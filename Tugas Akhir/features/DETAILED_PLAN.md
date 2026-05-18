# Rencana Detail: Aplikasi Catatan Tugas Kuliah
## React Native Expo + Gluestack UI

---

## 1. OVERVIEW PROYEK

**Nama Aplikasi:** Catatan Tugas Kuliah  
**Tech Stack:**
- Frontend: React Native + Expo
- UI Framework: Gluestack UI
- Navigation: React Navigation
- State Management: Zustand
- Backend: Node.js + Express
- Database: MySQL
- Authentication: JWT

**Platform Target:** iOS & Android  
**Naming Convention:** Semua variabel, property, interface, function names, dan comments menggunakan **Bahasa Indonesia**

---

## 2. FITUR UTAMA

### A. Authentication (Login/Register)
- **Login**
  - Email & password
  - Form validation
  - Error handling
  - Remember me option (optional)
  
- **Register**
  - Email validation
  - Password strength checker
  - Confirm password
  - Accept terms & conditions
  - Email verification (optional)

### B. Manajemen Tugas
- **Tambah Tugas**
  - Input judul tugas
  - Deskripsi detail
  - Pilih mata kuliah
  - Set deadline
  - Priority level (Tinggi/Sedang/Rendah)
  - Attachment/file (optional)

- **Lihat Daftar Tugas**
  - List semua tugas
  - Filter berdasarkan status (Belum/Sedang/Selesai)
  - Filter berdasarkan deadline
  - Sort by deadline atau priority
  - Pull to refresh

- **Edit Tugas**
  - Ubah semua field tugas
  - Update status
  - Change deadline
  
- **Hapus Tugas**
  - Soft delete atau hard delete
  - Confirmation dialog sebelum delete

- **Checklist Selesai**
  - Mark as complete/incomplete
  - Timestamp selesai
  - Visual feedback (strikethrough/badge)

---

## 3. STRUKTUR PROJECT

```
MobileApp/
├── app.json
├── app.js
├── eas.json
├── package.json
├── .babelrc
│
├── src/
│   ├── screens/
│   │   ├── Auth/
│   │   │   ├── LoginScreen.js
│   │   │   ├── RegisterScreen.js
│   │   │   └── SplashScreen.js
│   │   │
│   │   ├── Main/
│   │   │   ├── HomeScreen.js
│   │   │   ├── AddTaskScreen.js
│   │   │   ├── EditTaskScreen.js
│   │   │   └── TaskDetailScreen.js
│   │   │
│   │   └── Profile/
│   │       └── ProfileScreen.js
│   │
│   ├── components/
│   │   ├── TaskCard.js
│   │   ├── TaskForm.js
│   │   ├── Button.js
│   │   ├── Input.js
│   │   └── Header.js
│   │
   ├── store/
   │   ├── authStore.js
   │   ├── taskStore.js
   │   └── index.js
│   │
│   ├── services/
│   │   ├── api.js
│   │   ├── auth.js
│   │   ├── tasks.js
│   │   └── storage.js
│   │
│   ├── config/
│   │   └── constants.js
│   │
│   ├── utils/
│   │   ├── validation.js
│   │   └── formatting.js
│   │
│   ├── navigation/
│   │   └── RootNavigator.js
│   │
│   └── styles/
│       └── theme.js
│
└── assets/
    ├── images/
    └── fonts/
```

---

## 4. DATABASE SCHEMA

### Pengguna Table
```sql
CREATE TABLE pengguna (
  id INT PRIMARY KEY AUTO_INCREMENT,
  email VARCHAR(255) UNIQUE NOT NULL,
  kata_sandi VARCHAR(255) NOT NULL,
  nama VARCHAR(255) NOT NULL,
  dibuat TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  diperbarui TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

### Tugas Table
```sql
CREATE TABLE tugas (
  id INT PRIMARY KEY AUTO_INCREMENT,
  id_pengguna INT NOT NULL,
  judul VARCHAR(255) NOT NULL,
  deskripsi TEXT,
  mata_kuliah VARCHAR(255),
  prioritas ENUM('TINGGI', 'SEDANG', 'RENDAH') DEFAULT 'SEDANG',
  tgl_deadline DATETIME,
  status ENUM('MENUNGGU', 'SEDANG_DIKERJAKAN', 'SELESAI') DEFAULT 'MENUNGGU',
  sudah_selesai BOOLEAN DEFAULT FALSE,
  tgl_selesai DATETIME NULL,
  dibuat TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  diperbarui TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (id_pengguna) REFERENCES pengguna(id) ON DELETE CASCADE,
  INDEX (id_pengguna),
  INDEX (tgl_deadline),
  INDEX (status)
);
```

---

## 5. API ENDPOINTS

### Authentication (Autentikasi)
- `POST /api/aut/daftar` - Daftar pengguna baru
- `POST /api/aut/masuk` - Login pengguna
- `POST /api/aut/keluar` - Logout pengguna
- `GET /api/aut/profil` - Ambil profil pengguna (terlindungi)
- `PUT /api/aut/profil` - Perbarui profil pengguna (terlindungi)

### Tugas (Tasks)
- `GET /api/tugas` - Ambil semua tugas pengguna (terlindungi)
- `GET /api/tugas/:id` - Ambil detail tugas (terlindungi)
- `POST /api/tugas` - Buat tugas baru (terlindungi)
- `PUT /api/tugas/:id` - Perbarui tugas (terlindungi)
- `DELETE /api/tugas/:id` - Hapus tugas (terlindungi)
- `PATCH /api/tugas/:id/selesai` - Tandai tugas sebagai selesai (terlindungi)

---

## 6. FLOW NAVIGASI

```
SplashScreen
    ↓
[Auth Check] 
    ├─→ NOT LOGGED IN → AuthStack
    │   ├─ LoginScreen
    │   └─ RegisterScreen
    │
    └─→ LOGGED IN → MainStack
        ├─ HomeScreen (Task List)
        │   ├─ EditTaskScreen
        │   └─ TaskDetailScreen
        ├─ AddTaskScreen
        └─ ProfileScreen
```

---

## 7. UI COMPONENTS (GLUESTACK)

### Screens yang Perlu Didesain:

#### **Login Screen**
- Email input
- Password input
- Login button
- Link ke Register
- Error message display

#### **Register Screen**
- Name input
- Email input
- Password input
- Confirm password input
- Register button
- Link ke Login

#### **Home Screen (Task List)**
- Header dengan app title
- Filter/Sort buttons
- Task list dengan TaskCard components
- FAB (Floating Action Button) untuk add task
- Empty state jika tidak ada tugas

#### **Add/Edit Task Screen**
- Title input
- Description textarea
- Course dropdown/select
- Priority selector (radio/dropdown)
- Deadline date picker
- Submit button
- Cancel button

#### **Task Detail Screen**
- Full task information
- Status badge
- Edit button
- Delete button
- Mark complete checkbox
- Timestamps

#### **Profile Screen**
- User info display
- Logout button
- Settings (optional)

---

## 8. STATE MANAGEMENT (Zustand)

### Auth Store
```javascript
import { create } from 'zustand';

export const gunakkanStoreAut = create((set) => ({
  pengguna: null,
  sedangMemuat: false,
  token: null,
  
  masuk: async (email, kata_sandi) => {
    set({ sedangMemuat: true });
    // Panggilan API di sini
    try {
      // Implementasi login
      set({ pengguna: { id: '1', email, nama: 'User' }, token: 'token' });
    } finally {
      set({ sedangMemuat: false });
    }
  },
  
  daftar: async (email, kata_sandi, nama) => {
    set({ sedangMemuat: true });
    try {
      // Implementasi register
      set({ pengguna: { id: '1', email, nama }, token: 'token' });
    } finally {
      set({ sedangMemuat: false });
    }
  },
  
  keluar: () => set({ pengguna: null, token: null }),
  
  setPengguna: (pengguna) => set({ pengguna }),
  
  setToken: (token) => set({ token }),
}));
```

### Task Store
```javascript
import { create } from 'zustand';

export const gunakkanStoreTugas = create((set) => ({
  tugas: [],
  sedangMemuat: false,
  
  ambilTugas: async () => {
    set({ sedangMemuat: true });
    try {
      // Panggilan API untuk mengambil tugas
      // const response = await api.get('/tugas');
      // set({ tugas: response.data });
    } finally {
      set({ sedangMemuat: false });
    }
  },
  
  buatTugas: async (dataTugas) => {
    // Panggilan API untuk membuat tugas baru
    // const response = await api.post('/tugas', dataTugas);
  },
  
  perbaruiTugas: async (id, dataTugas) => {
    // Panggilan API untuk memperbarui tugas
    // const response = await api.put(`/tugas/${id}`, dataTugas);
  },
  
  hapusTugas: async (id) => {
    // Panggilan API untuk menghapus tugas
    // await api.delete(`/tugas/${id}`);
  },
  
  tandaiSelesai: async (id) => {
    // Panggilan API untuk tandai tugas selesai
    // await api.patch(`/tugas/${id}/selesai`);
  },
  
  setTugas: (tugas) => set({ tugas }),
}));
```

---

## 9. TAHAPAN PENGEMBANGAN

### Phase 1: Setup & Basic Structure (1-2 minggu)
- [ ] Init Expo project dengan Gluestack
- [ ] Setup React Navigation
- [ ] Setup Zustand stores
- [ ] Create basic folder structure
- [ ] Setup ESLint & Prettier (JavaScript)

### Phase 2: Authentication (1 minggu)
- [ ] Create login/register UI
- [ ] Implement auth store (Zustand)
- [ ] Connect ke backend API
- [ ] Form validation
- [ ] Error handling

### Phase 3: Backend API (1-2 minggu)
- [ ] Setup Node.js + Express
- [ ] Setup database
- [ ] Create auth endpoints
- [ ] Create task CRUD endpoints
- [ ] Implement JWT authentication

### Phase 4: Task Management (2-3 minggu)
- [ ] Create home screen with task list
- [ ] Implement task CRUD
- [ ] Add filter/sort functionality
- [ ] Implement complete/incomplete toggle
- [ ] Add empty state handling

### Phase 5: Polish & Testing (1-2 minggu)
- [ ] UI refinement
- [ ] Error handling & loading states
- [ ] Unit testing
- [ ] Integration testing
- [ ] App testing di device

### Phase 6: Deployment (1 minggu)
- [ ] Build APK/IPA
- [ ] Deploy backend
- [ ] Submit ke app store (optional)

---

## 10. NAMING CONVENTION GUIDE

Semua kode akan menggunakan **Bahasa Indonesia** untuk variabel, function names, dan comments.

### Contoh Naming Convention:

**Variables & Functions**
```javascript
// Variable
let sedangMemuat = true;
let totalTugas = 10;
const ambilSemuaTugas = () => {};

// Constants
const JENIS_PRIORITAS = {
  TINGGI: 'TINGGI',
  SEDANG: 'SEDANG',
  RENDAH: 'RENDAH'
};

// JSDoc untuk dokumentasi
/**
 * Mengambil semua tugas milik pengguna
 * @param {string} idPengguna - ID dari pengguna
 * @returns {Promise<Array>} Promise berisi array tugas
 */
const ambilSemuaTugas = async (idPengguna) => {};
```

**Database Naming**
```
Tabel: pengguna, tugas (snake_case)
Kolom: id_pengguna, tgl_deadline, sudah_selesai
```

**Function Names**
```javascript
// Good
const ambilTugasPengguna = () => {};
const buatTugaBaru = (data) => {};
const tandaiSebagaiSelesai = (id) => {};
const hapusTugas = (id) => {};

// Hindari English
const getUserTasks = () => {}; // ❌
const getTasks = () => {}; // ❌
```

**Comments & Documentation**
```javascript
/**
 * Mengambil semua tugas milik pengguna yang sedang login
 * @param {string} idPengguna - ID dari pengguna
 * @returns {Promise<Array>} Promise berisi array tugas
 */
const ambilSemuaTugas = async (idPengguna) => {};

// Ini adalah variable untuk menyimpan status loading
let sedangMemuat = false;
```

---

## 11. TEKNOLOGI & DEPENDENCIES

### Frontend
```json
{
  "@react-navigation/native": "^6.x",
  "@react-navigation/stack": "^6.x",
  "@react-native-async-storage/async-storage": "^1.x",
  "axios": "^1.x",
  "gluestack-ui": "^1.x",
  "zustand": "^4.x",
  "react": "^18.x",
  "react-native": "^0.x"
}

Dev Dependencies:
```json
{
  "@react-native/babel-preset": "^0.x",
  "eslint": "^8.x",
  "eslint-config-airbnb": "^19.x",
  "prettier": "^2.x"
}
```

### Backend (Node.js)
```json
{
  "express": "^4.x",
  "mysql2": "^3.x",
  "sequelize": "^6.x",
  "jsonwebtoken": "^9.x",
  "bcryptjs": "^2.x",
  "dotenv": "^16.x",
  "cors": "^2.x",
  "joi": "^17.x"
}
```

---

## 12. BEST PRACTICES & PEMBELAJARAN

### Frontend
- ✅ State management dengan Zustand
- ✅ Form handling & validation
- ✅ API integration dengan Axios
- ✅ Navigation patterns di React Native
- ✅ Error handling & loading states
- ✅ Component composition
- ✅ Custom hooks (JavaScript)

### Backend
- ✅ REST API design
- ✅ Authentication & authorization (JWT)
- ✅ Password hashing (bcrypt)
- ✅ Database design
- ✅ Error handling
- ✅ Input validation

---

## 13. CHECKLIST IMPLEMENTASI

### Persiapan
- [ ] Install Node.js & npm/yarn
- [ ] Install Expo CLI
- [ ] Setup git repository
- [ ] Create backend repo

### Development
- [ ] Setup project structure
- [ ] Create all components
- [ ] Setup navigation
- [ ] Implement auth flow
- [ ] Build backend API
- [ ] Integrate frontend dengan backend
- [ ] Implement all task CRUD
- [ ] Add filters & sorting
- [ ] Add validation & error handling

### Testing & Polish
- [ ] Test di iOS device/emulator
- [ ] Test di Android device/emulator
- [ ] Fix bugs & issues
- [ ] Optimize performance
- [ ] Polish UI/UX

### Deployment
- [ ] Prepare production build
- [ ] Deploy backend
- [ ] Build APK/IPA
- [ ] Submit ke stores (jika diperlukan)

---

## 14. ESTIMATED TIMELINE

**Total Durasi:** 8-12 minggu  
**Full-time Development**

- Setup & Structure: 2 minggu
- Authentication: 1 minggu
- Backend API: 2 minggu
- Task Management: 3 minggu
- Testing & Polish: 2 minggu
- Deployment: 1 minggu

---

## 15. OPTIONAL FEATURES (Future)

- Push notifications untuk deadline
- Dark mode
- Offline support (local storage sync)
- Cloud backup
- Share tasks dengan teman
- Multiple accounts/sync
- Analytics dashboard
- Recurring tasks
- Subject-based categorization
- Grade tracking
- Study timer/Pomodoro

---

## 16. RESOURCES & REFERENCES

- React Native Docs: https://reactnative.dev
- Expo Docs: https://docs.expo.dev
- Gluestack UI: https://gluestack.io
- React Navigation: https://reactnavigation.org
- Express.js: https://expressjs.com
- Sequelize (ORM untuk MySQL): https://sequelize.org
- MySQL Documentation: https://dev.mysql.com/doc/
- Zustand: https://github.com/pmndrs/zustand
- Babel.js: https://babeljs.io/
- ESLint: https://eslint.org/
- Prettier: https://prettier.io/

---

**Created:** May 2026  
**Status:** Ready for Development
