// Page5.js (VERSÃO ESTÁVEL)
import React, { useEffect, useRef } from 'react';
import { StyleSheet, Text, View, SafeAreaView, Platform, Pressable, Animated, Image } from 'react-native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { typography } from './styles/typography';

const BattlePokemonCard = ({ pokemon, theme, battleStatus }) => {
  // Seleção do ícone e cor
  const getStatusIndicator = () => {
    if (battleStatus === 'win') return { icon: 'trophy', color: '#22C55E' };
    if (battleStatus === 'loss') return { icon: 'skull-crossbones', color: '#EF4444' };
    if (battleStatus === 'draw') return { icon: 'equals', color: '#FBBF24' };
    return { icon: 'equals', color: theme.subtle };
  };
  const indicator = getStatusIndicator();

  // Total stats
  const totalStats = Object.values(pokemon.stats).reduce((acc, val) => acc + val, 0);

  // Escolher GIF ou imagem oficial
  const imageSource = pokemon.sprites?.animated || pokemon.sprites?.officialArtwork;

  return (
    <View style={[styles.cardContainer, { backgroundColor: theme.card, borderColor: indicator.color }]}>
      <View style={[styles.gifContainer, { borderColor: theme.subtle }]}>
        {imageSource ? (
          <Image source={{ uri: imageSource }} style={styles.gif} />
        ) : (
          <Image source={{ uri: pokemon.sprites?.officialArtwork }} style={styles.gif} />
        )}
      </View>
      <Text style={[typography.pokemonCardTitle, { color: theme.text, marginTop: 8, textTransform: 'capitalize' }]}>
        {pokemon.name}
      </Text>
      <View style={styles.detailsContainer}>
        <View style={styles.detailRow}>
          <Text style={[typography.label, { color: theme.subtle }]}>Total Stats</Text>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <FontAwesome5 name={indicator.icon} color={indicator.color} size={14} />
            <Text style={[typography.body, { color: theme.text, marginLeft: 8, fontSize: 14 }]}>{totalStats}</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

export default function Page5({ theme, handleBackPage4, pokemon1, pokemon2, winner }) {
  const resultOpacity = useRef(new Animated.Value(0)).current;
  const cardOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(resultOpacity, { toValue: 1, duration: 500, useNativeDriver: true }),
      Animated.timing(cardOpacity, { toValue: 1, duration: 500, delay: 200, useNativeDriver: true }),
    ]).start();
  }, []);

  const getWinnerText = () => {
    if (!winner) return "A batalha terminou em empate!";
    return `${winner.name} venceu a batalha!`;
  };

  const isDraw = !winner;
  const loser = winner ? (winner.id === pokemon1.id ? pokemon2 : pokemon1) : null;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: 'transparent' }]}>
      <View style={styles.fixedHeader}>
        <View style={styles.headerPlaceholder} />
        <Text style={[typography.appTitle, { color: theme.primary }]}>Resultado</Text>
        <Pressable onPress={handleBackPage4}>
          <FontAwesome5 name="times-circle" size={28} color={theme.primary} />
        </Pressable>
      </View>

      <View style={styles.content}>
        <Animated.View style={[styles.resultContainer, { backgroundColor: theme.card, opacity: resultOpacity }]}>
          <Text style={[typography.welcome, { color: theme.primary, marginTop: 0, textTransform: 'capitalize' }]}>
            {getWinnerText()}
          </Text>
        </Animated.View>

        <Animated.View style={[styles.battlefield, { opacity: cardOpacity }, isDraw ? styles.battlefieldDraw : styles.battlefieldWin]}>
          {isDraw ? (
            <>
              <BattlePokemonCard theme={theme} pokemon={pokemon1} battleStatus={'draw'} />
              <BattlePokemonCard theme={theme} pokemon={pokemon2} battleStatus={'draw'} />
            </>
          ) : (
            <>
              <View style={styles.winnerWrapper}><BattlePokemonCard theme={theme} pokemon={winner} battleStatus={'win'} /></View>
              <View style={styles.loserWrapper}><BattlePokemonCard theme={theme} pokemon={loser} battleStatus={'loss'} /></View>
            </>
          )}
        </Animated.View>

        <Pressable onPress={handleBackPage4} style={[styles.rematchButton, { backgroundColor: theme.primary }]}>
          <Text style={[typography.button, { color: '#FFF' }]}>Nova Batalha</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  fixedHeader: { paddingTop: Platform.OS === 'ios' ? 10 : 20, paddingBottom: 10, paddingHorizontal: 16, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  headerPlaceholder: { width: 52 },
  content: { flex: 1, alignItems: 'center', justifyContent: 'space-between', paddingVertical: 20 },
  battlefield: { flex: 1, width: '100%', alignItems: 'center' },
  battlefieldDraw: { flexDirection: 'row', justifyContent: 'space-around', paddingHorizontal: 10 },
  battlefieldWin: { flexDirection: 'column', justifyContent: 'center' },
  winnerWrapper: { transform: [{ scale: 1.1 }], marginBottom: 20, zIndex: 1 },
  loserWrapper: { transform: [{ scale: 0.8 }], opacity: 0.6 },
  cardContainer: { alignItems: 'center', borderRadius: 14, paddingVertical: 12, paddingHorizontal: 8, borderWidth: 3, width: 170 },
  gifContainer: { width: 90, height: 90, borderRadius: 45, borderWidth: 2, alignItems: 'center', justifyContent: 'center', overflow: 'hidden', backgroundColor: 'rgba(0,0,0,0.1)' },
  gif: { width: '90%', height: '90%', resizeMode: 'contain' },
  detailsContainer: { marginTop: 12, width: '100%' },
  detailRow: { marginBottom: 8, alignItems: 'center' },
  resultContainer: { padding: 20, borderRadius: 14, elevation: 4, alignItems: 'center', justifyContent: 'center', marginBottom: 20, width: '90%' },
  rematchButton: { paddingVertical: 16, paddingHorizontal: 32, borderRadius: 14, elevation: 4, marginTop: 20 },
});
