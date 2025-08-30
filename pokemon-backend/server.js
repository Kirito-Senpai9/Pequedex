// pokemon-backend/server.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise');
const fs = require('fs');

const app = express();
app.use(cors());
app.use(express.json());

// ===== SSL (Aiven exige TLS) =====
let caPem;
if (process.env.DB_CA_FILE && fs.existsSync(process.env.DB_CA_FILE)) {
  caPem = fs.readFileSync(process.env.DB_CA_FILE, 'utf8');
} else if (process.env.DB_CA_CERT) {
  caPem = process.env.DB_CA_CERT;
}

// ===== Pool MySQL =====
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT) || 3306,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  ssl: { rejectUnauthorized: true, ca: caPem }
});

// Cria tabela
(async () => {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS pokemons (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      types JSON NOT NULL,
      stats JSON NOT NULL,
      height DOUBLE,
      weight DOUBLE,
      abilities JSON NOT NULL,
      sprites JSON NOT NULL
    )
  `);
})();

// ===== Helpers de parse =====
function parseArray(val) {
  if (val == null) return [];
  // se já é array
  if (Array.isArray(val)) return val;
  // tentar JSON primeiro
  if (typeof val === 'string') {
    const s = val.trim();
    if (!s) return [];
    try {
      const parsed = JSON.parse(s);
      if (Array.isArray(parsed)) return parsed;
      if (typeof parsed === 'string') {
        return parsed.split(',').map(x => x.trim()).filter(Boolean);
      }
      // objeto -> pega valores (fallback)
      if (parsed && typeof parsed === 'object') {
        return Object.values(parsed);
      }
    } catch {
      // não é JSON -> tratar como CSV
      return s.split(',').map(x => x.trim()).filter(Boolean);
    }
  }
  // objeto simples vira lista de valores; primitivo vira lista singleton
  if (typeof val === 'object') return Object.values(val);
  return String(val).trim() ? [String(val).trim()] : [];
}

function parseObject(val) {
  if (val == null) return {};
  if (typeof val === 'object' && !Array.isArray(val)) return val;
  if (typeof val === 'string') {
    const s = val.trim();
    if (!s) return {};
    try {
      const parsed = JSON.parse(s);
      if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) return parsed;
      // se veio string (ex.: "hp:45,atk:49"), não há formato padronizado -> retorna vazio
      return {};
    } catch {
      return {};
    }
  }
  return {};
}

function mapRow(row) {
  return {
    id: row.id,
    name: row.name,
    types: parseArray(row.types),
    stats: parseObject(row.stats),
    height: row.height,
    weight: row.weight,
    abilities: parseArray(row.abilities),
    sprites: parseObject(row.sprites)
  };
}

function toDbPayload(body) {
  const {
    name,
    types = [],
    stats = {},
    height = null,
    weight = null,
    abilities = [],
    sprites = {}
  } = body;

  return {
    name,
    types: JSON.stringify(types),
    stats: JSON.stringify(stats),
    height,
    weight,
    abilities: JSON.stringify(abilities),
    sprites: JSON.stringify(sprites)
  };
}

// ===== CRUD =====
app.get('/api/pokemons', async (_req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM pokemons');
    res.json(rows.map(mapRow));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/pokemons/:id', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM pokemons WHERE id = ?', [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ error: 'Pokémon não encontrado' });
    res.json(mapRow(rows[0]));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/pokemons', async (req, res) => {
  try {
    const p = toDbPayload(req.body);
    const sql = `
      INSERT INTO pokemons (name, types, stats, height, weight, abilities, sprites)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;
    const params = [p.name, p.types, p.stats, p.height, p.weight, p.abilities, p.sprites];
    const [result] = await pool.query(sql, params);
    const [rows] = await pool.query('SELECT * FROM pokemons WHERE id = ?', [result.insertId]);
    res.status(201).json(mapRow(rows[0]));
  } catch (e) {
    res.status(400).json({ error: 'Payload inválido', details: String(e) });
  }
});

app.put('/api/pokemons/:id', async (req, res) => {
  try {
    const p = toDbPayload(req.body);
    const sql = `
      UPDATE pokemons
      SET name = ?, types = ?, stats = ?, height = ?, weight = ?, abilities = ?, sprites = ?
      WHERE id = ?
    `;
    const params = [p.name, p.types, p.stats, p.height, p.weight, p.abilities, p.sprites, req.params.id];
    const [result] = await pool.query(sql, params);
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Pokémon não encontrado' });
    const [rows] = await pool.query('SELECT * FROM pokemons WHERE id = ?', [req.params.id]);
    res.json(mapRow(rows[0]));
  } catch (e) {
    res.status(400).json({ error: 'Payload inválido', details: String(e) });
  }
});

app.delete('/api/pokemons/:id', async (req, res) => {
  try {
    const [result] = await pool.query('DELETE FROM pokemons WHERE id = ?', [req.params.id]);
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Pokémon não encontrado' });
    res.json({ ok: true, deleted: 1, id: Number(req.params.id) });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ===== Start =====
const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`API rodando na porta ${PORT}`);
});
