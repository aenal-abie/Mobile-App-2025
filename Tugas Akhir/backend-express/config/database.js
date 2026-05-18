require('dotenv').config();
const { Sequelize } = require('sequelize');

// Menginisialisasi koneksi basis data menggunakan Sequelize ORM
const koneksiDatabase = new Sequelize(
  process.env.DB_NAME,     // Nama database
  process.env.DB_USER,     // Nama user database (default: root)
  process.env.DB_PASSWORD, // Password database (default: kosong)
  {
    host: process.env.DB_HOST || '127.0.0.1',
    port: process.env.DB_PORT || 3306,
    dialect: 'mysql',
    logging: false, // Nonaktifkan log SQL di terminal agar lebih bersih
    define: {
      timestamps: false, // Kita akan mengelola timestamp secara manual sesuai skema SQL
      freezeTableName: true // Mencegah Sequelize mengubah nama tabel menjadi jamak
    }
  }
);

// Menguji apakah koneksi basis data berhasil dibuat
koneksiDatabase.authenticate()
  .then(() => {
    console.log('✅ Berhasil terhubung ke basis data MySQL!');
  })
  .catch((err) => {
    console.error('❌ Gagal terhubung ke basis data MySQL:', err.message);
  });

module.exports = koneksiDatabase;
