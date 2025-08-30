require('dotenv').config();
const mysql = require('mysql2/promise');
const fs = require('fs');

const ca = fs.readFileSync(process.env.DB_CA_FILE, 'utf8');

function coerceToArray(v) {
  if (v == null) return [];
  if (Array.isArray(v)) return v;
  if (typeof v === 'string') {
    const s = v.trim();
    if (!s) return [];
    try {
      const parsed = JSON.parse(s);
      if (Array.isArray(parsed)) return parsed;
      if (typeof parsed === 'string') return parsed.split(',').map(x=>x.trim()).filter(Boolean);
      if (parsed && typeof parsed === 'object') return Object.values(parsed);
    } catch {
      return s.split(',').map(x=>x.trim()).filter(Boolean);
    }
  }
  if (typeof v === 'object') return Object.values(v);
  return String(v).trim() ? [String(v).trim()] : [];
}

function coerceToObject(v) {
  if (v == null) return {};
  if (typeof v === 'object' && !Array.isArray(v)) return v;
  if (typeof v === 'string') {
    const s = v.trim();
    if (!s) return {};
    try {
      const parsed = JSON.parse(s);
      if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) return parsed;
    } catch {/* ignore */}
    return {};
  }
  return {};
}

(async () => {
  const con = await mysql.createConnection({
    host: process.env.DB_HOST,
    port: +process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    ssl: { rejectUnauthorized: true, ca }
  });

  const [rows] = await con.query('SELECT id, types, stats, abilities, sprites FROM pokemons');

  let fixes = 0;
  for (const r of rows) {
    const newTypes = coerceToArray(r.types);
    const newAbilities = coerceToArray(r.abilities);
    const newStats = coerceToObject(r.stats);
    const newSprites = coerceToObject(r.sprites);

    const oldTypes = typeof r.types === 'string' ? r.types : JSON.stringify(r.types ?? []);
    const oldAbilities = typeof r.abilities === 'string' ? r.abilities : JSON.stringify(r.abilities ?? []);
    const oldStats = typeof r.stats === 'string' ? r.stats : JSON.stringify(r.stats ?? {});
    const oldSprites = typeof r.sprites === 'string' ? r.sprites : JSON.stringify(r.sprites ?? {});

    if (
      JSON.stringify(newTypes)   !== oldTypes ||
      JSON.stringify(newAbilities)!== oldAbilities ||
      JSON.stringify(newStats)   !== oldStats ||
      JSON.stringify(newSprites) !== oldSprites
    ) {
      await con.query(
        'UPDATE pokemons SET types=?, abilities=?, stats=?, sprites=? WHERE id=?',
        [JSON.stringify(newTypes), JSON.stringify(newAbilities), JSON.stringify(newStats), JSON.stringify(newSprites), r.id]
      );
      fixes++;
    }
  }

  console.log(`Normalização concluída. Registros ajustados: ${fixes}`);
  await con.end();
})().catch(e => { console.error(e); process.exit(1); });
