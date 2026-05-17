const Tugas = require('../models/tugas');

const tugasController = {
  /**
   * Mengambil semua daftar tugas milik pengguna yang sedang login
   */
  ambilSemuaTugas: async (req, res) => {
    try {
      // Mengambil semua tugas berdasarkan ID Pengguna
      const daftarTugas = await Tugas.findAll({
        where: { id_pengguna: req.idPengguna },
        order: [['dibuat', 'DESC']] // Urutan tugas terbaru berada di atas
      });

      return res.status(200).json({
        sukses: true,
        data: daftarTugas
      });
    } catch (err) {
      console.error('Error saat ambil semua tugas:', err.message);
      return res.status(500).json({
        sukses: false,
        pesan: 'Terjadi kesalahan server saat mengambil daftar tugas.'
      });
    }
  },

  /**
   * Mengambil satu data detail tugas berdasarkan ID
   */
  ambilDetailTugas: async (req, res) => {
    try {
      // Mendukung pencarian lewat parameter rute /:id maupun kueri url ?id=X
      const idTugas = req.params.id || req.query.id;

      if (!idTugas) {
        return res.status(400).json({
          sukses: false,
          pesan: 'ID tugas wajib dilampirkan.'
        });
      }

      const tugas = await Tugas.findOne({
        where: { id: idTugas, id_pengguna: req.idPengguna }
      });

      if (!tugas) {
        return res.status(404).json({
          sukses: false,
          pesan: 'Tugas tidak ditemukan atau Anda tidak memiliki akses.'
        });
      }

      return res.status(200).json({
        sukses: true,
        data: tugas
      });
    } catch (err) {
      console.error('Error saat ambil detail tugas:', err.message);
      return res.status(500).json({
        sukses: false,
        pesan: 'Terjadi kesalahan server saat mengambil detail tugas.'
      });
    }
  },

  /**
   * Membuat tugas baru
   */
  buatTugas: async (req, res) => {
    try {
      const { judul, deskripsi, mata_kuliah, prioritas, tgl_deadline } = req.body;

      // Validasi wajib isi
      if (!judul) {
        return res.status(400).json({
          sukses: false,
          pesan: 'Judul tugas kuliah wajib diisi!'
        });
      }

      const tugasBaru = await Tugas.create({
        id_pengguna: req.idPengguna,
        judul,
        deskripsi: deskripsi || null,
        mata_kuliah: mata_kuliah || null,
        prioritas: prioritas || 'SEDANG',
        tgl_deadline: tgl_deadline || null,
        status: 'MENUNGGU',
        sudah_selesai: 0,
        tgl_selesai: null
      });

      return res.status(201).json({
        sukses: true,
        pesan: 'Tugas kuliah berhasil dibuat!',
        data: tugasBaru
      });
    } catch (err) {
      console.error('Error saat buat tugas:', err.message);
      return res.status(500).json({
        sukses: false,
        pesan: 'Terjadi kesalahan server saat membuat tugas.'
      });
    }
  },

  /**
   * Memperbarui detail tugas
   */
  perbaruiTugas: async (req, res) => {
    try {
      const idTugas = req.params.id || req.query.id;
      const { judul, deskripsi, mata_kuliah, prioritas, tgl_deadline, status, sudah_selesai } = req.body;

      if (!idTugas) {
        return res.status(400).json({
          sukses: false,
          pesan: 'ID tugas wajib ditentukan.'
        });
      }

      const tugas = await Tugas.findOne({
        where: { id: idTugas, id_pengguna: req.idPengguna }
      });

      if (!tugas) {
        return res.status(404).json({
          sukses: false,
          pesan: 'Tugas tidak ditemukan atau Anda tidak memiliki hak akses.'
        });
      }

      // Perbarui nilai jika dikirimkan di dalam request body
      if (judul !== undefined) tugas.judul = judul;
      if (deskripsi !== undefined) tugas.deskripsi = deskripsi;
      if (mata_kuliah !== undefined) tugas.mata_kuliah = mata_kuliah;
      if (prioritas !== undefined) tugas.prioritas = prioritas;
      if (tgl_deadline !== undefined) tugas.tgl_deadline = tgl_deadline;
      if (status !== undefined) tugas.status = status;
      
      // Jika status diset selesai atau sudah_selesai dicentang
      if (sudah_selesai !== undefined) {
        tugas.sudah_selesai = sudah_selesai ? 1 : 0;
        if (sudah_selesai) {
          tugas.status = 'SELESAI';
          tugas.tgl_selesai = new Date();
        } else {
          tugas.tgl_selesai = null;
          // Kembalikan ke 'SEDANG_DIKERJAKAN' jika status sebelumnya selesai tapi dicentang batal
          if (tugas.status === 'SELESAI') {
            tugas.status = 'SEDANG_DIKERJAKAN';
          }
        }
      }

      tugas.diperbarui = new Date();
      await tugas.save();

      return res.status(200).json({
        sukses: true,
        pesan: 'Tugas berhasil diperbarui!',
        data: tugas
      });
    } catch (err) {
      console.error('Error saat perbarui tugas:', err.message);
      return res.status(500).json({
        sukses: false,
        pesan: 'Terjadi kesalahan server saat memperbarui tugas.'
      });
    }
  },

  /**
   * Menghapus tugas secara permanen
   */
  hapusTugas: async (req, res) => {
    try {
      const idTugas = req.params.id || req.query.id;

      if (!idTugas) {
        return res.status(400).json({
          sukses: false,
          pesan: 'ID tugas wajib dilampirkan.'
        });
      }

      const tugas = await Tugas.findOne({
        where: { id: idTugas, id_pengguna: req.idPengguna }
      });

      if (!tugas) {
        return res.status(404).json({
          sukses: false,
          pesan: 'Tugas tidak ditemukan atau Anda tidak memiliki akses.'
        });
      }

      await tugas.destroy();

      return res.status(200).json({
        sukses: true,
        pesan: 'Tugas berhasil dihapus secara permanen.'
      });
    } catch (err) {
      console.error('Error saat hapus tugas:', err.message);
      return res.status(500).json({
        sukses: false,
        pesan: 'Terjadi kesalahan server saat menghapus tugas.'
      });
    }
  },

  /**
   * Menandai tugas selesai atau belum (Toggle Complete)
   */
  tandaiSelesai: async (req, res) => {
    try {
      const idTugas = req.params.id || req.query.id;

      if (!idTugas) {
        return res.status(400).json({
          sukses: false,
          pesan: 'ID tugas wajib dilampirkan.'
        });
      }

      const tugas = await Tugas.findOne({
        where: { id: idTugas, id_pengguna: req.idPengguna }
      });

      if (!tugas) {
        return res.status(404).json({
          sukses: false,
          pesan: 'Tugas tidak ditemukan atau Anda tidak memiliki akses.'
        });
      }

      // Melakukan toggle status pengerjaan
      const statusBaru = tugas.sudah_selesai === 1 ? 0 : 1;
      tugas.sudah_selesai = statusBaru;

      if (statusBaru === 1) {
        tugas.status = 'SELESAI';
        tugas.tgl_selesai = new Date();
      } else {
        tugas.status = 'SEDANG_DIKERJAKAN';
        tugas.tgl_selesai = null;
      }

      tugas.diperbarui = new Date();
      await tugas.save();

      return res.status(200).json({
        sukses: true,
        pesan: statusBaru === 1 ? 'Tugas berhasil ditandai selesai!' : 'Tugas dikembalikan ke proses pengerjaan.',
        data: tugas
      });
    } catch (err) {
      console.error('Error saat tandai selesai:', err.message);
      return res.status(500).json({
        sukses: false,
        pesan: 'Terjadi kesalahan server saat mengubah status tugas.'
      });
    }
  }
};

module.exports = tugasController;
