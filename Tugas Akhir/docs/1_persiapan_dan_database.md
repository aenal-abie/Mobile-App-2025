# Bab 1: Persiapan Sistem & Konfigurasi Database

Sebelum mulai membangun dan menjalankan aplikasi **TugasKu**, kita perlu memastikan bahwa semua alat bantu pengembangan perangkat lunak (software development tools) telah terpasang dengan benar di komputer kita.

---

## 🛠️ 1. Kebutuhan Perangkat Lunak (Prerequisites)

Silakan instal aplikasi-aplikasi berikut sesuai dengan Sistem Operasi komputer Anda:

1. **XAMPP** (atau Laragon):
   * Berfungsi sebagai server lokal yang menyediakan layanan **PHP** dan **MySQL Database**.
   * Download: [https://www.apachefriends.org/](https://www.apachefriends.org/)
   * Versi PHP yang disarankan: **PHP 8.0 ke atas**.

2. **Node.js & npm** (Node Package Manager):
   * Berfungsi sebagai platform runtime untuk menjalankan aplikasi React Native Expo dan mengelola library JavaScript.
   * Download: [https://nodejs.org/](https://nodejs.org/) (Disarankan versi **LTS**, misal Node v18 atau v20).

3. **Visual Studio Code (VS Code)**:
   * Editor teks / IDE yang sangat populer untuk menulis kode program.
   * Download: [https://code.visualstudio.com/](https://code.visualstudio.com/)

4. **Git**:
   * Sistem kontrol versi untuk mengelola repositori kode.
   * Download: [https://git-scm.com/](https://git-scm.com/)

5. **Expo Go (Aplikasi HP)**:
   * Instal aplikasi **Expo Go** secara gratis dari **Google Play Store** (Android) atau **Apple App Store** (iOS) pada HP fisik Anda untuk menguji aplikasi secara langsung.

---

## 💾 2. Pengaturan Basis Data (MySQL Database)

Kita akan membuat database bernama `catatan_tugas_db` menggunakan tool berbasis web **phpMyAdmin** yang disediakan oleh XAMPP.

### Langkah-Langkah Membuat Database:
1. Jalankan aplikasi **XAMPP Control Panel** di komputer Anda.
2. Klik tombol **Start** di samping baris **Apache** dan **MySQL** hingga indikatornya berubah menjadi warna hijau.
3. Buka browser web (seperti Google Chrome) lalu akses halaman:
   [http://localhost/phpmyadmin](http://localhost/phpmyadmin)
4. Klik tab **"New"** atau **"Baru"** di bilah kiri menu phpMyAdmin.
5. Ketik nama basis data: `catatan_tugas_db`, lalu klik tombol **"Create"** atau **"Buat"**.
6. Klik database `catatan_tugas_db` yang baru dibuat tersebut.
7. Pilih tab **"SQL"** di bagian atas menu.
8. Buka file skema database Anda di `backend-php/database/schema.sql`, lalu **salin (copy)** seluruh isinya dan **tempel (paste)** ke kolom teks SQL di phpMyAdmin.
9. Klik tombol **"Go"** atau **"Kirim"** di pojok kanan bawah untuk mengeksekusi kueri SQL tersebut.

---

## 📊 3. Penjelasan Skema & Struktur Database

Setelah proses impor selesai, database Anda akan memiliki dua buah tabel utama yang saling berelasi:

### A. Tabel `pengguna`
Menyimpan informasi identitas akun mahasiswa yang telah terdaftar.
* `id`: Kunci Utama (Primary Key), bertipe integer, bertambah otomatis (`AUTO_INCREMENT`).
* `email`: Alamat email mahasiswa (wajib unik agar tidak ada akun ganda).
* `kata_sandi`: Kata sandi akun yang dienkripsi menggunakan algoritma `Bcrypt` demi keamanan.
* `nama`: Nama lengkap mahasiswa.

### B. Tabel `tugas`
Menyimpan daftar tugas kuliah yang dimiliki oleh setiap mahasiswa.
* `id`: Kunci Utama (Primary Key).
* `id_pengguna`: Kunci Tamu (Foreign Key) yang merujuk pada kolom `id` di tabel `pengguna`.
* `judul`: Judul tugas kuliah (misal: "Laporan Fisika Dasar").
* `prioritas`: Tingkat urgensi tugas, bertipe ENUM (`TINGGI`, `SEDANG`, `RENDAH`).
* `status`: Status pengerjaan tugas (`MENUNGGU`, `SEDANG_DIKERJAKAN`, `SELESAI`).
* `sudah_selesai`: Penanda boolean (0 = belum, 1 = sudah selesai).
* `tgl_deadline`: Waktu batas pengumpulan tugas.
* `tgl_selesai`: Waktu ketika mahasiswa menandai tugas tersebut selesai.

---

## 🔗 4. Memahami Relasi "Foreign Key" & "Cascade Delete"

Di dalam SQL skema tabel `tugas` pada baris 29, terdapat kode berikut:
```sql
CONSTRAINT fk_tugas_pengguna
  FOREIGN KEY (id_pengguna) REFERENCES pengguna(id)
  ON DELETE CASCADE
```

### Apa maksud dari kode tersebut?
1. **Foreign Key (`id_pengguna`)**:
   Kolom ini mengunci keterkaitan data. Sebuah data tugas tidak bisa dibuat jika nilai `id_pengguna`-nya tidak terdaftar di tabel `pengguna`. Hal ini menjaga integritas data agar tidak ada tugas "gentayangan" tanpa pemilik yang jelas.
2. **`ON DELETE CASCADE`**:
   Aturan penghapusan data secara berantai. Jika suatu hari akun seorang pengguna dihapus dari tabel `pengguna`, maka sistem database MySQL akan **secara otomatis menghapus seluruh daftar tugas** milik pengguna tersebut dari tabel `tugas`. Ini sangat praktis karena mencegah adanya sampah data di server.
