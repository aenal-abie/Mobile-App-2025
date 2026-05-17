import { api } from './api';

export async function masukApi(email, kataSandi) {
  const response = await api.post('/aut/masuk', { email, kata_sandi: kataSandi });
  return response.data.data;
}

export async function daftarApi(nama, email, kataSandi) {
  const response = await api.post('/aut/daftar', { nama, email, kata_sandi: kataSandi });
  return response.data.data;
}

export async function profilApi() {
  const response = await api.get('/aut/profil');
  return response.data.data;
}

export async function perbaruiProfilApi(data) {
  const response = await api.put('/aut/profil', data);
  return response.data.data;
}

export async function keluarApi() {
  const response = await api.post('/aut/keluar');
  return response.data;
}
