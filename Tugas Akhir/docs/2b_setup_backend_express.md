# Bab 2B: Pengaturan & Menjalankan Backend API (Node.js Express & Sequelize)

Jika Anda lebih memilih menggunakan ekosistem **JavaScript** di kedua sisi (*Full-Stack JavaScript*), Anda dapat menggunakan server backend **Node.js + Express** yang terletak di folder `backend-express/`.

Backend ini dirancang dengan arsitektur **MVC (Model-View-Controller)** modern menggunakan **Sequelize ORM** untuk berinteraksi dengan database MySQL secara profesional dan aman.

---

## 📂 1. Memahami Struktur Folder Express Backend

Di dalam folder `backend-express`, berkas-berkas penting tersusun sebagai berikut:

```
backend-express/
├── config/
│   └── database.js           <-- Inisialisasi koneksi basis data menggunakan Sequelize ORM
├── controllers/
│   ├── authController.js     <-- Pengendali logika pendaftaran, login, dan profil
│   └── tugasController.js    <-- Pengendali logika tugas kuliah (CRUD & Selesai)
├── middleware/
│   └── autentikasi.js        <-- Middleware JWT untuk memvalidasi akses token
├── models/
│   ├── pengguna.js           <-- Definisi Skema tabel Pengguna di basis data
│   └── tugas.js              <-- Definisi Skema tabel Tugas Kuliah & Asosiasi
├── routes/
│   ├── authRoutes.js         <-- Pendaftaran rute API Autentikasi (/api/aut)
│   └── tugasRoutes.js        <-- Pendaftaran rute API Tugas Kuliah (/api/tugas)
├── .env                      <-- Kredensial rahasia (Database & JWT Secret)
├── package.json              <-- Konfigurasi package Node.js & dependensi library
└── server.js                 <-- Berkas masuk utama (Entry Point) aplikasi Express
```

---

## ⚙️ 2. Langkah-Langkah Instalasi & Konfigurasi

Ikuti langkah-langkah di bawah ini untuk menyiapkan server Express:

### Langkah 1: Buat Berkas Konfigurasi Lingkungan (`.env`)
Buka berkas **[backend-express/.env](./../backend-express/.env)** menggunakan VS Code. Pastikan kredensialnya sudah sesuai dengan konfigurasi XAMPP MySQL Anda:
```ini
PORT=8000

DB_HOST=127.0.0.1
DB_PORT=3306
DB_NAME=catatan_tugas_db
DB_USER=root
DB_PASSWORD=

JWT_SECRET=rahasia_token_tugas_anda_bebas
JWT_EXPIRES_IN=86400
```
*Catatan: Port kita kunci di `8000` agar menjadi pengganti langsung (drop-in replacement) untuk backend PHP tanpa perlu mengubah port di aplikasi mobile.*

### Langkah 2: Instalasi Dependencies
Buka terminal baru di VS Code, arahkan ke folder `backend-express/`, lalu jalankan perintah:
```bash
npm install
```
Perintah ini akan mengunduh paket-paket utama:
* **`express`**: Framework web minimalis untuk Node.js.
* **`sequelize`**: ORM (Object-Relational Mapping) tangguh untuk kueri SQL.
* **`mysql2`**: Driver MySQL untuk menghubungkan Sequelize dengan basis data XAMPP.
* **`jsonwebtoken`**: Untuk memproduksi dan memverifikasi token JWT.
* **`bcryptjs`**: Mengenkripsi password pengguna dengan salt secara aman.
* **`cors`**: Mengizinkan akses komunikasi lintas asal jaringan.

---

## 🚀 3. Menjalankan Server Backend Express

Untuk menyalakan server dalam mode pengembangan, jalankan perintah berikut di folder `backend-express/`:
```bash
npm run dev
```
Atau jika Anda ingin menjalankannya secara standar:
```bash
npm start
```
Jika sukses, terminal akan menampilkan pesan:
`✅ Berhasil terhubung ke basis data MySQL!`
`🚀 Server Express aktif di: http://localhost:8000`
`📡 Menunggu request API dari React Native Mobile App...`

Server Express Anda siap melayani pendaftaran tugas kuliah!

---

## 📡 4. Keunggulan Integrasi Ganda (Dual-Compatibility)

Untuk mempermudah transisi, server Express ini dilengkapi dengan **fitur kompabilitas ganda**:
1. **Dukungan Rute Fleksibel**:
   * Mendukung panggilan API langsung: `/api/masuk` dan `/api/daftar`.
   * Mendukung panggilan berawalan auth: `/api/aut/masuk` dan `/api/aut/daftar`.
2. **Dukungan Parameter Fleksibel**:
   * Untuk operasi mengubah atau menghapus tugas, server menerima parameter path: `/api/tugas/:id`.
   * Sekaligus menerima parameter kueri url: `/api/tugas?id=X`.
   * Rute penanda pengerjaan selesai juga mendukung keduanya: `/api/tugas/selesai?id=X` maupun `/api/tugas/:id/selesai`.

Dengan fleksibilitas ini, Anda dapat langsung beralih menggunakan Backend Express ini **tanpa perlu mengubah satu baris kode pun** di sisi React Native Mobile App!
