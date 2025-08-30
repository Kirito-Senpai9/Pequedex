import { getApiBaseUrl } from '../apiUrl';

const BASE = getApiBaseUrl();

async function listPokemons() {
  const res = await fetch(`${BASE}/api/pokemons`);
  if (!res.ok) throw new Error(`Erro ${res.status}`);
  return res.json();
}

async function getPokemon(id) {
  const res = await fetch(`${BASE}/api/pokemons/${id}`);
  if (!res.ok) throw new Error(`Erro ${res.status}`);
  return res.json();
}

async function createPokemon(data) {
  const res = await fetch(`${BASE}/api/pokemons`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error(`Erro ${res.status}`);
  return res.json();
}

async function updatePokemon(id, data) {
  const res = await fetch(`${BASE}/api/pokemons/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error(`Erro ${res.status}`);
  return res.json();
}

async function deletePokemon(id) {
  const res = await fetch(`${BASE}/api/pokemons/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error(`Erro ${res.status}`);
  return res.json();
}

export { listPokemons, getPokemon, createPokemon, updatePokemon, deletePokemon };

