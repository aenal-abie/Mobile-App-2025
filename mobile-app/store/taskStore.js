import { create } from 'zustand';
import { apiTugas } from '../services/tasks';

export const gunakkanStoreTugas = create((set, get) => ({
  tugas: [],
  sedangMemuat: false,
  error: null,
  filter: 'SEMUA',
  sort: 'deadline',

  // Mengambil semua tugas dari backend
  ambilTugas: async () => {
    try {
      set({ sedangMemuat: true, error: null });
      const respon = await apiTugas.ambilSemuaTugas();
      const dataRespon = respon.data;

      if (dataRespon.sukses) {
        set({ tugas: Array.isArray(dataRespon.data) ? dataRespon.data : [] });
      } else {
        set({ error: dataRespon.pesan || 'Gagal mengambil tugas' });
      }
    } catch (err) {
      const pesanError = err.response?.data?.pesan || err.message || 'Terjadi kesalahan saat memuat tugas';
      set({ error: pesanError, tugas: [] });
    } finally {
      set({ sedangMemuat: false });
    }
  },

  // Membuat tugas baru
  buatTugas: async (dataTugas) => {
    try {
      set({ sedangMemuat: true, error: null });
      const respon = await apiTugas.buatTugas(dataTugas);
      const dataRespon = respon.data;

      if (dataRespon.sukses) {
        set((state) => ({
          tugas: [...state.tugas, dataRespon.data],
        }));
      } else {
        set({ error: dataRespon.pesan || 'Gagal membuat tugas' });
        throw new Error(dataRespon.pesan);
      }
    } catch (err) {
      const pesanError = err.response?.data?.pesan || err.message || 'Terjadi kesalahan saat membuat tugas';
      set({ error: pesanError });
      throw new Error(pesanError);
    } finally {
      set({ sedangMemuat: false });
    }
  },

  // Memperbarui data tugas
  perbaruiTugas: async (id, dataTugas) => {
    try {
      set({ sedangMemuat: true, error: null });
      const respon = await apiTugas.perbaruiTugas(id, dataTugas);
      const dataRespon = respon.data;

      if (dataRespon.sukses) {
        set((state) => ({
          tugas: state.tugas.map((t) => (t.id === Number(id) || t.id === id ? dataRespon.data : t)),
        }));
      } else {
        set({ error: dataRespon.pesan || 'Gagal memperbarui tugas' });
        throw new Error(dataRespon.pesan);
      }
    } catch (err) {
      const pesanError = err.response?.data?.pesan || err.message || 'Terjadi kesalahan saat memperbarui tugas';
      set({ error: pesanError });
      throw new Error(pesanError);
    } finally {
      set({ sedangMemuat: false });
    }
  },

  // Menghapus tugas
  hapusTugas: async (id) => {
    try {
      set({ sedangMemuat: true, error: null });
      const respon = await apiTugas.hapusTugas(id);
      const dataRespon = respon.data;

      if (dataRespon.sukses) {
        set((state) => ({
          tugas: state.tugas.filter((t) => t.id !== Number(id) && t.id !== id),
        }));
      } else {
        set({ error: dataRespon.pesan || 'Gagal menghapus tugas' });
        throw new Error(dataRespon.pesan);
      }
    } catch (err) {
      const pesanError = err.response?.data?.pesan || err.message || 'Terjadi kesalahan saat menghapus tugas';
      set({ error: pesanError });
      throw new Error(pesanError);
    } finally {
      set({ sedangMemuat: false });
    }
  },

  // Menandai tugas sebagai selesai
  tandaiSelesai: async (id) => {
    try {
      // Optimistic update
      set((state) => ({
        tugas: state.tugas.map((t) => {
          if (t.id === Number(id) || t.id === id) {
            const sudahSelesai = !t.sudah_selesai;
            return {
              ...t,
              sudah_selesai: sudahSelesai,
              status: sudahSelesai ? 'SELESAI' : 'MENUNGGU',
            };
          }
          return t;
        }),
      }));

      const respon = await apiTugas.tandaiSelesai(id);
      const dataRespon = respon.data;

      if (dataRespon.sukses) {
        set((state) => ({
          tugas: state.tugas.map((t) => (t.id === Number(id) || t.id === id ? dataRespon.data : t)),
        }));
      }
    } catch (err) {
      console.error('Error saat menandai selesai:', err);
      // Rollback status tugas
      get().ambilTugas();
    }
  },

  // Set filter aktif
  setFilter: (filter) => set({ filter }),

  // Set urutan (sorting) aktif
  setSort: (sort) => set({ sort }),

  // Mengambil daftar tugas yang sudah difilter dan diurutkan
  getTugasFiltered: () => {
    const { tugas, filter, sort } = get();
    let hasil = [...tugas];

    // 1. Lakukan Penyaringan (Filtering)
    if (filter !== 'SEMUA') {
      hasil = hasil.filter((t) => t.status === filter);
    }

    // 2. Lakukan Pengurutan (Sorting)
    if (sort === 'deadline') {
      hasil.sort((a, b) => {
        if (!a.tgl_deadline) return 1;
        if (!b.tgl_deadline) return -1;
        return new Date(a.tgl_deadline).getTime() - new Date(b.tgl_deadline).getTime();
      });
    } else if (sort === 'prioritas') {
      const urutanPrioritas = { TINGGI: 0, SEDANG: 1, RENDAH: 2 };
      hasil.sort((a, b) => urutanPrioritas[a.prioritas] - urutanPrioritas[b.prioritas]);
    } else if (sort === 'terbaru') {
      hasil.sort((a, b) => {
        const tglA = a.dibuat ? new Date(a.dibuat).getTime() : 0;
        const tglB = b.dibuat ? new Date(b.dibuat).getTime() : 0;
        return tglB - tglA;
      });
    }

    return hasil;
  },
}));
