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
      className="flex-1 bg-slate-50"
    >
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
      >
        <Box className="flex-1 justify-center px-6 py-12">
          {/* Background Gradient */}
          <Box className="absolute top-0 left-0 right-0 h-[400px] opacity-15">
            <Gradient />
          </Box>

          <Box className="w-full max-w-md mx-auto z-10">
            {/* Header Form */}
            <Box className="mb-8 items-center">
              <Heading className="text-slate-900 text-3xl font-extrabold tracking-tight mb-2">
                Selamat Datang Kembali
              </Heading>
              <Text className="text-slate-500 text-center text-sm font-semibold">
                Masuk ke akun Anda untuk mengakses catatan tugas kuliah
              </Text>
            </Box>

            {/* Kotak Form (Light Shadow Mode) */}
            <Box className="bg-white p-6 rounded-3xl border border-slate-100 shadow-xl shadow-slate-200/50 gap-5">
              
              {/* Pesan Error Feedback */}
              {(error || errorValidasi) && (
                <Box className="bg-red-50 border border-red-100 p-3.5 rounded-xl">
                  <Text className="text-red-600 text-xs font-bold">
                    ⚠️ {errorValidasi || error}
                  </Text>
                </Box>
              )}

              {/* Input Email */}
              <Box className="gap-2">
                <Text className="text-slate-700 font-bold text-sm">
                  Email
                </Text>
                <Input
                  variant="outline"
                  size="md"
                  className="bg-slate-50/50 border-slate-200 focus:border-primary-500 rounded-xl"
                >
                  <InputField
                    placeholder="nama@mahasiswa.ac.id"
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    className="text-slate-900 text-sm font-medium"
                    placeholderTextColor="#94a3b8"
                  />
                </Input>
              </Box>

              {/* Input Kata Sandi */}
              <Box className="gap-2">
                <Text className="text-slate-700 font-bold text-sm">
                  Kata Sandi
                </Text>
                <Input
                  variant="outline"
                  size="md"
                  className="bg-slate-50/50 border-slate-200 focus:border-primary-500 rounded-xl"
                >
                  <InputField
                    placeholder="Masukkan kata sandi"
                    secureTextEntry={!tampilkanSandi}
                    value={kataSandi}
                    onChangeText={setKataSandi}
                    autoCapitalize="none"
                    className="text-slate-900 text-sm font-medium"
                    placeholderTextColor="#94a3b8"
                  />
                  <InputSlot
                    className="pr-3"
                    onPress={() => setTampilkanSandi(!tampilkanSandi)}
                  >
                    <InputIcon
                      as={tampilkanSandi ? EyeOffIcon : EyeIcon}
                      className="text-slate-400"
                    />
                  </InputSlot>
                </Input>
              </Box>

              {/* Tombol Aksi */}
              <Button
                onPress={tanganiLogin}
                disabled={sedangMemuat}
                className="bg-primary-600 hover:bg-primary-700 rounded-xl py-3 mt-2 shadow-lg shadow-primary-600/20 active:scale-95"
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
                <Text className="text-slate-500 text-xs font-semibold">
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
                  <Text className="text-primary-600 text-xs font-extrabold hover:underline">
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
