# Integrasi API di React Native (Expo) Menggunakan Fetch

Integrasi API (Application Programming Interface) adalah cara aplikasi Anda berkomunikasi dengan server/database untuk mengambil atau mengirim data (misalnya: mengambil daftar produk, proses *login*, menyimpan data pengguna, dll).

Di React Native (termasuk Expo), cara paling umum dan bawaan (*built-in*) untuk melakukan permintaan jaringan (HTTP requests) adalah dengan menggunakan **Fetch API**.

---

## 1. Konsep Dasar Fetch API

Fetch API adalah fungsi bawaan JavaScript modern. Fungsi ini mengembalikan sebuah **Promise**, yang berarti proses jaringan berjalan secara asinkron (*asynchronous*) — aplikasi tidak akan *freeze* atau berhenti selagi menunggu balasan dari server.

Kita umumnya menggunakan sintaks **`async / await`** agar kode lebih mudah dibaca daripada menggunakan `.then()`.

---

## 2. Mengambil Data (GET Request)

Metode `GET` digunakan untuk meminta data dari server. Ini adalah metode default dari `fetch()`.

### Contoh Kasus: Menampilkan Daftar Pengguna

```jsx
import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, ActivityIndicator, StyleSheet } from 'react-native';

const DaftarPengguna = () => {
  // 1. Siapkan state untuk data, status loading, dan error
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // 2. Buat fungsi untuk mengambil data (Fetch API)
  const ambilDataDariAPI = async () => {
    try {
      // Mulai proses fetch ke endpoint API
      const response = await fetch('https://jsonplaceholder.typicode.com/users');
      
      // Cek apakah HTTP status-nya sukses (200-299)
      if (!response.ok) {
        throw new Error('Jaringan bermasalah atau API error!');
      }
      
      // Ubah respons mentah menjadi format JSON
      const json = await response.json();
      
      // Simpan data ke dalam state
      setData(json);
    } catch (err) {
      // Tangkap dan simpan error jika gagal
      setError(err.message);
    } finally {
      // Apapun hasilnya (sukses/gagal), matikan status loading
      setIsLoading(false);
    }
  };

  // 3. Panggil fungsi ambilData saat komponen pertama kali dimuat
  useEffect(() => {
    ambilDataDariAPI();
  }, []); // Array kosong [] memastikan ini hanya dipanggil sekali

  // --- Bagian UI (Tampilan) ---

  // Tampilkan spinner saat masih memuat
  if (isLoading) {
    return (
      <View style={styles.tengah}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Memuat data...</Text>
      </View>
    );
  }

  // Tampilkan pesan jika terjadi error
  if (error) {
    return (
      <View style={styles.tengah}>
        <Text style={{ color: 'red' }}>Error: {error}</Text>
      </View>
    );
  }

  // Tampilkan data menggunakan FlatList
  return (
    <View style={styles.container}>
      <FlatList
        data={data}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.kartu}>
            <Text style={styles.nama}>{item.name}</Text>
            <Text>{item.email}</Text>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#f5f5f5' },
  tengah: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  kartu: { backgroundColor: '#fff', padding: 15, marginBottom: 10, borderRadius: 8, elevation: 2 },
  nama: { fontSize: 18, fontWeight: 'bold' }
});

export default DaftarPengguna;
```

---

## 3. Mengirim Data (POST Request)

Metode `POST` digunakan untuk mengirim data baru ke server (misalnya: *submit form* register, atau menambah produk baru). 

Untuk menggunakan `POST`, kita perlu menambahkan parameter opsi (objek) ke fungsi `fetch()`.

### Contoh Kasus: Mengirim Data Formulir

```jsx
const kirimDataPengguna = async (nama, email) => {
  try {
    const response = await fetch('https://jsonplaceholder.typicode.com/users', {
      // 1. Tentukan metode HTTP
      method: 'POST',
      
      // 2. Beri tahu server tipe data yang dikirim adalah JSON
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      
      // 3. Ubah objek JavaScript menjadi string JSON (Payload Data)
      body: JSON.stringify({
        name: nama,
        email: email,
      }),
    });

    const json = await response.json();
    console.log('Data berhasil dikirim, respons server:', json);
    alert('Berhasil menambah data!');

  } catch (error) {
    console.error('Gagal mengirim data:', error);
    alert('Terjadi kesalahan!');
  }
};
```

---

## 4. Tips dan Praktik Terbaik (Best Practices)

1. **Selalu Gunakan `try...catch`:** Operasi jaringan sangat rentan gagal (misal: koneksi internet terputus, server mati). Gunakan `try...catch` untuk menangkap error agar aplikasi Anda tidak *crash* mendadak.
2. **Kelola State Pemuatan (Loading State):** Selalu berikan umpan balik visual (*loading spinner* atau *skeleton*) kepada pengguna saat aplikasi sedang menunggu balasan dari API agar pengguna tahu aplikasi tidak nge-*hang*.
3. **Pengecekan `response.ok`:** `fetch()` **tidak** otomatis melempar (throw) *error* pada HTTP status code seperti `404 Not Found` atau `500 Internal Server Error`. Ia hanya melempar *error* jika koneksi internet terputus sepenuhnya. Oleh karena itu, kita selalu perlu mengecek `if (!response.ok)` secara manual.

## Alternatif: Axios
Selain menggunakan bawaan `fetch`, banyak pengembang React Native sangat menyukai **Axios** (`npm install axios`). Axios mempermudah beberapa hal seperti:
- Otomatis mengubah data ke JSON (tidak perlu `response.json()`).
- Otomatis melempar *error* untuk HTTP Error (400 dan 500).
- Mempermudah pengaturan URL dasar (*Base URL*) dan konfigurasi Global *Headers* (seperti Token Otorisasi/Bearer Token).

---

## 5. Menggabungkan Fetch API dengan Zustand

Jika aplikasi Anda mulai kompleks, mengelola state `data`, `isLoading`, dan `error` di setiap komponen akan membuat kode berulang (redundan). Kita bisa memindahkan logika *Fetch API* ini ke dalam **Zustand** (sebagai Global State).

### Langkah 1: Buat Store Zustand untuk API

```javascript
import { create } from 'zustand';

const useUserStore = create((set) => ({
  data: [],
  isLoading: false,
  error: null,

  // Action untuk menjalankan Fetch API
  fetchUsers: async () => {
    // 1. Set loading menjadi true sebelum mulai fetch
    set({ isLoading: true, error: null });

    try {
      const response = await fetch('https://jsonplaceholder.typicode.com/users');
      if (!response.ok) throw new Error('Gagal mengambil data dari server');
      
      const json = await response.json();
      
      // 2. Simpan hasil data ke state dan matikan loading
      set({ data: json, isLoading: false });
    } catch (err) {
      // 3. Simpan pesan error jika gagal
      set({ error: err.message, isLoading: false });
    }
  }
}));

export default useUserStore;
```

### Langkah 2: Gunakan di Komponen

Karena logika pemanggilan API sudah ditangani oleh Zustand, kode komponen React Native menjadi jauh lebih ringkas dan bersih.

```jsx
import React, { useEffect } from 'react';
import { View, Text, FlatList, ActivityIndicator, StyleSheet } from 'react-native';
import useUserStore from './useUserStore'; // Sesuaikan path

const DaftarPenggunaZustand = () => {
  // Ambil state dan action secara langsung dari store Zustand
  const { data, isLoading, error, fetchUsers } = useUserStore();

  // Panggil API saat komponen pertama kali dimuat
  useEffect(() => {
    fetchUsers();
  }, []); // Hanya dipanggil sekali saat mount

  // Tampilan jika sedang loading
  if (isLoading) {
    return (
      <View style={styles.tengah}>
        <ActivityIndicator size="large" color="blue" />
        <Text>Memuat data dari API...</Text>
      </View>
    );
  }

  // Tampilan jika terjadi error
  if (error) {
    return (
      <View style={styles.tengah}>
        <Text style={{ color: 'red' }}>Error: {error}</Text>
      </View>
    );
  }

  // Tampilan list data
  return (
    <View style={styles.container}>
      <FlatList
        data={data}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.kartu}>
            <Text style={styles.nama}>{item.name}</Text>
            <Text>{item.email}</Text>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#f5f5f5' },
  tengah: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  kartu: { backgroundColor: '#fff', padding: 15, marginBottom: 10, borderRadius: 8, elevation: 2 },
  nama: { fontSize: 18, fontWeight: 'bold' }
});

export default DaftarPenggunaZustand;
```

### Keuntungan Menggabungkan Fetch API dengan Zustand:
1. **Pemisahan Logika (Separation of Concerns):** Komponen UI hanya bertugas menampilkan data, tidak lagi tercampur dengan logika bisnis jaringan (*fetching*).
2. **State Bisa Diakses di Mana Saja:** Data pengguna (`data`) yang sudah di-*fetch* di satu layar, bisa langsung dipakai oleh layar lain di dalam aplikasi tanpa perlu memanggil API berulang kali.
3. **Lebih Mudah Dikelola:** Jika ada pembaruan URL API atau cara parsing data, Anda cukup memperbaruinya di satu tempat saja (di dalam *store* Zustand).
