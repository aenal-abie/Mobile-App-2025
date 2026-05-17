import React, { useState } from 'react';
import { useRouter } from 'expo-router';
import { Box } from '@/components/ui/box';
import { Text } from '@/components/ui/text';
import { Heading } from '@/components/ui/heading';
import { Input, InputField, InputSlot, InputIcon } from '@/components/ui/input';
import { Button, ButtonText, ButtonSpinner } from '@/components/ui/button';
import { EyeIcon, EyeOffIcon } from '@/components/ui/icon';
import { KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { gunakkanStoreAut } from '../../store/authStore';
import Gradient from '@/assets/icons/Gradient';

export default function RegisterScreen() {
  const router = useRouter();
  const { daftar, sedangMemuat, error, bersihkanError } = gunakkanStoreAut();

  const [nama, setNama] = useState('');
  const [email, setEmail] = useState('');
  const [kataSandi, setKataSandi] = useState('');
  const [konfirmasiSandi, setKonfirmasiSandi] = useState('');
  
  const [tampilkanSandi, setTampilkanSandi] = useState(false);
  const [tampilkanKonfirmasi, setTampilkanKonfirmasi] = useState(false);
  const [errorValidasi, setErrorValidasi] = useState('');

  const tanganiDaftar = async () => {
    bersihkanError();
    setErrorValidasi('');

    // Validasi Kolom Kosong
    if (!nama.trim() || !email.trim() || !kataSandi.trim() || !konfirmasiSandi.trim()) {
      setErrorValidasi('Semua kolom wajib diisi');
      return;
    }

    // Validasi Format Email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setErrorValidasi('Format email tidak valid');
      return;
    }

    // Validasi Kekuatan Kata Sandi
    if (kataSandi.length < 6) {
      setErrorValidasi('Kata sandi harus minimal 6 karakter');
      return;
    }

    // Validasi Kecocokan Kata Sandi
    if (kataSandi !== konfirmasiSandi) {
      setErrorValidasi('Konfirmasi kata sandi tidak cocok');
      return;
    }

    try {
      await daftar(email, nama, kataSandi);
      router.replace('/tabs/home');
    } catch (err) {
      // Error ditangani oleh store
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1 bg-background-950"
    >
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
      >
        <Box className="flex-1 justify-center px-6 py-8">
          {/* Background Gradient */}
          <Box className="absolute top-0 left-0 right-0 h-[400px] opacity-35">
            <Gradient />
          </Box>

          <Box className="w-full max-w-md mx-auto z-10">
            {/* Header Form */}
            <Box className="mb-6 items-center">
              <Heading className="text-white text-3xl font-extrabold tracking-tight mb-2">
                Buat Akun Baru
              </Heading>
              <Text className="text-gray-400 text-center text-sm font-medium">
                Daftar sekarang untuk mulai mengelola tugas-tugas kuliah Anda
              </Text>
            </Box>

            {/* Kotak Form Glassmorphism */}
            <Box className="bg-background-900/60 p-6 rounded-2xl border border-white/10 shadow-2xl backdrop-blur-md gap-4">
              
              {/* Pesan Error Feedback */}
              {(error || errorValidasi) && (
                <Box className="bg-red-500/10 border border-red-500/30 p-3 rounded-lg">
                  <Text className="text-red-400 text-xs font-semibold">
                    ⚠️ {errorValidasi || error}
                  </Text>
                </Box>
              )}

              {/* Input Nama */}
              <Box className="gap-1.5">
                <Text className="text-gray-300 font-semibold text-sm">
                  Nama Lengkap
                </Text>
                <Input
                  variant="outline"
                  size="md"
                  className="bg-background-950/40 border-white/10 focus:border-primary-500 rounded-xl"
                >
                  <InputField
                    placeholder="Nama Lengkap Anda"
                    value={nama}
                    onChangeText={setNama}
                    autoCapitalize="words"
                    className="text-white text-sm"
                  />
                </Input>
              </Box>

              {/* Input Email */}
              <Box className="gap-1.5">
                <Text className="text-gray-300 font-semibold text-sm">
                  Email
                </Text>
                <Input
                  variant="outline"
                  size="md"
                  className="bg-background-950/40 border-white/10 focus:border-primary-500 rounded-xl"
                >
                  <InputField
                    placeholder="nama@mahasiswa.ac.id"
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    className="text-white text-sm"
                  />
                </Input>
              </Box>

              {/* Input Kata Sandi */}
              <Box className="gap-1.5">
                <Text className="text-gray-300 font-semibold text-sm">
                  Kata Sandi
                </Text>
                <Input
                  variant="outline"
                  size="md"
                  className="bg-background-950/40 border-white/10 focus:border-primary-500 rounded-xl"
                >
                  <InputField
                    placeholder="Minimal 6 karakter"
                    secureTextEntry={!tampilkanSandi}
                    value={kataSandi}
                    onChangeText={setKataSandi}
                    autoCapitalize="none"
                    className="text-white text-sm"
                  />
                  <InputSlot
                    className="pr-3"
                    onPress={() => setTampilkanSandi(!tampilkanSandi)}
                  >
                    <InputIcon
                      as={tampilkanSandi ? EyeOffIcon : EyeIcon}
                      className="text-gray-400"
                    />
                  </InputSlot>
                </Input>
              </Box>

              {/* Input Konfirmasi Kata Sandi */}
              <Box className="gap-1.5">
                <Text className="text-gray-300 font-semibold text-sm">
                  Konfirmasi Kata Sandi
                </Text>
                <Input
                  variant="outline"
                  size="md"
                  className="bg-background-950/40 border-white/10 focus:border-primary-500 rounded-xl"
                >
                  <InputField
                    placeholder="Ulangi kata sandi"
                    secureTextEntry={!tampilkanKonfirmasi}
                    value={konfirmasiSandi}
                    onChangeText={setKonfirmasiSandi}
                    autoCapitalize="none"
                    className="text-white text-sm"
                  />
                  <InputSlot
                    className="pr-3"
                    onPress={() => tampilkanKonfirmasi ? setTampilkanKonfirmasi(false) : setTampilkanKonfirmasi(true)}
                  >
                    <InputIcon
                      as={tampilkanKonfirmasi ? EyeOffIcon : EyeIcon}
                      className="text-gray-400"
                    />
                  </InputSlot>
                </Input>
              </Box>

              {/* Tombol Daftar */}
              <Button
                onPress={tanganiDaftar}
                disabled={sedangMemuat}
                className="bg-primary-500 hover:bg-primary-600 rounded-xl py-3 mt-3 shadow-lg shadow-primary-500/20 active:scale-95"
              >
                {sedangMemuat ? (
                  <ButtonSpinner color="white" />
                ) : (
                  <ButtonText className="font-bold text-sm tracking-wide text-white">
                    Daftar Akun
                  </ButtonText>
                )}
              </Button>

              {/* Tautan Kembali ke Login */}
              <Box className="flex-row justify-center items-center mt-2 gap-1">
                <Text className="text-gray-400 text-xs font-medium">
                  Sudah memiliki akun?
                </Text>
                <Button
                  variant="link"
                  className="p-0 h-auto"
                  onPress={() => {
                    bersihkanError();
                    setErrorValidasi('');
                    router.back();
                  }}
                >
                  <Text className="text-primary-400 text-xs font-bold hover:underline">
                    Masuk di sini
                  </Text>
                </Button>
              </Box>

            </Box>
          </Box>
        </Box>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
