// pokemon-backend/server.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise');

const app = express();
app.use(cors());
app.use(express.json());

// ====== DB: conexão + criação da tabela ======
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10
});

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

// ====== Helpers de conversão ======
function mapRow(row) {
  return {
    id: row.id,
    name: row.name,
    types: JSON.parse(row.types || '[]'),
    stats: JSON.parse(row.stats || '{}'),
    height: row.height,
    weight: row.weight,
    abilities: JSON.parse(row.abilities || '[]'),
    sprites: JSON.parse(row.sprites || '{}')
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

  return { name, types, stats, height, weight, abilities, sprites };
}

// ====== CRUD ======

// LISTAR TODOS
app.get('/api/pokemons', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM pokemons');
    res.json(rows.map(mapRow));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// OBTER POR ID
app.get('/api/pokemons/:id', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM pokemons WHERE id = ?', [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ error: 'Pokémon não encontrado' });
    res.json(mapRow(rows[0]));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// CRIAR
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

// ATUALIZAR
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

// EXCLUIR
app.delete('/api/pokemons/:id', async (req, res) => {
  try {
    const [result] = await pool.query('DELETE FROM pokemons WHERE id = ?', [req.params.id]);
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Pokémon não encontrado' });
    res.json({ ok: true, deleted: 1, id: Number(req.params.id) });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ====== Start ======
const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`API rodando na porta ${PORT}`);
});

