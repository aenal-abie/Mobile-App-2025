# Menggunakan Zustand di React Native

## Apa itu Zustand?

**Zustand** (bahasa Jerman untuk "state" atau "kondisi") adalah *state management library* yang sangat kecil, cepat, dan terukur (scalable) untuk React dan React Native. Zustand diciptakan oleh tim yang sama yang membuat Jotai dan React Spring (Poimandres).

Dibandingkan dengan Redux yang memiliki banyak *boilerplate* (kode dasar yang berulang), Zustand menawarkan pendekatan yang jauh lebih sederhana berbasis hooks tanpa perlu membungkus aplikasi dengan `<Provider>`.

---

## 1. Cara Instalasi

Untuk menggunakan Zustand di dalam project React Native, jalankan salah satu perintah berikut di terminal yang mengarah ke direktori proyek Anda:

Menggunakan **npm**:
```bash
npm install zustand
```

Menggunakan **Yarn**:
```bash
yarn add zustand
```

---

## 2. Cara Penggunaan Dasar

Menggunakan Zustand umumnya terdiri dari dua langkah utama: membuat *Store*, lalu menggunakannya di *Component*.

### Langkah 1: Membuat Store

Kita membuat *store* menggunakan fungsi `create` dari Zustand. Di dalam store ini, kita mendefinisikan *state* (data) dan *actions* (fungsi untuk mengubah data).

Buat file baru, misalnya `store/useCounterStore.js`:

```javascript
import { create } from 'zustand';

// Membuat store
const useCounterStore = create((set) => ({
  // State (Data)
  angka: 0,
  
  // Action (Fungsi Pengubah)
  tambah: () => set((state) => ({ angka: state.angka + 1 })),
  kurang: () => set((state) => ({ angka: state.angka - 1 })),
  reset: () => set({ angka: 0 }),
}));

export default useCounterStore;
```

### Langkah 2: Menggunakan Store di Komponen

Setelah store dibuat, kita cukup meng-import hook `useCounterStore` tersebut di komponen manapun tanpa perlu *Context Provider*.

Contoh di `App.js` atau komponen lain:

```jsx
import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import useCounterStore from './store/useCounterStore'; // Sesuaikan path

const LayarPenghitung = () => {
  // Mengambil state dan actions dari Zustand Store
  const { angka, tambah, kurang, reset } = useCounterStore();

  /* 
    Bisa juga diambil satu-satu untuk optimasi re-render:
    const angka = useCounterStore((state) => state.angka);
    const tambah = useCounterStore((state) => state.tambah);
  */

  return (
    <View style={styles.container}>
      <Text style={styles.teks}>Nilai Counter: {angka}</Text>
      
      <View style={styles.grupTombol}>
        <Button title="Kurang" onPress={kurang} />
        <Button title="Tambah" onPress={tambah} />
      </View>
      
      <Button title="Reset" onPress={reset} color="red" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', gap: 20 },
  teks: { fontSize: 24, fontWeight: 'bold' },
  grupTombol: { flexDirection: 'row', gap: 10, marginBottom: 10 }
});

export default LayarPenghitung;
```

---

## 3. Kelebihan Zustand

1. **Sangat Ringan dan Cepat:** Ukuran *bundle* Zustand sangat kecil (sekitar ~1kb), sehingga tidak membebani ukuran aplikasi.
2. **Tidak Perlu Provider (Context-Free):** Anda tidak perlu membungkus `App.js` dengan `<Provider>` seperti di Redux atau Context API, yang bisa menghindari fenomena *"Provider Hell"*.
3. **Minim Boilerplate:** Penulisan kodenya sangat ringkas. Tidak ada *reducers*, *actions type*, *dispatch*, dan *thunk* secara default. Semua diletakkan di satu tempat dengan fungsi sederhana.
4. **Mendukung Async Actions Secara Langsung:** Mengambil data dari API tidak memerlukan tambahan *middleware* (seperti `redux-thunk` atau `redux-saga`).
   ```javascript
   const useUserStore = create((set) => ({
     users: [],
     fetchUsers: async () => {
       const response = await fetch('https://api.example.com/users')
       const data = await response.json()
       set({ users: data })
     }
   }))
   ```
5. **Re-render Teroptimasi:** Jika Anda mengambil data tertentu dari *store*, komponen hanya akan merender ulang jika **data spesifik tersebut berubah**, bukan seluruh objek state.

---

## 4. Kekurangan Zustand

1. **Terlalu Fleksibel untuk Proyek Skala Raksasa (Enterprise):** Jika tidak disiplin mengatur struktur folder/file untuk state, kode bisa menjadi berantakan karena tidak ada pola (*pattern*) ketat yang dipaksakan seperti pada arsitektur Redux.
2. **Dokumentasi Pendek:** Karena sangat sederhana, dokumentasi resminya relatif singkat. Untuk pemula yang ingin melihat "best practices" arsitektur aplikasi skala besar dengan Zustand, mungkin perlu mencari referensi dari komunitas/artikel luar.
3. **Komunitas Lebih Kecil (dibanding Redux):** Meskipun sedang *trending* dan pertumbuhannya pesat, dukungan komunitas, pustaka tambahan, dan referensi masalah (*troubleshooting*) masih jauh lebih banyak Redux.

## Kesimpulan

Zustand adalah pilihan ideal dan modern untuk **mengelola Global State di React Native**. Jika aplikasi Anda baru dimulai atau Anda merasa lelah dengan kerumitan Redux, **Zustand adalah opsi terbaik saat ini** yang menggabungkan performa tinggi dan pengalaman *developer* (DX) yang luar biasa nyaman.
