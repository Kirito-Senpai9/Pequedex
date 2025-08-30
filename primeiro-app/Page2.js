import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  SafeAreaView,
  FlatList,
  Modal,
  Image,
  TextInput,
  ScrollView,
  Dimensions,
  TouchableOpacity,
  ActivityIndicator,
  Platform,
} from "react-native";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import { typography } from "./styles/typography";

const POKEBALL_PLACEHOLDER = require("./assets/pokeball.png");
const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

// Componente para as barras de stats (do Código 1)
const StatBar = ({ label, value, theme }) => {
  const percent = Math.min((value / 150) * 100, 100);
  return (
    <View style={{ marginVertical: 4, width: "90%" }}>
      <Text style={{ color: theme.text, fontSize: 12 }}>
        {label}: {value}
      </Text>
      <View
        style={{
          backgroundColor: theme.subtle,
          height: 6, // diminuiu para não atrapalhar o info geral
          borderRadius: 5,
          overflow: "hidden",
        }}
      >
        <View
          style={{
            width: `${percent}%`,
            backgroundColor: theme.primary,
            height: 6,
          }}
        />
      </View>
    </View>
  );
};

// Card do Pokémon
const PokemonCard = ({ item, theme, onLongPress, onPress }) => {
  const imageUrl =
    item.sprites?.officialArtwork ||
    item.sprites?.frontDefault ||
    item.sprites?.animated;
  return (
    <TouchableOpacity
      style={[styles.pokemonBox, { backgroundColor: theme.card }]}
      onLongPress={() => onLongPress(item)}
      onPress={() => onPress(item)}
      delayLongPress={200}
    >
      {imageUrl ? (
        <Image source={{ uri: imageUrl }} style={styles.pokemonImage} />
      ) : (
        <Image
          source={POKEBALL_PLACEHOLDER}
          style={[styles.pokemonImage, { tintColor: theme.subtle }]}
        />
      )}
      <Text style={[styles.pokemonText, { color: theme.text }]}>{item.name}</Text>
    </TouchableOpacity>
  );
};

export default function Page2({
  theme,
  pokemons,
  loading,
  searchQuery,
  setSearchQuery,
  handleBackPage1,
  handleToggleTheme,
  selectionMode,
  handleSelectPokemon,
  error,
}) {
  const [selectedPokemon, setSelectedPokemon] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [innerPage, setInnerPage] = useState(0);

  // --- NOVO: controla a URI exibida no popup (GIF -> artwork -> frontDefault -> placeholder) ---
  const [gifUri, setGifUri] = useState(null);

  useEffect(() => {
    if (!selectedPokemon) {
      setGifUri(null);
      return;
    }
    const sprites = selectedPokemon?.sprites || {};
    const animated = sprites.animated;
    const official = sprites.officialArtwork;
    const front = sprites.frontDefault;
    const hasAnimated = !!(animated && animated.trim());
    const hasOfficial = !!(official && official.trim());
    const hasFront = !!(front && front.trim());
    setGifUri(hasAnimated ? animated : hasOfficial ? official : hasFront ? front : null);
  }, [selectedPokemon?.id, modalVisible]);
  // ---------------------------------------------------------------------------

  const handleCardPress = (pokemon) => {
    if (selectionMode > 0) handleSelectPokemon(pokemon);
  };

  const handleLongPressPokemon = (pokemon) => {
    // força nova referência para disparar o efeito
    setSelectedPokemon({ ...pokemon });
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setInnerPage(0);
    setGifUri(null);
    setSelectedPokemon(null);
  };

  if (loading) {
    return (
      <View style={styles.statusContainer}>
        <ActivityIndicator size="large" color={theme.primary} />
        <Text style={[styles.statusText, { color: theme.text }]}>Buscando Pokémon...</Text>
      </View>
    );
  }

  const filteredPokemons = pokemons.filter((p) =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* HEADER */}
      <View style={styles.fixedHeader}>
        <Pressable
          onPress={handleToggleTheme}
          style={[styles.themeToggle, { backgroundColor: theme.card, borderColor: theme.subtle }]}
        >
          <FontAwesome5 name={theme.isDark ? "sun" : "moon"} size={24} color={theme.text} solid />
        </Pressable>

        <View style={styles.searchContainer}>
          <FontAwesome5 name="search" size={16} color={theme.subtle} style={styles.searchIcon} />
          <TextInput
            style={[
              styles.searchInput,
              { backgroundColor: theme.card, color: theme.text, borderColor: theme.subtle },
            ]}
            placeholder="Buscar Pokémon..."
            placeholderTextColor={theme.subtle}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        <Pressable onPress={handleBackPage1}>
          <FontAwesome5 name="arrow-left" size={24} color={theme.primary} />
        </Pressable>
      </View>

      {/* LISTA DE POKÉMON */}
      <FlatList
        style={styles.list}
        data={filteredPokemons}
        keyExtractor={(item) => item.id.toString()}
        numColumns={2}
        renderItem={({ item }) => (
          <PokemonCard
            item={item}
            theme={theme}
            onLongPress={handleLongPressPokemon}
            onPress={handleCardPress}
          />
        )}
        ListEmptyComponent={() => (
          <View style={styles.statusContainer}>
            <Text style={[styles.statusText, { color: theme.text }]}>
              {error || 'Nenhum Pokémon encontrado.'}
            </Text>
          </View>
        )}
      />

      {/* MODAL POPUP (Código 1) */}
      {selectedPokemon && (
        <Modal animationType="slide" transparent={true} visible={modalVisible} onRequestClose={closeModal}>
          <View style={styles.modalBackground}>
            {/* Popup 1: GIF / Artwork / Placeholder */}
            <View style={[styles.gifPopup, { backgroundColor: theme.card }]}>
              {gifUri ? (
                <Image
                  key={`${selectedPokemon?.id}-${modalVisible ? 'on' : 'off'}`}
                  source={{ uri: gifUri }}
                  style={styles.gifImage}
                  onError={() => {
                    const sprites = selectedPokemon?.sprites || {};
                    const animated = sprites.animated;
                    const official = sprites.officialArtwork;
                    const front = sprites.frontDefault;
                    if (gifUri === animated && official) setGifUri(official);
                    else if ((gifUri === animated || gifUri === official) && front) setGifUri(front);
                    else setGifUri(null);
                  }}
                />
              ) : (
                <Image
                  key={`${selectedPokemon?.id}-${modalVisible ? 'on' : 'off'}`}
                  source={POKEBALL_PLACEHOLDER}
                  style={[styles.gifImage, { tintColor: theme.subtle }]}
                />
              )}
              <Text style={[styles.modalTitle, { color: theme.text }]}>{selectedPokemon.name}</Text>
            </View>

            {/* Popup 2: DETALHES (Stats ↔ Info) */}
            <View style={[styles.infoPopup, { backgroundColor: theme.card }]}>
              <ScrollView
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                onScroll={(e) => setInnerPage(Math.round(e.nativeEvent.contentOffset.x / screenWidth))}
                scrollEventThrottle={16}
              >
                {/* Stats */}
                <View style={styles.modalPage}>
                  <Text style={[styles.sectionTitle, { color: theme.text, textAlign: "center" }]}>
                    Estatísticas de Batalha
                  </Text>
                  <StatBar label="HP" value={selectedPokemon.stats.hp} theme={theme} />
                  <StatBar label="Ataque" value={selectedPokemon.stats.attack} theme={theme} />
                  <StatBar label="Defesa" value={selectedPokemon.stats.defense} theme={theme} />
                  <StatBar label="Atq. Especial" value={selectedPokemon.stats.specialAttack} theme={theme} />
                  <StatBar label="Def. Especial" value={selectedPokemon.stats.specialDefense} theme={theme} />
                  <StatBar label="Velocidade" value={selectedPokemon.stats.speed} theme={theme} />
                </View>

                {/* Info */}
                <View style={styles.modalPage}>
                  <Text style={[styles.sectionTitle, { color: theme.text, textAlign: "left", width: "90%" }]}>
                    Informações Gerais
                  </Text>
                  <View style={{ width: "90%", alignItems: "flex-start" }}>
                    <Text style={[styles.modalInfo, { color: theme.text }]}>
                      Tipos: {selectedPokemon.types.join(", ")}
                    </Text>
                    <Text style={[styles.modalInfo, { color: theme.text }]}>
                      Habilidades: {selectedPokemon.abilities.join(", ")}
                    </Text>
                    <Text style={[styles.modalInfo, { color: theme.text }]}>
                      Altura: {selectedPokemon.height} m
                    </Text>
                    <Text style={[styles.modalInfo, { color: theme.text }]}>
                      Peso: {selectedPokemon.weight} kg
                    </Text>
                  </View>
                </View>
              </ScrollView>

              {/* Pagination Dots */}
              <View style={styles.pagination}>
                {[0, 1].map((i) => (
                  <View
                    key={i}
                    style={[styles.dot, { backgroundColor: i === innerPage ? theme.primary : theme.subtle }]}
                  />
                ))}
              </View>

              <Pressable style={[styles.closeButton, { backgroundColor: theme.primary }]} onPress={closeModal}>
                <Text style={{ color: "#fff" }}>Fechar</Text>
              </Pressable>
            </View>
          </View>
        </Modal>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  fixedHeader: {
    paddingTop: Platform.OS === "ios" ? 10 : 20,
    paddingBottom: 10,
    paddingHorizontal: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  themeToggle: { width: 48, height: 48, borderRadius: 24, borderWidth: 1, alignItems: "center", justifyContent: "center" },
  searchContainer: { flex: 1, flexDirection: "row", alignItems: "center", marginHorizontal: 10 },
  searchInput: { flex: 1, height: 48, borderWidth: 1, borderRadius: 24, paddingLeft: 40, paddingRight: 16, ...typography.body },
  searchIcon: { position: "absolute", left: 16, zIndex: 1 },
  list: { flex: 1, paddingHorizontal: 8 },
  statusContainer: { flex: 1, height: 500, justifyContent: "center", alignItems: "center" },
  statusText: { ...typography.welcome },
  pokemonBox: { flex: 1, margin: 6, padding: 12, borderRadius: 12, elevation: 3, justifyContent: "center", alignItems: "center", height: 160 },
  pokemonImage: { width: 90, height: 90, resizeMode: "contain" },
  pokemonText: { ...typography.pokemonCardTitle, textTransform: "capitalize", marginTop: 8, textAlign: "center" },
  modalBackground: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "rgba(0,0,0,0.6)" },
  gifPopup: { width: "85%", borderTopLeftRadius: 20, borderTopRightRadius: 20, alignItems: "center", padding: 20 },
  gifImage: { width: 150, height: 150, resizeMode: "contain", marginBottom: 8 },
  modalTitle: { fontSize: 20, fontWeight: "bold", textTransform: "capitalize" },
  infoPopup: { width: "85%", borderBottomLeftRadius: 20, borderBottomRightRadius: 20, padding: 20, alignItems: "center" },
  modalPage: { width: screenWidth * 0.8, alignItems: "center", justifyContent: "center", padding: 10 },
  sectionTitle: { fontSize: 16, fontWeight: "bold", marginBottom: 8 },
  modalInfo: { fontSize: 14, marginVertical: 4 },
  pagination: { flexDirection: "row", justifyContent: "center", marginVertical: 10 },
  dot: { width: 8, height: 8, borderRadius: 4, marginHorizontal: 4 },
  closeButton: { marginTop: 10, padding: 10, borderRadius: 8 },
});
  