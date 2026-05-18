import api from './api';

export const apiAut = {
  /**
   * Mendaftar pengguna baru
   * @param email - Alamat email pengguna
   * @param nama - Nama lengkap pengguna
   * @param kataSandi - Kata sandi pengguna
   */
  daftar: (email, nama, kataSandi) =>
    api.post('/aut/daftar', {
      email,
      nama,
      kata_sandi: kataSandi,
    }),

  /**
   * Masuk/Login pengguna
   * @param email - Alamat email pengguna
   * @param kataSandi - Kata sandi pengguna
   */
  masuk: (email, kataSandi) =>
    api.post('/aut/masuk', {
      email,
      kata_sandi: kataSandi,
    }),

  /**
   * Mengambil profil pengguna yang sedang masuk
   */
  ambilProfil: () =>
    api.get('/aut/profil'),

  /**
   * Memperbarui nama profil pengguna yang sedang masuk
   * @param nama - Nama baru pengguna
   */
  perbaruiProfil: (nama) =>
    api.put('/aut/profil', { nama }),
};
