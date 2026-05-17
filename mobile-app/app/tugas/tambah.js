import React, { useState } from 'react';
import { useRouter } from 'expo-router';
import { Box } from '@/components/ui/box';
import { Text } from '@/components/ui/text';
import { Heading } from '@/components/ui/heading';
import { Input, InputField } from '@/components/ui/input';
import { Textarea, TextareaInput } from '@/components/ui/textarea';
import { Button, ButtonText, ButtonSpinner } from '@/components/ui/button';
import { ScrollView, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { gunakkanStoreTugas } from '../../store/taskStore';
import FontAwesome from '@expo/vector-icons/FontAwesome';

export default function TambahTugasScreen() {
  const router = useRouter();
  const { buatTugas, sedangMemuat } = gunakkanStoreTugas();

  // State Form
  const [judul, setJudul] = useState('');
  const [deskripsi, setDeskripsi] = useState('');
  const [mataKuliah, setMataKuliah] = useState('');
  const [prioritas, setPrioritas] = useState('SEDANG');
  
  // Custom Deadline State (Date + Time)
  const [tanggal, setTanggal] = useState(
    new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0] // Besok
  );
  const [jam, setJam] = useState('23:59');

  const setTanggalPintasan = (jumlahHari) => {
    const target = new Date();
    target.setDate(target.getDate() + jumlahHari);
    setTanggal(target.toISOString().split('T')[0]);
  };

  const tanganiSimpan = async () => {
    // Validasi Form
    if (!judul.trim()) {
      Alert.alert('Kesalahan', 'Judul tugas wajib diisi.');
      return;
    }
    if (!mataKuliah.trim()) {
      Alert.alert('Kesalahan', 'Nama mata kuliah wajib diisi.');
      return;
    }

    // Menggabungkan Tanggal dan Jam menjadi ISO String
    const deadlineString = `${tanggal}T${jam}:00`;
    const tglDeadline = new Date(deadlineString);

    if (isNaN(tglDeadline.getTime())) {
      Alert.alert('Kesalahan', 'Format tanggal atau jam deadline tidak valid.');
      return;
    }

    try {
      await buatTugas({
        judul: judul.trim(),
        deskripsi: deskripsi.trim(),
        mata_kuliah: mataKuliah.trim(),
        prioritas,
        tgl_deadline: tglDeadline.toISOString(),
        status: 'MENUNGGU',
      });

      Alert.alert('Berhasil', 'Tugas baru berhasil ditambahkan!', [
        {
          text: 'OK',
          onPress: () => {
            router.back();
          },
        },
      ]);
    } catch (err) {
      Alert.alert('Gagal menambahkan tugas', err.message);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1 bg-slate-50"
    >
      <ScrollView className="flex-1">
        <Box className="p-6 pt-12 pb-20">
          
          {/* Header Tambah */}
          <Box className="flex-row items-center gap-3 mb-8">
            <Button
              variant="link"
              className="p-1 h-auto min-w-0"
              onPress={() => router.back()}
              aria-label="Kembali"
            >
              <FontAwesome name="arrow-left" size={20} className="text-slate-500" />
            </Button>
            <Heading size="xl" className="text-slate-900 font-extrabold">
              Tambah Tugas Baru
            </Heading>
          </Box>

          <Box className="gap-5 bg-white p-6 rounded-3xl border border-slate-100 shadow-md shadow-slate-100">
            {/* Input Judul */}
            <Box className="gap-1.5">
              <Text className="text-slate-700 font-bold text-sm">Judul Tugas</Text>
              <Input className="bg-slate-50/50 border-slate-200 rounded-xl px-3 py-1 focus:border-primary-500">
                <InputField
                  placeholder="Contoh: Laporan Fisika Dasar"
                  value={judul}
                  onChangeText={setJudul}
                  className="text-slate-900 text-sm font-semibold"
                  placeholderTextColor="#94a3b8"
                />
              </Input>
            </Box>

            {/* Input Mata Kuliah */}
            <Box className="gap-1.5">
              <Text className="text-slate-700 font-bold text-sm">Mata Kuliah</Text>
              <Input className="bg-slate-50/50 border-slate-200 rounded-xl px-3 py-1 focus:border-primary-500">
                <InputField
                  placeholder="Contoh: Fisika Dasar I"
                  value={mataKuliah}
                  onChangeText={setMataKuliah}
                  className="text-slate-900 text-sm font-semibold"
                  placeholderTextColor="#94a3b8"
                />
              </Input>
            </Box>

            {/* Selector Prioritas */}
            <Box className="gap-1.5">
              <Text className="text-slate-700 font-bold text-sm">Tingkat Prioritas</Text>
              <Box className="flex-row gap-3">
                {['RENDAH', 'SEDANG', 'TINGGI'].map((p) => {
                  const isActive = prioritas === p;
                  let colorActive = 'bg-success-600 border-success-600';
                  let textActive = 'text-white';
                  if (p === 'SEDANG') colorActive = 'bg-amber-600 border-amber-600';
                  if (p === 'TINGGI') colorActive = 'bg-red-600 border-red-600';

                  return (
                    <Button
                      key={p}
                      size="sm"
                      className={`flex-1 rounded-xl py-2 h-auto border ${
                        isActive ? colorActive : 'bg-slate-50 border-slate-200'
                      }`}
                      onPress={() => setPrioritas(p)}
                    >
                      <ButtonText className={`font-extrabold text-xs ${isActive ? textActive : 'text-slate-500'}`}>{p}</ButtonText>
                    </Button>
                  );
                })}
              </Box>
            </Box>

            {/* Deadline Picker Custom */}
            <Box className="gap-2.5">
              <Text className="text-slate-700 font-bold text-sm">Batas Waktu (Deadline)</Text>
              
              {/* Shortcut Dates */}
              <Box className="flex-row gap-2 flex-wrap">
                <Button size="xs" className="bg-slate-50 border border-slate-200 rounded-full px-3 py-1 h-auto" onPress={() => setTanggalPintasan(0)}>
                  <ButtonText className="text-slate-600 text-2xs font-bold">Hari Ini</ButtonText>
                </Button>
                <Button size="xs" className="bg-slate-50 border border-slate-200 rounded-full px-3 py-1 h-auto" onPress={() => setTanggalPintasan(1)}>
                  <ButtonText className="text-slate-600 text-2xs font-bold">Besok</ButtonText>
                </Button>
                <Button size="xs" className="bg-slate-50 border border-slate-200 rounded-full px-3 py-1 h-auto" onPress={() => setTanggalPintasan(3)}>
                  <ButtonText className="text-slate-600 text-2xs font-bold">3 Hari</ButtonText>
                </Button>
                <Button size="xs" className="bg-slate-50 border border-slate-200 rounded-full px-3 py-1 h-auto" onPress={() => setTanggalPintasan(7)}>
                  <ButtonText className="text-slate-600 text-2xs font-bold">1 Minggu</ButtonText>
                </Button>
              </Box>

              {/* Tanggal & Waktu Inputs */}
              <Box className="flex-row gap-3">
                <Box className="flex-1 gap-1">
                  <Text className="text-slate-400 text-2xs font-semibold">Tanggal (YYYY-MM-DD)</Text>
                  <Input className="bg-slate-50 border-slate-200 rounded-xl px-3 py-1">
                    <InputField
                      placeholder="YYYY-MM-DD"
                      value={tanggal}
                      onChangeText={setTanggal}
                      className="text-slate-900 text-sm font-semibold"
                    />
                  </Input>
                </Box>
                <Box className="flex-1 gap-1" style={{ maxWidth: 120 }}>
                  <Text className="text-slate-400 text-2xs font-semibold">Jam (HH:MM)</Text>
                  <Input className="bg-slate-50 border-slate-200 rounded-xl px-3 py-1">
                    <InputField
                      placeholder="23:59"
                      value={jam}
                      onChangeText={setJam}
                      className="text-slate-900 text-sm font-semibold"
                    />
                  </Input>
                </Box>
              </Box>
            </Box>

            {/* Input Deskripsi */}
            <Box className="gap-1.5">
              <Text className="text-slate-700 font-bold text-sm">Deskripsi Tugas (Opsional)</Text>
              <Textarea className="bg-slate-50/50 border-slate-200 rounded-xl p-2.5 h-32 focus:border-primary-500">
                <TextareaInput
                  placeholder="Detail penjelasan mengenai tugas, tugas kelompok/individu, referensi, dll..."
                  value={deskripsi}
                  onChangeText={setDeskripsi}
                  className="text-slate-900 text-sm font-semibold"
                  placeholderTextColor="#94a3b8"
                  multiline
                />
              </Textarea>
            </Box>

            {/* Tombol Simpan */}
            <Button
              className="bg-primary-600 hover:bg-primary-700 rounded-xl py-3.5 mt-4 shadow-lg shadow-primary-600/20 active:scale-95 flex-row justify-center items-center gap-2"
              onPress={tanganiSimpan}
              disabled={sedangMemuat}
            >
              <FontAwesome name="check" size={16} className="text-white" />
              {sedangMemuat ? (
                <ButtonSpinner color="white" />
              ) : (
                <ButtonText className="text-white font-bold text-sm tracking-wide">
                  Simpan Tugas
                </ButtonText>
              )}
            </Button>

          </Box>
        </Box>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
