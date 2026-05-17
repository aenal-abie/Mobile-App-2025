import axios from 'axios';
import { KONFIGURASI } from '../config/constants';

export const api = axios.create({
  baseURL: KONFIGURASI.dasarApi,
  timeout: 10000,
});

export function aturToken(token) {
  api.defaults.headers.common.Authorization = token ? `Bearer ${token}` : '';
}
