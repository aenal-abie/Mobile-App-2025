import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { apiAut } from '../services/auth';

export const gunakkanStoreAut = create((set) => ({
  pengguna: null,
  token: null,
  sedangMemuat: false,
  error: null,

  // Membaca status login dari storage lokal saat aplikasi dimulai
  inisialisasiAuth: async () => {
    try {
      set({ sedangMemuat: true });
      const token = await AsyncStorage.getItem('token');
      const penggunaStr = await AsyncStorage.getItem('pengguna');

      if (token && penggunaStr) {
        set({ token, pengguna: JSON.parse(penggunaStr) });
      }
    } catch (err) {
      console.error('Error saat inisialisasi auth:', err);
    } finally {
      set({ sedangMemuat: false });
    }
  },

  // Mendaftar pengguna baru
  daftar: async (email, nama, kataSandi) => {
    try {
      set({ sedangMemuat: true, error: null });
      const respon = await apiAut.daftar(email, nama, kataSandi);
      const dataRespon = respon.data;

      if (dataRespon.sukses) {
        const penggunaBaru = dataRespon.data ?? {};
        await AsyncStorage.setItem('pengguna', JSON.stringify(penggunaBaru));
        set({ pengguna: penggunaBaru });
      } else {
        set({ error: dataRespon.pesan || 'Pendaftaran gagal' });
        throw new Error(dataRespon.pesan);
      }
    } catch (err) {
      const pesanError = err.response?.data?.pesan || err.message || 'Terjadi kesalahan saat mendaftar';
      set({ error: pesanError });
      throw new Error(pesanError);
    } finally {
      set({ sedangMemuat: false });
    }
  },

  // Masuk / Login pengguna
  masuk: async (email, kataSandi) => {
    try {
      set({ sedangMemuat: true, error: null });
      const respon = await apiAut.masuk(email, kataSandi);
      const dataRespon = respon.data;

      if (dataRespon.sukses) {
        const token = dataRespon.token;
        const penggunaBaru = dataRespon.pengguna ?? dataRespon.data ?? null;

        if (!token || !penggunaBaru) {
          throw new Error('Respons login tidak lengkap dari server');
        }

        await AsyncStorage.setItem('token', token);
        await AsyncStorage.setItem('pengguna', JSON.stringify(penggunaBaru));
        set({ token, pengguna: penggunaBaru });
      } else {
        set({ error: dataRespon.pesan || 'Login gagal' });
        throw new Error(dataRespon.pesan);
      }
    } catch (err) {
      const pesanError = err.response?.data?.pesan || err.message || 'Terjadi kesalahan saat masuk';
      set({ error: pesanError });
      throw new Error(pesanError);
    } finally {
      set({ sedangMemuat: false });
    }
  },

  // Keluar / Logout
  keluar: async () => {
    try {
      await AsyncStorage.removeItem('token');
      await AsyncStorage.removeItem('pengguna');
    } catch (err) {
      console.error('Error saat keluar:', err);
    } finally {
      set({ pengguna: null, token: null, error: null });
    }
  },

  // Memperbarui profil nama pengguna
  perbaruiProfil: async (nama) => {
    try {
      set({ sedangMemuat: true, error: null });
      const respon = await apiAut.perbaruiProfil(nama);
      const dataRespon = respon.data;

      if (dataRespon.sukses) {
        const penggunaBaru = dataRespon.data ?? null;
        if (!penggunaBaru) {
          throw new Error('Respons profil tidak lengkap dari server');
        }
        await AsyncStorage.setItem('pengguna', JSON.stringify(penggunaBaru));
        set({ pengguna: penggunaBaru });
      } else {
        set({ error: dataRespon.pesan || 'Gagal memperbarui profil' });
        throw new Error(dataRespon.pesan);
      }
    } catch (err) {
      const pesanError = err.response?.data?.pesan || err.message || 'Terjadi kesalahan saat memperbarui profil';
      set({ error: pesanError });
      throw new Error(pesanError);
    } finally {
      set({ sedangMemuat: false });
    }
  },

  bersihkanError: () => set({ error: null }),
}));
