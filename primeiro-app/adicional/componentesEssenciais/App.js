import React from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";

export default function App() {
  return (
    <ScrollView style={styles.container}>
      
      <View style={styles.header}>
        <Text style={styles.titulo}>Dominando Componentes Essenciais</Text>
        <Text style={styles.subtitulo}>Um Guia Prático para o React Native</Text>
      </View>
      
      <View style={styles.corpo}>
        <Text style={styles.paragrafo}>
          Olá, devs! Sejam bem-vindos ao nosso primeiro projeto prático. Aqui, vamos usar os componentes mais básicos do React Native para criar uma tela que simula um artigo de blog. O objetivo é que vocês se familiarizem com o uso de containers (View), texto (Text) e a funcionalidade de rolagem (ScrollView).
        </Text>
        <Text style={styles.paragrafo}>
          O componente View é o bloco de construção mais fundamental. Ele funciona como um contêiner genérico, permitindo agrupar e estilizar outros componentes. Usamos View para separar o cabeçalho do corpo do artigo, por exemplo.
        </Text>
        <Text style={styles.paragrafo}>
          Já o componente Text é o único que pode exibir texto. Tentar colocar uma string solta na tela resultará em um erro. Ele também possui suas próprias propriedades de estilo, como tamanho da fonte, peso e cor.
        </Text>
        <Text style={styles.paragrafo}>
          Por fim, o ScrollView é a nossa solução para lidar com telas com muito conteúdo. Se o texto deste artigo fosse maior do que a tela do celular, o ScrollView permitiria que o usuário rolasse a página, garantindo que todo o conteúdo fosse acessível. Sem ele, a parte inferior do texto simplesmente ficaria cortada e inacessível.
        </Text>
        <Text style={styles.paragrafo}>
          Experimentem modificar os estilos e adicionar mais texto. A prática é a melhor forma de fixar o conhecimento!
        </Text>
        <Text style={styles.paragrafo}>
          Olá, devs! Sejam bem-vindos ao nosso primeiro projeto prático. Aqui, vamos usar os componentes mais básicos do React Native para criar uma tela que simula um artigo de blog. O objetivo é que vocês se familiarizem com o uso de containers (View), texto (Text) e a funcionalidade de rolagem (ScrollView).
        </Text>
        <Text style={styles.paragrafo}>
          O componente View é o bloco de construção mais fundamental. Ele funciona como um contêiner genérico, permitindo agrupar e estilizar outros componentes. Usamos View para separar o cabeçalho do corpo do artigo, por exemplo.
        </Text>
        <Text style={styles.paragrafo}>
          Já o componente Text é o único que pode exibir texto. Tentar colocar uma string solta na tela resultará em um erro. Ele também possui suas próprias propriedades de estilo, como tamanho da fonte, peso e cor.
        </Text>
        <Text style={styles.paragrafo}>
          Por fim, o ScrollView é a nossa solução para lidar com telas com muito conteúdo. Se o texto deste artigo fosse maior do que a tela do celular, o ScrollView permitiria que o usuário rolasse a página, garantindo que todo o conteúdo fosse acessível. Sem ele, a parte inferior do texto simplesmente ficaria cortada e inacessível.
        </Text>
        <Text style={styles.paragrafo}>
          Experimentem modificar os estilos e adicionar mais texto. A prática é a melhor forma de fixar o conhecimento!
        </Text>
      </View>
      
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f3f3f3",
    padding: 20,
    marginTop: 30,
    flexDirection: 'column',
    justifyContent: 'flex-end',
  },
  header: {
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    paddingBottom: 10,
  },
  titulo: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
  },
  subtitulo: {
    fontSize: 16,
    color: "#666",
    marginTop: 5,
  },
  corpo: {
    // flex: 1,
    // flexDirection: 'column',
    // justifyContent: 'flex-start',
  },  
  paragrafo: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 15,
  },
});