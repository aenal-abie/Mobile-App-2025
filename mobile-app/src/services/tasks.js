import { api } from './api';

export async function ambilSemuaTugasApi() {
  const response = await api.get('/tugas');
  return response.data.data;
}

export async function ambilDetailTugasApi(id) {
  const response = await api.get(`/tugas/${id}`);
  return response.data.data;
}

export async function buatTugasApi(data) {
  const response = await api.post('/tugas', data);
  return response.data.data;
}

export async function perbaruiTugasApi(id, data) {
  const response = await api.put(`/tugas/${id}`, data);
  return response.data.data;
}

export async function hapusTugasApi(id) {
  const response = await api.delete(`/tugas/${id}`);
  return response.data;
}

export async function tandaiSelesaiApi(id) {
  const response = await api.patch(`/tugas/${id}/selesai`);
  return response.data.data;
}
