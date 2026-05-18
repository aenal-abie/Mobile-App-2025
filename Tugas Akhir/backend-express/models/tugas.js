const { DataTypes } = require('sequelize');
const koneksiDatabase = require('../config/database');
const Pengguna = require('./pengguna');

// Mendefinisikan Model Tugas untuk tabel 'tugas'
const Tugas = koneksiDatabase.define('tugas', {
  id: {
    type: DataTypes.INTEGER.UNSIGNED,
    primaryKey: true,
    autoIncrement: true
  },
  id_pengguna: {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: false,
    references: {
      model: Pengguna,
      key: 'id'
    }
  },
  judul: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  deskripsi: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  mata_kuliah: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  prioritas: {
    type: DataTypes.ENUM('TINGGI', 'SEDANG', 'RENDAH'),
    allowNull: false,
    defaultValue: 'SEDANG'
  },
  tgl_deadline: {
    type: DataTypes.DATE,
    allowNull: true
  },
  status: {
    type: DataTypes.ENUM('MENUNGGU', 'SEDANG_DIKERJAKAN', 'SELESAI'),
    allowNull: false,
    defaultValue: 'MENUNGGU'
  },
  sudah_selesai: {
    type: DataTypes.TINYINT(1),
    allowNull: false,
    defaultValue: 0
  },
  tgl_selesai: {
    type: DataTypes.DATE,
    allowNull: true
  },
  dibuat: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  diperbarui: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'tugas',
  timestamps: false // timestamps manual
});

// Menghubungkan Relasi Antar Tabel (Asosiasi)
Pengguna.hasMany(Tugas, { foreignKey: 'id_pengguna', as: 'daftarTugas', onDelete: 'CASCADE' });
Tugas.belongsTo(Pengguna, { foreignKey: 'id_pengguna', as: 'pemilik' });

module.exports = Tugas;
