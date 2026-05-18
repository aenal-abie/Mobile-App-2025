/**
 * Memformat string tanggal menjadi format tanggal Indonesia yang cantik
 * Contoh: "2026-05-20T23:59:59Z" -> "Rabu, 20 Mei 2026, 23:59"
 */
export const formatTanggalIndo = (tanggalString) => {
  if (!tanggalString) return 'Tidak ada deadline';
  
  try {
    const tanggal = new Date(tanggalString);
    if (isNaN(tanggal.getTime())) return 'Format tanggal salah';

    const namaHari = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
    const namaBulan = [
      'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
      'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
    ];

    const hari = namaHari[tanggal.getDay()];
    const tanggalKe = tanggal.getDate();
    const bulan = namaBulan[tanggal.getMonth()];
    const tahun = tanggal.getFullYear();
    
    const jam = String(tanggal.getHours()).padStart(2, '0');
    const menit = String(tanggal.getMinutes()).padStart(2, '0');

    return `${hari}, ${tanggalKe} ${bulan} ${tahun} pukul ${jam}:${menit}`;
  } catch (error) {
    return 'Tanggal tidak valid';
  }
};

/**
 * Mendapatkan warna visual Tailwind/Gluestack berdasarkan prioritas tugas
 */
export const dapatkanWarnaPrioritas = (prioritas) => {
  if (prioritas === 'TINGGI') return 'error'; // Merah
  if (prioritas === 'SEDANG') return 'warning'; // Amber/Kuning
  return 'success'; // Hijau
};

/**
 * Mendapatkan warna visual Tailwind/Gluestack berdasarkan status tugas
 */
export const dapatkanWarnaStatus = (status) => {
  if (status === 'SELESAI') return 'success';
  if (status === 'SEDANG_DIKERJAKAN') return 'warning';
  return 'info';
};
