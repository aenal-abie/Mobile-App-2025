# Panduan Integrasi: Mobile App + PHP Backend
## React Native Expo + Gluestack UI dengan PHP Native Backend

---

## 1. OVERVIEW INTEGRASI

Dokumen ini menjelaskan bagaimana aplikasi mobile **React Native Expo** berkomunikasi dengan backend **PHP Native** untuk fitur-fitur aplikasi Catatan Tugas Kuliah.

**Tech Stack Lengkap:**
- **Frontend (Mobile):** React Native + Expo + Gluestack UI + Zustand
- **Backend:** PHP Native + MySQL
- **Database:** MySQL
- **Authentication:** JWT (JSON Web Tokens)
- **API Format:** REST API dengan JSON

---

## 2. ARSITEKTUR APLIKASI

```
┌─────────────────────────────────────────────────────────────┐
│                    MOBILE APP (React Native)                │
│  (Login → Home → Task List → Add/Edit → Task Detail)        │
└──────────────────┬──────────────────────────────────────────┘
                   │
                   │ HTTP/REST API (JSON)
                   │ Authorization: Bearer Token
                   │
┌──────────────────▼──────────────────────────────────────────┐
│                  PHP BACKEND (Native)                        │
│  (Routing → Controllers → Models → Database)                │
└──────────────────┬──────────────────────────────────────────┘
                   │
                   │ SQL Queries
                   │
┌──────────────────▼──────────────────────────────────────────┐
│                    MySQL Database                           │
│  (pengguna, tugas tables)                                   │
└─────────────────────────────────────────────────────────────┘
```

---

## 3. FLOW APLIKASI LENGKAP

### A. Flow Login/Register

```
┌─────────────────────────────────┐
│  Mobile: Login/Register Screen  │
│  (Input: email, password, name) │
└────────────┬────────────────────┘
             │
             │ POST /api/aut/daftar atau /api/aut/masuk
             │ JSON: { email, kata_sandi, nama }
             │
┌────────────▼────────────────────┐
│  PHP Backend: Router             │
│  → AutController                 │
└────────────┬────────────────────┘
             │
             │ Validasi & Sanitasi
             │
┌────────────▼────────────────────┐
│  PHP Backend: Models             │
│  → Pengguna::cariByEmail()       │
│  → Pengguna::buat()              │
│  → Hash password (bcrypt)        │
└────────────┬────────────────────┘
             │
             │ Simpan ke Database
             │
┌────────────▼────────────────────┐
│  MySQL: INSERT pengguna          │
└────────────┬────────────────────┘
             │
             │ Generate JWT Token
             │
┌────────────▼────────────────────┐
│  PHP: JwtToken::buatToken()      │
│  Return: { token, pengguna }     │
└────────────┬────────────────────┘
             │
             │ Response: 200/201 + JSON
             │ { token, id, email, nama }
             │
┌────────────▼────────────────────┐
│  Mobile: Zustand Store           │
│  → Simpan token ke AsyncStorage  │
│  → Redirect ke Home Screen       │
└─────────────────────────────────┘
```

### B. Flow Lihat Daftar Tugas

```
┌─────────────────────────────────┐
│  Mobile: Home Screen             │
│  Trigger: useEffect (load)       │
└────────────┬────────────────────┘
             │
             │ GET /api/tugas
             │ Header: Authorization: Bearer {token}
             │
┌────────────▼────────────────────┐
│  PHP Backend: Router             │
│  → Middleware: Verify JWT        │
│  → Extract: idPengguna dari token│
└────────────┬────────────────────┘
             │
             │ Valid? Ya
             │
┌────────────▼────────────────────┐
│  PHP Backend: TugasController    │
│  → ambilSemuaTugas(idPengguna)   │
└────────────┬────────────────────┘
             │
             │ Tugas::cariByPengguna()
             │
┌────────────▼────────────────────┐
│  MySQL: SELECT tugas WHERE ...   │
│  Ambil semua tugas milik user    │
└────────────┬────────────────────┘
             │
             │ Return array of tasks
             │
┌────────────▼────────────────────┐
│  PHP: Response::sukses()         │
│  { tugas: [...] }                │
└────────────┬────────────────────┘
             │
             │ Response: 200 + JSON
             │
┌────────────▼────────────────────┐
│  Mobile: Update Zustand Store    │
│  → gunakkanStoreTugas.setTugas() │
│  → Re-render task list component │
└─────────────────────────────────┘
```

### C. Flow Tambah Tugas Baru

```
┌─────────────────────────────────┐
│  Mobile: Add Task Screen         │
│  (Form dengan inputs)            │
│  Fields:                         │
│  - judul                         │
│  - deskripsi                     │
│  - mata_kuliah                   │
│  - prioritas                     │
│  - tgl_deadline                  │
└────────────┬────────────────────┘
             │
             │ Submit form
             │
┌────────────▼────────────────────┐
│  Mobile: Validation (client-side)│
│  → validateForm()                │
│  → Check empty fields            │
│  → Check deadline > now          │
└────────────┬────────────────────┘
             │
             │ Valid? Yes
             │
┌────────────▼────────────────────┐
│  POST /api/tugas                 │
│  Header: Authorization: Bearer   │
│  Body JSON:                      │
│  {                               │
│    "judul": "Tugas Fisika",      │
│    "deskripsi": "...",           │
│    "mata_kuliah": "Fisika",      │
│    "prioritas": "TINGGI",        │
│    "tgl_deadline": "2026-05-20"  │
│  }                               │
└────────────┬────────────────────┘
             │
┌────────────▼────────────────────┐
│  PHP: Verify token               │
│  → Extract idPengguna            │
└────────────┬────────────────────┘
             │
┌────────────▼────────────────────┐
│  PHP: TugasController            │
│  → buatTugas(idPengguna, data)   │
│  → Validasi input                │
│  → Sanitasi data                 │
└────────────┬────────────────────┘
             │
┌────────────▼────────────────────┐
│  Tugas::buat(data)               │
│  → INSERT ke database            │
└────────────┬────────────────────┘
             │
┌────────────▼────────────────────┐
│  MySQL: INSERT tugas             │
│  VALUES (NULL, id_pengguna, ...) │
└────────────┬────────────────────┘
             │
┌────────────▼────────────────────┐
│  PHP: Response::sukses()         │
│  { id, judul, status: "created" }│
└────────────┬────────────────────┘
             │
┌────────────▼────────────────────┐
│  Mobile: Handle response         │
│  → gunakkanStoreTugas.buatTugas()│
│  → Add to task list              │
│  → Show success toast            │
│  → Navigate back to Home         │
└─────────────────────────────────┘
```

---

## 4. API ENDPOINTS & MOBILE INTEGRATION

### 4.1 Authentication Endpoints

#### **REGISTER (Daftar)**

**Endpoint:** `POST /api/aut/daftar`

**Mobile Component (RegisterScreen.js):**
```javascript
import axios from 'axios';
import { gunakkanStoreAut } from '../store/authStore';

const RegisterScreen = () => {
  const { daftar } = gunakkanStoreAut();
  
  const handleDaftar = async (email, nama, kataSandi) => {
    try {
      // Call store action
      await daftar(email, kataSandi, nama);
      // Navigation ke Home
    } catch (error) {
      // Handle error
    }
  };
};
```

**Backend (AutController.php):**
```php
public function daftar($data) {
  // Validasi input
  // Hash password
  // Create user in database
  // Generate JWT token
  // Response success dengan token
}
```

**Request JSON:**
```json
{
  "email": "user@example.com",
  "nama": "Nama User",
  "kata_sandi": "password123"
}
```

**Response (Success - 201):**
```json
{
  "sukses": true,
  "pesan": "Pendaftaran berhasil",
  "data": {
    "id": 1,
    "email": "user@example.com",
    "nama": "Nama User",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Response (Error - 409):**
```json
{
  "sukses": false,
  "pesan": "Email sudah terdaftar",
  "errors": {}
}
```

---

#### **LOGIN (Masuk)**

**Endpoint:** `POST /api/aut/masuk`

**Mobile Save Token:**
```javascript
import AsyncStorage from '@react-native-async-storage/async-storage';

// Di AuthStore (Zustand)
const masuk = async (email, kataSandi) => {
  const response = await api.post('/aut/masuk', { email, kata_sandi: kataSandi });
  
  // Simpan token
  await AsyncStorage.setItem('token', response.data.data.token);
  
  // Set ke store
  set({ 
    pengguna: response.data.data,
    token: response.data.data.token 
  });
};
```

**Request JSON:**
```json
{
  "email": "user@example.com",
  "kata_sandi": "password123"
}
```

**Response (Success - 200):**
```json
{
  "sukses": true,
  "pesan": "Login berhasil",
  "data": {
    "id": 1,
    "email": "user@example.com",
    "nama": "Nama User",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

---

#### **GET PROFILE (Ambil Profil)**

**Endpoint:** `GET /api/aut/profil`

**Mobile Implementation:**
```javascript
const ambilProfil = async (token) => {
  const response = await api.get('/aut/profil', {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  
  return response.data.data;
};
```

**Request Header:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Response (Success - 200):**
```json
{
  "sukses": true,
  "pesan": "Profil pengguna berhasil diambil",
  "data": {
    "id": 1,
    "email": "user@example.com",
    "nama": "Nama User",
    "dibuat": "2026-05-17T10:00:00Z"
  }
}
```

---

### 4.2 Task Management Endpoints

#### **GET ALL TASKS (Ambil Semua Tugas)**

**Endpoint:** `GET /api/tugas`

**Mobile (HomeScreen.js):**
```javascript
import { gunakkanStoreTugas } from '../store/taskStore';

const HomeScreen = () => {
  const { tugas, ambilTugas } = gunakkanStoreTugas();
  
  useEffect(() => {
    ambilTugas(); // Call backend
  }, []);
  
  return (
    <FlatList
      data={tugas}
      renderItem={({ item }) => <TaskCard tugas={item} />}
    />
  );
};
```

**Backend Processing:**
1. Router dapat request GET /api/tugas
2. Middleware verify JWT token
3. Extract idPengguna dari token
4. TugasController::ambilSemuaTugas(idPengguna)
5. Query: SELECT * FROM tugas WHERE id_pengguna = idPengguna
6. Return JSON array

**Response (Success - 200):**
```json
{
  "sukses": true,
  "pesan": "Tugas berhasil diambil",
  "data": [
    {
      "id": 1,
      "id_pengguna": 1,
      "judul": "Tugas Fisika",
      "deskripsi": "Hitung momentum benda",
      "mata_kuliah": "Fisika Dasar",
      "prioritas": "TINGGI",
      "tgl_deadline": "2026-05-20T23:59:59Z",
      "status": "MENUNGGU",
      "sudah_selesai": false,
      "tgl_selesai": null,
      "dibuat": "2026-05-17T10:00:00Z",
      "diperbarui": "2026-05-17T10:00:00Z"
    },
    {
      "id": 2,
      "id_pengguna": 1,
      "judul": "Presentasi Sejarah",
      "deskripsi": "Tentang Proklamasi Kemerdekaan",
      "mata_kuliah": "Sejarah Indonesia",
      "prioritas": "SEDANG",
      "tgl_deadline": "2026-05-22T23:59:59Z",
      "status": "SEDANG_DIKERJAKAN",
      "sudah_selesai": false,
      "tgl_selesai": null,
      "dibuat": "2026-05-17T10:15:00Z",
      "diperbarui": "2026-05-17T10:15:00Z"
    }
  ]
}
```

---

#### **CREATE TASK (Buat Tugas Baru)**

**Endpoint:** `POST /api/tugas`

**Mobile (AddTaskScreen.js):**
```javascript
const handleBuatTugas = async (formData) => {
  try {
    const response = await api.post('/tugas', {
      judul: formData.judul,
      deskripsi: formData.deskripsi,
      mata_kuliah: formData.mataKuliah,
      prioritas: formData.prioritas, // 'TINGGI' | 'SEDANG' | 'RENDAH'
      tgl_deadline: formData.deadline // ISO format: 2026-05-20T23:59:59Z
    }, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    // Update store
    gunakkanStoreTugas.buatTugas(response.data.data);
    
    // Navigate back
    navigation.goBack();
  } catch (error) {
    // Handle error
  }
};
```

**Request JSON:**
```json
{
  "judul": "Tugas Fisika",
  "deskripsi": "Hitung momentum benda dengan massa 5kg dan kecepatan 10m/s",
  "mata_kuliah": "Fisika Dasar",
  "prioritas": "TINGGI",
  "tgl_deadline": "2026-05-20T23:59:59Z"
}
```

**Response (Success - 201):**
```json
{
  "sukses": true,
  "pesan": "Tugas berhasil dibuat",
  "data": {
    "id": 3,
    "id_pengguna": 1,
    "judul": "Tugas Fisika",
    "deskripsi": "Hitung momentum benda dengan massa 5kg dan kecepatan 10m/s",
    "mata_kuliah": "Fisika Dasar",
    "prioritas": "TINGGI",
    "tgl_deadline": "2026-05-20T23:59:59Z",
    "status": "MENUNGGU",
    "sudah_selesai": false,
    "tgl_selesai": null,
    "dibuat": "2026-05-17T10:30:00Z",
    "diperbarui": "2026-05-17T10:30:00Z"
  }
}
```

---

#### **UPDATE TASK (Perbarui Tugas)**

**Endpoint:** `PUT /api/tugas/:id`

**Mobile (EditTaskScreen.js):**
```javascript
const handlePerbarui = async (idTugas, formData) => {
  const response = await api.put(`/tugas/${idTugas}`, {
    judul: formData.judul,
    deskripsi: formData.deskripsi,
    mata_kuliah: formData.mataKuliah,
    prioritas: formData.prioritas,
    tgl_deadline: formData.deadline,
    status: formData.status // 'MENUNGGU' | 'SEDANG_DIKERJAKAN' | 'SELESAI'
  }, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  
  gunakkanStoreTugas.perbaruiTugas(idTugas, response.data.data);
};
```

**Request Path:** `/api/tugas/3`

**Request JSON:**
```json
{
  "judul": "Tugas Fisika (Revisi)",
  "deskripsi": "Hitung momentum benda...",
  "mata_kuliah": "Fisika Dasar",
  "prioritas": "SEDANG",
  "tgl_deadline": "2026-05-22T23:59:59Z",
  "status": "SEDANG_DIKERJAKAN"
}
```

**Response (Success - 200):**
```json
{
  "sukses": true,
  "pesan": "Tugas berhasil diperbarui",
  "data": {
    "id": 3,
    "id_pengguna": 1,
    "judul": "Tugas Fisika (Revisi)",
    "status": "SEDANG_DIKERJAKAN",
    ...
  }
}
```

---

#### **MARK COMPLETE (Tandai Selesai)**

**Endpoint:** `PATCH /api/tugas/:id/selesai`

**Mobile (TaskCard.js):**
```javascript
const handleTandaiSelesai = async (idTugas) => {
  const response = await api.patch(`/tugas/${idTugas}/selesai`, {}, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  
  // Update task di store
  gunakkanStoreTugas.tandaiSelesai(idTugas);
};
```

**Request Path:** `/api/tugas/3/selesai`

**Request Body:** {} (kosong atau minimal)

**Response (Success - 200):**
```json
{
  "sukses": true,
  "pesan": "Tugas berhasil ditandai selesai",
  "data": {
    "id": 3,
    "id_pengguna": 1,
    "judul": "Tugas Fisika",
    "status": "SELESAI",
    "sudah_selesai": true,
    "tgl_selesai": "2026-05-19T14:30:00Z",
    ...
  }
}
```

---

#### **DELETE TASK (Hapus Tugas)**

**Endpoint:** `DELETE /api/tugas/:id`

**Mobile (TaskCard.js):**
```javascript
const handleHapus = async (idTugas) => {
  Alert.alert('Hapus Tugas', 'Yakin ingin menghapus?', [
    {
      text: 'Batal',
      onPress: () => {}
    },
    {
      text: 'Hapus',
      onPress: async () => {
        await api.delete(`/tugas/${idTugas}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        gunakkanStoreTugas.hapusTugas(idTugas);
      }
    }
  ]);
};
```

**Request Path:** `/api/tugas/3`

**Response (Success - 200):**
```json
{
  "sukses": true,
  "pesan": "Tugas berhasil dihapus",
  "data": null
}
```

---

## 5. SERVICE LAYER (MOBILE)

### src/services/api.js
```javascript
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Base configuration
const API_URL = 'http://localhost:8000'; // atau IP address backend

const instance = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor untuk tambah token
instance.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor untuk handle errors
instance.interceptors.response.use(
  (response) => response,
  async (error) => {
    // Handle 401 (token expired)
    if (error.response?.status === 401) {
      await AsyncStorage.removeItem('token');
      // Redirect to login
    }
    return Promise.reject(error);
  }
);

export default instance;
```

### src/services/auth.js
```javascript
import api from './api';

export const apiAut = {
  // Daftar
  daftar: (email, nama, kataSandi) =>
    api.post('/aut/daftar', {
      email,
      nama,
      kata_sandi: kataSandi
    }),

  // Masuk
  masuk: (email, kataSandi) =>
    api.post('/aut/masuk', {
      email,
      kata_sandi: kataSandi
    }),

  // Ambil profil
  ambilProfil: () =>
    api.get('/aut/profil'),

  // Perbarui profil
  perbaruiProfil: (nama) =>
    api.put('/aut/profil', { nama })
};
```

### src/services/tasks.js
```javascript
import api from './api';

export const apiTugas = {
  // Ambil semua tugas
  ambilSemuaTugas: () =>
    api.get('/tugas'),

  // Ambil detail tugas
  ambilTugaById: (id) =>
    api.get(`/tugas/${id}`),

  // Buat tugas baru
  buatTugas: (dataTugas) =>
    api.post('/tugas', dataTugas),

  // Perbarui tugas
  perbaruiTugas: (id, dataTugas) =>
    api.put(`/tugas/${id}`, dataTugas),

  // Hapus tugas
  hapusTugas: (id) =>
    api.delete(`/tugas/${id}`),

  // Tandai selesai
  tandaiSelesai: (id) =>
    api.patch(`/tugas/${id}/selesai`, {})
};
```

---

## 6. ZUSTAND STORE (MOBILE)

### src/store/authStore.js
```javascript
import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { apiAut } from '../services/auth';

export const gunakkanStoreAut = create((set) => ({
  pengguna: null,
  token: null,
  sedangMemuat: false,
  error: null,

  // Inisialisasi dari AsyncStorage
  inisialisasiAuth: async () => {
    try {
      set({ sedangMemuat: true });
      const token = await AsyncStorage.getItem('token');
      const penggunaStr = await AsyncStorage.getItem('pengguna');
      
      if (token && penggunaStr) {
        const pengguna = JSON.parse(penggunaStr);
        set({ token, pengguna });
      }
    } finally {
      set({ sedangMemuat: false });
    }
  },

  // Daftar
  daftar: async (email, nama, kataSandi) => {
    try {
      set({ sedangMemuat: true, error: null });
      const response = await apiAut.daftar(email, nama, kataSandi);
      const { token, ...pengguna } = response.data.data;
      
      // Simpan ke AsyncStorage
      await AsyncStorage.setItem('token', token);
      await AsyncStorage.setItem('pengguna', JSON.stringify(pengguna));
      
      set({ token, pengguna });
    } catch (error) {
      set({ error: error.response?.data?.pesan || 'Error daftar' });
      throw error;
    } finally {
      set({ sedangMemuat: false });
    }
  },

  // Masuk
  masuk: async (email, kataSandi) => {
    try {
      set({ sedangMemuat: true, error: null });
      const response = await apiAut.masuk(email, kataSandi);
      const { token, ...pengguna } = response.data.data;
      
      await AsyncStorage.setItem('token', token);
      await AsyncStorage.setItem('pengguna', JSON.stringify(pengguna));
      
      set({ token, pengguna });
    } catch (error) {
      set({ error: error.response?.data?.pesan || 'Error login' });
      throw error;
    } finally {
      set({ sedangMemuat: false });
    }
  },

  // Keluar
  keluar: async () => {
    await AsyncStorage.removeItem('token');
    await AsyncStorage.removeItem('pengguna');
    set({ pengguna: null, token: null });
  },

  // Update profil
  perbaruiProfil: async (nama) => {
    try {
      set({ sedangMemuat: true });
      const response = await apiAut.perbaruiProfil(nama);
      const pengguna = response.data.data;
      
      await AsyncStorage.setItem('pengguna', JSON.stringify(pengguna));
      set({ pengguna });
    } catch (error) {
      set({ error: error.response?.data?.pesan });
      throw error;
    } finally {
      set({ sedangMemuat: false });
    }
  }
}));
```

### src/store/taskStore.js
```javascript
import { create } from 'zustand';
import { apiTugas } from '../services/tasks';

export const gunakkanStoreTugas = create((set) => ({
  tugas: [],
  sedangMemuat: false,
  error: null,
  filter: 'SEMUA', // SEMUA | MENUNGGU | SEDANG_DIKERJAKAN | SELESAI
  sort: 'deadline', // deadline | prioritas | terbaru

  // Ambil semua tugas
  ambilTugas: async () => {
    try {
      set({ sedangMemuat: true, error: null });
      const response = await apiTugas.ambilSemuaTugas();
      set({ tugas: response.data.data });
    } catch (error) {
      set({ error: error.response?.data?.pesan || 'Error ambil tugas' });
    } finally {
      set({ sedangMemuat: false });
    }
  },

  // Buat tugas baru
  buatTugas: async (dataTugas) => {
    try {
      set({ sedangMemuat: true });
      const response = await apiTugas.buatTugas(dataTugas);
      
      set((state) => ({
        tugas: [...state.tugas, response.data.data]
      }));
    } catch (error) {
      set({ error: error.response?.data?.pesan });
      throw error;
    } finally {
      set({ sedangMemuat: false });
    }
  },

  // Perbarui tugas
  perbaruiTugas: async (id, dataTugas) => {
    try {
      set({ sedangMemuat: true });
      const response = await apiTugas.perbaruiTugas(id, dataTugas);
      
      set((state) => ({
        tugas: state.tugas.map((t) => t.id === id ? response.data.data : t)
      }));
    } catch (error) {
      set({ error: error.response?.data?.pesan });
      throw error;
    } finally {
      set({ sedangMemuat: false });
    }
  },

  // Hapus tugas
  hapusTugas: async (id) => {
    try {
      await apiTugas.hapusTugas(id);
      
      set((state) => ({
        tugas: state.tugas.filter((t) => t.id !== id)
      }));
    } catch (error) {
      set({ error: error.response?.data?.pesan });
      throw error;
    }
  },

  // Tandai selesai
  tandaiSelesai: async (id) => {
    try {
      const response = await apiTugas.tandaiSelesai(id);
      
      set((state) => ({
        tugas: state.tugas.map((t) => t.id === id ? response.data.data : t)
      }));
    } catch (error) {
      set({ error: error.response?.data?.pesan });
    }
  },

  // Set filter
  setFilter: (filter) => set({ filter }),

  // Get filtered tasks
  getTugasFiltered: () => {
    return ((state) => {
      let filtered = state.tugas;
      
      if (state.filter !== 'SEMUA') {
        filtered = filtered.filter((t) => t.status === state.filter);
      }
      
      // Sort
      if (state.sort === 'deadline') {
        filtered.sort((a, b) => new Date(a.tgl_deadline) - new Date(b.tgl_deadline));
      } else if (state.sort === 'prioritas') {
        const prioritasOrder = { TINGGI: 0, SEDANG: 1, RENDAH: 2 };
        filtered.sort((a, b) => prioritasOrder[a.prioritas] - prioritasOrder[b.prioritas]);
      }
      
      return filtered;
    });
  }
}));
```

---

## 7. ENVIRONMENT CONFIGURATION

### Mobile (.env atau constants.js)
```javascript
// src/config/constants.js
export const API_CONFIG = {
  BASE_URL: 'http://localhost:8000', // Ubah IP sesuai backend
  TIMEOUT: 10000,
  RETRY_ATTEMPTS: 3
};

export const APP_CONFIG = {
  APP_NAME: 'Catatan Tugas Kuliah',
  VERSION: '1.0.0',
  DEBUG: true
};

export const PRIORITAS_OPTIONS = [
  { label: 'Tinggi', value: 'TINGGI' },
  { label: 'Sedang', value: 'SEDANG' },
  { label: 'Rendah', value: 'RENDAH' }
];

export const STATUS_OPTIONS = [
  { label: 'Menunggu', value: 'MENUNGGU' },
  { label: 'Sedang Dikerjakan', value: 'SEDANG_DIKERJAKAN' },
  { label: 'Selesai', value: 'SELESAI' }
];
```

### Backend (.env untuk PHP)
```
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=catatan_tugas_db
DB_PORT=3306

JWT_SECRET=rahasia_jwt_mu_sangat_aman_2026
JWT_ALGORITHM=HS256

APP_ENV=development
APP_DEBUG=true
API_URL=http://localhost/backend-php/public

# CORS untuk mobile app
CORS_ALLOWED_ORIGINS=http://localhost:19000,http://localhost:8081,http://192.168.1.X:19000
```

---

## 8. FLOW STATES & COMPONENTS (DETAILED)

### Home Screen Flow

```
HomeScreen
  ├─ useEffect
  │   └─ ambilTugas() [Store]
  │       └─ GET /api/tugas [Backend]
  │           └─ Return array tugas
  │
  ├─ sedangMemuat? 
  │   ├─ Ya → Loading Spinner
  │   └─ Tidak → Continue
  │
  ├─ Filter Section
  │   ├─ SEMUA
  │   ├─ MENUNGGU
  │   ├─ SEDANG_DIKERJAKAN
  │   └─ SELESAI
  │
  ├─ FlatList
  │   ├─ Map setiap tugas
  │   └─ Render TaskCard component
  │
  ├─ FAB (Tombol Tambah)
  │   └─ Navigate ke AddTaskScreen
  │
  └─ Pull to Refresh
      └─ Panggil ambilTugas() lagi
```

### TaskCard Component

```javascript
const TaskCard = ({ tugas, onPress, onComplete, onDelete }) => {
  return (
    <Card
      onPress={() => onPress(tugas.id)}
      style={styles.card}
    >
      <HStack space="md">
        <CheckBox
          value={tugas.sudah_selesai}
          onChange={() => onComplete(tugas.id)}
        />
        <VStack flex={1}>
          <Heading size="md">{tugas.judul}</Heading>
          <Text size="sm" color="gray">{tugas.mata_kuliah}</Text>
          <HStack>
            <Badge color={getPriorityColor(tugas.prioritas)}>
              {tugas.prioritas}
            </Badge>
            <Badge>{tugas.status}</Badge>
          </HStack>
          <Text size="xs" color="gray">
            Deadline: {formatDate(tugas.tgl_deadline)}
          </Text>
        </VStack>
        <Pressable onPress={() => onDelete(tugas.id)}>
          <Icon as={CloseIcon} color="red" />
        </Pressable>
      </HStack>
    </Card>
  );
};
```

---

## 9. ERROR HANDLING & RESPONSES

### Standardized Error Responses

**Format Error dari Backend (PHP):**
```json
{
  "sukses": false,
  "pesan": "Pesan error yang user-friendly",
  "errors": {
    "email": "Format email tidak valid",
    "kata_sandi": "Password minimal 6 karakter"
  }
}
```

**Mobile Handling:**
```javascript
const handleError = (error) => {
  if (error.response?.status === 401) {
    // Unauthorized - Token invalid
    gunakkanStoreAut.keluar();
    navigation.navigate('Login');
  } else if (error.response?.status === 400) {
    // Bad request - Validation error
    const errors = error.response.data.errors;
    showValidationErrors(errors);
  } else if (error.response?.status === 500) {
    // Server error
    showAlert('Terjadi kesalahan server. Silakan coba lagi.');
  } else {
    // Network error
    showAlert('Tidak dapat terhubung ke server.');
  }
};
```

---

## 10. DATABASE RELATIONSHIP VISUALIZATION

```
┌─────────────────────────────┐
│        PENGGUNA             │
├─────────────────────────────┤
│ id (PK)                     │
│ email (UNIQUE)              │
│ kata_sandi                  │
│ nama                        │
│ dibuat                      │
│ diperbarui                  │
└────────────┬────────────────┘
             │
             │ 1:N
             │
┌────────────▼────────────────┐
│        TUGAS                │
├─────────────────────────────┤
│ id (PK)                     │
│ id_pengguna (FK)            │ ◄──┤
│ judul                       │
│ deskripsi                   │
│ mata_kuliah                 │
│ prioritas (ENUM)            │
│ tgl_deadline                │
│ status (ENUM)               │
│ sudah_selesai               │
│ tgl_selesai                 │
│ dibuat                      │
│ diperbarui                  │
└─────────────────────────────┘
```

---

## 11. TESTING ENDPOINTS (dengan cURL)

### Test Register
```bash
curl -X POST http://localhost:8000/api/aut/daftar \
  -H 'Content-Type: application/json' \
  -d '{
    "email": "user@test.com",
    "nama": "Test User",
    "kata_sandi": "password123"
  }'
```

### Test Login
```bash
curl -X POST http://localhost:8000/api/aut/masuk \
  -H 'Content-Type: application/json' \
  -d '{
    "email": "user@test.com",
    "kata_sandi": "password123"
  }'
```

### Test Get Tasks (dengan token)
```bash
curl -X GET http://localhost:8000/api/tugas \
  -H 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
```

### Test Create Task
```bash
curl -X POST http://localhost:8000/api/tugas \
  -H 'Content-Type: application/json' \
  -H 'Authorization: Bearer TOKEN_ANDA' \
  -d '{
    "judul": "Tugas Fisika",
    "deskripsi": "Hitung momentum",
    "mata_kuliah": "Fisika Dasar",
    "prioritas": "TINGGI",
    "tgl_deadline": "2026-05-20T23:59:59Z"
  }'
```

---

## 12. DEVELOPMENT TIMELINE

### Phase 1: Setup (1-2 minggu)
- [x] Buat struktur project mobile
- [x] Setup Expo & Gluestack
- [x] Buat struktur folder
- [x] Setup React Navigation
- [ ] Install dependencies

### Phase 2: Backend Foundation (1-2 minggu)
- [ ] Setup PHP project
- [ ] Setup database MySQL
- [ ] Create config files
- [ ] Setup routing & controllers

### Phase 3: Authentication (1-2 minggu)
- [ ] Implement PHP auth endpoints
- [ ] Mobile login/register screens
- [ ] JWT token handling
- [ ] AsyncStorage integration

### Phase 4: Task CRUD (2-3 minggu)
- [ ] PHP task endpoints
- [ ] Mobile task list
- [ ] Add/edit task screens
- [ ] Delete & complete functionality

### Phase 5: Integration & Testing (1-2 minggu)
- [ ] End-to-end testing
- [ ] Fix bugs & issues
- [ ] Performance optimization

### Phase 6: Deployment (1 minggu)
- [ ] Production build
- [ ] Deploy backend
- [ ] Final testing

**Total:** 8-12 minggu (Full-time)

---

## 13. QUICK START GUIDE

### Backend Setup
```bash
# 1. Clone atau setup folder
mkdir backend-php
cd backend-php

# 2. Install composer dependencies
composer install

# 3. Setup .env
cp .env.example .env
# Edit .env dengan DB config

# 4. Create database
mysql -u root -p < migrations.sql

# 5. Run server
cd public
php -S localhost:8000
```

### Mobile Setup
```bash
# 1. Create Expo project
npx create-expo-app MobileApp

# 2. Install dependencies
cd MobileApp
npm install @react-navigation/native @react-navigation/stack
npm install gluestack-ui zustand axios async-storage

# 3. Update constants
# Edit src/config/constants.js dengan IP backend

# 4. Run mobile app
npx expo start
```

---

## 14. CHECKLIST INTEGRASI

### Backend
- [ ] Database created & tables created
- [ ] JWT token working
- [ ] Auth endpoints tested (register/login)
- [ ] Task endpoints tested (CRUD)
- [ ] CORS configured correctly
- [ ] Error handling implemented
- [ ] Validation working

### Mobile
- [ ] API service configured
- [ ] Auth store created
- [ ] Task store created
- [ ] Login/register screens working
- [ ] Home screen displays tasks
- [ ] Add/edit task screens working
- [ ] Token saved to AsyncStorage
- [ ] Error messages displayed correctly

### Integration
- [ ] Mobile connects to backend
- [ ] Login works end-to-end
- [ ] Tasks appear in home screen
- [ ] Add task works
- [ ] Edit task works
- [ ] Delete task works
- [ ] Complete task toggle works
- [ ] Logout works & clears token

---

## 15. COMMON ISSUES & SOLUTIONS

### Mobile cannot connect to backend
```
Issue: getaddrinfo ENOTFOUND localhost
Solution: Use backend IP instead of localhost
         Update src/config/constants.js
         API_URL = 'http://192.168.x.x:8000'
```

### CORS Error
```
Solution: Check .env di backend
          Ensure CORS_ALLOWED_ORIGINS includes mobile app URL
          eg: http://192.168.1.x:19000
```

### Token expired on mobile
```
Solution: Implement token refresh
          Or set longer expiration time (default 24 jam)
          Handle 401 with auto-logout
```

### Database connection failed
```
Solution: Check .env settings
         Ensure MySQL running
         Verify DB_HOST, DB_USER, DB_PASSWORD
```

---

**Documentation Version:** 1.0  
**Last Updated:** May 17, 2026  
**Status:** Ready for Implementation
