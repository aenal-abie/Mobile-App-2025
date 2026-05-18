const express = require('express');
const router = express.Router();
const tugasController = require('../controllers/tugasController');
const verifikasiToken = require('../middleware/autentikasi');

// Rute CRUD Utama Tugas Kuliah (Semua dilindungi JWT verifikasiToken)
router.get('/', verifikasiToken, tugasController.ambilSemuaTugas);
router.post('/', verifikasiToken, tugasController.buatTugas);

// Mengakomodasi PUT /tugas?id=X dan PUT /tugas/:id
router.put('/', verifikasiToken, tugasController.perbaruiTugas);
router.put('/:id', verifikasiToken, tugasController.perbaruiTugas);

// Mengakomodasi DELETE /tugas?id=X dan DELETE /tugas/:id
router.delete('/', verifikasiToken, tugasController.hapusTugas);
router.delete('/:id', verifikasiToken, tugasController.hapusTugas);

// Mengakomodasi GET /tugas/detail?id=X dan GET /tugas/:id
router.get('/detail', verifikasiToken, tugasController.ambilDetailTugas);
router.get('/:id', verifikasiToken, tugasController.ambilDetailTugas);

// Rute khusus menandai pengerjaan selesai (Toggle Complete)
// Mengakomodasi PUT /tugas/selesai?id=X dan PATCH /tugas/:id/selesai
router.put('/selesai', verifikasiToken, tugasController.tandaiSelesai);
router.patch('/:id/selesai', verifikasiToken, tugasController.tandaiSelesai);

module.exports = router;
