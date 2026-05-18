# Bab 2: Pengaturan & Menjalankan Backend API (PHP Native)

Server backend aplikasi **TugasKu** dibangun menggunakan **PHP Native** terstruktur dengan arsitektur RESTful API modern. Kode backend ini menangani seluruh logika autentikasi pengguna (registrasi & login dengan JSON Web Tokens / JWT) serta operasi CRUD data tugas secara aman ke database MySQL.

---

## 📂 1. Memahami Struktur Folder Backend

Di dalam folder `backend-php`, terdapat struktur berkas sebagai berikut:
* `src/`: Berisi kode logika utama.
  * `api.php`: Berisi seluruh logika aplikasi, mulai dari koneksi database, router REST API, autentikasi JWT, hingga penanganan kueri SQL.
* `public/index.php`: Pintu masuk utama (Entry Point) seluruh request API yang memuat file `api.php`.
* `database/`: Menyimpan file skema atau export database SQL (`.sql`).
* `.env.example`: Contoh konfigurasi lingkungan basis data & JWT.
* `.htaccess`: Konfigurasi server web Apache untuk me-routing semua request ke `public/index.php`.

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

### Langkah 3: Pastikan Ekstensi PHP Aktif
Karena backend ini merupakan murni **PHP Native** tanpa library pihak ketiga (tanpa Composer), pastikan Anda telah mengaktifkan ekstensi PDO MySQL di konfigurasi `php.ini` Anda:
```ini
extension=pdo_mysql
```
(Secara default di XAMPP, ekstensi ini biasanya sudah aktif).

---

## 🚀 3. Menjalankan Server Backend Lokal (dengan XAMPP)

Karena aplikasi menggunakan database MySQL, sangat disarankan untuk menjalankannya menggunakan XAMPP. Ikuti langkah berikut:

1. Pastikan folder proyek `backend-php` (atau seluruh folder `Tugas Akhir`) sudah dipindahkan atau berada di dalam direktori `htdocs/` pada instalasi XAMPP Anda (misal di Windows: `C:\xampp\htdocs\backend-php`, atau Linux: `/opt/lampp/htdocs/backend-php`).
2. Buka aplikasi **XAMPP Control Panel**.
3. Jalankan module **Apache** dan **MySQL** dengan mengklik tombol **Start**.
4. Server backend Anda sekarang aktif dan dapat diuji melalui browser atau aplikasi mobile pada alamat lokal (contoh: `http://localhost/backend-php/public`). 

*(Catatan: Saat diakses dari HP Android / aplikasi mobile, ganti `localhost` dengan alamat IPv4 komputer Anda, contoh: `http://192.168.1.5/backend-php/public`)*

Server backend Anda sekarang siap melayani permintaan API dari aplikasi mobile!

---

## 📡 4. Daftar REST API Endpoints

Aplikasi mobile TugasKu akan berkomunikasi dengan backend melalui alamat-alamat endpoint berikut dengan format data berupa **JSON**:

| Metode HTTP | Alamat Endpoint | Keterangan Fitur | Perlindungan JWT? |
| :--- | :--- | :--- | :--- |
| **POST** | `/api/aut/daftar` | Registrasi akun pengguna baru | ❌ Tidak |
| **POST** | `/api/aut/masuk` | Login pengguna & mendapatkan token JWT | ❌ Tidak |
| **POST** | `/api/aut/keluar` | Logout pengguna dari sistem | ❌ Tidak |
| **GET** | `/api/aut/profil` | Mengambil data profil pengguna | ✅ Ya |
| **PUT** | `/api/aut/profil` | Mengubah nama/email profil pengguna | ✅ Ya |
| **GET** | `/api/tugas` | Mengambil seluruh daftar tugas milik pengguna | ✅ Ya |
| **POST** | `/api/tugas` | Membuat tugas kuliah baru | ✅ Ya |
| **GET** | `/api/tugas/{id}` | Mengambil detail tugas tertentu | ✅ Ya |
| **PUT** | `/api/tugas/{id}` | Memperbarui detail tugas tertentu | ✅ Ya |
| **PATCH** | `/api/tugas/{id}/selesai`| Menandai tugas sebagai selesai/belum | ✅ Ya |
| **DELETE** | `/api/tugas/{id}` | Menghapus tugas tertentu secara permanen | ✅ Ya |

---

> [!NOTE]
> **Penting Mengenai Proteksi JWT**:
> Endpoint yang dilindungi JWT (ditandai **✅ Ya**) mewajibkan aplikasi mobile untuk melampirkan header `Authorization: Bearer <TOKEN>` dalam setiap pengiriman request. Ini mencegah pengguna lain memodifikasi atau melihat tugas milik Anda.
