# Bab 2: Pengaturan & Menjalankan Backend API (PHP Native)

Server backend aplikasi **TugasKu** dibangun menggunakan **PHP Native** terstruktur dengan arsitektur RESTful API modern. Kode backend ini menangani seluruh logika autentikasi pengguna (registrasi & login dengan JSON Web Tokens / JWT) serta operasi CRUD data tugas secara aman ke database MySQL.

---

## 📂 1. Memahami Struktur Folder Backend

Di dalam folder `backend-php`, terdapat struktur berkas sebagai berikut:
* `src/`: Berisi kode logika utama.
  * `Core/`: Penanganan koneksi database, router, request, dan response.
  * `Controllers/`: Controller untuk menangani alur data pengguna (`AuthController.js`) dan tugas (`TaskController.js`).
  * `Middleware/`: Memvalidasi token JWT untuk mengamankan data pengguna agar tidak diakses orang lain.
  * `Models/`: Model database (`Pengguna.js` & `Tugas.js`) yang melakukan kueri SQL.
  * `routes/` & `api.php`: Pendefinisian jalur alamat REST API.
* `public/index.php`: Pintu masuk utama (Entry Point) seluruh request API.
* `.env.example`: Contoh konfigurasi lingkungan basis data & JWT.
* `composer.json`: Berkas dependensi pustaka PHP (seperti Firebase JWT dan PHP Dotenv).

---

## ⚙️ 2. Langkah-Langkah Instalasi & Konfigurasi

Ikuti langkah-langkah di bawah ini untuk menyiapkan server API:

### Langkah 1: Gandakan Berkas Konfigurasi Lingkungan (`.env`)
Salin berkas `.env.example` dan ubah namanya menjadi `.env` di dalam folder `backend-php`:
* **Di Linux / macOS**:
  ```bash
  cp .env.example .env
  ```
* **Di Windows**:
  ```cmd
  copy .env.example .env
  ```

### Langkah 2: Sesuaikan Kredensial Database
Buka berkas `.env` yang baru dibuat menggunakan VS Code, lalu sesuaikan dengan konfigurasi MySQL XAMPP Anda. Konfigurasi default umumnya:
```ini
APP_ENV=development
APP_DEBUG=true
APP_KEY=ubah_kunci_ini_bebas

DB_HOST=127.0.0.1
DB_PORT=3306
DB_NAME=catatan_tugas_db
DB_USER=root
DB_PASSWORD=

JWT_SECRET=rahasia_token_tugas_anda_bebas
JWT_ISSUER=catatan-tugas-kuliah
JWT_EXPIRES_IN=86400

CORS_ALLOWED_ORIGINS=*
```
*Catatan: Pastikan `DB_NAME` sama dengan nama database yang Anda buat di phpMyAdmin (`catatan_tugas_db`).*

### Langkah 3: Instal Pustaka Pendukung via Composer
Buka Terminal (di VS Code atau terminal bawaan) pada direktori `backend-php/`, lalu jalankan perintah:
```bash
composer install
```
Perintah ini akan secara otomatis mengunduh pustaka **Firebase JWT** (untuk autentikasi token) dan **PHP Dotenv** (untuk membaca file `.env`), serta mengkonfigurasi auto-loading berkas PHP.

---

## 🚀 3. Menjalankan Server Backend Lokal

Untuk menjalankan server PHP built-in, jalankan perintah berikut di Terminal folder `backend-php/`:
```bash
composer run serve
```
Atau Anda bisa menggunakan perintah bawaan PHP langsung:
```bash
php -S localhost:8000 -t public
```
Jika berhasil, terminal akan menampilkan pesan:
`PHP Development Server (http://localhost:8000) started`

Server backend Anda sekarang aktif dan siap melayani permintaan API dari aplikasi mobile!

---

## 📡 4. Daftar REST API Endpoints

Aplikasi mobile TugasKu akan berkomunikasi dengan backend melalui alamat-alamat endpoint berikut dengan format data berupa **JSON**:

| Metode HTTP | Alamat Endpoint | Keterangan Fitur | Perlindungan JWT? |
| :--- | :--- | :--- | :--- |
| **POST** | `/api/daftar` | Registrasi akun pengguna baru | ❌ Tidak |
| **POST** | `/api/masuk` | Login pengguna & mendapatkan token JWT | ❌ Tidak |
| **GET** | `/api/tugas` | Mengambil seluruh daftar tugas milik pengguna |  Ya |
| **POST** | `/api/tugas` | Membuat tugas kuliah baru |  Ya |
| **PUT** | `/api/tugas?id={id}` | Memperbarui detail tugas tertentu |  Ya |
| **DELETE** | `/api/tugas?id={id}` | Menghapus tugas tertentu secara permanen |  Ya |
| **PUT** | `/api/tugas/selesai?id={id}` | Menandai tugas sebagai selesai/belum |  Ya |
| **PUT** | `/api/profil` | Mengubah nama lengkap profil pengguna |  Ya |

---

> [!NOTE]
> **Penting Mengenai Proteksi JWT**:
> Endpoint yang dilindungi JWT (ditandai  **Ya**) mewajibkan aplikasi mobile untuk melampirkan header `Authorization: Bearer <TOKEN>` dalam setiap pengiriman request. Ini mencegah pengguna lain memodifikasi atau melihat tugas milik Anda.
