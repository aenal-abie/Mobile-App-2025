import React, { useState } from 'react';
import { useRouter } from 'expo-router';
import { Alert, ScrollView } from 'react-native';
import { Box } from '@/components/ui/box';
import { Text } from '@/components/ui/text';
import { Heading } from '@/components/ui/heading';
import { Card } from '@/components/ui/card';
import { Input, InputField } from '@/components/ui/input';
import { Button, ButtonText, ButtonSpinner } from '@/components/ui/button';
import { gunakkanStoreAut } from '../../../store/authStore';
import { gunakkanStoreTugas } from '../../../store/taskStore';
import { formatTanggalIndo } from '../../../utils/formatting';
import FontAwesome from '@expo/vector-icons/FontAwesome';

export default function ProfileScreen() {
  const router = useRouter();
  const { pengguna, keluar, perbaruiProfil, sedangMemuat } = gunakkanStoreAut();
  const { tugas } = gunakkanStoreTugas();

  const [namaBaru, setNamaBaru] = useState(pengguna?.nama || '');
  const [sedangMengedit, setSedangMengedit] = useState(false);
  const [pesanSukses, setPesanSukses] = useState('');

  // Menghitung statistik tugas untuk user dashboard
  const totalTugas = tugas.length;
  const tugasSelesai = tugas.filter((t) => t.sudah_selesai).length;
  const tugasMenunggu = totalTugas - tugasSelesai;

  const tanganiPerbaruiProfil = async () => {
    if (!namaBaru.trim()) {
      Alert.alert('Kesalahan', 'Nama lengkap tidak boleh kosong.');
      return;
    }

    try {
      await perbaruiProfil(namaBaru);
      setPesanSukses('Profil berhasil diperbarui!');
      setSedangMengedit(false);
      setTimeout(() => setPesanSukses(''), 3000);
    } catch (err) {
      Alert.alert('Gagal memperbarui profil', err.message);
    }
  };

  const tanganiKeluar = () => {
    Alert.alert(
      'Keluar Aplikasi',
      'Apakah Anda yakin ingin keluar dari akun Anda?',
      [
        { text: 'Batal', style: 'cancel' },
        {
          text: 'Keluar',
          style: 'destructive',
          onPress: async () => {
            await keluar();
            router.replace('/auth/login');
          },
        },
      ]
    );
  };

  return (
    <ScrollView className="flex-1 bg-background-950">
      <Box className="flex-1 p-6 pb-20 pt-16">
        
        {/* Header Profil */}
        <Box className="items-center mb-8 gap-3">
          {/* Avatar Ring Premium */}
          <Box className="bg-primary-500/10 border-2 border-primary-500 p-6 rounded-full relative">
            <FontAwesome name="user" size={60} className="text-primary-400" />
            <Box className="absolute bottom-1 right-1 bg-success-500 h-4 w-4 rounded-full border-2 border-background-950" />
          </Box>
          <Heading size="xl" className="text-white font-extrabold mt-2">
            {pengguna?.nama || 'Pengguna'}
          </Heading>
          <Text className="text-gray-400 text-sm font-medium -mt-2">
            {pengguna?.email || 'email@mahasiswa.ac.id'}
          </Text>
        </Box>

        {/* Informasi Status Sukses */}
        {pesanSukses ? (
          <Box className="bg-success-500/10 border border-success-500/30 p-3 rounded-xl mb-4">
            <Text className="text-success-400 text-xs font-semibold text-center">
              ✅ {pesanSukses}
            </Text>
          </Box>
        ) : null}

        {/* Kotak Ringkasan Statistik */}
        <Box className="flex-row justify-between gap-4 mb-6">
          <Card className="flex-1 bg-background-900/40 border border-white/5 p-4 rounded-2xl items-center">
            <Text className="text-gray-400 text-3xs font-extrabold tracking-wider">TOTAL TUGAS</Text>
            <Text className="text-white text-2xl font-black mt-1">{totalTugas}</Text>
          </Card>
          <Card className="flex-1 bg-background-900/40 border border-white/5 p-4 rounded-2xl items-center">
            <Text className="text-success-400 text-3xs font-extrabold tracking-wider">SELESAI</Text>
            <Text className="text-success-400 text-2xl font-black mt-1">{tugasSelesai}</Text>
          </Card>
          <Card className="flex-1 bg-background-900/40 border border-white/5 p-4 rounded-2xl items-center">
            <Text className="text-primary-400 text-3xs font-extrabold tracking-wider">MENUNGGU</Text>
            <Text className="text-primary-400 text-2xl font-black mt-1">{tugasMenunggu}</Text>
          </Card>
        </Box>

        {/* Kotak Pengaturan Profil */}
        <Card className="bg-background-900/40 border border-white/5 p-5 rounded-2xl mb-6 gap-4">
          <Box className="flex-row justify-between items-center pb-2 border-b border-white/5">
            <Heading size="md" className="text-white font-extrabold">Informasi Akun</Heading>
            {!sedangMengedit ? (
              <Button
                variant="link"
                className="p-0 h-auto min-w-0"
                onPress={() => setSedangMengedit(true)}
              >
                <Text className="text-primary-400 text-xs font-bold">Ubah Nama</Text>
              </Button>
            ) : (
              <Button
                variant="link"
                className="p-0 h-auto min-w-0"
                onPress={() => {
                  setNamaBaru(pengguna?.nama || '');
                  setSedangMengedit(false);
                }}
              >
                <Text className="text-gray-400 text-xs font-bold">Batal</Text>
              </Button>
            )}
          </Box>

          {/* Edit / Detail Input Nama */}
          <Box className="gap-1.5">
            <Text className="text-gray-400 text-xs font-bold">Nama Lengkap</Text>
            {sedangMengedit ? (
              <Box className="flex-row gap-2 items-center">
                <Input className="flex-1 bg-background-950 border-white/10 rounded-xl px-3 py-1">
                  <InputField
                    value={namaBaru}
                    onChangeText={setNamaBaru}
                    className="text-white text-sm"
                  />
                </Input>
                <Button
                  size="sm"
                  className="bg-primary-500 rounded-xl px-4"
                  onPress={tanganiPerbaruiProfil}
                  disabled={sedangMemuat}
                >
                  {sedangMemuat ? (
                    <ButtonSpinner color="white" />
                  ) : (
                    <ButtonText className="text-white text-xs font-bold">Simpan</ButtonText>
                  )}
                </Button>
              </Box>
            ) : (
              <Text className="text-white text-sm font-semibold">{pengguna?.nama}</Text>
            )}
          </Box>

          {/* Informasi Email (Read-Only) */}
          <Box className="gap-1.5">
            <Text className="text-gray-400 text-xs font-bold">Email</Text>
            <Text className="text-white text-sm font-semibold">{pengguna?.email}</Text>
          </Box>

          {/* Informasi Terdaftar */}
          <Box className="gap-1.5">
            <Text className="text-gray-400 text-xs font-bold">Terdaftar Pada</Text>
            <Text className="text-white text-sm font-semibold">
              {formatTanggalIndo(pengguna?.dibuat || new Date().toISOString())}
            </Text>
          </Box>
        </Card>

        {/* Tombol Keluar */}
        <Button
          variant="solid"
          action="negative"
          className="bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 rounded-xl py-3.5 flex-row justify-center items-center gap-2 active:scale-95"
          onPress={tanganiKeluar}
        >
          <FontAwesome name="sign-out" size={16} className="text-red-400" />
          <ButtonText className="text-red-400 font-bold text-sm tracking-wide">
            Keluar dari Aplikasi
          </ButtonText>
        </Button>

      </Box>
    </ScrollView>
  );
}
