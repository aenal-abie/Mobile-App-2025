export function formatTanggal(nilai) {
  if (!nilai) return '-';
  const tanggal = new Date(nilai);
  return tanggal.toLocaleDateString('id-ID', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export function formatTanggalWaktu(nilai) {
  if (!nilai) return '-';
  const tanggal = new Date(nilai);
  return tanggal.toLocaleString('id-ID');
}
