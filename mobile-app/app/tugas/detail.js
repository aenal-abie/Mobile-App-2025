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
      <Box className="flex-1 bg-background-950 justify-center items-center p-6">
        <Text className="text-gray-400 font-semibold mb-4">Tugas tidak ditemukan</Text>
        <Button className="bg-primary-500 rounded-xl" onPress={() => router.back()}>
          <ButtonText className="text-white font-bold">Kembali</ButtonText>
        </Button>
      </Box>
    );
  }

  const warnaPrioritas = dapatkanWarnaPrioritas(item.prioritas);
  const warnaStatus = dapatkanWarnaStatus(item.status);

  return (
    <ScrollView className="flex-1 bg-background-950">
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
              <FontAwesome name="arrow-left" size={20} className="text-gray-400" />
            </Button>
            <Heading size="xl" className="text-white font-extrabold">
              Detail Tugas
            </Heading>
          </Box>

          {/* Tombol Hapus */}
          <Button
            variant="solid"
            action="negative"
            className="bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 rounded-xl px-3 py-1.5 h-auto"
            onPress={tanganiHapus}
          >
            <FontAwesome name="trash" size={14} className="text-red-400 mr-1" />
            <ButtonText className="text-red-400 font-bold text-xs">Hapus</ButtonText>
          </Button>
        </Box>

        {/* Card Konten Detail */}
        <Card className="bg-background-900/40 border border-white/5 p-6 rounded-2xl gap-5 mb-6">
          
          {/* Judul Tugas */}
          <Box className="gap-2">
            <Heading className="text-white text-2xl font-black leading-tight">
              {item.judul}
            </Heading>
            <Text className="text-gray-400 text-sm font-semibold">
              📚 Mata Kuliah: <Text className="text-primary-400 font-extrabold">{item.mata_kuliah}</Text>
            </Text>
          </Box>

          {/* Badges Prioritas & Status */}
          <Box className="flex-row gap-3 border-y border-white/5 py-4 flex-wrap">
            <Box className="flex-1 min-w-[120px] gap-1">
              <Text className="text-gray-400 text-3xs font-extrabold tracking-wider">PRIORITAS</Text>
              <Badge variant="solid" action={warnaPrioritas} className="rounded-full px-3 py-0.5 mt-1 self-start">
                <BadgeText className="text-2xs font-extrabold">{item.prioritas}</BadgeText>
              </Badge>
            </Box>

            <Box className="flex-1 min-w-[120px] gap-1">
              <Text className="text-gray-400 text-3xs font-extrabold tracking-wider">STATUS</Text>
              <Badge variant="outline" action={warnaStatus} className="rounded-full px-3 py-0.5 mt-1 self-start border border-current">
                <BadgeText className="text-2xs font-extrabold">{item.status.replace('_', ' ')}</BadgeText>
              </Badge>
            </Box>
          </Box>

          {/* Deadline */}
          <Box className="gap-1 bg-background-950/40 border border-white/5 p-4 rounded-xl">
            <Text className="text-gray-400 text-3xs font-extrabold tracking-wider">BATAS WAKTU (DEADLINE)</Text>
            <Text className="text-white text-sm font-bold mt-1.5">
              📅 {formatTanggalIndo(item.tgl_deadline)}
            </Text>
          </Box>

          {/* Deskripsi */}
          <Box className="gap-2">
            <Text className="text-gray-400 text-3xs font-extrabold tracking-wider">DESKRIPSI DETAIL</Text>
            <Text className="text-gray-200 text-sm font-medium leading-relaxed mt-1">
              {item.deskripsi || 'Tidak ada deskripsi untuk tugas ini.'}
            </Text>
          </Box>

          {/* Checkbox Selesai & Tanggal Penyelesaian */}
          <Box className="border-t border-white/5 pt-4 gap-3">
            <Box className="flex-row items-center gap-3">
              <Checkbox
                size="md"
                value={item.sudah_selesai ? 'selesai' : ''}
                isChecked={item.sudah_selesai}
                onChange={() => tandaiSelesai(item.id)}
                aria-label={`Tandai selesai`}
              >
                <CheckboxIndicator className="rounded-md border-white/20 checked:bg-success-600 checked:border-success-600">
                  <CheckboxIcon as={CheckIcon} className="text-white" />
                </CheckboxIndicator>
              </Checkbox>
              <Text className="text-gray-300 text-sm font-bold">
                Tandai sebagai sudah selesai
              </Text>
            </Box>

            {item.sudah_selesai && item.tgl_selesai ? (
              <Box className="bg-success-500/5 border border-success-500/10 p-3 rounded-xl mt-1">
                <Text className="text-success-400 text-xs font-semibold">
                  🎉 Diselesaikan pada: {formatTanggalIndo(item.tgl_selesai)}
                </Text>
              </Box>
            ) : null}
          </Box>
        </Card>

        {/* Tombol Edit */}
        <Button
          className="bg-primary-500 hover:bg-primary-600 rounded-xl py-3.5 flex-row justify-center items-center gap-2 active:scale-95 shadow-lg shadow-primary-500/20"
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
