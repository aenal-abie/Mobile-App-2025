# Bab 4: Panduan Menjalankan Aplikasi & Troubleshooting

Ini adalah bagian akhir sekaligus paling penting. Kita akan menyambungkan aplikasi **Mobile** dengan server **Backend PHP** agar keduanya dapat saling mengirim dan menerima data tugas kuliah secara realtime.

---

## 🔌 1. Langkah Kunci: Mengatur Alamat IP API (`config/constants.js`)

Aplikasi React Native yang berjalan di emulator atau HP fisik **tidak bisa** menghubungi alamat `localhost` karena `localhost` di dalam HP fisik/emulator akan merujuk pada perangkat itu sendiri, bukan komputer server Anda.

Buka berkas **[config/constants.js](../mobile-app/config/constants.js)** di VS Code, lalu sesuaikan nilai `BASE_URL` berdasarkan target pengujian Anda:

### Skenario A: Menggunakan Android Emulator (AVD)
Android Emulator memiliki gerbang khusus (loopback IP) untuk menghubungi komputer host Anda.
* Ubah `BASE_URL` di `constants.js` menjadi:
  ```javascript
  BASE_URL: 'http://10.0.2.2:8000/api'
  ```

### Skenario B: Menggunakan Handphone Fisik (Expo Go)
Komputer dan HP Anda **wajib terhubung pada jaringan Wi-Fi yang sama**.
1. Cari tahu IP lokal komputer Anda:
   * **Di Windows**: Buka Command Prompt (`cmd`), ketik `ipconfig`, lalu cari `IPv4 Address` (contoh: `192.168.1.15`).
   * **Di Linux / macOS**: Buka Terminal, ketik `hostname -I` atau `ip a`, cari IP Anda.
2. Ubah `BASE_URL` di `constants.js` menjadi:
  ```javascript
  BASE_URL: 'http://<IP_LOKAL_KOMPUTER>:8000/api'
  // Contoh: 'http://192.168.1.15:8000/api'
  ```

### Skenario C: Menggunakan Browser (Web Preview)
* Ubah `BASE_URL` di `constants.js` menjadi:
  ```javascript
  BASE_URL: 'http://localhost:8000/api'
  ```

---

## 🏃‍♂️ 2. Alur Menjalankan Aplikasi (Langkah-demi-Langkah)

Pastikan layanan Apache dan MySQL di XAMPP Anda sudah berstatus **Start**.

### Langkah 1: Jalankan Salah Satu Server Backend (PHP atau Express)
Pilih salah satu backend yang ingin Anda gunakan (keduanya berjalan di port `8000`):

* **Opsi A: Menggunakan Node.js Express (Rekomendasi - JS)**
  1. Buka Terminal baru, masuk ke direktori `backend-express/`.
  2. Jalankan perintah:
     ```bash
     npm run dev
     ```
  3. Server aktif di alamat `http://localhost:8000`.

* **Opsi B: Menggunakan PHP Native**
  1. Buka Terminal baru, masuk ke direktori `backend-php/`.
  2. Jalankan perintah:
     ```bash
     composer run serve
     ```
  3. Server aktif di alamat `http://localhost:8000`.

### Langkah 2: Jalankan Metro Bundler Mobile App
1. Buka Terminal baru lainnya, masuk ke direktori `mobile-app/`.
2. Jalankan perintah:
   ```bash
   npm run dev
   ```
3. Terminal akan menampilkan **Kode QR** besar yang mewakili aplikasi Anda.

### Langkah 3: Scan QR Code & Jalankan di Perangkat
* **Di HP Android**: Buka aplikasi **Expo Go** yang telah diunduh, klik **"Scan QR Code"**, lalu arahkan kamera ke terminal komputer Anda.
* **Di HP iOS / iPhone**: Buka aplikasi **Kamera bawaan**, arahkan ke Kode QR, lalu klik pop-up tautan kuning untuk membuka di **Expo Go**.
* **Di Android Emulator**: Cukup tekan tombol **a** pada keyboard terminal VS Code Anda untuk otomatis menyalakan emulator.

---

## 🛠️ 3. Panduan Mengatasi Masalah (Troubleshooting)

Berikut adalah ringkasan solusi jika Anda menemui kendala umum saat pengerjaan:

### Masalah 1: Error `ENOSPC: System limit for number of file watchers reached` (Khusus Linux)
* **Penyebab**: Batas maksimal inotify sistem operasi Linux komputer Anda terlalu rendah untuk mengawasi berkas proyek Node.js.
* **Solusi**: Jalankan perintah berikut di Terminal utama Linux Anda untuk meningkatkan batasnya secara permanen:
  ```bash
  echo fs.inotify.max_user_watches=524288 | sudo tee -a /etc/sysctl.conf && sudo sysctl -p
  ```
  Masukkan password komputer Anda ketika diminta, lalu restart bundler Expo Anda.

### Masalah 2: Pesan "Network Error" atau "Connection Refused" saat Login / Register
* **Penyebab**: Aplikasi mobile gagal menghubungi server backend PHP.
* **Pemeriksaan Solusi**:
  1. Pastikan server PHP Anda masih berjalan aktif di port `8000`.
  2. Periksa kembali isi file `config/constants.js`. Jika Anda menggunakan HP fisik, pastikan Anda memakai IP lokal komputer (seperti `192.168.x.x`), **bukan** `localhost` atau `10.0.2.2`.
  3. Pastikan HP fisik dan laptop/PC Anda terhubung ke router Wi-Fi yang **sama persis**.
  4. Periksa firewall komputer Anda, pastikan tidak memblokir koneksi masuk ke port `8000`.

### Masalah 3: Masalah Keamanan CORS (Cross-Origin Resource Sharing)
* **Penyebab**: Browser menolak menerima data dari alamat domain server yang berbeda demi alasan keamanan web.
* **Solusi**: Server PHP bawaan kita telah dikonfigurasi untuk mengizinkan semua asal koneksi. Pastikan di berkas `.env` folder `backend-php` Anda sudah tertera:
  ```ini
  CORS_ALLOWED_ORIGINS=*
  ```

---

> **Selamat!**
> Anda telah sukses menyelesaikan dan mendokumentasikan pembuatan aplikasi **TugasKu**. Selamat menguji aplikasi, bereksperimen dengan fitur-fitur baru, dan semoga sukses dalam perkuliahan Pemrograman Mobile Anda! 🎓✨
