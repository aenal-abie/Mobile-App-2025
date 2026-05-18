# Plan Alternatif: Backend dengan PHP Native
## Catatan Tugas Kuliah - Backend Option

---

## 1. OVERVIEW BACKEND (PHP Native)

**Bahasa Pemrograman:** PHP Native (Vanilla PHP)  
**Database:** MySQL  
**Authentication:** JWT (JSON Web Tokens)  
**API Format:** REST API dengan JSON  

**Keuntungan PHP Native:**
- ✅ Simple & langsung
- ✅ Tidak perlu setup kompleks
- ✅ Bisa langsung host di shared hosting
- ✅ Cocok untuk projek sedang
- ✅ Development cepat

**Kekurangan PHP Native:**
- ❌ Perlu manual file organization
- ❌ Tidak ada built-in routing
- ❌ Manual dependency management
- ❌ Testing lebih kompleks

---

## 2. STRUKTUR PROJECT BACKEND (PHP)

```
backend-php/
├── .env
├── .htaccess
├── config.php
├── index.php
├── composer.json
│
├── public/
│   └── index.php (Entry point)
│
├── src/
│   ├── config/
│   │   ├── database.php
│   │   └── konstanta.php
│   │
│   ├── controllers/
│   │   ├── AutController.php
│   │   └── TugasController.php
│   │
│   ├── models/
│   │   ├── Pengguna.php
│   │   └── Tugas.php
│   │
│   ├── middleware/
│   │   ├── AutMiddleware.php
│   │   └── ValidationMiddleware.php
│   │
│   ├── utils/
│   │   ├── JwtToken.php
│   │   ├── Response.php
│   │   ├── Validasi.php
│   │   └── Database.php
│   │
│   └── routes/
│       └── api.php
│
├── logs/
│   └── error.log
│
└── tests/
    ├── AutTest.php
    └── TugasTest.php
```

---

## 3. DATABASE SCHEMA (Sama dengan Node.js)

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

## 4. KONFIGURASI & SETUP

### composer.json
```json
{
  "name": "catatan-tugas-kuliah/backend-php",
  "description": "Backend API untuk aplikasi catatan tugas kuliah",
  "version": "1.0.0",
  "require": {
    "php": "^8.0",
    "firebase/php-jwt": "^6.0"
  },
  "require-dev": {
    "phpunit/phpunit": "^10.0"
  },
  "autoload": {
    "psr-4": {
      "App\\": "src/"
    }
  }
}
```

### .env
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

CORS_ALLOWED_ORIGINS=http://localhost:19000,http://localhost:8081
```

### .htaccess (untuk Apache routing)
```
<IfModule mod_rewrite.c>
    RewriteEngine On
    RewriteBase /backend-php/public/
    RewriteCond %{REQUEST_FILENAME} !-f
    RewriteCond %{REQUEST_FILENAME} !-d
    RewriteRule ^(.+)$ index.php?request=$1 [QSA,L]
</IfModule>
```

---

## 5. CORE FILES

### src/config/database.php
```php
<?php
/**
 * Konfigurasi Database Connection
 */

class Database {
  private $host;
  private $user;
  private $password;
  private $database;
  private $koneksi;

  public function __construct() {
    $this->host = $_ENV['DB_HOST'] ?? 'localhost';
    $this->user = $_ENV['DB_USER'] ?? 'root';
    $this->password = $_ENV['DB_PASSWORD'] ?? '';
    $this->database = $_ENV['DB_NAME'] ?? 'catatan_tugas_db';
  }

  /**
   * Membuat koneksi ke database
   * @return mysqli Connection object
   */
  public function hubungkan() {
    $this->koneksi = new mysqli(
      $this->host,
      $this->user,
      $this->password,
      $this->database
    );

    if ($this->koneksi->connect_error) {
      die("Koneksi gagal: " . $this->koneksi->connect_error);
    }

    $this->koneksi->set_charset("utf8");
    return $this->koneksi;
  }

  /**
   * Mendapatkan koneksi yang sudah dibuat
   * @return mysqli
   */
  public function dapatkanKoneksi() {
    if (!$this->koneksi) {
      $this->hubungkan();
    }
    return $this->koneksi;
  }
}
?>
```

### src/utils/JwtToken.php
```php
<?php
/**
 * JWT Token Handler
 */
use Firebase\JWT\JWT;
use Firebase\JWT\Key;

class JwtToken {
  private $kunciRahasia;
  private $algoritma = 'HS256';

  public function __construct() {
    $this->kunciRahasia = $_ENV['JWT_SECRET'] ?? 'rahasia_jwt';
  }

  /**
   * Membuat JWT token
   * @param array $data - Data yang akan dienkripsi
   * @param int $waktuKadaluarsa - Waktu dalam detik (default 24 jam)
   * @return string Token JWT
   */
  public function buatToken($data, $waktuKadaluarsa = 86400) {
    $sekarang = time();
    $payload = array_merge($data, [
      'iat' => $sekarang,
      'exp' => $sekarang + $waktuKadaluarsa
    ]);

    return JWT::encode($payload, $this->kunciRahasia, $this->algoritma);
  }

  /**
   * Memverifikasi JWT token
   * @param string $token - Token yang akan diverifikasi
   * @return object|false Data dari token atau false jika invalid
   */
  public function verifikasiToken($token) {
    try {
      return JWT::decode($token, new Key($this->kunciRahasia, $this->algoritma));
    } catch (\Exception $e) {
      return false;
    }
  }

  /**
   * Mendapatkan token dari header Authorization
   * @return string|null Token atau null jika tidak ditemukan
   */
  public function ambilTokenDariHeader() {
    $headers = getallheaders();
    
    if (isset($headers['Authorization'])) {
      $parts = explode(' ', $headers['Authorization']);
      return count($parts) === 2 && $parts[0] === 'Bearer' ? $parts[1] : null;
    }
    
    return null;
  }
}
?>
```

### src/utils/Response.php
```php
<?php
/**
 * Response Handler untuk API
 */

class Response {
  /**
   * Mengirim response sukses
   * @param mixed $data - Data yang akan dikirim
   * @param string $pesan - Pesan success
   * @param int $kodeStatus - HTTP status code (default 200)
   */
  public static function sukses($data = null, $pesan = 'Berhasil', $kodeStatus = 200) {
    http_response_code($kodeStatus);
    header('Content-Type: application/json');
    
    echo json_encode([
      'sukses' => true,
      'pesan' => $pesan,
      'data' => $data
    ]);
    
    exit;
  }

  /**
   * Mengirim response error
   * @param string $pesan - Pesan error
   * @param int $kodeStatus - HTTP status code (default 400)
   * @param array $errors - Array detail errors
   */
  public static function error($pesan = 'Terjadi kesalahan', $kodeStatus = 400, $errors = []) {
    http_response_code($kodeStatus);
    header('Content-Type: application/json');
    
    echo json_encode([
      'sukses' => false,
      'pesan' => $pesan,
      'errors' => $errors
    ]);
    
    exit;
  }

  /**
   * Mengirim response validasi error
   * @param array $errors - Array validation errors
   */
  public static function validasiError($errors = []) {
    self::error('Validasi gagal', 422, $errors);
  }
}
?>
```

### src/utils/Validasi.php
```php
<?php
/**
 * Input Validation Utility
 */

class Validasi {
  /**
   * Validasi email
   * @param string $email - Email yang akan divalidasi
   * @return bool
   */
  public static function emailValid($email) {
    return filter_var($email, FILTER_VALIDATE_EMAIL) !== false;
  }

  /**
   * Validasi password (minimal 6 karakter)
   * @param string $password - Password yang akan divalidasi
   * @return bool
   */
  public static function passwordValid($password) {
    return strlen($password) >= 6;
  }

  /**
   * Validasi panjang string
   * @param string $text - Text yang akan divalidasi
   * @param int $minLengthh - Minimal panjang
   * @param int $maxLength - Maksimal panjang
   * @return bool
   */
  public static function panjangValid($text, $minLength = 1, $maxLength = 255) {
    $length = strlen($text);
    return $length >= $minLength && $length <= $maxLength;
  }

  /**
   * Validasi required field
   * @param string $field - Field yang dicek
   * @param array $data - Data array
   * @return bool
   */
  public static function required($field, $data) {
    return isset($data[$field]) && !empty($data[$field]);
  }

  /**
   * Sanitasi input string
   * @param string $text - String yang akan di-sanitasi
   * @return string
   */
  public static function sanitasi($text) {
    return htmlspecialchars(strip_tags(trim($text)), ENT_QUOTES, 'UTF-8');
  }
}
?>
```

### src/models/Pengguna.php
```php
<?php
/**
 * Model Pengguna
 */

class Pengguna {
  private $db;

  public function __construct() {
    $database = new Database();
    $this->db = $database->hubungkan();
  }

  /**
   * Cari pengguna berdasarkan email
   * @param string $email - Email pengguna
   * @return array|null
   */
  public function cariByEmail($email) {
    $query = "SELECT * FROM pengguna WHERE email = ?";
    $stmt = $this->db->prepare($query);
    $stmt->bind_param("s", $email);
    $stmt->execute();
    
    $result = $stmt->get_result();
    return $result->num_rows > 0 ? $result->fetch_assoc() : null;
  }

  /**
   * Cari pengguna berdasarkan ID
   * @param int $id - ID pengguna
   * @return array|null
   */
  public function cariById($id) {
    $query = "SELECT id, email, nama, dibuat FROM pengguna WHERE id = ?";
    $stmt = $this->db->prepare($query);
    $stmt->bind_param("i", $id);
    $stmt->execute();
    
    $result = $stmt->get_result();
    return $result->num_rows > 0 ? $result->fetch_assoc() : null;
  }

  /**
   * Membuat pengguna baru
   * @param string $email - Email pengguna
   * @param string $nama - Nama pengguna
   * @param string $kataSandi - Password (akan di-hash)
   * @return bool|int
   */
  public function buat($email, $nama, $kataSandi) {
    $kataSandiHash = password_hash($kataSandi, PASSWORD_BCRYPT);
    
    $query = "INSERT INTO pengguna (email, nama, kata_sandi) VALUES (?, ?, ?)";
    $stmt = $this->db->prepare($query);
    $stmt->bind_param("sss", $email, $nama, $kataSandiHash);
    
    if ($stmt->execute()) {
      return $this->db->insert_id;
    }
    
    return false;
  }

  /**
   * Update profil pengguna
   * @param int $id - ID pengguna
   * @param array $data - Data yang diupdate
   * @return bool
   */
  public function update($id, $data) {
    $diperbarui = date('Y-m-d H:i:s');
    $query = "UPDATE pengguna SET nama = ?, diperbarui = ? WHERE id = ?";
    $stmt = $this->db->prepare($query);
    
    $nama = $data['nama'] ?? '';
    $stmt->bind_param("ssi", $nama, $diperbarui, $id);
    
    return $stmt->execute();
  }
}
?>
```

### src/controllers/AutController.php
```php
<?php
/**
 * Authentication Controller
 */

class AutController {
  private $pengguna;
  private $jwtToken;

  public function __construct() {
    $this->pengguna = new Pengguna();
    $this->jwtToken = new JwtToken();
  }

  /**
   * Endpoint: POST /api/aut/daftar
   * Mendaftar pengguna baru
   */
  public function daftar($data) {
    // Validasi input
    if (!Validasi::required('email', $data) ||
        !Validasi::required('nama', $data) ||
        !Validasi::required('kata_sandi', $data)) {
      Response::error('Email, nama, dan kata sandi harus diisi', 400);
    }

    $email = Validasi::sanitasi($data['email']);
    $nama = Validasi::sanitasi($data['nama']);
    $kataSandi = $data['kata_sandi'];

    // Validasi email format
    if (!Validasi::emailValid($email)) {
      Response::validasiError(['email' => 'Format email tidak valid']);
    }

    // Validasi password strength
    if (!Validasi::passwordValid($kataSandi)) {
      Response::validasiError(['kata_sandi' => 'Password minimal 6 karakter']);
    }

    // Cek email sudah terdaftar
    if ($this->pengguna->cariByEmail($email)) {
      Response::error('Email sudah terdaftar', 409);
    }

    // Buat pengguna baru
    $idPengguna = $this->pengguna->buat($email, $nama, $kataSandi);
    
    if (!$idPengguna) {
      Response::error('Gagal mendaftar pengguna', 500);
    }

    // Buat JWT token
    $token = $this->jwtToken->buatToken([
      'id' => $idPengguna,
      'email' => $email,
      'nama' => $nama
    ]);

    Response::sukses([
      'id' => $idPengguna,
      'email' => $email,
      'nama' => $nama,
      'token' => $token
    ], 'Pendaftaran berhasil', 201);
  }

  /**
   * Endpoint: POST /api/aut/masuk
   * Login pengguna
   */
  public function masuk($data) {
    // Validasi input
    if (!Validasi::required('email', $data) ||
        !Validasi::required('kata_sandi', $data)) {
      Response::error('Email dan kata sandi harus diisi', 400);
    }

    $email = Validasi::sanitasi($data['email']);
    $kataSandi = $data['kata_sandi'];

    // Cari pengguna
    $pengguna = $this->pengguna->cariByEmail($email);
    
    if (!$pengguna) {
      Response::error('Email atau password salah', 401);
    }

    // Verifikasi password
    if (!password_verify($kataSandi, $pengguna['kata_sandi'])) {
      Response::error('Email atau password salah', 401);
    }

    // Buat JWT token
    $token = $this->jwtToken->buatToken([
      'id' => $pengguna['id'],
      'email' => $pengguna['email'],
      'nama' => $pengguna['nama']
    ]);

    Response::sukses([
      'id' => $pengguna['id'],
      'email' => $pengguna['email'],
      'nama' => $pengguna['nama'],
      'token' => $token
    ], 'Login berhasil');
  }

  /**
   * Endpoint: GET /api/aut/profil
   * Ambil profil pengguna (Protected)
   */
  public function ambilProfil($idPengguna) {
    $pengguna = $this->pengguna->cariById($idPengguna);
    
    if (!$pengguna) {
      Response::error('Pengguna tidak ditemukan', 404);
    }

    Response::sukses($pengguna, 'Profil pengguna berhasil diambil');
  }

  /**
   * Endpoint: PUT /api/aut/profil
   * Update profil pengguna (Protected)
   */
  public function updateProfil($idPengguna, $data) {
    if (!Validasi::required('nama', $data)) {
      Response::error('Nama harus diisi', 400);
    }

    $nama = Validasi::sanitasi($data['nama']);

    if (!Validasi::panjangValid($nama, 3, 100)) {
      Response::validasiError(['nama' => 'Nama harus 3-100 karakter']);
    }

    if ($this->pengguna->update($idPengguna, ['nama' => $nama])) {
      $pengguna = $this->pengguna->cariById($idPengguna);
      Response::sukses($pengguna, 'Profil berhasil diupdate');
    } else {
      Response::error('Gagal update profil', 500);
    }
  }
}
?>
```

### public/index.php (Router)
```php
<?php
/**
 * Main Entry Point - API Router
 */

// Load environment variables
require_once __DIR__ . '/../src/config/database.php';
require_once __DIR__ . '/../src/utils/JwtToken.php';
require_once __DIR__ . '/../src/utils/Response.php';
require_once __DIR__ . '/../src/utils/Validasi.php';
require_once __DIR__ . '/../src/models/Pengguna.php';
require_once __DIR__ . '/../src/models/Tugas.php';
require_once __DIR__ . '/../src/controllers/AutController.php';
require_once __DIR__ . '/../src/controllers/TugasController.php';

// Load Composer autoload
require_once __DIR__ . '/../vendor/autoload.php';

// Setup CORS
header('Access-Control-Allow-Origin: ' . ($_ENV['CORS_ALLOWED_ORIGINS'] ?? '*'));
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, PATCH, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
  http_response_code(200);
  exit;
}

// Parse request
$method = $_SERVER['REQUEST_METHOD'];
$path = parse_url($_GET['request'] ?? '/', PHP_URL_PATH);
$parts = explode('/', trim($path, '/'));

// Route matching
$route = implode('/', $parts);

// Get JSON input
$input = json_decode(file_get_contents('php://input'), true) ?? $_GET;

// Middleware: Check authentication untuk protected routes
$adminControllers = [
  'api/tugas' => true,
  'api/aut/profil' => true
];

$jwtToken = new JwtToken();
$token = $jwtToken->ambilTokenDariHeader();
$idPengguna = null;

if (in_array($route, array_keys($adminControllers)) && 
    ($method === 'GET' || $method === 'PUT' || $method === 'DELETE' || $method === 'PATCH')) {
  
  if (!$token) {
    Response::error('Token tidak ditemukan', 401);
  }
  
  $decoded = $jwtToken->verifikasiToken($token);
  if (!$decoded) {
    Response::error('Token invalid atau kadaluarsa', 401);
  }
  
  $idPengguna = $decoded->id;
}

// Router logic
switch ($route) {
  // Authentication Routes
  case 'api/aut/daftar':
    if ($method === 'POST') {
      $aut = new AutController();
      $aut->daftar($input);
    }
    break;
    
  case 'api/aut/masuk':
    if ($method === 'POST') {
      $aut = new AutController();
      $aut->masuk($input);
    }
    break;
    
  case 'api/aut/profil':
    $aut = new AutController();
    if ($method === 'GET') {
      $aut->ambilProfil($idPengguna);
    } elseif ($method === 'PUT') {
      $aut->updateProfil($idPengguna, $input);
    }
    break;

  // Task Routes
  case 'api/tugas':
    $tugas = new TugasController();
    if ($method === 'GET') {
      $tugas->ambilSemuaTugas($idPengguna);
    } elseif ($method === 'POST') {
      $tugas->buatTugas($idPengguna, $input);
    }
    break;

  default:
    Response::error('Route tidak ditemukan', 404);
}
?>
```

---

## 6. API ENDPOINTS

### Authentication (Autentikasi)
- `POST /api/aut/daftar` - Daftar pengguna baru
- `POST /api/aut/masuk` - Login pengguna
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

## 7. KONFIGURASI SERVER

### Apache (.htaccess)
```
<IfModule mod_rewrite.c>
    RewriteEngine On
    RewriteBase /backend-php/public/
    
    # Block direct access to non-public files
    RewriteCond %{REQUEST_FILENAME} !-f
    RewriteCond %{REQUEST_FILENAME} !-d
    RewriteRule ^(.+)$ index.php?request=$1 [QSA,L]
</IfModule>
```

### Nginx (nginx.conf)
```nginx
server {
    listen 80;
    server_name api.catatantugas.local;
    
    root /var/www/backend-php/public;
    
    location / {
        try_files $uri $uri/ /index.php?request=$uri&$args;
    }
    
    location ~ \.php$ {
        include fastcgi_params;
        fastcgi_pass unix:/var/run/php-fpm.sock;
        fastcgi_param SCRIPT_FILENAME $document_root$fastcgi_script_name;
    }
}
```

---

## 8. SETUP GUIDE

### 1. Clone Repository
```bash
git clone <repository-url>
cd backend-php
```

### 2. Install Dependencies
```bash
composer install
```

### 3. Setup Environment
```bash
cp .env.example .env
# Edit .env dengan konfigurasi Anda
```

### 4. Create Database
```bash
mysql -u root -p
CREATE DATABASE catatan_tugas_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE catatan_tugas_db;
```

### 5. Run Migration (Import SQL)
```bash
mysql -u root -p catatan_tugas_db < database/migrations.sql
```

### 6. Start Development Server
```bash
cd public
php -S localhost:8000
```

### 7. Test API
```bash
curl -X POST http://localhost:8000/api/aut/daftar \
  -H 'Content-Type: application/json' \
  -d '{
    "email": "user@example.com",
    "nama": "Nama User",
    "kata_sandi": "password123"
  }'
```

---

## 9. TESTING

### Dengan cURL
```bash
# Register
curl -X POST http://localhost:8000/api/aut/daftar \
  -H 'Content-Type: application/json' \
  -d '{
    "email": "user@test.com",
    "nama": "Test User",
    "kata_sandi": "password123"
  }'

# Login
curl -X POST http://localhost:8000/api/aut/masuk \
  -H 'Content-Type: application/json' \
  -d '{
    "email": "user@test.com",
    "kata_sandi": "password123"
  }'

# Get Profile (dengan token)
curl -X GET http://localhost:8000/api/aut/profil \
  -H 'Authorization: Bearer YOUR_TOKEN'
```

### Dengan Postman
1. Import endpoints
2. Set Authorization type = Bearer Token
3. Paste token dari response login
4. Test setiap endpoint

---

## 10. DEPENDENCIES

### Required
- PHP >= 8.0
- MySQL >= 5.7
- Composer

### Composer Packages
```json
{
  "firebase/php-jwt": "^6.0"
}
```

### Recommended Extensions
- mysqli
- json
- gd (untuk image processing)
- curl

---

## 11. BEST PRACTICES (PHP Native)

### Security
- ✅ Input validation dan sanitasi
- ✅ Password hashing dengan bcrypt
- ✅ JWT token verification
- ✅ CORS configuration
- ✅ SQL prepared statements
- ✅ Error logging

### Code Organization
- ✅ Separate concerns (Controllers, Models, Utils)
- ✅ Consistent naming convention (Bahasa Indonesia)
- ✅ JSDoc-style comments
- ✅ Type hints dalam function signatures
- ✅ Error handling

### Database
- ✅ Prepared statements untuk prevent SQL injection
- ✅ Proper indexing
- ✅ Foreign key constraints
- ✅ Transaction handling

### API
- ✅ RESTful design
- ✅ Consistent JSON response format
- ✅ Proper HTTP status codes
- ✅ CORS headers
- ✅ Comprehensive error messages

---

## 12. TAHAPAN DEVELOPMENT (PHP Backend)

### Phase 1: Setup (3-4 hari)
- [ ] Initialize project structure
- [ ] Setup database connection
- [ ] Install dependencies
- [ ] Create config files

### Phase 2: Core Utilities (4-5 hari)
- [ ] Setup JWT token handler
- [ ] Create Response class
- [ ] Create Validation utility
- [ ] Setup database connection

### Phase 3: Authentication (5-7 hari)
- [ ] Create Pengguna model
- [ ] Create AutController
- [ ] Implement register endpoint
- [ ] Implement login endpoint
- [ ] Implement JWT verification middleware

### Phase 4: Task Management (5-7 hari)
- [ ] Create Tugas model
- [ ] Create TugasController
- [ ] Implement CRUD endpoints
- [ ] Add filtering & sorting
- [ ] Add validation

### Phase 5: Testing & Documentation (3-5 hari)
- [ ] Unit testing
- [ ] API testing
- [ ] Documentation
- [ ] Error handling

### Phase 6: Deployment (2-3 hari)
- [ ] Prepare production config
- [ ] Deploy to server
- [ ] Setup monitoring
- [ ] Security audit

---

## 13. ESTIMATED TIMELINE

**Total Durasi Backend:** 3-4 minggu (Full-time)

### Breakdown:
- Setup: 3-4 hari
- Core Utilities: 4-5 hari
- Authentication: 5-7 hari
- Task Management: 5-7 hari
- Testing & Docs: 3-5 hari
- Deployment: 2-3 hari

---

## 14. COMPARISON: Node.js vs PHP Native

| Aspek | Node.js | PHP Native |
|-------|---------|-----------|
| **Learning Curve** | Moderate | Easy |
| **Setup Complexity** | Moderate | Easy |
| **Development Speed** | Fast | Moderate |
| **Performance** | Excellent | Good |
| **Scalability** | Excellent | Good |
| **Deployment** | Complex | Simple |
| **Hosting Cost** | Higher | Lower |
| **Documentation** | Extensive | Good |
| **File Organization** | Automatic | Manual |
| **Testing** | Easy | Moderate |
| **Best For** | Large apps, real-time | Simple-medium apps |
| **Ideal When** | Scale, performance | Quick deployment |

---

## 15. TIPS & TRICKS (PHP)

### 1. Development dengan Live Server
```bash
cd public
php -S localhost:8000 -t .
```

### 2. Debug dengan var_dump
```php
error_log(json_encode($data, JSON_PRETTY_PRINT));
```

### 3. Test Routes
```bash
php -S localhost:8000 router.php
```

### 4. Database Backup
```bash
mysqldump -u root -p catatan_tugas_db > backup.sql
```

### 5. Performance Optimization
- Enable opcache
- Optimize database queries
- Use caching (Redis)
- Minify JSON responses

---

## 16. RESOURCES & REFERENCES

- PHP Official: https://www.php.net/
- PHP JWT: https://github.com/firebase/php-jwt
- REST API Best Practices: https://restfulapi.net/
- MySQL Documentation: https://dev.mysql.com/
- Composer: https://getcomposer.org/
- Apache .htaccess: https://httpd.apache.org/docs/current/mod/mod_rewrite.html
- Nginx: https://nginx.org/en/

---

## 17. TROUBLESHOOTING

### 1. CORS Error
```php
// Pastikan headers CORS sudah benar di index.php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
```

### 2. Database Connection Error
```php
mysqli_connect_error(); // untuk cek error
mysqli_connect_errno(); // untuk cek errno
```

### 3. JWT Token Invalid
```php
// Pastikan kunciRahasia sama di .env dan JwtToken.php
// Check token expiration time
```

### 4. 404 Routes
```
# Pastikan .htaccess di public folder
# Atau setup Nginx rewrite rules dengan benar
```

---

## 18. SECURITY CHECKLIST

- [ ] Validate semua input
- [ ] Sanitasi database queries
- [ ] Hash passwords dengan bcrypt
- [ ] Implement rate limiting
- [ ] Use HTTPS in production
- [ ] Secure JWT secret
- [ ] Log security events
- [ ] Regular security updates
- [ ] Database backup regularly
- [ ] Monitor server logs

---

**Status:** Ready for Development  
**Last Updated:** May 2026
