<?php

require __DIR__ . '/../vendor/autoload.php';

use Dotenv\Dotenv;
use Firebase\JWT\JWT;
use Firebase\JWT\Key;

if (file_exists(__DIR__ . '/../.env')) {
    Dotenv::createImmutable(__DIR__ . '/..')->safeLoad();
}

function kirim_json(array $data, int $status = 200): void
{
    header('Content-Type: application/json; charset=utf-8');
    header('Access-Control-Allow-Origin: ' . ($_ENV['CORS_ALLOWED_ORIGINS'] ?? '*'));
    header('Access-Control-Allow-Headers: Content-Type, Authorization');
    header('Access-Control-Allow-Methods: GET, POST, PUT, PATCH, DELETE, OPTIONS');
    http_response_code($status);
    echo json_encode($data, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    exit;
}

function ambil_json(): array
{
    $input = file_get_contents('php://input');
    $data = json_decode($input ?: '', true);
    return is_array($data) ? $data : [];
}

function validasi_wajib(array $data, array $field): array
{
    $kesalahan = [];
    foreach ($field as $nama) {
        if (!isset($data[$nama]) || trim((string) $data[$nama]) === '') {
            $kesalahan[$nama] = 'Wajib diisi';
        }
    }
    return $kesalahan;
}

function db(): PDO
{
    static $pdo = null;
    if ($pdo instanceof PDO) {
        return $pdo;
    }

    $dsn = 'mysql:host=' . ($_ENV['DB_HOST'] ?? '127.0.0.1')
        . ';port=' . ($_ENV['DB_PORT'] ?? '3306')
        . ';dbname=' . ($_ENV['DB_NAME'] ?? 'catatan_tugas_db')
        . ';charset=utf8mb4';

    $pdo = new PDO($dsn, $_ENV['DB_USER'] ?? 'root', $_ENV['DB_PASSWORD'] ?? '', [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    ]);

    return $pdo;
}

function ambil_token(): ?string
{
    $header = $_SERVER['HTTP_AUTHORIZATION'] ?? '';
    if (preg_match('/Bearer\s+(.*)$/i', $header, $cocok)) {
        return trim($cocok[1]);
    }
    return null;
}

function buat_token(array $data): string
{
    $waktu = time();
    $payload = [
        'iss' => $_ENV['JWT_ISSUER'] ?? 'catatan-tugas-kuliah',
        'iat' => $waktu,
        'exp' => $waktu + (int) ($_ENV['JWT_EXPIRES_IN'] ?? 86400),
        'data' => $data,
    ];

    return JWT::encode($payload, $_ENV['JWT_SECRET'] ?? 'ubah_rahasia_jwt_ini', 'HS256');
}

function login_wajib(): array
{
    $token = ambil_token();
    if (!$token) {
        kirim_json(['pesan' => 'Token tidak ditemukan'], 401);
    }

    try {
        $decoded = JWT::decode($token, new Key($_ENV['JWT_SECRET'] ?? 'ubah_rahasia_jwt_ini', 'HS256'));
        $data = json_decode(json_encode($decoded), true);
        if (!isset($data['data']['id'])) {
            throw new Exception('Token tidak valid');
        }
        return $data['data'];
    } catch (Throwable) {
        kirim_json(['pesan' => 'Token tidak valid atau kedaluwarsa'], 401);
    }
}

function ambil_pengguna(int $id): ?array
{
    $stmt = db()->prepare('SELECT id, email, nama, dibuat, diperbarui FROM pengguna WHERE id = :id LIMIT 1');
    $stmt->execute(['id' => $id]);
    $data = $stmt->fetch();
    return $data ?: null;
}

function ambil_tugas(int $id, int $idPengguna): ?array
{
    $stmt = db()->prepare('SELECT * FROM tugas WHERE id = :id AND id_pengguna = :id_pengguna LIMIT 1');
    $stmt->execute(['id' => $id, 'id_pengguna' => $idPengguna]);
    $data = $stmt->fetch();
    return $data ?: null;
}

function ambil_path(): string
{
    $path = parse_url($_SERVER['REQUEST_URI'] ?? '/', PHP_URL_PATH) ?: '/';
    $base = '/backend-php/public';
    if (str_starts_with($path, $base)) {
        $path = substr($path, strlen($base));
    }
    return '/' . trim($path, '/');
}

$method = $_SERVER['REQUEST_METHOD'] ?? 'GET';
$path = ambil_path();

if ($method === 'OPTIONS') {
    http_response_code(204);
    exit;
}

if ($path === '/' && $method === 'GET') {
    kirim_json(['pesan' => 'API backend-php aktif']);
}

if ($path === '/api/aut/daftar' && $method === 'POST') {
    $data = ambil_json();
    $kesalahan = validasi_wajib($data, ['nama', 'email', 'kata_sandi']);
    if ($kesalahan) {
        kirim_json(['pesan' => 'Validasi gagal', 'kesalahan' => $kesalahan], 422);
    }

    $email = strtolower(trim((string) $data['email']));
    $cek = db()->prepare('SELECT id FROM pengguna WHERE email = :email LIMIT 1');
    $cek->execute(['email' => $email]);
    if ($cek->fetch()) {
        kirim_json(['pesan' => 'Email sudah terdaftar'], 409);
    }

    $stmt = db()->prepare('INSERT INTO pengguna (email, kata_sandi, nama) VALUES (:email, :kata_sandi, :nama)');
    $stmt->execute([
        'email' => $email,
        'kata_sandi' => password_hash((string) $data['kata_sandi'], PASSWORD_BCRYPT),
        'nama' => trim((string) $data['nama']),
    ]);

    $pengguna = ambil_pengguna((int) db()->lastInsertId());
    $token = buat_token($pengguna ?? ['id' => (int) db()->lastInsertId()]);
    kirim_json(['pesan' => 'Pendaftaran berhasil', 'data' => ['pengguna' => $pengguna, 'token' => $token]], 201);
}

if ($path === '/api/aut/masuk' && $method === 'POST') {
    $data = ambil_json();
    $kesalahan = validasi_wajib($data, ['email', 'kata_sandi']);
    if ($kesalahan) {
        kirim_json(['pesan' => 'Validasi gagal', 'kesalahan' => $kesalahan], 422);
    }

    $stmt = db()->prepare('SELECT * FROM pengguna WHERE email = :email LIMIT 1');
    $stmt->execute(['email' => strtolower(trim((string) $data['email']))]);
    $pengguna = $stmt->fetch();

    if (!$pengguna || !password_verify((string) $data['kata_sandi'], (string) $pengguna['kata_sandi'])) {
        kirim_json(['pesan' => 'Email atau kata sandi salah'], 401);
    }

    unset($pengguna['kata_sandi']);
    $token = buat_token($pengguna);
    kirim_json(['pesan' => 'Login berhasil', 'data' => ['pengguna' => $pengguna, 'token' => $token]]);
}

if ($path === '/api/aut/keluar' && $method === 'POST') {
    kirim_json(['pesan' => 'Logout berhasil']);
}

if ($path === '/api/aut/profil' && $method === 'GET') {
    $pengguna = login_wajib();
    kirim_json(['pesan' => 'Profil berhasil diambil', 'data' => $pengguna]);
}

if ($path === '/api/aut/profil' && $method === 'PUT') {
    $penggunaLogin = login_wajib();
    $data = ambil_json();
    $kesalahan = validasi_wajib($data, ['nama', 'email']);
    if ($kesalahan) {
        kirim_json(['pesan' => 'Validasi gagal', 'kesalahan' => $kesalahan], 422);
    }

    $stmt = db()->prepare('UPDATE pengguna SET nama = :nama, email = :email WHERE id = :id');
    $stmt->execute([
        'id' => (int) $penggunaLogin['id'],
        'nama' => trim((string) $data['nama']),
        'email' => strtolower(trim((string) $data['email'])),
    ]);

    kirim_json(['pesan' => 'Profil berhasil diperbarui', 'data' => ambil_pengguna((int) $penggunaLogin['id'])]);
}

if ($path === '/api/tugas' && $method === 'GET') {
    $penggunaLogin = login_wajib();
    $stmt = db()->prepare('SELECT * FROM tugas WHERE id_pengguna = :id_pengguna ORDER BY tgl_deadline IS NULL, tgl_deadline ASC, id DESC');
    $stmt->execute(['id_pengguna' => (int) $penggunaLogin['id']]);
    kirim_json(['pesan' => 'Data tugas berhasil diambil', 'data' => $stmt->fetchAll()]);
}

if ($path === '/api/tugas' && $method === 'POST') {
    $penggunaLogin = login_wajib();
    $data = ambil_json();
    $kesalahan = validasi_wajib($data, ['judul']);
    if ($kesalahan) {
        kirim_json(['pesan' => 'Validasi gagal', 'kesalahan' => $kesalahan], 422);
    }

    $stmt = db()->prepare(
        'INSERT INTO tugas (id_pengguna, judul, deskripsi, mata_kuliah, prioritas, tgl_deadline, status, sudah_selesai, tgl_selesai)
        VALUES (:id_pengguna, :judul, :deskripsi, :mata_kuliah, :prioritas, :tgl_deadline, :status, :sudah_selesai, :tgl_selesai)'
    );
    $stmt->execute([
        'id_pengguna' => (int) $penggunaLogin['id'],
        'judul' => trim((string) $data['judul']),
        'deskripsi' => $data['deskripsi'] ?? null,
        'mata_kuliah' => $data['mata_kuliah'] ?? null,
        'prioritas' => $data['prioritas'] ?? 'SEDANG',
        'tgl_deadline' => $data['tgl_deadline'] ?? null,
        'status' => $data['status'] ?? 'MENUNGGU',
        'sudah_selesai' => !empty($data['sudah_selesai']) ? 1 : 0,
        'tgl_selesai' => $data['tgl_selesai'] ?? null,
    ]);
    kirim_json(['pesan' => 'Tugas berhasil dibuat', 'data' => ['id' => (int) db()->lastInsertId()]], 201);
}

if (preg_match('#^/api/tugas/(\d+)$#', $path, $cocok) && $method === 'GET') {
    $penggunaLogin = login_wajib();
    $tugas = ambil_tugas((int) $cocok[1], (int) $penggunaLogin['id']);
    if (!$tugas) {
        kirim_json(['pesan' => 'Tugas tidak ditemukan'], 404);
    }
    kirim_json(['pesan' => 'Detail tugas berhasil diambil', 'data' => $tugas]);
}

if (preg_match('#^/api/tugas/(\d+)$#', $path, $cocok) && $method === 'PUT') {
    $penggunaLogin = login_wajib();
    $tugas = ambil_tugas((int) $cocok[1], (int) $penggunaLogin['id']);
    if (!$tugas) {
        kirim_json(['pesan' => 'Tugas tidak ditemukan'], 404);
    }

    $data = ambil_json();
    $sudahSelesai = !empty($data['sudah_selesai']) ? 1 : (int) $tugas['sudah_selesai'];

    $stmt = db()->prepare(
        'UPDATE tugas SET judul = :judul, deskripsi = :deskripsi, mata_kuliah = :mata_kuliah, prioritas = :prioritas,
        tgl_deadline = :tgl_deadline, status = :status, sudah_selesai = :sudah_selesai, tgl_selesai = :tgl_selesai
        WHERE id = :id AND id_pengguna = :id_pengguna'
    );
    $stmt->execute([
        'id' => (int) $cocok[1],
        'id_pengguna' => (int) $penggunaLogin['id'],
        'judul' => trim((string) ($data['judul'] ?? $tugas['judul'])),
        'deskripsi' => $data['deskripsi'] ?? $tugas['deskripsi'],
        'mata_kuliah' => $data['mata_kuliah'] ?? $tugas['mata_kuliah'],
        'prioritas' => $data['prioritas'] ?? $tugas['prioritas'],
        'tgl_deadline' => $data['tgl_deadline'] ?? $tugas['tgl_deadline'],
        'status' => $data['status'] ?? ($sudahSelesai ? 'SELESAI' : $tugas['status']),
        'sudah_selesai' => $sudahSelesai,
        'tgl_selesai' => array_key_exists('tgl_selesai', $data) ? $data['tgl_selesai'] : ($sudahSelesai ? ($tugas['tgl_selesai'] ?? date('Y-m-d H:i:s')) : null),
    ]);

    kirim_json(['pesan' => 'Tugas berhasil diperbarui', 'data' => ambil_tugas((int) $cocok[1], (int) $penggunaLogin['id'])]);
}

if (preg_match('#^/api/tugas/(\d+)$#', $path, $cocok) && $method === 'DELETE') {
    $penggunaLogin = login_wajib();
    $tugas = ambil_tugas((int) $cocok[1], (int) $penggunaLogin['id']);
    if (!$tugas) {
        kirim_json(['pesan' => 'Tugas tidak ditemukan'], 404);
    }

    $stmt = db()->prepare('DELETE FROM tugas WHERE id = :id AND id_pengguna = :id_pengguna');
    $stmt->execute(['id' => (int) $cocok[1], 'id_pengguna' => (int) $penggunaLogin['id']]);
    kirim_json(['pesan' => 'Tugas berhasil dihapus']);
}

if (preg_match('#^/api/tugas/(\d+)/selesai$#', $path, $cocok) && $method === 'PATCH') {
    $penggunaLogin = login_wajib();
    $tugas = ambil_tugas((int) $cocok[1], (int) $penggunaLogin['id']);
    if (!$tugas) {
        kirim_json(['pesan' => 'Tugas tidak ditemukan'], 404);
    }

    $statusBaru = ((int) $tugas['sudah_selesai'] === 1) ? 0 : 1;
    $stmt = db()->prepare(
        'UPDATE tugas SET status = :status, sudah_selesai = :sudah_selesai, tgl_selesai = :tgl_selesai WHERE id = :id AND id_pengguna = :id_pengguna'
    );
    $stmt->execute([
        'id' => (int) $cocok[1],
        'id_pengguna' => (int) $penggunaLogin['id'],
        'status' => $statusBaru ? 'SELESAI' : 'MENUNGGU',
        'sudah_selesai' => $statusBaru,
        'tgl_selesai' => $statusBaru ? date('Y-m-d H:i:s') : null,
    ]);

    kirim_json(['pesan' => 'Status tugas berhasil diperbarui', 'data' => ambil_tugas((int) $cocok[1], (int) $penggunaLogin['id'])]);
}

kirim_json(['pesan' => 'Rute tidak ditemukan'], 404);
