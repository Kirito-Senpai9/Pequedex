// battleEffects.js
import { useRef, useEffect, useState } from 'react';
import { Animated, Easing, StyleSheet } from 'react-native';

const PARTICLE_COUNT = 12;

export function useBattleAnimation(winner, pokemon1, pokemon2) {
  const anim = useRef(new Animated.Value(0)).current;
  const flashAnim = useRef(new Animated.Value(0)).current;
  const textAnim = useRef(new Animated.Value(0)).current;
  const particles = useRef([...Array(PARTICLE_COUNT)].map(() => new Animated.Value(0))).current;
  const [isAnimationComplete, setIsAnimationComplete] = useState(false);

  useEffect(() => {
    Animated.sequence([
      Animated.timing(anim, { toValue: 1, duration: 500, easing: Easing.out(Easing.poly(4)), useNativeDriver: true }),
      Animated.delay(100),
      Animated.timing(anim, { toValue: 2, duration: 400, useNativeDriver: true }),
      Animated.timing(anim, { toValue: 3, duration: 200, easing: Easing.in(Easing.quad), useNativeDriver: true }),
      Animated.parallel([
        Animated.sequence([
          Animated.timing(flashAnim, { toValue: 1, duration: 70, useNativeDriver: true }),
          Animated.timing(flashAnim, { toValue: 0, duration: 300, useNativeDriver: true }),
        ]),
        Animated.stagger(30, particles.map(p => Animated.timing(p, { toValue: 1, duration: 800, useNativeDriver: true }))),
        Animated.timing(anim, { toValue: 4, duration: 1000, easing: Easing.out(Easing.exp), useNativeDriver: true }),
      ]),
      Animated.timing(textAnim, { toValue: 1, duration: 400, easing: Easing.back(1), useNativeDriver: true }),
    ]).start(() => setIsAnimationComplete(true));
  }, []);

  const isP1Winner = winner?.id === pokemon1?.id;
  const isP2Winner = winner?.id === pokemon2?.id;

  const createCardStyles = (isWinner, isLeftCard) => ({
    opacity: anim.interpolate({
      inputRange: [4, 5],
      // CORREÇÃO: A opacidade do perdedor agora é controlada aqui
      outputRange: [1, isWinner ? 1 : 0.6],
      extrapolate: 'clamp'
    }),
    transform: [
      { perspective: 1000 },
      {
        translateY: anim.interpolate({
          inputRange: [0, 1],
          outputRange: [400, 0],
          extrapolate: 'clamp'
        })
      },
      {
        rotateY: anim.interpolate({
            inputRange: [0, 1],
            outputRange: [isLeftCard ? '90deg' : '-90deg', '0deg'],
            extrapolate: 'clamp'
        })
      },
      {
        translateX: anim.interpolate({
          inputRange: [1, 2, 3, 4],
          outputRange: [isLeftCard ? -85 : 85, isLeftCard ? -75 : 75, isLeftCard ? -30 : 30, isLeftCard ? -85 : 85],
          extrapolate: 'clamp'
        })
      },
      {
        scale: anim.interpolate({
          inputRange: [1, 2, 3, 4],
          outputRange: [1, 0.95, 1.2, isWinner ? 1.1 : 1],
          extrapolate: 'clamp'
        })
      },
      { // CORREÇÃO: A rotação do perdedor foi integrada aqui
        rotateZ: anim.interpolate({
            inputRange: [4, 5],
            outputRange: ['0deg', isWinner ? '0deg' : (isLeftCard ? '8deg' : '-8deg')],
            extrapolate: 'clamp'
        })
      }
    ],
  });

  const card1Style = createCardStyles(isP1Winner, true);
  const card2Style = createCardStyles(isP2Winner, false);

  const flashStyle = {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    zIndex: 100,
    opacity: flashAnim,
  };

  const winnerGlowStyle = {
    position: 'absolute',
    width: 170, height: 230,
    borderRadius: 14,
    backgroundColor: '#FBBF24',
    zIndex: -1,
    opacity: anim.interpolate({
        inputRange: [4, 5],
        outputRange: [0, 0.4],
        extrapolate: 'clamp'
    }),
  };

  const particleStyles = particles.map((p, i) => {
    const angle = (i / PARTICLE_COUNT) * 360;
    const radius = 150;
    return {
        position: 'absolute',
        width: 15,
        height: 15,
        borderRadius: 10,
        backgroundColor: i % 2 === 0 ? '#EF4444' : '#FBBF24',
        opacity: p.interpolate({ inputRange: [0, 0.1, 1], outputRange: [0, 1, 0] }),
        transform: [
            { translateX: p.interpolate({ inputRange: [0, 1], outputRange: [0, Math.cos(angle * (Math.PI / 180)) * radius] }) },
            { translateY: p.interpolate({ inputRange: [0, 1], outputRange: [0, Math.sin(angle * (Math.PI / 180)) * radius] }) },
            { scale: p.interpolate({ inputRange: [0, 0.05, 1], outputRange: [0, 1, 0] }) }
        ]
    };
  });

  const resultTextStyle = {
      opacity: textAnim,
      transform: [{ scale: textAnim }]
  }

  // A etapa final da animação é de 4 para 5, para os efeitos de vitória/derrota
  useEffect(() => {
    if(isAnimationComplete) {
        Animated.timing(anim, {
            toValue: 5,
            duration: 400,
            useNativeDriver: true
        }).start();
    }
  }, [isAnimationComplete]);

  return { styles: { card1Style, card2Style, flashStyle, winnerGlowStyle, particleStyles, resultTextStyle }, isAnimationComplete };
}