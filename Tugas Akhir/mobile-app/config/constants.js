export const API_CONFIG = {
  // Gunakan 'http://10.0.2.2:8000' untuk emulator Android, atau IP lokal Anda (misal 'http://192.168.1.50:8000') jika menggunakan perangkat fisik.
  // Untuk iOS simulator atau Web, 'http://localhost:8000' berfungsi dengan baik.
  BASE_URL: 'http://localhost:8000/api',
  TIMEOUT: 10000,
};

export const APP_CONFIG = {
  NAMA_APLIKASI: 'Catatan Tugas Kuliah',
  VERSI: '1.0.0',
  DEBUG: true,
};

export const PILIHAN_PRIORITAS = [
  { label: 'Tinggi', value: 'TINGGI', warna: 'red' },
  { label: 'Sedang', value: 'SEDANG', warna: 'amber' },
  { label: 'Rendah', value: 'RENDAH', warna: 'emerald' },
];

export const PILIHAN_STATUS = [
  { label: 'Menunggu', value: 'MENUNGGU', warna: 'blue' },
  { label: 'Sedang Dikerjakan', value: 'SEDANG_DIKERJAKAN', warna: 'warning' },
  { label: 'Selesai', value: 'SELESAI', warna: 'success' },
];
