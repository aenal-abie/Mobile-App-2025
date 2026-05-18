import React from 'react';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Alert, ScrollView } from 'react-native';
import { Box } from '@/components/ui/box';
import { Text } from '@/components/ui/text';
import { Heading } from '@/components/ui/heading';
import { Card } from '@/components/ui/card';
import { Badge, BadgeText } from '@/components/ui/badge';
import { Checkbox, CheckboxIndicator, CheckboxIcon } from '@/components/ui/checkbox';
import { CheckIcon } from '@/components/ui/icon';
import { Button, ButtonText } from '@/components/ui/button';
import { gunakkanStoreTugas } from '../../store/taskStore';
import { formatTanggalIndo, dapatkanWarnaPrioritas, dapatkanWarnaStatus } from '../../utils/formatting';
import FontAwesome from '@expo/vector-icons/FontAwesome';

export default function DetailTugasScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const { tugas, tandaiSelesai, hapusTugas } = gunakkanStoreTugas();

  // Cari data tugas
  const item = tugas.find((t) => String(t.id) === String(id));

  const tanganiHapus = () => {
    if (!item) return;

    Alert.alert(
      'Hapus Tugas',
      `Apakah Anda yakin ingin menghapus tugas "${item.judul}"?`,
      [
        { text: 'Batal', style: 'cancel' },
        {
          text: 'Hapus',
          style: 'destructive',
          onPress: async () => {
            try {
              await hapusTugas(item.id);
              router.back();
            } catch (err) {
              Alert.alert('Gagal menghapus tugas', err.message);
            }
          },
        },
      ]
    );
  };

  if (!item) {
    return (
      <Box className="flex-1 bg-slate-50 justify-center items-center p-6">
        <Text className="text-slate-500 font-bold mb-4">Tugas tidak ditemukan</Text>
        <Button className="bg-primary-600 rounded-xl" onPress={() => router.back()}>
          <ButtonText className="text-white font-bold">Kembali</ButtonText>
        </Button>
      </Box>
    );
  }

  const warnaPrioritas = dapatkanWarnaPrioritas(item.prioritas);
  const warnaStatus = dapatkanWarnaStatus(item.status);

  return (
    <ScrollView className="flex-1 bg-slate-50">
      <Box className="p-6 pt-12 pb-20">
        
        {/* Header Detail */}
        <Box className="flex-row items-center justify-between mb-8">
          <Box className="flex-row items-center gap-3">
            <Button
              variant="link"
              className="p-1 h-auto min-w-0"
              onPress={() => router.back()}
              aria-label="Kembali"
            >
              <FontAwesome name="arrow-left" size={20} className="text-slate-500" />
            </Button>
            <Heading size="xl" className="text-slate-900 font-extrabold">
              Detail Tugas
            </Heading>
          </Box>

          {/* Tombol Hapus */}
          <Button
            variant="solid"
            action="negative"
            className="bg-red-50 hover:bg-red-100 border border-red-200/50 rounded-xl px-3 py-1.5 h-auto shadow-sm shadow-red-100"
            onPress={tanganiHapus}
          >
            <FontAwesome name="trash" size={14} className="text-red-600 mr-1" />
            <ButtonText className="text-red-600 font-bold text-xs">Hapus</ButtonText>
          </Button>
        </Box>

        {/* Card Konten Detail */}
        <Card className="bg-white border border-slate-100 p-6 rounded-3xl gap-5 mb-6 shadow-sm shadow-slate-100">
          
          {/* Judul Tugas */}
          <Box className="gap-2">
            <Heading className="text-slate-900 text-2xl font-black leading-tight">
              {item.judul}
            </Heading>
            <Text className="text-slate-500 text-sm font-bold">
              📚 Mata Kuliah: <Text className="text-primary-600 font-extrabold">{item.mata_kuliah}</Text>
            </Text>
          </Box>

          {/* Badges Prioritas & Status */}
          <Box className="flex-row gap-3 border-y border-slate-100 py-4 flex-wrap">
            <Box className="flex-1 min-w-[120px] gap-1">
              <Text className="text-slate-400 text-3xs font-extrabold tracking-wider">PRIORITAS</Text>
              <Badge variant="solid" action={warnaPrioritas} className="rounded-full px-3 py-0.5 mt-1 self-start">
                <BadgeText className="text-2xs font-extrabold">{item.prioritas}</BadgeText>
              </Badge>
            </Box>

            <Box className="flex-1 min-w-[120px] gap-1">
              <Text className="text-slate-400 text-3xs font-extrabold tracking-wider">STATUS</Text>
              <Badge variant="outline" action={warnaStatus} className="rounded-full px-3 py-0.5 mt-1 self-start border border-current">
                <BadgeText className="text-2xs font-extrabold">{item.status.replace('_', ' ')}</BadgeText>
              </Badge>
            </Box>
          </Box>

          {/* Deadline */}
          <Box className="gap-1 bg-slate-50 border border-slate-100 p-4 rounded-2xl shadow-inner">
            <Text className="text-slate-400 text-3xs font-extrabold tracking-wider">BATAS WAKTU (DEADLINE)</Text>
            <Text className="text-slate-800 text-sm font-extrabold mt-1.5">
              📅 {formatTanggalIndo(item.tgl_deadline)}
            </Text>
          </Box>

          {/* Deskripsi */}
          <Box className="gap-2">
            <Text className="text-slate-400 text-3xs font-extrabold tracking-wider">DESKRIPSI DETAIL</Text>
            <Text className="text-slate-700 text-sm font-semibold leading-relaxed mt-1">
              {item.deskripsi || 'Tidak ada deskripsi untuk tugas ini.'}
            </Text>
          </Box>

          {/* Checkbox Selesai & Tanggal Penyelesaian */}
          <Box className="border-t border-slate-100 pt-4 gap-3">
            <Box className="flex-row items-center gap-3">
              <Checkbox
                size="md"
                value={item.sudah_selesai ? 'selesai' : ''}
                isChecked={item.sudah_selesai}
                onChange={() => tandaiSelesai(item.id)}
                aria-label={`Tandai selesai`}
              >
                <CheckboxIndicator className="rounded-md border-slate-300 checked:bg-success-600 checked:border-success-600">
                  <CheckboxIcon as={CheckIcon} className="text-white" />
                </CheckboxIndicator>
              </Checkbox>
              <Text className="text-slate-800 text-sm font-bold">
                Tandai sebagai sudah selesai
              </Text>
            </Box>

            {item.sudah_selesai && item.tgl_selesai ? (
              <Box className="bg-success-50 border border-success-200 p-3 rounded-xl mt-1 shadow-sm shadow-success-100">
                <Text className="text-success-600 text-xs font-bold">
                  🎉 Diselesaikan pada: {formatTanggalIndo(item.tgl_selesai)}
                </Text>
              </Box>
            ) : null}
          </Box>
        </Card>

        {/* Tombol Edit */}
        <Button
          className="bg-primary-600 hover:bg-primary-700 rounded-xl py-3.5 flex-row justify-center items-center gap-2 active:scale-95 shadow-lg shadow-primary-600/20"
          onPress={() => router.push(`/tugas/edit?id=${item.id}`)}
        >
          <FontAwesome name="pencil" size={16} className="text-white" />
          <ButtonText className="text-white font-bold text-sm tracking-wide">
            Ubah Detail Tugas
          </ButtonText>
        </Button>

      </Box>
    </ScrollView>
  );
}
