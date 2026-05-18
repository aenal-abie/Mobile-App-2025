const jwt = require('jsonwebtoken');

/**
 * Middleware untuk mengamankan endpoint API dengan memverifikasi token JWT
 */
const verifikasiToken = (req, res, next) => {
  const headerOtorisasi = req.headers['authorization'];
  
  // Memeriksa keberadaan header Authorization
  if (!headerOtorisasi) {
    return res.status(401).json({
      sukses: false,
      pesan: 'Akses ditolak. Token otorisasi tidak ditemukan.'
    });
  }

  // Format token harus berupa: Bearer <TOKEN>
  const bagianToken = headerOtorisasi.split(' ');
  if (bagianToken[0] !== 'Bearer' || !bagianToken[1]) {
    return res.status(401).json({
      sukses: false,
      pesan: 'Format token otorisasi tidak valid. Gunakan format "Bearer <TOKEN>".'
    });
  }

  const token = bagianToken[1];

  try {
    // Memverifikasi token JWT menggunakan kunci rahasia
    const dataTerdekripsi = jwt.verify(token, process.env.JWT_SECRET || 'rahasia_token_tugas_anda_bebas');
    
    // Menyimpan id pengguna ke dalam objek request agar bisa diakses oleh controller
    req.idPengguna = dataTerdekripsi.id;
    
    next(); // Lanjutkan ke pengendali (controller) berikutnya
  } catch (err) {
    return res.status(401).json({
      sukses: false,
      pesan: 'Token tidak valid atau telah kedaluwarsa. Silakan login kembali.'
    });
  }
};

module.exports = verifikasiToken;
