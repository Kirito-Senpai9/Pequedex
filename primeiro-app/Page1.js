// Page1.js (VERSÃO FINAL COM O BOTÃO "VOLTAR" CORRETO)
import React from 'react';
import {
  StyleSheet, Text, View, Pressable, Animated, TextInput, TouchableWithoutFeedback
} from 'react-native';
import { typography } from './styles/typography';

export default function Page1({
  theme, name, setName, scaleBtn, onPressIn, onPressOut, handleMainButtonPress,
  showWelcome, showContinue, handleContinuePage2, handleGoPage3, handleGoPage4,
  balls, handleBallPress, showBalls, handleBackToNameInput
}) {
  return (
    <View style={styles.pageContainer}>
      <View style={styles.content}>
        {!showWelcome && !showContinue && (
          <TextInput
            style={[typography.input, { borderColor: theme.subtle, color: theme.text, backgroundColor: theme.card }]}
            placeholder="Digite seu nome"
            placeholderTextColor={theme.subtle}
            value={name}
            onChangeText={setName}
          />
        )}

        {!showWelcome && !showContinue && (
          <Animated.View style={{ transform: [{ scale: scaleBtn }], width: '100%' }}>
            <Pressable
              onPress={handleMainButtonPress}
              onPressIn={onPressIn}
              onPressOut={onPressOut}
              style={[ styles.button, { backgroundColor: theme.primary, opacity: name.trim() === '' ? 0.5 : 1 }]}
              disabled={name.trim() === ''}
            >
              <Text style={styles.buttonText}>CLIQUE AQUI E CONTINUE</Text>
            </Pressable>
          </Animated.View>
        )}

        {showWelcome && (
          <Text style={[typography.welcome, { color: theme.primary, textTransform: 'capitalize'}]}>
            Seja bem-vindo(a) {name}
          </Text>
        )}

        {showContinue && (
          <>
            <Pressable onPress={handleContinuePage2} style={[styles.button, { backgroundColor: theme.primary, marginTop: 12 }]}>
              <Text style={styles.buttonText}>Ver Lista Pokémon</Text>
            </Pressable>
            <Pressable onPress={handleGoPage4} style={[styles.button, { backgroundColor: theme.primary, marginTop: 12 }]}>
              <Text style={styles.buttonText}>Ir para Batalha</Text>
            </Pressable>
            <Pressable onPress={handleGoPage3} style={[styles.button, { backgroundColor: theme.primary, marginTop: 12 }]}>
              <Text style={styles.buttonText}>Perfil do Desenvolvedor</Text>
            </Pressable>

            {/* BOTÃO DE VOLTAR ADICIONADO AQUI, NO FINAL DA LISTA */}
            <Pressable
              onPress={handleBackToNameInput}
              style={[styles.button, { backgroundColor: theme.subtle, marginTop: 12 }]}
            >
              <Text style={[styles.buttonText, { color: theme.text }]}>Voltar</Text>
            </Pressable>
          </>
        )}
      </View>

      {showBalls && balls.map((b) => (
        <TouchableWithoutFeedback key={b.id} onPress={() => handleBallPress(b)}>
          <Animated.View
            style={[
              styles.ball,
              { 
                backgroundColor: theme.primary,
                width: b.size,
                height: b.size,
                borderRadius: b.size / 2,
                transform: [{ translateX: b.ax }, { translateY: b.ay }] 
              },
            ]}
          />
        </TouchableWithoutFeedback>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  pageContainer: { flex: 1, backgroundColor: 'transparent' },
  content: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 20 },
  button: { paddingVertical: 16, paddingHorizontal: 28, borderRadius: 14, elevation: 4, width: '100%', alignItems: 'center' },
  buttonText: { ...typography.button, color: '#fff' },
  ball: { position: 'absolute' },
});