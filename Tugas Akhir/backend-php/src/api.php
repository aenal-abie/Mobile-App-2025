<?php

function muat_env(string $path): void
{
    if (!file_exists($path)) {
        return;
    }

    $baris = file($path, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
    if ($baris === false) {
        return;
    }

    foreach ($baris as $line) {
        $line = trim($line);
        if ($line === '' || str_starts_with($line, '#') || !str_contains($line, '=')) {
            continue;
        }

        [$key, $value] = array_map('trim', explode('=', $line, 2));
        if ($key === '') {
            continue;
        }

        $value = trim($value, "\"'");
        $_ENV[$key] = $value;
        putenv($key . '=' . $value);
    }
}

muat_env(__DIR__ . '/../.env');

function base64url_encode(string $data): string
{
    return rtrim(strtr(base64_encode($data), '+/', '-_'), '=');
}

function base64url_decode(string $data): string
{
    $remainder = strlen($data) % 4;
    if ($remainder) {
        $data .= str_repeat('=', 4 - $remainder);
    }
    return base64_decode(strtr($data, '-_', '+/')) ?: '';
}

function jwt_encode(array $payload, string $secret): string
{
    $header = ['alg' => 'HS256', 'typ' => 'JWT'];
    $segments = [
        base64url_encode((string) json_encode($header, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES)),
        base64url_encode((string) json_encode($payload, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES)),
    ];

    $signature = hash_hmac('sha256', implode('.', $segments), $secret, true);
    $segments[] = base64url_encode($signature);

    return implode('.', $segments);
}

function jwt_decode(string $token, string $secret): array
{
    $parts = explode('.', $token);
    if (count($parts) !== 3) {
        throw new RuntimeException('Token format tidak valid');
    }

    [$encodedHeader, $encodedPayload, $encodedSignature] = $parts;
    $signature = base64url_encode(hash_hmac('sha256', $encodedHeader . '.' . $encodedPayload, $secret, true));

    if (!hash_equals($signature, $encodedSignature)) {
        throw new RuntimeException('Tanda tangan token tidak cocok');
    }

    $payload = json_decode(base64url_decode($encodedPayload), true);
    if (!is_array($payload)) {
        throw new RuntimeException('Payload token tidak valid');
    }

    if (isset($payload['exp']) && time() >= (int) $payload['exp']) {
        throw new RuntimeException('Token kedaluwarsa');
    }

    return $payload;
}

function kirim_json(array $data, int $status = 200): void
{
    header('Content-Type: application/json; charset=utf-8');
    header('Access-Control-Allow-Origin: ' . ($_ENV['CORS_ALLOWED_ORIGINS'] ?? '*'));
    header('Vary: Origin');
    header('Access-Control-Allow-Headers: Content-Type, Authorization');
    header('Access-Control-Allow-Methods: GET, POST, PUT, PATCH, DELETE, OPTIONS');
    http_response_code($status);
    echo json_encode($data, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    exit;
}

function kirim_preflight(): void
{
    header('Access-Control-Allow-Origin: ' . ($_ENV['CORS_ALLOWED_ORIGINS'] ?? '*'));
    header('Vary: Origin');
    header('Access-Control-Allow-Headers: Content-Type, Authorization');
    header('Access-Control-Allow-Methods: GET, POST, PUT, PATCH, DELETE, OPTIONS');
    header('Access-Control-Max-Age: 86400');
    http_response_code(204);
    exit;
}

function respon_ok(string $pesan, mixed $data = null, int $status = 200, array $extra = []): void
{
    $payload = array_merge([
        'sukses' => true,
        'pesan' => $pesan,
    ], $extra);

    if ($data !== null) {
        $payload['data'] = $data;
    }

    kirim_json($payload, $status);
}

function respon_gagal(string $pesan, int $status = 400, array $extra = []): void
{
    kirim_json(array_merge([
        'sukses' => false,
        'pesan' => $pesan,
    ], $extra), $status);
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
    if (!$header && function_exists('getallheaders')) {
        $headers = getallheaders();
        $header = $headers['Authorization'] ?? $headers['authorization'] ?? '';
    }
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

    return jwt_encode($payload, $_ENV['JWT_SECRET'] ?? 'ubah_rahasia_jwt_ini');
}

function login_wajib(): array
{
    $token = ambil_token();
    if (!$token) {
        respon_gagal('Token tidak ditemukan', 401);
    }

    try {
        $data = jwt_decode($token, $_ENV['JWT_SECRET'] ?? 'ubah_rahasia_jwt_ini');
        if (!isset($data['data']['id'])) {
            throw new Exception('Token tidak valid');
        }
        return $data['data'];
    } catch (Throwable) {
        respon_gagal('Token tidak valid atau kedaluwarsa', 401);
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
    $prefixes = [
        '/public/index.php',
        '/index.php',
        '/backend-php/public/index.php',
        '/backend-php/public',
    ];

    foreach ($prefixes as $prefix) {
        if (str_starts_with($path, $prefix)) {
            $path = substr($path, strlen($prefix));
            break;
        }
    }

    return '/' . trim($path, '/');
}

$method = $_SERVER['REQUEST_METHOD'] ?? 'GET';
$path = ambil_path();

if ($method === 'OPTIONS') {
    kirim_preflight();
}

if ($path === '/' && $method === 'GET') {
    respon_ok('API backend-php aktif');
}

if ($path === '/api/aut/daftar' && $method === 'POST') {
    $data = ambil_json();
    $kesalahan = validasi_wajib($data, ['nama', 'email', 'kata_sandi']);
    if ($kesalahan) {
        respon_gagal('Validasi gagal', 422, ['kesalahan' => $kesalahan]);
    }

    $email = strtolower(trim((string) $data['email']));
    $cek = db()->prepare('SELECT id FROM pengguna WHERE email = :email LIMIT 1');
    $cek->execute(['email' => $email]);
    if ($cek->fetch()) {
        respon_gagal('Email sudah terdaftar', 409);
    }

    $stmt = db()->prepare('INSERT INTO pengguna (email, kata_sandi, nama) VALUES (:email, :kata_sandi, :nama)');
    $stmt->execute([
        'email' => $email,
        'kata_sandi' => password_hash((string) $data['kata_sandi'], PASSWORD_BCRYPT),
        'nama' => trim((string) $data['nama']),
    ]);

    $idPengguna = (int) db()->lastInsertId();
    $pengguna = ambil_pengguna($idPengguna);
    respon_ok(
        'Pendaftaran berhasil',
        $pengguna,
        201,
        $pengguna ? ['pengguna' => $pengguna] : []
    );
}

if ($path === '/api/aut/masuk' && $method === 'POST') {
    $data = ambil_json();
    $kesalahan = validasi_wajib($data, ['email', 'kata_sandi']);
    if ($kesalahan) {
        respon_gagal('Validasi gagal', 422, ['kesalahan' => $kesalahan]);
    }

    $stmt = db()->prepare('SELECT * FROM pengguna WHERE email = :email LIMIT 1');
    $stmt->execute(['email' => strtolower(trim((string) $data['email']))]);
    $pengguna = $stmt->fetch();

    if (!$pengguna || !password_verify((string) $data['kata_sandi'], (string) $pengguna['kata_sandi'])) {
        respon_gagal('Email atau kata sandi salah', 401);
    }

    unset($pengguna['kata_sandi']);
    $token = buat_token($pengguna);
    kirim_json([
        'sukses' => true,
        'pesan' => 'Berhasil masuk akun!',
        'token' => $token,
        'pengguna' => $pengguna,
    ]);
}

if ($path === '/api/aut/keluar' && $method === 'POST') {
    respon_ok('Logout berhasil');
}

if ($path === '/api/aut/profil' && $method === 'GET') {
    $pengguna = login_wajib();
    respon_ok('Profil berhasil diambil', $pengguna);
}

if ($path === '/api/aut/profil' && $method === 'PUT') {
    $penggunaLogin = login_wajib();
    $data = ambil_json();
    $kesalahan = validasi_wajib($data, ['nama']);
    if ($kesalahan) {
        respon_gagal('Validasi gagal', 422, ['kesalahan' => $kesalahan]);
    }

    $emailBaru = isset($data['email']) && trim((string) $data['email']) !== ''
        ? strtolower(trim((string) $data['email']))
        : null;

    if ($emailBaru !== null) {
        $cek = db()->prepare('SELECT id FROM pengguna WHERE email = :email AND id <> :id LIMIT 1');
        $cek->execute([
            'email' => $emailBaru,
            'id' => (int) $penggunaLogin['id'],
        ]);
        if ($cek->fetch()) {
            respon_gagal('Email sudah digunakan pengguna lain', 409);
        }
    }

    $stmt = db()->prepare('UPDATE pengguna SET nama = :nama, email = COALESCE(:email, email) WHERE id = :id');
    $stmt->execute([
        'id' => (int) $penggunaLogin['id'],
        'nama' => trim((string) $data['nama']),
        'email' => $emailBaru,
    ]);

    respon_ok('Profil berhasil diperbarui', ambil_pengguna((int) $penggunaLogin['id']));
}

if ($path === '/api/tugas' && $method === 'GET') {
    $penggunaLogin = login_wajib();
    $stmt = db()->prepare('SELECT * FROM tugas WHERE id_pengguna = :id_pengguna ORDER BY tgl_deadline IS NULL, tgl_deadline ASC, id DESC');
    $stmt->execute(['id_pengguna' => (int) $penggunaLogin['id']]);
    respon_ok('Data tugas berhasil diambil', $stmt->fetchAll());
}

if ($path === '/api/tugas' && $method === 'POST') {
    $penggunaLogin = login_wajib();
    $data = ambil_json();
    $kesalahan = validasi_wajib($data, ['judul']);
    if ($kesalahan) {
        respon_gagal('Validasi gagal', 422, ['kesalahan' => $kesalahan]);
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
    respon_ok('Tugas berhasil dibuat', ['id' => (int) db()->lastInsertId()], 201);
}

if (preg_match('#^/api/tugas/(\d+)$#', $path, $cocok) && $method === 'GET') {
    $penggunaLogin = login_wajib();
    $tugas = ambil_tugas((int) $cocok[1], (int) $penggunaLogin['id']);
    if (!$tugas) {
        respon_gagal('Tugas tidak ditemukan', 404);
    }
    respon_ok('Detail tugas berhasil diambil', $tugas);
}

if (preg_match('#^/api/tugas/(\d+)$#', $path, $cocok) && $method === 'PUT') {
    $penggunaLogin = login_wajib();
    $tugas = ambil_tugas((int) $cocok[1], (int) $penggunaLogin['id']);
    if (!$tugas) {
        respon_gagal('Tugas tidak ditemukan', 404);
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

    respon_ok('Tugas berhasil diperbarui', ambil_tugas((int) $cocok[1], (int) $penggunaLogin['id']));
}

if (preg_match('#^/api/tugas/(\d+)$#', $path, $cocok) && $method === 'DELETE') {
    $penggunaLogin = login_wajib();
    $tugas = ambil_tugas((int) $cocok[1], (int) $penggunaLogin['id']);
    if (!$tugas) {
        respon_gagal('Tugas tidak ditemukan', 404);
    }

    $stmt = db()->prepare('DELETE FROM tugas WHERE id = :id AND id_pengguna = :id_pengguna');
    $stmt->execute(['id' => (int) $cocok[1], 'id_pengguna' => (int) $penggunaLogin['id']]);
    respon_ok('Tugas berhasil dihapus');
}

if (preg_match('#^/api/tugas/(\d+)/selesai$#', $path, $cocok) && $method === 'PATCH') {
    $penggunaLogin = login_wajib();
    $tugas = ambil_tugas((int) $cocok[1], (int) $penggunaLogin['id']);
    if (!$tugas) {
        respon_gagal('Tugas tidak ditemukan', 404);
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

    respon_ok('Status tugas berhasil diperbarui', ambil_tugas((int) $cocok[1], (int) $penggunaLogin['id']));
}

respon_gagal('Rute tidak ditemukan', 404);
