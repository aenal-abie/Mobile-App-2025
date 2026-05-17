import AsyncStorage from '@react-native-async-storage/async-storage';

const KUNCI_TOKEN = '@token';
const KUNCI_PENGGUNA = '@pengguna';

export async function simpanSesi(token, pengguna) {
  await AsyncStorage.multiSet([
    [KUNCI_TOKEN, token || ''],
    [KUNCI_PENGGUNA, JSON.stringify(pengguna || null)],
  ]);
}

export async function ambilSesi() {
  const pasangan = await AsyncStorage.multiGet([KUNCI_TOKEN, KUNCI_PENGGUNA]);
  const token = pasangan[0][1];
  const pengguna = pasangan[1][1] ? JSON.parse(pasangan[1][1]) : null;
  return { token, pengguna };
}

export async function hapusSesi() {
  await AsyncStorage.multiRemove([KUNCI_TOKEN, KUNCI_PENGGUNA]);
}
