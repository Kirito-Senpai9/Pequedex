import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Modal,
  Pressable
} from 'react-native';

export default function App() {
  const [modalVisivel, setModalVisivel] = useState(false);

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Controle de Modal</Text>
      
      <Pressable
        style={styles.botaoAbrir}
        onPress={() => setModalVisivel(true)}
      >
        <Text style={styles.textoBotao}>Abrir Pop-up</Text>
      </Pressable>

      <Modal
        animationType="fade"
        transparent={false}
        visible={modalVisivel}
        onRequestClose={() => {
          setModalVisivel(!modalVisivel);
        }}
      >
        <View style={styles.modalCentralizado}>
          <View style={styles.modalConteudo}>
            <Text style={styles.tituloModal}>Pop-up Aberto!</Text>
            <Text style={styles.textoModal}>
              Esta é uma tela sobreposta. Você a abriu alterando o estado da aplicação.
            </Text>
            <Pressable
              style={styles.botaoFechar}
              onPress={() => setModalVisivel(false)}
            >
              <Text style={styles.textoBotao}>Fechar</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
      
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
  },
  titulo: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  botaoAbrir: {
    backgroundColor: '#007bff',
    padding: 10,
    borderRadius: 5,
  },
  textoBotao: {
    color: 'white',
    fontWeight: 'bold',
  },
  modalCentralizado: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalConteudo: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
    elevation: 5, // Sombra no Android
    shadowColor: '#000', // Sombra no iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  tituloModal: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  textoModal: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
  botaoFechar: {
    backgroundColor: '#dc3545',
    padding: 10,
    borderRadius: 5,
  },
});