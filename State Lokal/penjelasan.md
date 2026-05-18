# Memahami State Lokal (Local State) di React Native

Dalam pengembangan aplikasi dengan React Native (dan React pada umumnya), **State** adalah salah satu konsep inti yang membuat aplikasi menjadi hidup, interaktif, dan dinamis. Secara sederhana, state adalah memori dari sebuah komponen.

**State Lokal (Local State)** merujuk pada data state yang hanya dimiliki, dikelola, dan hanya bisa diakses secara langsung oleh **satu komponen tertentu saja**.

---

## 1. Konsep Dasar State Lokal

- **Penyimpanan Internal:** State lokal menyimpan informasi tentang komponen tersebut pada suatu waktu. Misalnya, apakah sebuah tombol sedang ditekan, apa teks yang sedang diketik pengguna di input form, atau halaman ke berapa yang sedang dibuka.
- **Memicu Render Ulang (Re-rendering):** Karakteristik utama dari state adalah: **ketika nilai state berubah, React akan otomatis melakukan *render* ulang (memperbarui tampilan) khusus untuk komponen tersebut (dan komponen anak-anaknya)** agar UI selalu sinkron dengan data terbaru.
- **Terisolasi:** State lokal di komponen A tidak dapat diakses atau diubah secara langsung oleh komponen B, kecuali jika data tersebut dioper ke komponen B melalui **Props**.

*(Catatan: Jika sebuah state perlu diakses oleh banyak komponen di seluruh aplikasi, kita biasanya menggunakan **Global State** seperti Redux, Zustand, atau React Context).*

---

## 2. Menggunakan State Lokal dengan `useState`

Di React modern (menggunakan Functional Components), kita mengelola state lokal menggunakan *Hook* bernama `useState`.

### Sintaks Dasar `useState`

```jsx
import React, { useState } from 'react';

// Di dalam komponen:
const [namaState, setNamaState] = useState(nilaiAwal);
```

**Penjelasan Array Destructuring:**
1. `namaState`: Variabel yang menyimpan nilai state saat ini.
2. `setNamaState`: Fungsi (setter) yang **wajib** digunakan untuk mengubah nilai `namaState`. Kita tidak boleh mengubah `namaState` secara langsung (misal: `namaState = 'baru'`).
3. `nilaiAwal`: Nilai pertama kali dari state saat komponen pertama kali dimuat (bisa berupa angka, string, boolean, array, atau objek).

---

## 3. Contoh Penggunaan State Lokal

Berikut adalah beberapa skenario umum penggunaan state lokal di React Native:

### Contoh 1: Counter (Tipe Data Angka / Number)

Menyimpan jumlah klik atau hitungan.

```jsx
import React, { useState } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

const Penghitung = () => {
  // Deklarasi state 'jumlah' dengan nilai awal 0
  const [jumlah, setJumlah] = useState(0);

  const tambah = () => {
    // Menggunakan fungsi setJumlah untuk memperbarui state
    setJumlah(jumlah + 1);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.teks}>Tombol ditekan sebanyak: {jumlah} kali</Text>
      <Button title="Tambah" onPress={tambah} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { padding: 20, alignItems: 'center' },
  teks: { fontSize: 18, marginBottom: 10 }
});

export default Penghitung;
```

### Contoh 2: Menyimpan Input Form (Tipe Data Teks / String)

State sangat sering digunakan untuk menangkap apa yang diketik oleh pengguna secara *real-time*.

```jsx
import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';

const FormNama = () => {
  // State untuk menyimpan teks input
  const [nama, setNama] = useState('');

  return (
    <View style={styles.container}>
      {/* TextInput mengubah state setiap kali ada ketikan baru */}
      <TextInput 
        style={styles.input}
        placeholder="Ketik nama Anda di sini..."
        value={nama} // Binding state ke nilai input
        onChangeText={(teks) => setNama(teks)} // Memperbarui state
      />
      
      {/* UI akan otomatis diperbarui setiap state 'nama' berubah */}
      <Text style={styles.hasil}>Halo, {nama || 'Tamu'}!</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { padding: 20 },
  input: { borderWidth: 1, borderColor: '#ccc', padding: 10, marginBottom: 15 },
  hasil: { fontSize: 20, fontWeight: 'bold' }
});

export default FormNama;
```

### Contoh 3: Toggle atau Sakelar (Tipe Data Boolean)

State boolean (true/false) biasanya digunakan untuk menyembunyikan/menampilkan elemen, mengubah tema (gelap/terang), atau status *loading*.

```jsx
import React, { useState } from 'react';
import { View, Text, Switch, StyleSheet } from 'react-native';

const SakelarLampu = () => {
  const [lampuMenyala, setLampuMenyala] = useState(false);

  // Fungsi untuk membalikkan state (true jadi false, false jadi true)
  const toggleLampu = () => {
    setLampuMenyala(stateSebelumnya => !stateSebelumnya);
  };

  return (
    <View style={[styles.container, { backgroundColor: lampuMenyala ? '#fff' : '#333' }]}>
      <Text style={{ color: lampuMenyala ? '#000' : '#fff', fontSize: 24, marginBottom: 20 }}>
        Lampu: {lampuMenyala ? 'MENYALA 💡' : 'MATI 🌑'}
      </Text>
      
      <Switch
        trackColor={{ false: "#767577", true: "#81b0ff" }}
        thumbColor={lampuMenyala ? "#f5dd4b" : "#f4f3f4"}
        onValueChange={toggleLampu}
        value={lampuMenyala}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 50 }
});

export default SakelarLampu;
```

---

## 4. Aturan dan Praktik Terbaik (Best Practices) State Lokal

1. **State bersifat Asinkronus (Asynchronous):** Pembaruan state melalui *setter function* (misal: `setJumlah`) tidak terjadi secara instan. React mengelompokkan (batch) pembaruan state untuk performa. Jika state baru bergantung pada state sebelumnya, gunakan format fungsi: `setJumlah(prev => prev + 1)` daripada `setJumlah(jumlah + 1)`.
2. **Immutability (Jangan ubah state secara langsung):** Terutama jika state berupa array atau objek, jangan pernah melakukan ini:
   ```js
   // ❌ SALAH
   dataUser.nama = "Budi";
   setDataUser(dataUser);
   ```
   Lakukan salinan (copy) terlebih dahulu (biasanya menggunakan *spread operator* `...`):
   ```js
   // ✅ BENAR
   setDataUser({ ...dataUser, nama: "Budi" });
   ```
3. **Kapan Menggunakan State Lokal vs Variabel Biasa?**
   - Gunakan **variabel biasa** (`let`, `const`) jika perubahan nilai tersebut **tidak perlu** mengubah tampilan (UI) di layar.
   - Gunakan **State** (`useState`) jika perubahan nilai tersebut **harus** terlihat perubahannya di layar secara langsung.

## Ringkasan
State lokal adalah jantung dari komponen yang interaktif. Ia menyimpan memori spesifik komponen dan memberikan React "sinyal" untuk menggambar ulang (render) layar setiap kali memori tersebut diperbarui.
