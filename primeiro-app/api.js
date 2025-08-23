// api.js
import axios from 'axios';
import { getApiBaseUrl } from './apiUrl';

export const api = axios.create({
  baseURL: `${getApiBaseUrl()}/api`,
});