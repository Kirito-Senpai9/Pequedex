// App.js — adiciona Page6 para CRUD completo e botão na Page2 para navegar
import { StatusBar } from 'expo-status-bar';
import React, { useRef, useState, useEffect } from 'react';
import { StyleSheet, Text, View, Pressable, Animated, SafeAreaView, Dimensions, Platform } from 'react-native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

import Page1 from './Page1';
import Page2 from './Page2';
import Page3 from './Page3';
import Page4 from './Page4';
import Page5 from './Page5';
import Page6 from './Page6'; // <<< NOVO
import AnimatedBackground from './AnimatedBackground';
import { typography } from './styles/typography';

import { listPokemons } from './services/backend';

const lightTheme = { bg: 'transparent', card: 'rgba(255, 255, 255, 0.85)', primary: '#EF4444', text: '#111827', subtle: '#9CA3AF' };
const darkTheme = { bg: 'transparent', card: 'rgba(31, 41, 55, 0.85)', primary: '#FBBF24', text: '#F9FAFB', subtle: '#778DA9' };

const BASE_BALL_SIZE = 40; const MIN_BALL_SIZE = 10; const MAX_BALLS = 50;
function rand(min, max) { return Math.random() * (max - min) + min; }
function createBall(bounds, size = BASE_BALL_SIZE) {
  const x0 = rand(0, Math.max(0, bounds.width - size)); const y0 = rand(0, Math.max(0, bounds.height - size));
  const speed = rand(2.0, 4.5); const angle = rand(0, Math.PI * 2);
  return { id: Date.now().toString() + Math.random().toString(36).slice(2), x: x0, y: y0, vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed, ax: new Animated.Value(x0), ay: new Animated.Value(y0), size: size };
}

export default function App() {
  const [isDark, setIsDark] = useState(true);
  const theme = isDark ? {...darkTheme, isDark: true} : {...lightTheme, isDark: false};
  const [page, setPage] = useState(1);

  const scaleBtn = useRef(new Animated.Value(1)).current;
  const [bounds, setBounds] = useState(Dimensions.get('window'));
  const [balls, setBalls] = useState([]);
  const ballsRef = useRef([]);
  const loopRef = useRef(null);
  const [name, setName] = useState('');
  const [showWelcome, setShowWelcome] = useState(false);
  const [showContinue, setShowContinue] = useState(false);
  const [showPhotoViewer, setShowPhotoViewer] = useState(false);
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [showBalls, setShowBalls] = useState(false);
  const [pokemon1, setPokemon1] = useState(null);
  const [pokemon2, setPokemon2] = useState(null);
  const [selectionMode, setSelectionMode] = useState(0);
  const [winner, setWinner] = useState(null);
  const [pokemons, setPokemons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filteredPokemons, setFilteredPokemons] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [error, setError] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const data = await listPokemons();
        setPokemons(data);
        setFilteredPokemons(data);
      } catch (e) {
        console.log('Falha ao buscar Pokémon:', e?.message);
        setError('Falha ao carregar Pokémon.');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  useEffect(() => {
    if (searchQuery === '') setFilteredPokemons(pokemons);
    else setFilteredPokemons(pokemons.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase())));
  }, [searchQuery, pokemons]);

  useEffect(() => {
    const sub = Dimensions.addEventListener('change', ({ window }) => { setBounds(window); });
    return () => { sub?.remove(); };
  }, []);

  useEffect(() => {
    if (showBalls && balls.length === 0) { const first = [createBall(bounds)]; setBalls(first); ballsRef.current = first; } 
    else if (!showBalls) { setBalls([]); ballsRef.current = []; }
  }, [showBalls, bounds]);

  useEffect(() => {
    const tick = () => {
      if (ballsRef.current.length === 0) { loopRef.current = requestAnimationFrame(tick); return; }
      for (const b of ballsRef.current) {
        b.x += b.vx; b.y += b.vy;
        if (b.x <= 0 || b.x >= bounds.width - b.size) b.vx *= -1;
        if (b.y <= 0 || b.y >= bounds.height - b.size) b.vy *= -1;
        b.ax.setValue(Math.min(Math.max(b.x, 0), bounds.width - b.size));
        b.ay.setValue(Math.min(Math.max(b.y, 0), bounds.height - b.size));
      }
      loopRef.current = requestAnimationFrame(tick);
    };
    loopRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(loopRef.current);
  }, [bounds]);

  const handleToggleTheme = () => setIsDark(v => !v);
  const onPressIn = () => Animated.spring(scaleBtn, { toValue: 1.07, useNativeDriver: true }).start();
  const onPressOut = () => Animated.spring(scaleBtn, { toValue: 1, useNativeDriver: true }).start();
  const handleBallPress = (pressedBall) => {
    const currentBalls = ballsRef.current;
    if (currentBalls.length >= MAX_BALLS && pressedBall.size <= MIN_BALL_SIZE) return;
    const newSize = BASE_BALL_SIZE - (BASE_BALL_SIZE - MIN_BALL_SIZE) * Math.min(currentBalls.length / MAX_BALLS, 1.0);
    const finalBalls = [...currentBalls.filter(b => b.id !== pressedBall.id), ...Array.from({ length: 2 }, () => createBall(bounds, newSize))].slice(0, MAX_BALLS);
    ballsRef.current = finalBalls; setBalls(finalBalls);
  };
  const toggleBallsVisibility = () => { setShowBalls(v => !v); };
  const handleMainButtonPress = () => { setShowWelcome(true); setTimeout(() => setShowContinue(true), 500); };
  const handleContinuePage2 = () => { setSelectionMode(0); setPage(2); };
  const handleGoPage3 = () => setPage(3);
  const handleGoPage4 = () => setPage(4);
  const handleBackPage1 = () => {
    setPage(1); setSelectionMode(0); setPokemon1(null); setPokemon2(null); setSearchQuery('');
  };
  const handleBackToNameInput = () => { setShowWelcome(false); setShowContinue(false); setName(''); };
  const handleBackPage4 = () => { setWinner(null); setPage(4); };
  const handleChoosePokemonForBattle = (slot) => { setSelectionMode(slot); setPage(2); };
  const handleSelectPokemon = (pokemon) => {
    if (selectionMode === 1) setPokemon1(pokemon);
    else if (selectionMode === 2) setPokemon2(pokemon);
    setSelectionMode(0); setPage(4);
  };
  const handleStartBattle = (p1, p2) => {
    if (!p1 || !p2) return;
    const p1Total = Object.values(p1.stats).reduce((a, b) => a + b, 0);
    const p2Total = Object.values(p2.stats).reduce((a, b) => a + b, 0);
    if (p2Total > p1Total) setWinner(p2);
    else if (p1Total > p2Total) setWinner(p1);
    else setWinner(null);
    setPage(5);
  };

  const renderPage = () => {
    switch (page) {
      case 1:
        return <Page1 {...{theme, name, setName, scaleBtn, onPressIn, onPressOut, handleMainButtonPress, showWelcome, showContinue, handleContinuePage2, handleGoPage3, handleGoPage4, balls, handleBallPress, showBalls, handleBackToNameInput}} />;
      case 2:
        return (
          <View style={{ flex: 1 }}>
            {/* FAB para ir ao CRUD (Page6) — canto inferior direito */}
            <View style={{ position: 'absolute', bottom: 28, right: 18, zIndex: 20 }}>
              <Pressable
                onPress={() => setPage(6)}
                style={{ backgroundColor: theme.primary, paddingHorizontal: 18, paddingVertical: 14, borderRadius: 30, elevation: 5 }}
              >
                <Text style={{ color: '#111827', fontWeight: '700', fontSize: 16 }}>+ CRUD</Text>
              </Pressable>
            </View>

            <Page2
              {...{
                theme,
                pokemons: filteredPokemons,
                loading,
                searchQuery,
                setSearchQuery,
                handleToggleTheme,
                handleBackPage1,
                selectionMode,
                handleSelectPokemon,
                error,
              }}
            />
          </View>
        );
      case 3:
        return <Page3 {...{theme, bounds, showPhotoViewer, setShowPhotoViewer, showInfoModal, setShowInfoModal, handleToggleTheme, handleBackPage1From3: handleBackPage1}} />;
      case 4:
        return <Page4 {...{theme, handleToggleTheme, handleBackPage1, pokemon1, pokemon2, handleChoosePokemon: handleChoosePokemonForBattle, handleStartBattle}} />;
      case 5:
        return <Page5 {...{theme, handleBackPage4, pokemon1, pokemon2, winner}} />;
      case 6:
        return <Page6 theme={theme} pokemons={pokemons} setPokemons={setPokemons} onBack={() => setPage(2)} />; // <<< RENDERIZA O CRUD COMPLETO
      default:
        return null;
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <AnimatedBackground isDark={isDark} />
      <SafeAreaView style={styles.container}>
        <StatusBar style={isDark ? 'light' : 'dark'} />
        {page === 1 && (
          <View style={styles.headerTop}>
            <View>
              <Pressable onPress={handleToggleTheme} style={[styles.themeToggle, { backgroundColor: theme.card, borderColor: theme.subtle }]}>
                <FontAwesome5 name={isDark ? 'sun' : 'moon'} size={24} color={theme.text} solid />
              </Pressable>
            </View>
            <Text style={[styles.appTitle, { color: theme.primary }]}>Pokédex</Text>
            <View style={styles.headerRightActions}>
              <Pressable onPress={toggleBallsVisibility} style={[styles.ballToggleButton, { backgroundColor: theme.card, borderColor: theme.subtle }]}>
                <FontAwesome5 name="futbol" size={24} color={showBalls ? theme.primary : theme.text} solid />
              </Pressable>
            </View>
          </View>
        )}
        {renderPage()}
        {page === 1 && <Text style={[styles.footer, { color: theme.subtle }]}>Developed by Gustavo Rocha</Text>}
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'transparent' },
  headerTop: { position: 'absolute', top: Platform.OS === 'ios' ? 50 : 20, left: 0, right: 0, flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 16, alignItems: 'center', zIndex: 10 },
  themeToggle: { width: 52, height: 52, borderRadius: 26, borderWidth: 1, alignItems: 'center', justifyContent: 'center', zIndex: 20, elevation: 4 },
  appTitle: { ...typography.appTitle, position: 'absolute', left: 0, right: 0, textAlign: 'center', zIndex: -1 },
  headerRightActions: { minWidth: 52, alignItems: 'flex-end' },
  ballToggleButton: { width: 52, height: 52, borderRadius: 26, borderWidth: 1, alignItems: 'center', justifyContent: 'center', zIndex: 20, elevation: 4 },
  footer: { ...typography.footer, position: 'absolute', bottom: 24, width: '100%', textAlign: 'center' },
});
