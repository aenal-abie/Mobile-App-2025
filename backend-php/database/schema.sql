CREATE DATABASE IF NOT EXISTS catatan_tugas_db
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE catatan_tugas_db;

CREATE TABLE IF NOT EXISTS pengguna (
  id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
  email VARCHAR(255) NOT NULL UNIQUE,
  kata_sandi VARCHAR(255) NOT NULL,
  nama VARCHAR(255) NOT NULL,
  dibuat TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  diperbarui TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS tugas (
  id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
  id_pengguna INT UNSIGNED NOT NULL,
  judul VARCHAR(255) NOT NULL,
  deskripsi TEXT NULL,
  mata_kuliah VARCHAR(255) NULL,
  prioritas ENUM('TINGGI', 'SEDANG', 'RENDAH') NOT NULL DEFAULT 'SEDANG',
  tgl_deadline DATETIME NULL,
  status ENUM('MENUNGGU', 'SEDANG_DIKERJAKAN', 'SELESAI') NOT NULL DEFAULT 'MENUNGGU',
  sudah_selesai TINYINT(1) NOT NULL DEFAULT 0,
  tgl_selesai DATETIME NULL,
  dibuat TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  diperbarui TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_tugas_pengguna
    FOREIGN KEY (id_pengguna) REFERENCES pengguna(id)
    ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE INDEX idx_tugas_pengguna ON tugas (id_pengguna);
CREATE INDEX idx_tugas_deadline ON tugas (tgl_deadline);
CREATE INDEX idx_tugas_status ON tugas (status);

INSERT INTO pengguna (email, kata_sandi, nama)
VALUES ('admin@contoh.com', '$2y$10$7QvQxY1YH7Jg5dYQG3s0uegQG5YJ3Q1h0bGx8C0QmT6L7q1m8f9XK', 'Admin Contoh');

INSERT INTO tugas (id_pengguna, judul, deskripsi, mata_kuliah, prioritas, tgl_deadline, status, sudah_selesai, tgl_selesai)
VALUES
(1, 'Kerjakan laporan praktikum', 'Selesaikan bab hasil dan pembahasan', 'Pemrograman Mobile', 'TINGGI', DATE_ADD(NOW(), INTERVAL 2 DAY), 'MENUNGGU', 0, NULL),
(1, 'Review materi UTS', 'Baca ulang semua slide pertemuan', 'Basis Data', 'SEDANG', DATE_ADD(NOW(), INTERVAL 5 DAY), 'SEDANG_DIKERJAKAN', 0, NULL);
