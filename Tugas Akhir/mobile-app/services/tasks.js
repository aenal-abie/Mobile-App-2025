import api from './api';

export const apiTugas = {
  /**
   * Mengambil semua tugas milik pengguna
   */
  ambilSemuaTugas: () =>
    api.get('/tugas'),

  /**
   * Mengambil detail tugas berdasarkan ID
   * @param id - ID tugas
   */
  ambilTugasById: (id) =>
    api.get(`/tugas/${id}`),

  /**
   * Membuat tugas baru
   * @param dataTugas - Data tugas baru
   */
  buatTugas: (dataTugas) =>
    api.post('/tugas', dataTugas),

  /**
   * Memperbarui data tugas
   * @param id - ID tugas
   * @param dataTugas - Data tugas yang diperbarui
   */
  perbaruiTugas: (id, dataTugas) =>
    api.put(`/tugas/${id}`, dataTugas),

  /**
   * Menghapus tugas
   * @param id - ID tugas
   */
  hapusTugas: (id) =>
    api.delete(`/tugas/${id}`),

  /**
   * Menandai tugas sebagai selesai atau memperbarui status selesainya
   * @param id - ID tugas
   */
  tandaiSelesai: (id) =>
    api.patch(`/tugas/${id}/selesai`, {}),
};
