# Portal Dokumentasi Aplikasi "TugasKu" (Catatan Tugas Kuliah)

Selamat datang di **Portal Dokumentasi TugasKu**! Panduan ini disusun secara khusus untuk membantu **mahasiswa baru** memahami, menginstal, mengkonfigurasi, dan menjalankan aplikasi **TugasKu** dari dasar hingga siap digunakan.

Aplikasi **TugasKu** adalah platform pencatatan tugas kuliah modern berbasis **Client-Server Architecture** yang terdiri atas:
1. **Backend Server**: RESTful API dibangun dengan **PHP Native** dan database **MySQL** (menyimpan data akun pengguna dan daftar tugas kuliah).
2. **Mobile Client**: Aplikasi mobile lintas platform (Android/iOS) dibangun menggunakan **React Native Expo**, **Gluestack UI**, dan **Zustand State Management** berbasis **Pure JavaScript (.js)**.

---

## 🏛️ Arsitektur Sistem

Aplikasi ini menggunakan komunikasi berbasis REST API dengan format data JSON. Berikut adalah alur interaksi antarkomponen:

```
[ React Native Mobile App ]
           │
           ▼  (Kirim Request HTTP JSON)
[ PHP RESTful API Server ]
           │
           ▼  (Kueri SQL CRUD)
[ MySQL Database (catatan_tugas_db) ]
```

---

## 📂 Daftar Panduan Step-by-Step

Silakan ikuti panduan ini secara berurutan agar aplikasi dapat berjalan dengan sukses:

### 📑 [1. Persiapan & Konfigurasi Database](./1_persiapan_dan_database.md)
* Kebutuhan sistem (Software & Tools) yang wajib diinstal.
* Panduan mengaktifkan MySQL menggunakan XAMPP/Laragon.
* Langkah-langkah membuat database dan mengimpor tabel schema database lewat phpMyAdmin.

### 📑 [2. Pengaturan Backend API (PHP)](./2_setup_backend.md)
* Memahami struktur folder dan kode server backend.
* Konfigurasi koneksi database PHP.
* Cara menjalankan server PHP built-in dan daftar endpoint REST API.

### 📑 [2B. Pengaturan Backend API (Node.js Express & Sequelize)](./2b_setup_backend_express.md)
* Memahami struktur MVC dan Sequelize ORM.
* Instalasi dependencies dan pengaturan variabel `.env`.
* Menjalankan server Express dan fitur kompatibilitas ganda rute/parameter API.

### 📑 [3. Pengaturan Mobile App (React Native Expo)](./3_setup_mobile_app.md)
* Persiapan lingkungan kerja React Native Node.js & Expo.
* Penjelasan instalasi modul-modul pendukung (`zustand`, `axios`, `async-storage`).
* Penjelasan modul State Management (Zustand) dan penguncian Light Theme secara paten.

### 📑 [4. Panduan Menjalankan & Troubleshooting](./4_panduan_menjalankan.md)
* Langkah menghubungkan aplikasi mobile dengan server lokal (menghindari Network Error).
* Menguji aplikasi menggunakan Android Emulator atau Hp Fisik (Expo Go).
* Solusi lengkap jika mengalami error umum (Error `ENOSPC` watcher limit Linux, CORS, IP salah, dsb).

---

> **Tips untuk Mahasiswa Baru**:
> Bacalah setiap bab secara perlahan. Pahami konsep bagaimana aplikasi Mobile berkomunikasi dengan Database server lewat REST API. Konsep ini adalah ilmu fundamental yang sangat penting di dunia Pemrograman Mobile dan Basis Data!
