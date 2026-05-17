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

export default function LoginScreen() {
  const router = useRouter();
  const { masuk, sedangMemuat, error, bersihkanError } = gunakkanStoreAut();

  const [email, setEmail] = useState('');
  const [kataSandi, setKataSandi] = useState('');
  const [tampilkanSandi, setTampilkanSandi] = useState(false);
  const [errorValidasi, setErrorValidasi] = useState('');

  const tanganiLogin = async () => {
    bersihkanError();
    setErrorValidasi('');

    // Validasi Sederhana
    if (!email.trim() || !kataSandi.trim()) {
      setErrorValidasi('Email dan kata sandi wajib diisi');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setErrorValidasi('Format email tidak valid');
      return;
    }

    try {
      await masuk(email, kataSandi);
      router.replace('/tabs/home');
    } catch (err) {
      // Error di-handle oleh store
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
        <Box className="flex-1 justify-center px-6 py-12">
          {/* Background Gradient */}
          <Box className="absolute top-0 left-0 right-0 h-[400px] opacity-30">
            <Gradient />
          </Box>

          <Box className="w-full max-w-md mx-auto z-10">
            {/* Header Form */}
            <Box className="mb-8 items-center">
              <Heading className="text-white text-3xl font-extrabold tracking-tight mb-2">
                Selamat Datang Kembali
              </Heading>
              <Text className="text-gray-400 text-center text-sm font-medium">
                Masuk ke akun Anda untuk mengakses catatan tugas kuliah
              </Text>
            </Box>

            {/* Kotak Form (Glassmorphism Effect) */}
            <Box className="bg-background-900/60 p-6 rounded-2xl border border-white/10 shadow-2xl backdrop-blur-md gap-5">
              
              {/* Pesan Error Feedback */}
              {(error || errorValidasi) && (
                <Box className="bg-red-500/10 border border-red-500/30 p-3 rounded-lg">
                  <Text className="text-red-400 text-xs font-semibold">
                    ⚠️ {errorValidasi || error}
                  </Text>
                </Box>
              )}

              {/* Input Email */}
              <Box className="gap-2">
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
              <Box className="gap-2">
                <Text className="text-gray-300 font-semibold text-sm">
                  Kata Sandi
                </Text>
                <Input
                  variant="outline"
                  size="md"
                  className="bg-background-950/40 border-white/10 focus:border-primary-500 rounded-xl"
                >
                  <InputField
                    placeholder="Masukkan kata sandi"
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

              {/* Tombol Aksi */}
              <Button
                onPress={tanganiLogin}
                disabled={sedangMemuat}
                className="bg-primary-500 hover:bg-primary-600 rounded-xl py-3 mt-2 shadow-lg shadow-primary-500/20 active:scale-95"
              >
                {sedangMemuat ? (
                  <ButtonSpinner color="white" />
                ) : (
                  <ButtonText className="font-bold text-sm tracking-wide text-white">
                    Masuk Sekarang
                  </ButtonText>
                )}
              </Button>

              {/* Tautan ke Register */}
              <Box className="flex-row justify-center items-center mt-3 gap-1">
                <Text className="text-gray-400 text-xs font-medium">
                  Belum punya akun?
                </Text>
                <Button
                  variant="link"
                  className="p-0 h-auto"
                  onPress={() => {
                    bersihkanError();
                    setErrorValidasi('');
                    router.push('/auth/register');
                  }}
                >
                  <Text className="text-primary-400 text-xs font-bold hover:underline">
                    Daftar di sini
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
