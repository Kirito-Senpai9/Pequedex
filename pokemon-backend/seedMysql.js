// pokemon-backend/seedMysql.js
require('dotenv').config();
const mysql = require('mysql2/promise');
const { POKEMONS_DATA } = require('./pokemons.js');

async function seed() {
  const pool = mysql.createPool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT || 3306,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10
  });

  const sql = `
    INSERT INTO pokemons (id, name, types, stats, height, weight, abilities, sprites)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    ON DUPLICATE KEY UPDATE
      name = VALUES(name),
      types = VALUES(types),
      stats = VALUES(stats),
      height = VALUES(height),
      weight = VALUES(weight),
      abilities = VALUES(abilities),
      sprites = VALUES(sprites)
  `;

  for (const p of POKEMONS_DATA) {
    const params = [
      p.id,
      p.name,
      p.types,
      p.stats,
      p.height,
      p.weight,
      p.abilities,
      p.sprites
    ];
    await pool.query(sql, params);
  }

  await pool.end();
  console.log('Seed concluído');
}

seed().catch(err => {
  console.error(err);
  process.exit(1);
});

