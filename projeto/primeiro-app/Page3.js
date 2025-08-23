// Page3.js (VERSÃO FINAL COM BOTÃO DE INFO, MODAL TÉCNICO E ZOOM NA FOTO)
import React, { useState } from 'react';
import {
  StyleSheet, Text, View, Pressable, SafeAreaView, Platform, Image,
  Linking, ScrollView, Modal
} from 'react-native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { typography } from './styles/typography';

const PROFILE_SRC = require('./assets/Imagem do WhatsApp de 2025-08-12 à(s) 09.25.33_54c69b98.jpg');
const ICON_IG = require('./assets/Instagram_logo_2022.svg.png');
const ICON_IN = require('./assets/LinkedIn_logo_initials.png');
const ICON_GH = require('./assets/download.png');

export default function Page3({
  theme,
  handleToggleTheme,
  handleBackPage1From3,
}) {
  const [infoModalVisible, setInfoModalVisible] = useState(false);
  const [imageModalVisible, setImageModalVisible] = useState(false); // NOVO ESTADO P/ FOTO

  const URL_IG = 'https://www.instagram.com/gitodelax';
  const URL_GH = 'https://github.com/gugu013';
  const URL_IN = 'https://www.linkedin.com/in/gugu-rocha-86982a354';

  const techSummary = "Com uma base sólida em lógica de programação, possuo conhecimentos em desenvolvimento web e mobile. Minhas habilidades incluem: JavaScript (React/React Native, Node.js), bancos de dados (SQL, MongoDB), e linguagens como Python e PHP. Tenho familiaridade com HTML/CSS, Bootstrap e ambientes Windows e Linux.";

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: 'transparent' }]}>
      <View style={styles.headerContainer}>
        <Pressable onPress={handleToggleTheme} style={[styles.themeToggle, { backgroundColor: theme.card, borderColor: theme.subtle }]}>
          <FontAwesome5 name={theme.isDark ? 'sun' : 'moon'} size={24} color={theme.text} solid />
        </Pressable>
        <Text style={[styles.appTitle, { color: theme.primary }]}>Perfil</Text>
        <Pressable onPress={handleBackPage1From3}>
          <View style={styles.backButton}>
            <FontAwesome5 name="arrow-left" size={24} color={theme.primary} />
          </View>
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {/* FOTO CLICÁVEL */}
        <Pressable onPress={() => setImageModalVisible(true)}>
          <View style={styles.profileImageContainer}>
            <Image source={PROFILE_SRC} style={styles.profileImage} resizeMode="cover" />
          </View>
        </Pressable>

        <Text style={[typography.profileText, { color: theme.text, marginTop: 15 }]}>
          Gustavo Rocha
        </Text>
        <Text style={[typography.body, { color: theme.text, textAlign: 'center', paddingHorizontal: 20, marginBottom: 20 }]}>
          Tenho 20 anos e sou apaixonado por tecnologia, jogos e futebol.
        </Text>
        <View style={styles.socialContainer}>
          <Pressable onPress={() => Linking.openURL(URL_IG)} style={[styles.socialBtn, { backgroundColor: theme.card, borderColor: theme.subtle }]}><Image source={ICON_IG} style={styles.socialIcon} /></Pressable>
          <Pressable onPress={() => Linking.openURL(URL_IN)} style={[styles.socialBtn, { backgroundColor: theme.card, borderColor: theme.subtle }]}><Image source={ICON_IN} style={styles.socialIcon} /></Pressable>
          <Pressable onPress={() => Linking.openURL(URL_GH)} style={[styles.socialBtn, { backgroundColor: theme.card, borderColor: theme.subtle }]}><Image source={ICON_GH} style={styles.socialIcon} /></Pressable>
        </View>
      </ScrollView>

      {/* BOTÃO DE INFO */}
      <Pressable
        onPress={() => setInfoModalVisible(true)}
        style={[styles.fabInfo, { backgroundColor: theme.primary }]}
      >
        <FontAwesome5 name="info" size={24} color={'#FFF'} solid />
      </Pressable>

      {/* MODAL DE INFO */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={infoModalVisible}
        onRequestClose={() => setInfoModalVisible(false)}
      >
        <Pressable style={styles.modalOverlay} onPress={() => setInfoModalVisible(false)}>
          <View style={[styles.modalContainer, { backgroundColor: theme.card }]} onStartShouldSetResponder={() => true}>
            <Text style={[styles.modalTitle, { color: theme.primary }]}>Conhecimentos Técnicos</Text>
            <Text style={[styles.modalText, { color: theme.text }]}>{techSummary}</Text>
            <Pressable onPress={() => setInfoModalVisible(false)} style={[styles.button, { backgroundColor: theme.primary, marginTop: 20 }]}>
              <Text style={styles.buttonText}>Fechar</Text>
            </Pressable>
          </View>
        </Pressable>
      </Modal>

      {/* MODAL DA FOTO COM ZOOM */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={imageModalVisible}
        onRequestClose={() => setImageModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <ScrollView
            style={{ flex: 1 }}
            contentContainerStyle={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
            minimumZoomScale={1}
            maximumZoomScale={5}
            showsHorizontalScrollIndicator={false}
            showsVerticalScrollIndicator={false}
          >
            <Image source={PROFILE_SRC} style={{ width: 350, height: 350, borderRadius: 20 }} resizeMode="contain" />
          </ScrollView>
          <Pressable onPress={() => setImageModalVisible(false)} style={[styles.button, { backgroundColor: theme.primary, margin: 20 }]}>
            <Text style={styles.buttonText}>Fechar</Text>
          </Pressable>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  headerContainer: { paddingTop: Platform.OS === 'ios' ? 10 : 20, paddingBottom: 10, paddingHorizontal: 16, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  themeToggle: { width: 52, height: 52, borderRadius: 26, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
  appTitle: { ...typography.appTitle, position: 'absolute', left: 0, right: 0, textAlign: 'center', zIndex: -1 },
  backButton: { width: 52, height: 52, alignItems: 'flex-end', justifyContent: 'center' },
  content: { flexGrow: 1, alignItems: 'center', paddingTop: 30, paddingBottom: 80, paddingHorizontal: 16 },
  profileImageContainer: { width: 140, height: 140, borderRadius: 70, overflow: 'hidden', borderWidth: 3, borderColor: '#FBBF24' },
  profileImage: { width: '100%', height: '100%' },
  socialContainer: { flexDirection: 'row', gap: 20, marginTop: 10 },
  socialBtn: { width: 60, height: 60, borderRadius: 30, borderWidth: 1, alignItems: 'center', justifyContent: 'center', elevation: 3 },
  socialIcon: { width: 30, height: 30, resizeMode: 'contain' },
  fabInfo: { position: 'absolute', right: 20, bottom: 20, width: 60, height: 60, borderRadius: 30, alignItems: 'center', justifyContent: 'center', elevation: 8 },
  modalOverlay: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.9)' },
  modalContainer: { width: '90%', borderRadius: 20, padding: 25, alignItems: 'center' },
  modalTitle: { ...typography.modalTitle, marginBottom: 15 },
  modalText: { ...typography.body, textAlign: 'center', lineHeight: 24 },
  button: { paddingVertical: 12, paddingHorizontal: 24, borderRadius: 10, elevation: 4 },
  buttonText: { ...typography.button, color: '#fff' },
});
