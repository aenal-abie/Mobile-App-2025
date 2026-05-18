# Bab 3: Pengaturan & Konfigurasi Mobile App (React Native Expo)

Bagian front-end dari **TugasKu** dikembangkan sebagai aplikasi mobile modern berbasis **React Native** dengan **Expo SDK**. Aplikasi ini ditulis menggunakan **Pure JavaScript (.js)** secara penuh untuk menjamin keringanan performa, kemudahan modifikasi, dan adaptabilitas yang tinggi bagi mahasiswa baru.

---

## 🛠️ 1. Langkah Pembuatan Awal Proyek (Dari Nol / Scratch)

Jika Anda ingin tahu bagaimana proyek **TugasKu** ini diinisialisasi pertama kali, berikut adalah tahapan pembuatannya dari nol agar Anda memahaminya sebagai developer pemula:

### Langkah 1: Membuat Template Expo Baru
Buka Terminal komputer Anda, lalu jalankan perintah pembuat proyek Expo dengan struktur router otomatis (*file-based routing*):
```bash
npx create-expo-app@latest mobile-app --template tabs
```
*Keterangan*: `--template tabs` akan secara otomatis membuatkan tab navigasi di bagian bawah layar sebagai titik awal aplikasi.

### Langkah 2: Menginstal Library Tambahan
Masuk ke dalam folder proyek:
```bash
cd mobile-app
```
Kemudian, instal pustaka-pustaka tambahan yang kita perlukan untuk mengolah data dan autentikasi:
```bash
# 1. Instal Zustand untuk Manajemen State Global
npm install zustand

# 2. Instal Axios untuk Request HTTP ke REST API PHP
npm install axios

# 3. Instal AsyncStorage untuk Menyimpan Token Sesi Login di HP
npx expo install @react-native-async-storage/async-storage
```

### Langkah 3: Membuat Folder Penunjang Arsitektur Clean Code
Untuk memisahkan tanggung jawab kode (*separation of concerns*), buat beberapa folder kustom baru di dalam direktori utama proyek:
```bash
mkdir config services store utils
```
* **`config/`**: Menyimpan konfigurasi umum seperti URL Server.
* **`services/`**: Berisi kode fungsi khusus untuk melakukan *fetch* data ke API.
* **`store/`**: Wadah manajemen state global menggunakan Zustand.
* **`utils/`**: Berisi fungsi pembantu seperti pengubah format tanggal.

### Langkah 4: Membersihkan File Bawaan & Membuat Rute Baru
Template bawaan Expo biasanya menggunakan TypeScript (`.tsx`). Kita dapat membersihkan berkas bawaan di folder `app/` dan membuat berkas baru menggunakan format **JavaScript murni (`.js`)** untuk:
* Halaman Auth Gate (`app/index.js`)
* Login & Register (`app/auth/login.js` dan `app/auth/register.js`)
* Tab Dashboard & Profil (`app/tabs/(tabs)/home.js` dan `app/tabs/(tabs)/profil.js`)
* Halaman Tugas (`app/tugas/tambah.js`, `app/tugas/edit.js`, dan `app/tugas/detail.js`)

---

## 📂 2. Memahami Struktur Folder Mobile App

Di dalam folder `mobile-app`, berkas-berkas penting tersusun sebagai berikut:

```
mobile-app/
├── config/
│   └── constants.js          <-- Pengaturan URL API utama & variabel status
├── services/
│   ├── api.js                <-- Axios client dengan interceptor token Authorization otomatis
│   ├── auth.js               <-- Penghubung API REST untuk Autentikasi
│   └── tasks.js              <-- Penghubung API REST untuk tugas kuliah
├── store/
│   ├── authStore.js          <-- Zustand Store untuk data akun & persistence login
│   └── taskStore.js          <-- Zustand Store untuk manipulasi state tugas (CRUD)
├── utils/
│   └── formatting.js         <-- Formatter tanggal Indonesia & warna prioritas
└── app/
    ├── _layout.js            <-- Titik masuk utama & Provider UI
    ├── index.js              <-- Auth Gate / Splash Screen (Pemeriksa Token)
    ├── auth/
    │   ├── login.js          <-- Form masuk akun mahasiswa
    │   └── register.js       <-- Form daftar akun baru
    ├── tabs/
    │   └── (tabs)/
    │       ├── home.js       <-- Dashboard Tugas (Pencarian, Filter, Sort, FAB)
    │       └── profil.js     <-- Statistik Tugas & Profil Lengkap
    └── tugas/
        ├── tambah.js         <-- Form buat tugas dengan pintasan deadline
        ├── edit.js           <-- Form ubah detail dan status pengerjaan
        └── detail.js         <-- Tampilan detail tugas & tombol hapus
```

---

## 📦 2. Menginstal Library Dependensi Utama

Sebelum dapat menjalankan aplikasi mobile, Anda harus mengunduh semua pustaka (library) yang tercantum di dalam file `package.json`.

Buka terminal baru di direktori `mobile-app/` lalu jalankan perintah:
```bash
npm install
```
Perintah ini akan secara otomatis menginstal dependensi bawaan seperti React Native, Expo, Gluestack UI, Tailwind CSS, dan modul-modul penting berikut:

1. **`zustand`**: Library manajemen state yang sangat ringan dan efisien untuk menyimpan status login & daftar tugas global.
2. **`axios`**: Pustaka client HTTP untuk melakukan kueri asinkron ke server REST API PHP.
3. **`@react-native-async-storage/async-storage`**: Media penyimpanan internal (*local storage*) HP untuk menyimpan token JWT agar sesi login mahasiswa tidak hilang saat aplikasi ditutup.

---

## 🌐 3. Konfigurasi Axios Interceptor (`services/api.js`)

Untuk mengamankan rute data tugas di backend, kita menggunakan token JWT. Dibanding memasukkan token secara manual di setiap fungsi, aplikasi ini menggunakan **Axios Interceptor** yang dikonfigurasi di **[services/api.js](../mobile-app/services/api.js)**:

```javascript
api.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem('auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```
*Penjelasan untuk Mahasiswa*: Setiap kali aplikasi mobile mengirimkan permintaan mengambil data tugas ke backend, kode interseptor di atas akan secara otomatis menyelipkan token login Anda di header request. Sangat rapi dan aman!

## 🗃️ 4. Konsep State Management dengan Zustand

Aplikasi ini menggunakan **Zustand** untuk menyimpan data secara global tanpa perlu mengoper data antar komponen secara rumit (*prop drilling*).

* **`authStore.js`**: Mengelola status login pengguna (`token`, `pengguna`), menangani pemanggilan login/register/logout, dan menyinkronkan token secara otomatis ke penyimpanan lokal (`AsyncStorage`).
* **`taskStore.js`**: Mengelola state array tugas kuliah, mengurus pemanggilan CRUD, menyimpan kata kunci pencarian, status filter pengerjaan, dan melakukan pengurutan (*sorting*) berdasarkan deadline atau prioritas.

---

## 🔄 5. Detail Alur Integrasi API: Service ➜ Store ➜ Screen

Untuk memahami bagaimana aplikasi mobile berkomunikasi dengan backend, perhatikan diagram alir integrasi berikut:

```
[ Screen UI (Login.js) ]
       │  1. Pengguna klik "Masuk", panggil action store
       ▼
[ Zustand Store (authStore.js) ]
       │  2. Nyalakan loading spinner, panggil service API
       ▼
[ Service API (services/auth.js) ]
       │  3. Kirim request HTTP POST dengan Axios client
       ▼
[ PHP REST API Server ]  (Mengolah data, enkripsi, kueri database)
       │
       ▼  4. Kembalikan response JSON (Token & Profil Pengguna)
[ Service API (services/auth.js) ]
       │
       ▼  5. Kembalikan data sukses ke Store
[ Zustand Store (authStore.js) ]
       │  6. Simpan token ke AsyncStorage & update state pengguna
       ▼
[ Screen UI (Login.js) ]
          7. Hentikan spinner, alihkan layar ke /tabs/home
```

Berikut adalah contoh pembuatan kode riil untuk masing-masing bagian agar Anda dapat menirunya:

### Bagian A: Membuat Service API (`services/auth.js`)
Service adalah fungsi murni yang bertugas **hanya** untuk berkomunikasi ke server menggunakan Axios. Ia tidak peduli dengan tampilan layar atau state global.

```javascript
// services/auth.js
import api from './api';

export const loginApi = async (email, kataSandi) => {
  // Mengirim data POST email & kata sandi ke server PHP
  const response = await api.post('/masuk', {
    email,
    kata_sandi: kataSandi
  });
  // Mengembalikan data JSON hasil response dari server
  return response.data; 
};
```

### Bagian B: Membuat Zustand Store (`store/authStore.js`)
Store bertugas sebagai **pusat data** aplikasi. Ia memanggil Service API, mengelola indikator loading (`sedangMemuat`), merekam data user (`pengguna`), serta menyimpan token ke penyimpanan HP.

```javascript
// store/authStore.js
import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { loginApi } from '../services/auth';

export const gunakkanStoreAut = create((set) => ({
  pengguna: null,
  token: null,
  sedangMemuat: false,
  error: null,

  // Action: Fungsi untuk melakukan login
  masuk: async (email, kataSandi) => {
    set({ sedangMemuat: true, error: null });
    try {
      // 1. Panggil fungsi Service API yang kita buat di Bagian A
      const data = await loginApi(email, kataSandi);

      // 2. Jika sukses, simpan Token JWT ke penyimpanan lokal HP
      await AsyncStorage.setItem('auth_token', data.token);

      // 3. Perbarui data state global di store
      set({ 
        token: data.token, 
        pengguna: data.pengguna, 
        sedangMemuat: false 
      });
    } catch (err) {
      // Rekam pesan error jika login gagal
      set({ 
        error: err.response?.data?.message || 'Gagal masuk akun', 
        sedangMemuat: false 
      });
      throw err;
    }
  }
}));
```

### Bagian C: Membuat Screen UI (`app/auth/login.js`)
Layar UI bertugas untuk **menampilkan elemen visual** kepada pengguna. Layar ini mengambil fungsi `masuk` dan state `sedangMemuat` langsung dari Store, tanpa perlu mengetahui kerumitan koneksi database di server.

```javascript
// app/auth/login.js
import React, { useState } from 'react';
import { Button, ButtonText, ButtonSpinner } from '@/components/ui/button';
import { Input, InputField } from '@/components/ui/input';
import { gunakkanStoreAut } from '../../store/authStore';

export default function LoginScreen() {
  // 1. Hubungkan Screen ke Zustand Store
  const { masuk, sedangMemuat, error } = gunakkanStoreAut();
  
  const [email, setEmail] = useState('');
  const [kataSandi, setKataSandi] = useState('');

  const tanganiKlikLogin = async () => {
    try {
      // 2. Panggil action store saat tombol diklik
      await masuk(email, kataSandi);
      // Pindah halaman jika sukses...
    } catch (err) {
      // Error otomatis terekam di store dan tampil di layar
    }
  };

  return (
    <>
      <Input>
        <InputField placeholder="Email" value={email} onChangeText={setEmail} />
      </Input>
      
      <Input>
        <InputField placeholder="Sandi" value={kataSandi} onChangeText={setKataSandi} secureTextEntry />
      </Input>

      {/* 3. Gunakan state 'sedangMemuat' untuk menonaktifkan tombol & menampilkan spinner */}
      <Button onPress={tanganiKlikLogin} disabled={sedangMemuat}>
        {sedangMemuat ? <ButtonSpinner color="white" /> : <ButtonText>Masuk</ButtonText>}
      </Button>
    </>
  );
}
```

---

## ☀️ 5. Penguncian Desain Light Mode Premium

Agar desain aplikasi selalu konsisten dan tampak terang (terhindar dari warna teks atau latar belakang yang pecah/hilang ketika tema HP pengguna berubah), aplikasi ini dikunci ke dalam **Light Mode** secara permanen.

Pengaturan ini dikonfigurasi di dalam berkas entry layout **[app/_layout.js](../mobile-app/app/_layout.js)**:

```jsx
function RootLayoutNav() {
  return (
    <GluestackUIProvider mode="light">
      <ThemeProvider value={DefaultTheme}>
        <StatusBar style="dark" />
        <Slot />
      </ThemeProvider>
    </GluestackUIProvider>
  );
}
```

* **`mode="light"`**: Mengunci tema komponen Gluestack UI ke mode terang.
* **`ThemeProvider value={DefaultTheme}`**: Mengunci tema navigasi Expo Router ke mode default (terang).
* **`StatusBar style="dark"`**: Mengatur bar baterai & sinyal di bagian atas layar agar selalu menggunakan ikon gelap agar kontras di latar belakang aplikasi yang terang.
