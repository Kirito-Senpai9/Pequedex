import React from 'react';
import { StyleSheet, View, Image, Dimensions, ScrollView } from 'react-native';

 const { width } = Dimensions.get('window'); // Obtenha a largura da tela
 const larguraImagem = width / 3 - 2; // Calcule a largura de cada imagem, subtraindo a margem

const imagens = [
  'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=1976',
  'https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=1974',
  'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=1974',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=1974',
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=1976',
  'https://images.unsplash.com/photo-1521119989691-81014b9c1e19?q=80&w=1974',
  'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=1976',
  'https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=1974',
  'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=1974',
    'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=1976',
  'https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=1974',
  'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=1974',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=1974',
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=1976',
  'https://images.unsplash.com/photo-1521119989691-81014b9c1e19?q=80&w=1974',
  'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=1976',
  'https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=1974',
  'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=1974',
];

export default function App() {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.galeria}>
        {imagens.map((uri, index) => (
          <Image
            key={index}
            source={{ uri: uri }}
            style={{ width: larguraImagem, height: larguraImagem, margin: 1 }}
          />
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  galeria: {
    flexDirection: 'row',
    flexWrap: 'wrap', // Permite que as imagens quebrem para a próxima linha
    justifyContent: 'center',
    marginTop: 30,
    backgroundColor: 'red',
    height: '500px'
  },
});