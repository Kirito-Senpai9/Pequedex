const POKEAPI = 'https://pokeapi.co/api/v2';

const toCamel = (s) => s.replace(/-([a-z])/g, (_,c)=>c.toUpperCase());

function mapStats(arr) {
  const out = { hp: 0, attack: 0, defense: 0, specialAttack: 0, specialDefense: 0, speed: 0 };
  for (const s of arr) {
    const name = s.stat?.name || '';
    if (name === 'hp') out.hp = s.base_stat;
    else if (name === 'attack') out.attack = s.base_stat;
    else if (name === 'defense') out.defense = s.base_stat;
    else if (name === 'special-attack') out.specialAttack = s.base_stat;
    else if (name === 'special-defense') out.specialDefense = s.base_stat;
    else if (name === 'speed') out.speed = s.base_stat;
  }
  return out;
}

function mapPokemon(p) {
  const animated =
    p?.sprites?.versions?.['generation-v']?.['black-white']?.animated?.front_default || null;

  return {
    id: p.id,
    name: p.name,
    types: (p.types || []).map(t => t.type?.name).filter(Boolean),
    stats: mapStats(p.stats || []),
    height: (p.height || 0) / 10,  // m
    weight: (p.weight || 0) / 10,  // kg
    abilities: (p.abilities || []).map(a => a.ability?.name).filter(Boolean),
    sprites: {
      officialArtwork: p?.sprites?.other?.['official-artwork']?.front_default || p?.sprites?.front_default || '',
      frontDefault: p?.sprites?.front_default || '',
      animated,
    },
  };
}

async function fetchJson(url) {
  const r = await fetch(url);
  if (!r.ok) throw new Error(`HTTP ${r.status}`);
  return r.json();
}

// baixa detalhes em lotes para não sobrecarregar a PokeAPI
async function fetchAllPokemons(limit = 200) {
  const list = await fetchJson(`${POKEAPI}/pokemon?limit=${limit}`);
  const urls = list.results.map(r => r.url);

  const chunkSize = 25;
  const results = [];
  for (let i = 0; i < urls.length; i += chunkSize) {
    const chunk = urls.slice(i, i + chunkSize);
    const batch = await Promise.all(chunk.map(u => fetchJson(u).then(mapPokemon)));
    results.push(...batch);
  }
  return results;
}

export { fetchAllPokemons };
