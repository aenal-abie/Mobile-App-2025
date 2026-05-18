const { DataTypes } = require('sequelize');
const koneksiDatabase = require('../config/database');

// Mendefinisikan Model Pengguna untuk tabel 'pengguna'
const Pengguna = koneksiDatabase.define('pengguna', {
  id: {
    type: DataTypes.INTEGER.UNSIGNED,
    primaryKey: true,
    autoIncrement: true
  },
  email: {
    type: DataTypes.STRING(255),
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true // Validasi format email otomatis
    }
  },
  kata_sandi: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  nama: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  dibuat: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
    field: 'dibuat' // Memetakan ke kolom 'dibuat'
  },
  diperbarui: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
    field: 'diperbarui' // Memetakan ke kolom 'diperbarui'
  }
}, {
  // Opsi tambahan untuk sinkronisasi
  tableName: 'pengguna',
  timestamps: false // timestamps manual menggunakan kolom dibuat & diperbarui
});

module.exports = Pengguna;
