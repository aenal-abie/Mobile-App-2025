# Backend PHP

Backend REST API untuk aplikasi catatan tugas kuliah.

## Fitur
- Login dan register dengan JWT
- Profil pengguna
- CRUD tugas
- Tandai selesai / belum selesai

## Setup
1. Jalankan `composer install`
2. Salin `.env.example` menjadi `.env`
3. Import `database/schema.sql` ke MySQL
4. Jalankan `composer serve`

## Struktur Sederhana
- `public/index.php` sebagai pintu masuk
- `src/api.php` berisi semua helper dan routing
- `database/schema.sql` berisi perintah SQL

## Endpoint
- `POST /api/aut/daftar`
- `POST /api/aut/masuk`
- `POST /api/aut/keluar`
- `GET /api/aut/profil`
- `PUT /api/aut/profil`
- `GET /api/tugas`
- `GET /api/tugas/{id}`
- `POST /api/tugas`
- `PUT /api/tugas/{id}`
- `DELETE /api/tugas/{id}`
- `PATCH /api/tugas/{id}/selesai`
