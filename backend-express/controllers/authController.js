const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Pengguna = require('../models/pengguna');

const authController = {
  /**
   * Pendaftaran akun mahasiswa baru (Register)
   */
  daftar: async (req, res) => {
    try {
      const { email, kata_sandi, nama } = req.body;

      // 1. Validasi input dasar
      if (!email || !kata_sandi || !nama) {
        return res.status(400).json({
          sukses: false,
          pesan: 'Semua isian (email, kata sandi, nama) wajib diisi!'
        });
      }

      // 2. Periksa apakah email sudah terdaftar sebelumnya
      const emailTerdaftar = await Pengguna.findOne({ where: { email } });
      if (emailTerdaftar) {
        return res.status(400).json({
          sukses: false,
          pesan: 'Email sudah terdaftar. Gunakan email lainnya atau silakan masuk.'
        });
      }

      // 3. Enkripsi kata sandi menggunakan bcryptjs
      const salt = bcrypt.genSaltSync(10);
      const kataSandiTerenkripsi = bcrypt.hashSync(kata_sandi, salt);

      // 4. Buat data pengguna baru di basis data
      const penggunaBaru = await Pengguna.create({
        email,
        kata_sandi: kataSandiTerenkripsi,
        nama
      });

      return res.status(201).json({
        sukses: true,
        pesan: 'Registrasi akun berhasil! Silakan masuk.',
        data: {
          id: penggunaBaru.id,
          email: penggunaBaru.email,
          nama: penggunaBaru.nama
        }
      });
    } catch (err) {
      console.error('Error saat daftar:', err.message);
      return res.status(500).json({
        sukses: false,
        pesan: 'Terjadi kesalahan server saat mendaftarkan akun.'
      });
    }
  },

  /**
   * Masuk ke dalam akun pengguna (Login)
   */
  masuk: async (req, res) => {
    try {
      const { email, kata_sandi } = req.body;

      // 1. Validasi input dasar
      if (!email || !kata_sandi) {
        return res.status(400).json({
          sukses: false,
          pesan: 'Email dan kata sandi wajib diisi!'
        });
      }

      // 2. Cari pengguna berdasarkan email
      const pengguna = await Pengguna.findOne({ where: { email } });
      if (!pengguna) {
        return res.status(400).json({
          sukses: false,
          pesan: 'Email atau kata sandi salah. Silakan periksa kembali.'
        });
      }

      // 3. Verifikasi kesesuaian kata sandi
      const sandiCocok = bcrypt.compareSync(kata_sandi, pengguna.kata_sandi);
      if (!sandiCocok) {
        return res.status(400).json({
          sukses: false,
          pesan: 'Email atau kata sandi salah. Silakan periksa kembali.'
        });
      }

      // 4. Membuat Token JWT yang berlaku selama 24 jam (86400 detik)
      const token = jwt.sign(
        { id: pengguna.id, email: pengguna.email },
        process.env.JWT_SECRET || 'rahasia_token_tugas_anda_bebas',
        { expiresIn: parseInt(process.env.JWT_EXPIRES_IN || '86400') }
      );

      return res.status(200).json({
        sukses: true,
        pesan: 'Berhasil masuk akun!',
        token,
        pengguna: {
          id: pengguna.id,
          email: pengguna.email,
          nama: pengguna.nama
        }
      });
    } catch (err) {
      console.error('Error saat masuk:', err.message);
      return res.status(500).json({
        sukses: false,
        pesan: 'Terjadi kesalahan server saat memproses login.'
      });
    }
  },

  /**
   * Keluar dari akun (Logout)
   */
  keluar: async (req, res) => {
    // Karena JWT bersifat stateless, logout ditangani di mobile client dengan menghapus token.
    // Di server kita cukup mengirimkan respons sukses.
    return res.status(200).json({
      sukses: true,
      pesan: 'Berhasil keluar sesi aplikasi.'
    });
  },

  /**
   * Mengambil data profil lengkap pengguna yang sedang login
   */
  ambilProfil: async (req, res) => {
    try {
      const pengguna = await Pengguna.findByPk(req.idPengguna, {
        attributes: { exclude: ['kata_sandi'] } // Amankan kata sandi agar tidak dikirim
      });

      if (!pengguna) {
        return res.status(404).json({
          sukses: false,
          pesan: 'Profil pengguna tidak ditemukan.'
        });
      }

      return res.status(200).json({
        sukses: true,
        data: pengguna
      });
    } catch (err) {
      console.error('Error saat ambil profil:', err.message);
      return res.status(500).json({
        sukses: false,
        pesan: 'Terjadi kesalahan server saat mengambil data profil.'
      });
    }
  },

  /**
   * Mengubah data profil pengguna (nama)
   */
  perbaruiProfil: async (req, res) => {
    try {
      const { nama } = req.body;

      if (!nama) {
        return res.status(400).json({
          sukses: false,
          pesan: 'Nama lengkap baru wajib diisi!'
        });
      }

      const pengguna = await Pengguna.findByPk(req.idPengguna);
      if (!pengguna) {
        return res.status(404).json({
          sukses: false,
          pesan: 'Pengguna tidak ditemukan.'
        });
      }

      // Perbarui nama pengguna
      pengguna.nama = nama;
      await pengguna.save();

      return res.status(200).json({
        sukses: true,
        pesan: 'Profil berhasil diperbarui!',
        data: {
          id: pengguna.id,
          email: pengguna.email,
          nama: pengguna.nama
        }
      });
    } catch (err) {
      console.error('Error saat perbarui profil:', err.message);
      return res.status(500).json({
        sukses: false,
        pesan: 'Terjadi kesalahan server saat memperbarui data profil.'
      });
    }
  }
};

module.exports = authController;
