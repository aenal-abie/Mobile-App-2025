# Mobile App

Mobile app React Native Expo untuk aplikasi catatan tugas kuliah.

## Struktur
- `App.js` sebagai entry point
- `src/screens` untuk layar aplikasi
- `src/store` untuk Zustand
- `src/services` untuk koneksi backend

## Jalankan
1. Install dependency dengan `npm install`
2. Jalankan `npm start`
3. Pastikan backend PHP aktif di `http://localhost:8000`

## Catatan
- Base URL di `src/config/constants.js` memakai `10.0.2.2` untuk Android emulator
- Kalau pakai HP asli, ganti ke IP laptop kamu di network lokal
