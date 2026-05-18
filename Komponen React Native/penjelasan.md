# Mengenal Komponen (Components) dalam React Native

Dalam React Native, **Komponen (Components)** adalah fondasi utama atau blok pembangun dasar (building blocks) dari antarmuka pengguna (User Interface). Sama seperti di React JS, semua yang Anda lihat di layar aplikasi React Native adalah sebuah komponen.

Komponen memungkinkan kita untuk memecah UI yang kompleks menjadi bagian-bagian yang lebih kecil, mandiri (independent), dan dapat digunakan kembali (reusable).

---

## 1. Core Components (Komponen Inti)

React Native menyediakan berbagai komponen bawaan (Core Components) yang siap digunakan. Komponen-komponen ini akan diterjemahkan menjadi elemen antarmuka asli (native UI elements) pada masing-masing platform (Android/iOS).

Berikut adalah beberapa komponen inti yang paling sering digunakan:

### a. `<View>`
Komponen ini mirip dengan `<div>` di HTML. Digunakan sebagai kontainer untuk membungkus komponen lain, mengatur tata letak (layout) dengan Flexbox, serta memberikan gaya (styling).

```jsx
import { View } from 'react-native';

<View style={{ padding: 20, backgroundColor: 'blue' }}>
  {/* Komponen lain di sini */}
</View>
```

### b. `<Text>`
Digunakan untuk menampilkan teks di layar. Mirip dengan tag `<p>` atau `<span>` di HTML. Semua teks di React Native **wajib** dibungkus menggunakan komponen ini.

```jsx
import { Text } from 'react-native';

<Text style={{ fontSize: 18, color: 'white' }}>Halo, Dunia!</Text>
```

### c. `<Image>`
Digunakan untuk menampilkan gambar. Bisa dari gambar lokal (assets) maupun URL dari internet.

```jsx
import { Image } from 'react-native';

// Menggunakan gambar dari URL
<Image 
  source={{ uri: 'https://reactnative.dev/img/tiny_logo.png' }} 
  style={{ width: 50, height: 50 }} 
/>

// Menggunakan gambar lokal
<Image 
  source={require('./assets/logo.png')} 
/>
```

### d. `<TextInput>`
Digunakan untuk mengambil input teks dari pengguna melalui keyboard (mirip dengan `<input type="text">` di HTML).

```jsx
import { TextInput } from 'react-native';

<TextInput 
  placeholder="Masukkan nama Anda"
  onChangeText={(text) => console.log(text)}
/>
```

### e. `<ScrollView>`
Kontainer bergulir (scrollable) yang dapat menampung banyak komponen. Digunakan ketika konten melebihi ukuran layar.

```jsx
import { ScrollView, Text } from 'react-native';

<ScrollView>
  <Text>Konten panjang 1...</Text>
  <Text>Konten panjang 2...</Text>
  {/* dan seterusnya */}
</ScrollView>
```

---

## 2. Membuat Custom Component (Komponen Kustom)

Selain menggunakan komponen bawaan, kita bisa membuat komponen sendiri dengan menggabungkan komponen-komponen inti tersebut. Secara umum, komponen di React Native ditulis menggunakan fungsi (Functional Component).

### Contoh Pembuatan Custom Component:

```jsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

// Membuat custom component bernama 'KartuProfil'
const KartuProfil = () => {
  return (
    <View style={styles.kartu}>
      <Text style={styles.judul}>Nama: Budi Santoso</Text>
      <Text style={styles.deskripsi}>Software Engineer</Text>
    </View>
  );
};

// Gaya (Styling)
const styles = StyleSheet.create({
  kartu: {
    backgroundColor: '#ffffff',
    padding: 15,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    elevation: 3,
  },
  judul: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  deskripsi: {
    fontSize: 14,
    color: 'gray',
  }
});

export default KartuProfil;
```

---

## 3. Konsep Penting dalam Komponen: Props & State

Agar komponen bisa bersifat dinamis dan interaktif, React Native menggunakan dua konsep penting:

### a. Props (Properties)
Props adalah cara untuk **mengirimkan data** dari komponen induk (parent) ke komponen anak (child). Props bersifat *read-only* (tidak dapat diubah oleh komponen anak).

```jsx
// Komponen Anak menerima props bernama 'nama'
const Sapaan = (props) => {
  return <Text>Halo, {props.nama}!</Text>;
}

// Komponen Induk mengirimkan data via props
const Aplikasi = () => {
  return (
    <View>
      <Sapaan nama="Andi" />
      <Sapaan nama="Budi" />
    </View>
  );
}
```

### b. State
State adalah tempat **menyimpan data yang bisa berubah-ubah** seiring berjalannya waktu (misalnya karena interaksi pengguna). Jika state berubah, komponen akan otomatis melakukan *render* ulang (diperbarui di layar).

Kita menggunakan *hook* `useState` untuk mengelola state di Functional Component.

```jsx
import React, { useState } from 'react';
import { View, Text, Button } from 'react-native';

const Penghitung = () => {
  // Membuat state 'angka' dengan nilai awal 0
  const [angka, setAngka] = useState(0);

  return (
    <View style={{ alignItems: 'center', marginTop: 20 }}>
      <Text style={{ fontSize: 30 }}>{angka}</Text>
      <Button 
        title="Tambah 1" 
        onPress={() => setAngka(angka + 1)} // Mengubah state saat tombol ditekan
      />
    </View>
  );
}
```

## Ringkasan
- **Komponen** adalah bagian pembangun antarmuka UI.
- Gunakan **Core Components** seperti `View`, `Text`, dan `Image` sebagai bahan baku dasar.
- Buat **Custom Component** agar kode lebih rapi dan bisa dipakai berulang (reusable).
- Gunakan **Props** untuk melempar data antar komponen.
- Gunakan **State** untuk mengelola data yang berubah-ubah di dalam komponen.
