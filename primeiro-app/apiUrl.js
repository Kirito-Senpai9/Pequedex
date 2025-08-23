// apiUrl.js
import { Platform } from 'react-native';
import Constants from 'expo-constants';

/**
 * WEB (PC): localhost:3000
 * EXPO GO (celular): usa o IP do QR do Expo + :3000
 * Fallback (emulador Android): 10.0.2.2:3000
 */
export const getApiBaseUrl = () => {
  if (Platform.OS === 'web') {
    return 'http://localhost:3000';
  }

  const expoConfig = Constants?.expoConfig || Constants?.manifest || {};
  const hostUri = expoConfig.hostUri || ''; // ex.: "192.168.1.90:8081"
  if (hostUri) {
    const host = hostUri.split(':')[0]; // "192.168.1.90"
    return `http://${host}:3000`;
  }

  return Platform.OS === 'android' ? 'http://10.0.2.2:3000' : 'http://localhost:3000';
};