import React, { useEffect, useState } from 'react';
import { useRouter } from 'expo-router';
import { Box } from '@/components/ui/box';
import { Text } from '@/components/ui/text';
import { Spinner } from '@/components/ui/spinner';
import { gunakkanStoreAut } from '../store/authStore';
import Gradient from '@/assets/icons/Gradient';
import Logo from '@/assets/icons/Logo';

export default function GateAut() {
  const router = useRouter();
  const { token, sedangMemuat, inisialisasiAuth } = gunakkanStoreAut();
  const [sudahSiap, setSudahSiap] = useState(false);

  useEffect(() => {
    // Jalankan inisialisasi status login
    const muatAuth = async () => {
      await inisialisasiAuth();
      setSudahSiap(true);
    };
    muatAuth();
  }, []);

  useEffect(() => {
    if (sudahSiap && !sedangMemuat) {
      if (token) {
        // Jika sudah login, arahkan ke Tab Home Tugas
        router.replace('/tabs/home');
      } else {
        // Jika belum login, arahkan ke halaman Login
        router.replace('/auth/login');
      }
    }
  }, [sudahSiap, sedangMemuat, token]);

  return (
    <Box className="flex-1 bg-slate-50 justify-center items-center h-[100vh]">
      {/* Background Gradient Premium */}
      <Box className="absolute h-[500px] w-[500px] lg:w-[700px] lg:h-[700px] opacity-15">
        <Gradient />
      </Box>

      <Box className="items-center z-10 gap-6">
        <Box className="h-[120px] w-[120px] justify-center items-center">
          <Logo />
        </Box>
        <Text className="text-slate-900 font-extrabold text-3xl tracking-wider">
          TugasKu
        </Text>
        <Text className="text-slate-500 text-center font-semibold px-6 -mt-2">
          Catatan Tugas Kuliah Modern & Terorganisir
        </Text>
        <Box className="flex-row items-center gap-3 mt-6 bg-white py-3 px-6 rounded-full border border-slate-100 shadow-md shadow-slate-100">
          <Spinner size="small" color="#3b82f6" />
          <Text className="text-slate-700 text-sm font-semibold">
            Memuat data...
          </Text>
        </Box>
      </Box>
    </Box>
  );
}
