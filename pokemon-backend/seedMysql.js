require('dotenv').config();
const mysql = require('mysql2/promise');
const fs = require('fs');
const { POKEMONS_DATA } = require('./pokemons');

// SSL
let caPem;
if (process.env.DB_CA_FILE && fs.existsSync(process.env.DB_CA_FILE)) {
  caPem = fs.readFileSync(process.env.DB_CA_FILE, 'utf8');
} else if (process.env.DB_CA_CERT) {
  caPem = process.env.DB_CA_CERT;
}

async function main() {
  const pool = await mysql.createPool({
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT) || 3306,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 5,
    ssl: { rejectUnauthorized: true, ca: caPem }
  });

  await pool.query(`
    CREATE TABLE IF NOT EXISTS pokemons (
      id INT PRIMARY KEY,                 -- aqui aceitaremos o id do dataset
      name VARCHAR(255) NOT NULL,
      types JSON NOT NULL,
      stats JSON NOT NULL,
      height DOUBLE,
      weight DOUBLE,
      abilities JSON NOT NULL,
      sprites JSON NOT NULL
    )
  `);

  const sql = `
    INSERT INTO pokemons (id, name, types, stats, height, weight, abilities, sprites)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    ON DUPLICATE KEY UPDATE
      name=VALUES(name),
      types=VALUES(types),
      stats=VALUES(stats),
      height=VALUES(height),
      weight=VALUES(weight),
      abilities=VALUES(abilities),
      sprites=VALUES(sprites)
  `;

  // inserção em lotes
  const chunk = 200;
  for (let i = 0; i < POKEMONS_DATA.length; i += chunk) {
    const part = POKEMONS_DATA.slice(i, i + chunk);
    const tx = pool.getConnection();
    const conn = await tx;
    try {
      await conn.beginTransaction();
      for (const p of part) {
        await conn.query(sql, [
          p.id,
          p.name,
          JSON.stringify(p.types || []),
          JSON.stringify(p.stats || {}),
          p.height ?? null,
          p.weight ?? null,
          JSON.stringify(p.abilities || []),
          JSON.stringify(p.sprites || {})
        ]);
      }
      await conn.commit();
      console.log(`Seed: ${i + part.length}/${POKEMONS_DATA.length}`);
    } catch (e) {
      await (await tx).rollback();
      throw e;
    } finally {
      (await tx).release();
    }
  }

  await pool.end();
  console.log('Seed concluído.');
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
