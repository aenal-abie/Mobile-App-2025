import { create } from 'zustand';
import {
  ambilDetailTugasApi,
  ambilSemuaTugasApi,
  buatTugasApi,
  hapusTugasApi,
  perbaruiTugasApi,
  tandaiSelesaiApi,
} from '../services/tasks';

export const useTaskStore = create((set, get) => ({
  tugas: [],
  tugasTerpilih: null,
  sedangMemuat: false,
  pesanError: '',

  ambilTugas: async () => {
    set({ sedangMemuat: true, pesanError: '' });
    try {
      const data = await ambilSemuaTugasApi();
      set({ tugas: data });
    } catch (error) {
      set({ pesanError: error.response?.data?.pesan || 'Gagal ambil tugas' });
      throw error;
    } finally {
      set({ sedangMemuat: false });
    }
  },

  ambilDetailTugas: async (id) => {
    const data = await ambilDetailTugasApi(id);
    set({ tugasTerpilih: data });
    return data;
  },

  buatTugas: async (dataTugas) => {
    const data = await buatTugasApi(dataTugas);
    const tugasBaru = { ...dataTugas, id: data.id };
    set((state) => ({ tugas: [tugasBaru, ...state.tugas] }));
    return data;
  },

  perbaruiTugas: async (id, dataTugas) => {
    const data = await perbaruiTugasApi(id, dataTugas);
    set((state) => ({
      tugas: state.tugas.map((item) => (item.id === id ? data : item)),
      tugasTerpilih: state.tugasTerpilih?.id === id ? data : state.tugasTerpilih,
    }));
    return data;
  },

  hapusTugas: async (id) => {
    await hapusTugasApi(id);
    set((state) => ({
      tugas: state.tugas.filter((item) => item.id !== id),
      tugasTerpilih: state.tugasTerpilih?.id === id ? null : state.tugasTerpilih,
    }));
  },

  tandaiSelesai: async (id) => {
    const data = await tandaiSelesaiApi(id);
    set((state) => ({
      tugas: state.tugas.map((item) => (item.id === id ? data : item)),
      tugasTerpilih: state.tugasTerpilih?.id === id ? data : state.tugasTerpilih,
    }));
    return data;
  },

  setTugas: (tugas) => set({ tugas }),
  setTugasTerpilih: (tugasTerpilih) => set({ tugasTerpilih }),
}));
