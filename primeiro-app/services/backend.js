import { API_URL } from "../apiUrl";

export async function listPokemons({ signal, fresh = false } = {}) {
  const bust = fresh ? `?_=${Date.now()}` : "";
  const res = await fetch(`${API_URL}/api/pokemons${bust}`, {
    method: "GET",
    headers: { Accept: "application/json" },
    signal,
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const data = await res.json();
  return Array.isArray(data) ? data : [];
}

export async function getPokemon(id) {
  const res = await fetch(`${API_URL}/api/pokemons/${id}`);
  if (!res.ok) throw new Error(`Erro ${res.status}`);
  return res.json();
}

export async function createPokemon(data) {
  const res = await fetch(`${API_URL}/api/pokemons`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error(`Erro ${res.status}`);
  return res.json();
}

export async function updatePokemon(id, data) {
  const res = await fetch(`${API_URL}/api/pokemons/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error(`Erro ${res.status}`);
  return res.json();
}

export async function deletePokemon(id) {
  const res = await fetch(`${API_URL}/api/pokemons/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error(`Erro ${res.status}`);
  return res.json();
}

