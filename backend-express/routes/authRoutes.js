const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const verifikasiToken = require('../middleware/autentikasi');

// Rute pendaftaran dan masuk akun
router.post('/daftar', authController.daftar);
router.post('/masuk', authController.masuk);
router.post('/keluar', authController.keluar);

// Rute pengelolaan profil (dilindungi verifikasiToken JWT)
router.get('/profil', verifikasiToken, authController.ambilProfil);
router.put('/profil', verifikasiToken, authController.perbaruiProfil);

module.exports = router;
