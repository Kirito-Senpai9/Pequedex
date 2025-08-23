// AnimatedBackground.js
import React, { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { BlurView } from 'expo-blur';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withRepeat,
  withSequence,
} from 'react-native-reanimated';

const AnimatedCircle = ({ color, initialX, initialY, size }) => {
  const translateX = useSharedValue(initialX);
  const translateY = useSharedValue(initialY);

  useEffect(() => {
    translateX.value = withRepeat(
      withSequence(
        withTiming(initialX + (Math.random() * 200 - 100), { duration: 8000 }),
        withTiming(initialX, { duration: 8000 })
      ),
      -1, true
    );
    translateY.value = withRepeat(
      withSequence(
        withTiming(initialY + (Math.random() * 200 - 100), { duration: 8000 }),
        withTiming(initialY, { duration: 8000 })
      ),
      -1, true
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: translateX.value }, { translateY: translateY.value }],
    };
  });

  return (
    <Animated.View 
      style={[
        styles.circle,
        { backgroundColor: color, width: size, height: size },
        animatedStyle
      ]} 
    />
  );
};

// O componente agora recebe "isDark" para saber qual tema usar
export default function AnimatedBackground({ isDark }) {
  // Define as cores do fundo e das luzes com base no tema
  const backgroundColor = isDark ? '#111827' : '#F3F4F6';
  const colors = isDark 
    ? ['#FBBF24', '#4338CA', '#22D3EE'] // Amarelo, Roxo, Ciano para o tema escuro
    : ['#FECACA', '#BAE6FD', '#E0E7FF']; // Tons pastéis para o tema claro

  return (
    <View style={[styles.container, { backgroundColor }]}>
      <AnimatedCircle color={colors[0]} size={300} initialX={-50} initialY={-50} />
      <AnimatedCircle color={colors[1]} size={250} initialX={150} initialY={200} />
      <AnimatedCircle color={colors[2]} size={200} initialX={50} initialY={450} />
      
      <BlurView intensity={100} tint={isDark ? 'dark' : 'light'} style={StyleSheet.absoluteFill} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    overflow: 'hidden',
  },
  circle: {
    position: 'absolute',
    borderRadius: 1000,
    opacity: 0.5, // Deixando as luzes um pouco mais sutis
  },
});