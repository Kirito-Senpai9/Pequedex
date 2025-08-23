// ManagePokemonForm.js
import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet, Platform } from 'react-native';

export default function ManagePokemonForm({ theme, onCancel, onSubmit, initial }) {
  const [name, setName] = useState('');
  const [typesText, setTypesText] = useState('');

  useEffect(() => {
    if (initial) {
      setName(initial.name || '');
      setTypesText((initial.types || []).join(', '));
    }
  }, [initial]);

  const handleSave = () => {
    const types = typesText.split(',').map(t => t.trim()).filter(Boolean);
    if (!name) return;

    const payload = {
      name,
      types,
      stats: initial?.stats || { hp: 10, attack: 10, defense: 10, specialAttack: 10, specialDefense: 10, speed: 10 },
      height: initial?.height ?? 0.4,
      weight: initial?.weight ?? 6,
      abilities: initial?.abilities || [],
      sprites: initial?.sprites || {},
    };
    onSubmit(payload);
  };

  return (
    <View style={[styles.overlay]}>
      <View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.subtle }]}>
        <Text style={[styles.title, { color: theme.text }]}>{initial ? 'Editar Pokémon' : 'Novo Pokémon'}</Text>

        <Text style={[styles.label, { color: theme.text }]}>Nome</Text>
        <TextInput
          value={name}
          onChangeText={setName}
          placeholder="Ex.: Pikachu"
          placeholderTextColor={theme.subtle}
          style={[styles.input, { color: theme.text, borderColor: theme.subtle }]}
        />

        <Text style={[styles.label, { color: theme.text }]}>Tipos (separados por vírgula)</Text>
        <TextInput
          value={typesText}
          onChangeText={setTypesText}
          placeholder="Ex.: electric, flying"
          placeholderTextColor={theme.subtle}
          style={[styles.input, { color: theme.text, borderColor: theme.subtle }]}
        />

        <View style={styles.row}>
          <Pressable onPress={onCancel} style={[styles.btn, { borderColor: theme.subtle }]}>
            <Text style={{ color: theme.text }}>Cancelar</Text>
          </Pressable>
          <Pressable onPress={handleSave} style={[styles.btn, { borderColor: theme.subtle, backgroundColor: theme.primary }]}>
            <Text style={{ color: '#111' }}>{initial ? 'Salvar' : 'Criar'}</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: { position: 'absolute', inset: 0, backgroundColor: 'rgba(0,0,0,0.25)', alignItems: 'center', justifyContent: 'center', padding: 16 },
  card: { width: '100%', maxWidth: 420, borderRadius: 16, borderWidth: 1, padding: 16 },
  title: { fontSize: 20, fontWeight: '700', marginBottom: 12 },
  label: { fontSize: 14, marginTop: 8 },
  input: { borderWidth: 1, borderRadius: 10, paddingHorizontal: 12, paddingVertical: Platform.OS === 'ios' ? 12 : 8, marginTop: 6 },
  row: { flexDirection: 'row', justifyContent: 'flex-end', gap: 12, marginTop: 16 },
  btn: { borderWidth: 1, borderRadius: 10, paddingHorizontal: 16, paddingVertical: 10 },
});
