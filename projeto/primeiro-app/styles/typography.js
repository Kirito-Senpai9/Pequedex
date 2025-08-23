// styles/typography.js
import { Platform } from 'react-native';

// A família de fontes base continua a mesma
const FONT_FAMILY_BASE = Platform.select({
  ios: 'System',
  android: 'Roboto',
  default: 'sans-serif',
});

// O único peso que usaremos agora será o REGULAR
const FONT_WEIGHT = {
  REGULAR: '400',
  // Os outros pesos não são mais necessários, mas podemos mantê-los para uso futuro
  SEMIBOLD: '600',
  BOLD: '700',
  EXTRA_BOLD: '800',
  BLACK: '900',
};

// --- ALTERAÇÃO PRINCIPAL AQUI ---
// Todos os fontWeight foram alterados para FONT_WEIGHT.REGULAR
export const typography = {
  // Estilos Gerais
  body: {
    fontFamily: FONT_FAMILY_BASE,
    fontWeight: FONT_WEIGHT.REGULAR,
    fontSize: 16,
  },
  label: {
    fontFamily: FONT_FAMILY_BASE,
    fontWeight: FONT_WEIGHT.REGULAR, // Alterado de BOLD
    fontSize: 14,
    marginBottom: 4,
  },

  // Estilos Específicos de Componentes
  appTitle: {
    fontFamily: FONT_FAMILY_BASE,
    fontWeight: FONT_WEIGHT.REGULAR, // Alterado de BLACK
    fontSize: 24,
  },
  button: {
    fontFamily: FONT_FAMILY_BASE,
    fontWeight: FONT_WEIGHT.REGULAR, // Alterado de EXTRA_BOLD
    fontSize: 16,
    letterSpacing: 0.8,
  },
  footer: {
    fontFamily: FONT_FAMILY_BASE,
    fontWeight: FONT_WEIGHT.REGULAR, // Já era REGULAR
    fontSize: 12,
  },
  input: {
    fontFamily: FONT_FAMILY_BASE,
    fontWeight: FONT_WEIGHT.REGULAR, // Já era REGULAR
    fontSize: 16,
    height: 50, 
    borderWidth: 1, 
    borderRadius: 14, 
    paddingHorizontal: 16, 
    marginBottom: 12,
    width: '100%',
  },
  welcome: {
    fontFamily: FONT_FAMILY_BASE,
    fontWeight: FONT_WEIGHT.REGULAR, // Alterado de BLACK
    fontSize: 20,
    marginTop: 12,
  },
  pokemonCardTitle: {
    fontFamily: FONT_FAMILY_BASE,
    fontWeight: FONT_WEIGHT.REGULAR, // Alterado de BOLD
    fontSize: 18,
  },
  modalTitle: {
    fontFamily: FONT_FAMILY_BASE,
    fontWeight: FONT_WEIGHT.REGULAR, // Alterado de BOLD
    fontSize: 24,
    marginBottom: 15,
    textAlign: 'center',
  },
  modalText: {
    fontFamily: FONT_FAMILY_BASE,
    fontWeight: FONT_WEIGHT.REGULAR, // Já era REGULAR
    fontSize: 18,
  },
  profileText: {
    fontFamily: FONT_FAMILY_BASE,
    fontWeight: FONT_WEIGHT.REGULAR, // Alterado de BOLD
    textAlign: 'center', 
    paddingHorizontal: 24,
    marginTop: 16,
  },
  infoTitle: {
    fontFamily: FONT_FAMILY_BASE,
    fontWeight: FONT_WEIGHT.REGULAR, // Alterado de BLACK
    fontSize: 18,
    marginBottom: 8,
  },
  infoBody: {
    fontFamily: FONT_FAMILY_BASE,
    fontWeight: FONT_WEIGHT.REGULAR, // Alterado de SEMIBOLD
    fontSize: 14,
    opacity: 0.9,
  },
};