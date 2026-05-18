require('dotenv').config();
const express = require('express');
const cors = require('cors');
const koneksiDatabase = require('./config/database');

// Import berkas routing API
const authRoutes = require('./routes/authRoutes');
const tugasRoutes = require('./routes/tugasRoutes');

const app = express();
const PORT = process.env.PORT || 8000;

// 1. Mengaktifkan middleware CORS (Cross-Origin Resource Sharing)
app.use(cors());

// 2. Mengaktifkan parser data JSON dan URL-encoded request body
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 3. Menghubungkan Rute API (Routing)
// Mendukung pemanggilan baik menggunakan awalan '/api/aut' maupun langsung '/api'
app.use('/api/aut', authRoutes);
app.use('/api', authRoutes); 
app.use('/api/tugas', tugasRoutes);

// Rute uji coba status server (Health Check)
app.get('/', (req, res) => {
  res.status(200).json({
    sukses: true,
    pesan: 'Server RESTful API Node.js Express TugasKu aktif berjalan!'
  });
});

// 4. Penanganan Rute Tidak Ditemukan (404 Fallback)
app.use((req, res) => {
  res.status(404).json({
    sukses: false,
    pesan: `Alamat endpoint '${req.originalUrl}' tidak ditemukan di server.`
  });
});

// 5. Penanganan Error Global (Error Handling Middleware)
app.use((err, req, res, next) => {
  console.error('Terjadi Error Internal:', err.stack);
  res.status(500).json({
    sukses: false,
    pesan: 'Terjadi kesalahan sistem internal pada server Express.',
    error: process.env.NODE_ENV === 'development' ? err.message : {}
  });
});

// 6. Menyinkronkan basis data Sequelize dan menjalankan server
koneksiDatabase.sync({ force: false }) // 'force: false' menjamin data tabel Anda aman dan tidak dihapus
  .then(() => {
    app.listen(PORT, () => {
      console.log(`🚀 Server Express aktif di: http://localhost:${PORT}`);
      console.log(`📡 Menunggu request API dari React Native Mobile App...`);
    });
  })
  .catch((err) => {
    console.error('❌ Gagal menyinkronkan basis data, server tidak dapat dijalankan:', err.message);
  });
