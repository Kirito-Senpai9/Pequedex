// primeiro-app/Page4.js (CORRIGIDO)
import React from 'react';
import { StyleSheet, Text, View, Pressable, SafeAreaView, Platform, Image, TouchableOpacity } from 'react-native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { typography } from './styles/typography';

const PokemonSlot = ({ theme, pokemon, onSelect }) => {
  return (
    <TouchableOpacity
      style={[styles.slotContainer, { backgroundColor: theme.card, borderColor: theme.subtle }]}
      onPress={onSelect}
    >
      {pokemon ? (
        <>
          <Image source={{ uri: pokemon.sprites.officialArtwork }} style={styles.pokemonImage} />
          <Text style={[typography.pokemonCardTitle, { color: theme.text, textTransform: 'capitalize' }]}>{pokemon.name}</Text>
        </>
      ) : (
        <>
          <FontAwesome5 name="question-circle" size={40} color={theme.subtle} solid />
          <Text style={[typography.label, { color: theme.subtle, marginTop: 8, marginBottom: 0 }]}>
            Selecionar
          </Text>
        </>
      )}
    </TouchableOpacity>
  );
};

export default function Page4({
  theme, handleToggleTheme, handleBackPage1, pokemon1, pokemon2, handleChoosePokemon, handleStartBattle,
}) {
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: 'transparent' }]}>
      <View style={styles.fixedHeader}>
        <Pressable onPress={handleToggleTheme} style={[styles.themeToggle, { backgroundColor: theme.card, borderColor: theme.subtle }]}>
          <FontAwesome5 name={theme.isDark ? 'sun' : 'moon'} size={24} color={theme.text} solid />
        </Pressable>
        <Text style={[typography.appTitle, { color: theme.primary }]}>Batalha Pokémon</Text>
        <Pressable onPress={handleBackPage1}>
          <FontAwesome5 name="arrow-left" size={24} color={theme.primary} />
        </Pressable>
      </View>
      <View style={styles.content}>
        <Text style={[typography.welcome, { color: theme.text, marginBottom: 20 }]}>Escolha os Lutadores</Text>
        <View style={styles.battleContainer}>
          <PokemonSlot theme={theme} pokemon={pokemon1} onSelect={() => handleChoosePokemon(1)} />
          <Text style={[typography.appTitle, { color: theme.primary, marginHorizontal: 10 }]}>VS</Text>
          <PokemonSlot theme={theme} pokemon={pokemon2} onSelect={() => handleChoosePokemon(2)} />
        </View>
        {pokemon1 && pokemon2 && (
            <Pressable 
              onPress={() => handleStartBattle(pokemon1, pokemon2)}
              style={[styles.battleButton, { backgroundColor: theme.primary }]}
            >
                <Text style={[typography.button, {color: '#FFF'}]}>Iniciar Batalha!</Text>
            </Pressable>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  fixedHeader: { paddingTop: Platform.OS === 'ios' ? 10 : 20, paddingBottom: 10, paddingHorizontal: 16, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', },
  themeToggle: { width: 52, height: 52, borderRadius: 26, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
  content: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 16, },
  battleContainer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', width: '100%', },
  slotContainer: { flex: 1, height: 180, borderWidth: 2, borderRadius: 12, borderStyle: 'dashed', alignItems: 'center', justifyContent: 'center', padding: 10, },
  pokemonImage: { width: 100, height: 100, resizeMode: 'contain', marginBottom: 8, },
  battleButton: { marginTop: 40, paddingVertical: 16, paddingHorizontal: 32, borderRadius: 14, elevation: 4, }
});