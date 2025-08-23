// seedDatabase.js (VERSÃO FINAL - COM INSERT OR IGNORE)
const sqlite3 = require('sqlite3').verbose();
const { POKEMONS_DATA } = require('./pokemons.js');

const db = new sqlite3.Database('./pokedex.db', (err) => {
  if (err) {
    return console.error(err.message);
  }
  console.log('Conectado ao arquivo de banco de dados pokedex.db.');
});

db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS pokemons (
    id INTEGER PRIMARY KEY,
    name TEXT,
    types TEXT,
    stats TEXT,
    height REAL,
    weight REAL,
    abilities TEXT,
    sprites TEXT
  )`, (err) => {
    if (err) {
      return console.error('Erro ao criar tabela:', err.message);
    }
    console.log('Tabela "pokemons" pronta para receber os dados.');

    // ALTERAÇÃO AQUI: usamos INSERT OR IGNORE
    const stmt = db.prepare(`
      INSERT OR IGNORE INTO pokemons 
      (id, name, types, stats, height, weight, abilities, sprites) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);

    console.log('Iniciando a inserção dos 1000 Pokémon. Isso pode levar um momento...');

    db.parallelize(() => {
      POKEMONS_DATA.forEach(p => {
        stmt.run(
          p.id,
          p.name,
          JSON.stringify(p.types),
          JSON.stringify(p.stats),
          p.height,
          p.weight,
          JSON.stringify(p.abilities),
          JSON.stringify(p.sprites)
        );
      });
    });

    stmt.finalize((err) => {
      if (err) {
        return console.error('Erro ao finalizar inserção:', err.message);
      }
      console.log('✅ Missão Cumprida! Todos os Pokémon foram inseridos no banco de dados (sem duplicados).');

      // Fecha o banco após finalizar
      db.close((err) => {
        if (err) {
          return console.error(err.message);
        }
        console.log('Conexão com o banco de dados fechada com segurança.');
      });
    });
  });
});
