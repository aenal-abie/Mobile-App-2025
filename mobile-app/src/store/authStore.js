import { create } from 'zustand';
import { aturToken } from '../services/api';
import { daftarApi, keluarApi, masukApi, profilApi } from '../services/auth';
import { ambilSesi, hapusSesi, simpanSesi } from '../services/storage';

export const useAuthStore = create((set, get) => ({
  pengguna: null,
  token: null,
  sedangMemuat: false,
  pesanError: '',

  muatSesi: async () => {
    const sesi = await ambilSesi();
    if (sesi.token) {
      aturToken(sesi.token);
      set({ token: sesi.token, pengguna: sesi.pengguna });
    }
  },

  masuk: async (email, kataSandi) => {
    set({ sedangMemuat: true, pesanError: '' });
    try {
      const data = await masukApi(email, kataSandi);
      aturToken(data.token);
      await simpanSesi(data.token, data.pengguna);
      set({ token: data.token, pengguna: data.pengguna });
    } catch (error) {
      set({ pesanError: error.response?.data?.pesan || 'Gagal masuk' });
      throw error;
    } finally {
      set({ sedangMemuat: false });
    }
  },

  daftar: async (nama, email, kataSandi) => {
    set({ sedangMemuat: true, pesanError: '' });
    try {
      const data = await daftarApi(nama, email, kataSandi);
      aturToken(data.token);
      await simpanSesi(data.token, data.pengguna);
      set({ token: data.token, pengguna: data.pengguna });
    } catch (error) {
      set({ pesanError: error.response?.data?.pesan || 'Gagal daftar' });
      throw error;
    } finally {
      set({ sedangMemuat: false });
    }
  },

  sinkronProfil: async () => {
    const token = get().token;
    if (!token) return;
    const data = await profilApi();
    set({ pengguna: data });
    await simpanSesi(token, data);
  },

  keluar: async () => {
    try {
      await keluarApi();
    } catch (_) {}
    aturToken('');
    await hapusSesi();
    set({ pengguna: null, token: null });
  },

  setPengguna: (pengguna) => set({ pengguna }),
  setToken: (token) => {
    aturToken(token);
    set({ token });
  },
}));
