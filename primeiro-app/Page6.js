// Page6.js — Tela de CRUD completo (Criar, Listar, Editar, Excluir) com todos os campos
import React, { useState } from 'react';
import {
  View, Text, TextInput, Pressable, StyleSheet, Platform, ScrollView, Alert,
} from 'react-native';
import { createPokemon, updatePokemon, deletePokemon } from './services/backend';

export default function Page6({ theme, onBack, pokemons, setPokemons }) {
  const [searchTerm, setSearchTerm] = useState('');

  // formulário
  const [editingId, setEditingId] = useState(null); // null = criando, number = editando
  const [name, setName] = useState('');
  const [typesText, setTypesText] = useState('');       // "electric, grass"
  const [abilitiesText, setAbilitiesText] = useState(''); // "static, lightning-rod"
  const [hp, setHp] = useState('10');
  const [attack, setAttack] = useState('10');
  const [defense, setDefense] = useState('10');
  const [spAtk, setSpAtk] = useState('10');
  const [spDef, setSpDef] = useState('10');
  const [speed, setSpeed] = useState('10');
  const [height, setHeight] = useState('0.4');
  const [weight, setWeight] = useState('6');
  const [staticUrl, setStaticUrl] = useState('');
  const [animatedUrl, setAnimatedUrl] = useState('');

  const resetForm = () => {
    setEditingId(null);
    setName('');
    setTypesText('');
    setAbilitiesText('');
    setHp('10'); setAttack('10'); setDefense('10'); setSpAtk('10'); setSpDef('10'); setSpeed('10');
    setHeight('0.4'); setWeight('6');
    setStaticUrl('');
    setAnimatedUrl('');
  };

  const fillFormFromPokemon = (p) => {
    setEditingId(p.id);
    setName(p.name || '');
    setTypesText((p.types || []).join(', '));
    setAbilitiesText((p.abilities || []).join(', '));
    setHp(String(p?.stats?.hp ?? 10));
    setAttack(String(p?.stats?.attack ?? 10));
    setDefense(String(p?.stats?.defense ?? 10));
    setSpAtk(String(p?.stats?.specialAttack ?? 10));
    setSpDef(String(p?.stats?.specialDefense ?? 10));
    setSpeed(String(p?.stats?.speed ?? 10));
    setHeight(String(p?.height ?? 0.4));
    setWeight(String(p?.weight ?? 6));
    setStaticUrl(String(p?.sprites?.frontDefault ?? ''));
    setAnimatedUrl(String(p?.sprites?.animated ?? ''));
  };

  const filteredPokemons = pokemons.filter((p) =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const buildPayload = () => {
    // transforma campos de texto em arrays/objetos
    const types = typesText.split(',').map(t => t.trim()).filter(Boolean);
    const abilities = abilitiesText.split(',').map(a => a.trim()).filter(Boolean);
    const stats = {
      hp: Number(hp) || 0,
      attack: Number(attack) || 0,
      defense: Number(defense) || 0,
      specialAttack: Number(spAtk) || 0,
      specialDefense: Number(spDef) || 0,
      speed: Number(speed) || 0,
    };
    const sprites = {};
    if (staticUrl.trim()) sprites.frontDefault = staticUrl.trim();
    if (animatedUrl.trim()) sprites.animated = animatedUrl.trim();

    return {
      name: name.trim(),
      types,
      stats,
      height: Number(height) || 0,
      weight: Number(weight) || 0,
      abilities,
      sprites,
    };
  };

  const handleSave = async () => {
    const payload = buildPayload();

    if (!payload.name) {
      Alert.alert('Validação', 'Informe o nome do Pokémon.');
      return;
    }
    if (!payload.types.length) {
      Alert.alert('Validação', 'Informe pelo menos um tipo.');
      return;
    }

    try {
      if (editingId) {
        const updated = await updatePokemon(editingId, payload);
        setPokemons(prev => prev.map(p => (p.id === editingId ? updated : p)));
        Alert.alert('Sucesso', `Pokémon atualizado!`);
      } else {
        const created = await createPokemon(payload);
        setPokemons(prev => [created, ...prev]);
        Alert.alert('Sucesso', `Pokémon criado!`);
      }
      resetForm();
    } catch (err) {
      Alert.alert('Erro', err.message);
    }
  };

  const handleEdit = (p) => {
    fillFormFromPokemon(p);
  };

  const handleDelete = (p) => {
    Alert.alert(
      'Excluir Pokémon',
      `Tem certeza que deseja excluir "${p.name}"?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: async () => {
            try {
              await deletePokemon(p.id);
              setPokemons(prev => prev.filter(x => x.id !== p.id));
              if (editingId === p.id) resetForm();
              Alert.alert('Excluído', `"${p.name}" foi removido.`);
            } catch (err) {
              Alert.alert('Erro', err.message);
            }
          }
        }
      ]
    );
  };

  return (
    <View style={{ flex: 1 }}>
      {/* Header simples com voltar */}
      <View style={{ paddingTop: Platform.OS === 'ios' ? 50 : 20, paddingHorizontal: 16, paddingBottom: 10, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
        <Pressable onPress={onBack} style={[styles.btn, { borderColor: theme.subtle, backgroundColor: theme.card }]}>
          <Text style={{ color: theme.text }}>← Voltar</Text>
        </Pressable>
        <Text style={[{ fontSize: 18, fontWeight: '700' }, { color: theme.text }]}>Gerenciar Pokémons (CRUD)</Text>
        <View style={{ width: 80 }} />
      </View>

      <ScrollView contentContainerStyle={{ padding: 16 }}>
        <Text style={{ color: theme.text, opacity: 0.7, marginBottom: 8 }}>
          Gerencie os Pokémon persistidos no backend.
        </Text>
        {/* FORMULÁRIO */}
        <View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.subtle }]}> 
          <Text style={[styles.title, { color: theme.text }]}>{editingId ? 'Editar Pokémon' : 'Novo Pokémon'}</Text>

          <Text style={[styles.label, { color: theme.text }]}>Nome *</Text>
          <TextInput
            value={name}
            onChangeText={setName}
            placeholder="Ex.: Pikachu"
            placeholderTextColor={theme.subtle}
            style={[styles.input, { color: theme.text, borderColor: theme.subtle }]}
          />

          <Text style={[styles.label, { color: theme.text }]}>Tipos * (separados por vírgula)</Text>
          <TextInput
            value={typesText}
            onChangeText={setTypesText}
            placeholder="Ex.: electric, flying"
            placeholderTextColor={theme.subtle}
            style={[styles.input, { color: theme.text, borderColor: theme.subtle }]}
          />

          <Text style={[styles.label, { color: theme.text }]}>Habilidades (separadas por vírgula)</Text>
          <TextInput
            value={abilitiesText}
            onChangeText={setAbilitiesText}
            placeholder="Ex.: static, lightning-rod"
            placeholderTextColor={theme.subtle}
            style={[styles.input, { color: theme.text, borderColor: theme.subtle }]}
          />

          <Text style={[styles.subtitle, { color: theme.text }]}>Stats</Text>
          <View style={styles.grid}>
            <View style={styles.gridCol}>
              <Text style={[styles.label, { color: theme.text }]}>HP</Text>
              <TextInput keyboardType="numeric" value={hp} onChangeText={setHp} style={[styles.input, { color: theme.text, borderColor: theme.subtle }]} />
            </View>
            <View style={styles.gridCol}>
              <Text style={[styles.label, { color: theme.text }]}>Attack</Text>
              <TextInput keyboardType="numeric" value={attack} onChangeText={setAttack} style={[styles.input, { color: theme.text, borderColor: theme.subtle }]} />
            </View>
            <View style={styles.gridCol}>
              <Text style={[styles.label, { color: theme.text }]}>Defense</Text>
              <TextInput keyboardType="numeric" value={defense} onChangeText={setDefense} style={[styles.input, { color: theme.text, borderColor: theme.subtle }]} />
            </View>
            <View style={styles.gridCol}>
              <Text style={[styles.label, { color: theme.text }]}>Sp. Atk</Text>
              <TextInput keyboardType="numeric" value={spAtk} onChangeText={setSpAtk} style={[styles.input, { color: theme.text, borderColor: theme.subtle }]} />
            </View>
            <View style={styles.gridCol}>
              <Text style={[styles.label, { color: theme.text }]}>Sp. Def</Text>
              <TextInput keyboardType="numeric" value={spDef} onChangeText={setSpDef} style={[styles.input, { color: theme.text, borderColor: theme.subtle }]} />
            </View>
            <View style={styles.gridCol}>
              <Text style={[styles.label, { color: theme.text }]}>Speed</Text>
              <TextInput keyboardType="numeric" value={speed} onChangeText={setSpeed} style={[styles.input, { color: theme.text, borderColor: theme.subtle }]} />
            </View>
          </View>

          <View style={styles.row2}>
            <View style={{ flex: 1, marginRight: 8 }}>
              <Text style={[styles.label, { color: theme.text }]}>Altura (m)</Text>
              <TextInput keyboardType="numeric" value={height} onChangeText={setHeight} style={[styles.input, { color: theme.text, borderColor: theme.subtle }]} />
            </View>
            <View style={{ flex: 1, marginLeft: 8 }}>
              <Text style={[styles.label, { color: theme.text }]}>Peso (kg)</Text>
              <TextInput keyboardType="numeric" value={weight} onChangeText={setWeight} style={[styles.input, { color: theme.text, borderColor: theme.subtle }]} />
            </View>
          </View>

          <Text style={[styles.label, { color: theme.text }]}>Imagem estática (.png)</Text>
          <TextInput
            value={staticUrl}
            onChangeText={setStaticUrl}
            placeholder="https://..."
            placeholderTextColor={theme.subtle}
            style={[styles.input, { color: theme.text, borderColor: theme.subtle }]}
          />

          <Text style={[styles.label, { color: theme.text }]}>Imagem animada (.gif)</Text>
          <TextInput
            value={animatedUrl}
            onChangeText={setAnimatedUrl}
            placeholder="https://..."
            placeholderTextColor={theme.subtle}
            style={[styles.input, { color: theme.text, borderColor: theme.subtle }]}
          />

          <View style={[styles.row, { marginTop: 12 }]}>
            <Pressable onPress={resetForm} style={[styles.btn, { borderColor: theme.subtle }]}>
              <Text style={{ color: theme.text }}>Novo</Text>
            </Pressable>
            <Pressable onPress={handleSave} style={[styles.btn, { borderColor: theme.subtle, backgroundColor: theme.primary }]}>
              <Text style={{ color: '#111' }}>{editingId ? 'Salvar' : 'Criar'}</Text>
            </Pressable>
          </View>
        </View>

        {/* LISTA */}
        <View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.subtle, marginTop: 16 }]}>
          <Text style={[styles.title, { color: theme.text }]}>Lista</Text>
          {/* Barra de pesquisa */}
          <TextInput
            value={searchTerm}
            onChangeText={setSearchTerm}
            placeholder="Pesquise pelo nome…"
            placeholderTextColor={theme.subtle}
            style={[styles.input, { marginBottom: 12, color: theme.text, borderColor: theme.subtle }]}
            />
            <View>
              {filteredPokemons.map((p) => (
                <View key={p.id} style={[styles.rowBetween, { borderBottomWidth: 1, borderColor: theme.subtle, paddingVertical: 10 }]}> 
                  <Text style={{ color: theme.text, fontWeight: '600' }}>{p.id}. {p.name}</Text>
                  <View style={{ flexDirection: 'row', gap: 8 }}>
                    <Pressable onPress={() => handleEdit(p)} style={[styles.smallBtn, { borderColor: theme.subtle }]}> 
                      <Text style={{ color: theme.text }}>Editar</Text>
                    </Pressable>
                    <Pressable onPress={() => handleDelete(p)} style={[styles.smallBtn, { borderColor: theme.subtle }]}> 
                      <Text style={{ color: theme.text }}>Excluir</Text>
                    </Pressable>
                  </View>
                </View>
              ))}
              {!filteredPokemons.length && (
                <Text style={{ color: theme.text, opacity: 0.7, marginTop: 8 }}>Nenhum registro.</Text>
              )}
            </View>
          </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { borderWidth: 1, borderRadius: 16, padding: 16 },
  title: { fontSize: 18, fontWeight: '700', marginBottom: 12 },
  label: { fontSize: 14, marginTop: 8 },
  input: { borderWidth: 1, borderRadius: 10, paddingHorizontal: 12, paddingVertical: Platform.OS === 'ios' ? 12 : 8, marginTop: 6 },
  subtitle: { fontSize: 16, fontWeight: '700', marginTop: 12 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  gridCol: { width: '31%', minWidth: 110 },
  row: { flexDirection: 'row', justifyContent: 'flex-end', gap: 10 },
  row2: { flexDirection: 'row', marginTop: 8 },
  rowBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  btn: { borderWidth: 1, borderRadius: 10, paddingHorizontal: 16, paddingVertical: 10 },
  smallBtn: { borderWidth: 1, borderRadius: 8, paddingHorizontal: 12, paddingVertical: 6 },
});
