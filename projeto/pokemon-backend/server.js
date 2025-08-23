// pokemon-backend/server.js
const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();

const app = express();
app.use(cors());
app.use(express.json());

// ====== DB: conexão + criação da tabela ======
const db = new sqlite3.Database('./pokedex.db');

db.run(`
  CREATE TABLE IF NOT EXISTS pokemons (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    types TEXT NOT NULL,        -- JSON (array)
    stats TEXT NOT NULL,        -- JSON (obj)
    height REAL,
    weight REAL,
    abilities TEXT NOT NULL,    -- JSON (array)
    sprites TEXT NOT NULL       -- JSON (obj)
  )
`);

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
    sprites: JSON.parse(row.sprites || '{}'),
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
    sprites = {},
  } = body;

  return {
    name,
    types: JSON.stringify(types),
    stats: JSON.stringify(stats),
    height,
    weight,
    abilities: JSON.stringify(abilities),
    sprites: JSON.stringify(sprites),
  };
}

// ====== CRUD ======

// LISTAR TODOS
app.get('/api/pokemons', (req, res) => {
  db.all('SELECT * FROM pokemons', [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows.map(mapRow));
  });
});

// OBTER POR ID
app.get('/api/pokemons/:id', (req, res) => {
  db.get('SELECT * FROM pokemons WHERE id = ?', [req.params.id], (err, row) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!row) return res.status(404).json({ error: 'Pokémon não encontrado' });
    res.json(mapRow(row));
  });
});

// CRIAR
app.post('/api/pokemons', (req, res) => {
  try {
    const p = toDbPayload(req.body);
    const sql = `
      INSERT INTO pokemons (name, types, stats, height, weight, abilities, sprites)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;
    const params = [p.name, p.types, p.stats, p.height, p.weight, p.abilities, p.sprites];

    db.run(sql, params, function (err) {
      if (err) return res.status(500).json({ error: err.message });
      const id = this.lastID;
      db.get('SELECT * FROM pokemons WHERE id = ?', [id], (err2, row) => {
        if (err2) return res.status(500).json({ error: err2.message });
        res.status(201).json(mapRow(row));
      });
    });
  } catch (e) {
    res.status(400).json({ error: 'Payload inválido', details: String(e) });
  }
});

// ATUALIZAR
app.put('/api/pokemons/:id', (req, res) => {
  try {
    const p = toDbPayload(req.body);
    const sql = `
      UPDATE pokemons
      SET name = ?, types = ?, stats = ?, height = ?, weight = ?, abilities = ?, sprites = ?
      WHERE id = ?
    `;
    const params = [p.name, p.types, p.stats, p.height, p.weight, p.abilities, p.sprites, req.params.id];

    db.run(sql, params, function (err) {
      if (err) return res.status(500).json({ error: err.message });
      if (this.changes === 0) return res.status(404).json({ error: 'Pokémon não encontrado' });

      db.get('SELECT * FROM pokemons WHERE id = ?', [req.params.id], (err2, row) => {
        if (err2) return res.status(500).json({ error: err2.message });
        res.json(mapRow(row));
      });
    });
  } catch (e) {
    res.status(400).json({ error: 'Payload inválido', details: String(e) });
  }
});

// EXCLUIR
app.delete('/api/pokemons/:id', (req, res) => {
  db.run('DELETE FROM pokemons WHERE id = ?', [req.params.id], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    if (this.changes === 0) return res.status(404).json({ error: 'Pokémon não encontrado' });
    res.json({ ok: true, deleted: 1, id: Number(req.params.id) });
  });
});

// ====== Start ======
const PORT = 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`API rodando em http://localhost:${PORT} (ou http://SEU_IP:${PORT} na rede)`);
});
