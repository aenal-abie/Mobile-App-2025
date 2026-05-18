# Memahami UI dan gluestack-ui v3 di React Native

## 1. Apa itu UI (User Interface)?

**User Interface (Antarmuka Pengguna)** adalah segala sesuatu yang dilihat dan berinteraksi secara visual oleh pengguna di dalam aplikasi Anda. Di React Native, UI dibangun dari elemen-elemen dasar (Core Components) seperti `<View>` untuk tata letak, `<Text>` untuk teks, dan `<TextInput>` untuk formulir.

Membangun UI dari nol menggunakan komponen dasar sangat memakan banyak waktu. Anda harus memikirkan desain (styling), aksesibilitas, animasi, hingga status interaktif (seperti tombol ditekan, hover, dll) secara manual.

Di sinilah **Library Komponen UI** masuk. Library UI menyediakan sekumpulan blok bangunan siap pakai (seperti Tombol, Kartu, Modal) sehingga *developer* bisa membangun aplikasi lebih cepat.

---

## 2. Apa itu gluestack-ui v3?

**gluestack-ui v3** adalah rilis mayor terbaru dari pustaka komponen UI *universal* (bisa untuk Web, iOS, dan Android). Ini merupakan evolusi modern dari kreator NativeBase.

**Perubahan Terbesar di Versi 3:**
Jika versi sebelumnya menggunakan sistem *styling* bawaan, **gluestack-ui v3 telah beralih sepenuhnya menggunakan Tailwind CSS** (berkat dukungan **NativeWind**). Selain itu, v3 mengadopsi model **"Copy-Paste" (Ownership Model)** yang dipopulerkan oleh *shadcn/ui* di ekosistem web.

Artinya, komponen gluestack tidak lagi bersembunyi di dalam folder `node_modules`. Saat Anda menginstal tombol, kode asli tombol tersebut akan disalin ke dalam *folder* proyek Anda, sehingga Anda memiliki kendali 100% untuk mengubah gayanya sesuai kebutuhan!

---

## 3. Fitur Utama dan Kelebihan gluestack-ui v3

1. **Terintegrasi dengan Tailwind CSS (NativeWind):**
   Anda tidak perlu lagi belajar *style props* khusus. Anda bisa menggunakan *utility classes* standar dari Tailwind CSS seperti `className="bg-red-500 p-4 rounded-md"` langsung di dalam komponen React Native.
2. **Component Ownership (Sistem Copy-Paste):**
   Gunakan CLI untuk menambahkan komponen yang hanya Anda butuhkan (misal: `npx gluestack-ui add button`). Ini membuat aplikasi Anda tidak bengkak karena *library* yang tidak terpakai, dan Anda bebas merombak kode *source* komponen tersebut.
3. **Aksesibilitas Tinggi (Built-in Accessibility):**
   Setiap komponen tetap mempertahankan standar w3c (WAI-ARIA), navigasi *keyboard*, dan dukungan *screen reader* kelas atas yang selama ini menjadi keunggulan gluestack.
4. **Performa Luar Biasa (Lebih Ringan):**
   Berkat arsitektur baru berbasis Tailwind CSS dan tidak adanya keharusan membungkus seluruh aplikasi dengan *Provider* raksasa, waktu *render* komponen menjadi sangat cepat dibandingkan versi-versi sebelumnya.

---

## 4. Konsep dan Contoh Penggunaan di v3

Di v3, alur kerjanya menjadi seperti ini:

### Langkah 1: Instalasi via CLI
Anda menginisialisasi proyek dan menambahkan komponen spesifik menggunakan Terminal:
```bash
npx gluestack-ui init
npx gluestack-ui add button
npx gluestack-ui add text
```
*Perintah di atas akan membuat folder `components/ui/` di dalam proyek Anda yang berisi kode mentah dari Button dan Text.*

### Langkah 2: Menggunakan Komponen dengan Tailwind
Di dalam file komponen Anda (misal `App.js`), Anda mengimpor komponen tersebut dari direktori lokal proyek Anda, dan menggunakan `className` (Tailwind) untuk menyesuaikan *styling*:

```jsx
import React from 'react';
import { View } from 'react-native';
// Komponen di-import dari folder lokal proyek kita (bukan dari node_modules!)
import { Button, ButtonText } from './components/ui/button';
import { Text } from './components/ui/text';

export default function App() {
  return (
    // Menggunakan kelas Tailwind untuk styling layout utama
    <View className="flex-1 justify-center items-center bg-slate-50 p-6">
      
      {/* Teks dengan kelas Tailwind (text-slate-900, text-xl, font-bold) */}
      <Text className="text-slate-900 text-xl font-bold mb-4">
        Halo dari gluestack-ui v3!
      </Text>

      {/* Tombol yang bisa dikustomisasi className-nya */}
      <Button size="md" variant="solid" className="bg-blue-600 rounded-full px-6">
        <ButtonText className="text-white font-semibold">
          Klik Saya
        </ButtonText>
      </Button>
      
    </View>
  );
}
```

### Mengapa memilih gluestack-ui v3?
Jika Anda menyukai **Tailwind CSS**, menginginkan **kontrol penuh atas komponen** tanpa terkunci oleh *library* pihak ketiga (pendekatan ala *shadcn/ui*), namun tetap membutuhkan jaminan **aksesibilitas dan kompatibilitas universal** (Web & Mobile), maka **gluestack-ui v3** adalah pilihan paling modern saat ini.
