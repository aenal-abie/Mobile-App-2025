export function validasiEmail(email) {
  return /^\S+@\S+\.\S+$/.test(String(email || ''));
}

export function validasiPassword(kataSandi) {
  return String(kataSandi || '').length >= 6;
}

export function validasiTugas(data) {
  const kesalahan = {};
  if (!String(data.judul || '').trim()) kesalahan.judul = 'Judul wajib diisi';
  return kesalahan;
}
