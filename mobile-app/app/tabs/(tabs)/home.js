import React, { useEffect, useState } from 'react';
import { useRouter } from 'expo-router';
import { FlatList, RefreshControl, Alert, Pressable } from 'react-native';
import { Box } from '@/components/ui/box';
import { Text } from '@/components/ui/text';
import { Heading } from '@/components/ui/heading';
import { Card } from '@/components/ui/card';
import { Badge, BadgeText } from '@/components/ui/badge';
import { Checkbox, CheckboxIndicator, CheckboxIcon } from '@/components/ui/checkbox';
import { CheckIcon, AddIcon } from '@/components/ui/icon';
import { Fab, FabIcon } from '@/components/ui/fab';
import { Button, ButtonText } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { Input, InputField } from '@/components/ui/input';
import { gunakkanStoreAut } from '../../../store/authStore';
import { gunakkanStoreTugas } from '../../../store/taskStore';
import { formatTanggalIndo, dapatkanWarnaPrioritas, dapatkanWarnaStatus } from '../../../utils/formatting';
import FontAwesome from '@expo/vector-icons/FontAwesome';

export default function HomeScreen() {
  const router = useRouter();
  const { pengguna } = gunakkanStoreAut();
  const {
    ambilTugas,
    tandaiSelesai,
    hapusTugas,
    sedangMemuat,
    filter,
    setFilter,
    sort,
    setSort,
    getTugasFiltered,
  } = gunakkanStoreTugas();

  const [kataKunci, setKataKunci] = useState('');
  const [sedangMenyegarkan, setSedangMenyegarkan] = useState(false);

  useEffect(() => {
    ambilTugas();
  }, []);

  const tanganiSegarkan = async () => {
    setSedangMenyegarkan(true);
    await ambilTugas();
    setSedangMenyegarkan(false);
  };

  const tanganiHapus = (id, judul) => {
    Alert.alert(
      'Hapus Tugas',
      `Apakah Anda yakin ingin menghapus tugas "${judul}"?`,
      [
        { text: 'Batal', style: 'cancel' },
        {
          text: 'Hapus',
          style: 'destructive',
          onPress: async () => {
            try {
              await hapusTugas(id);
            } catch (err) {
              Alert.alert('Gagal menghapus tugas', err.message);
            }
          },
        },
      ]
    );
  };

  // Mendapatkan data tugas yang difilter & diurutkan dari store, lalu disaring berdasarkan kata kunci pencarian
  const semuaTugas = getTugasFiltered();
  const tugasTampil = semuaTugas.filter(
    (t) =>
      t.judul.toLowerCase().includes(kataKunci.toLowerCase()) ||
      t.mata_kuliah.toLowerCase().includes(kataKunci.toLowerCase())
  );

  const renderKartuTugas = ({ item }) => {
    const warnaPrioritas = dapatkanWarnaPrioritas(item.prioritas);
    const warnaStatus = dapatkanWarnaStatus(item.status);

    return (
      <Card
        className={`mb-4 mx-4 p-5 rounded-2xl border border-white/10 bg-background-900/40 relative active:opacity-90 ${
          item.sudah_selesai ? 'opacity-60' : ''
        }`}
        style={{ elevation: 2 }}
      >
        <Box className="flex-row items-start justify-between gap-3">
          {/* Checkbox Selesai Cepat */}
          <Checkbox
            size="md"
            value={item.sudah_selesai ? 'selesai' : ''}
            isChecked={item.sudah_selesai}
            onChange={() => tandaiSelesai(item.id)}
            aria-label={`Tandai ${item.judul} selesai`}
            className="mt-1"
          >
            <CheckboxIndicator className="rounded-md border-white/20 checked:bg-success-600 checked:border-success-600">
              <CheckboxIcon as={CheckIcon} className="text-white" />
            </CheckboxIndicator>
          </Checkbox>

          {/* Konten Tugas */}
          <Box className="flex-1 ml-1" style={{ width: '60%' }}>
            <Pressable style={{ width: '100%' }} onPress={() => router.push(`/tugas/detail?id=${item.id}`)}>
              <Heading
                size="md"
                className={`text-white font-bold leading-tight ${
                  item.sudah_selesai ? 'line-through text-gray-500' : ''
                }`}
              >
                {item.judul}
              </Heading>
              
              <Text className="text-gray-400 text-xs font-semibold mt-1">
                📚 {item.mata_kuliah}
              </Text>
              
              {/* Prioritas & Status Badges */}
              <Box className="flex-row gap-2 mt-3 flex-wrap">
                <Badge size="sm" variant="solid" action={warnaPrioritas} className="rounded-full px-2.5 py-0.5">
                  <BadgeText className="text-2xs font-extrabold">{item.prioritas}</BadgeText>
                </Badge>

                <Badge size="sm" variant="outline" action={warnaStatus} className="rounded-full px-2.5 py-0.5 border border-current">
                  <BadgeText className="text-2xs font-extrabold">{item.status.replace('_', ' ')}</BadgeText>
                </Badge>
              </Box>

              <Text className="text-gray-500 text-3xs font-medium mt-3.5">
                📅 Deadline: {formatTanggalIndo(item.tgl_deadline)}
              </Text>
            </Pressable>
          </Box>

          {/* Tombol Hapus & Edit */}
          <Box className="flex-row gap-2">
            <Button
              variant="link"
              className="p-1 h-auto min-w-0"
              onPress={() => router.push(`/tugas/edit?id=${item.id}`)}
              aria-label="Edit tugas"
            >
              <FontAwesome name="pencil" size={16} className="text-primary-400" />
            </Button>
            <Button
              variant="link"
              className="p-1 h-auto min-w-0"
              onPress={() => tanganiHapus(item.id, item.judul)}
              aria-label="Hapus tugas"
            >
              <FontAwesome name="trash" size={16} className="text-red-400" />
            </Button>
          </Box>
        </Box>
      </Card>
    );
  };

  return (
    <Box className="flex-1 bg-background-950">
      {/* Header Premium */}
      <Box className="pt-14 pb-5 px-5 bg-background-900 border-b border-white/5">
        <Box className="flex-row justify-between items-center">
          <Box>
            <Text className="text-gray-400 text-xs font-semibold tracking-wider">
              SELAMAT DATANG
            </Text>
            <Heading size="xl" className="text-white font-extrabold">
              {pengguna?.nama || 'Mahasiswa'} 👋
            </Heading>
          </Box>
          <Box className="bg-primary-500/10 border border-primary-500/20 p-2.5 rounded-2xl">
            <FontAwesome name="calendar-check-o" size={22} className="text-primary-400" />
          </Box>
        </Box>

        {/* Pencarian */}
        <Input className="bg-background-950 border-white/10 rounded-xl mt-4 px-3 py-1">
          <InputField
            placeholder="Cari tugas atau mata kuliah..."
            value={kataKunci}
            onChangeText={setKataKunci}
            className="text-white text-sm"
          />
        </Input>
      </Box>

      {/* Filter Status (Horizontal) */}
      <Box className="py-3 px-4 border-b border-white/5">
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={[
            { label: 'Semua', value: 'SEMUA' },
            { label: 'Menunggu', value: 'MENUNGGU' },
            { label: 'Dikerjakan', value: 'SEDANG_DIKERJAKAN' },
            { label: 'Selesai', value: 'SELESAI' },
          ]}
          keyExtractor={(item) => item.value}
          contentContainerStyle={{ gap: 8 }}
          renderItem={({ item }) => (
            <Button
              size="sm"
              onPress={() => setFilter(item.value)}
              className={`rounded-full px-4 py-1.5 h-auto ${
                filter === item.value
                  ? 'bg-primary-500'
                  : 'bg-background-900 border border-white/10'
              }`}
            >
              <ButtonText
                className={`text-xs font-bold ${
                  filter === item.value ? 'text-white' : 'text-gray-400'
                }`}
              >
                {item.label}
              </ButtonText>
            </Button>
          )}
        />
      </Box>

      {/* Urutan (Sorting) & Jumlah Tugas */}
      <Box className="flex-row justify-between items-center px-5 py-3.5">
        <Text className="text-gray-400 text-xs font-bold">
          {tugasTampil.length} Tugas Ditemukan
        </Text>
        
        {/* Toggle Urutan */}
        <Box className="flex-row bg-background-900 border border-white/10 rounded-full p-0.5">
          <Button
            size="xs"
            onPress={() => setSort('deadline')}
            className={`rounded-full px-3 py-1 h-auto ${
              sort === 'deadline' ? 'bg-primary-500' : 'bg-transparent'
            }`}
          >
            <ButtonText className="text-2xs font-extrabold text-white">Deadline</ButtonText>
          </Button>
          <Button
            size="xs"
            onPress={() => setSort('prioritas')}
            className={`rounded-full px-3 py-1 h-auto ${
              sort === 'prioritas' ? 'bg-primary-500' : 'bg-transparent'
            }`}
          >
            <ButtonText className="text-2xs font-extrabold text-white">Prioritas</ButtonText>
          </Button>
          <Button
            size="xs"
            onPress={() => setSort('terbaru')}
            className={`rounded-full px-3 py-1 h-auto ${
              sort === 'terbaru' ? 'bg-primary-500' : 'bg-transparent'
            }`}
          >
            <ButtonText className="text-2xs font-extrabold text-white">Terbaru</ButtonText>
          </Button>
        </Box>
      </Box>

      {/* Daftar Tugas */}
      {sedangMemuat && tugasTampil.length === 0 ? (
        <Box className="flex-1 justify-center items-center">
          <Spinner size="large" color="#3b82f6" />
          <Text className="text-gray-400 text-sm mt-3 font-semibold">
            Mengambil data tugas...
          </Text>
        </Box>
      ) : (
        <FlatList
          data={tugasTampil}
          keyExtractor={(item) => String(item.id)}
          renderItem={renderKartuTugas}
          contentContainerStyle={{ paddingBottom: 100 }}
          refreshControl={
            <RefreshControl
              refreshing={sedangMenyegarkan}
              onRefresh={tanganiSegarkan}
              colors={['#3b82f6']}
              tintColor="#3b82f6"
            />
          }
          ListEmptyComponent={
            <Box className="flex-1 items-center justify-center py-20 px-8">
              <Box className="bg-background-900 border border-white/10 p-5 rounded-full mb-4">
                <FontAwesome name="check-square-o" size={40} className="text-gray-600" />
              </Box>
              <Heading size="md" className="text-white text-center font-bold">
                Tidak Ada Tugas
              </Heading>
              <Text className="text-gray-400 text-center mt-2 text-sm max-w-xs font-semibold">
                {kataKunci
                  ? 'Tidak ada tugas yang cocok dengan kata kunci pencarian Anda.'
                  : 'Hebat! Semua tugas Anda telah selesai, atau Anda belum menambahkan tugas baru.'}
              </Text>
              {!kataKunci && (
                <Button
                  className="bg-primary-500 rounded-xl px-5 py-2 mt-5 shadow-lg active:scale-95"
                  onPress={() => router.push('/tugas/tambah')}
                >
                  <ButtonText className="text-sm font-bold text-white">Tambah Tugas Baru</ButtonText>
                </Button>
              )}
            </Box>
          }
        />
      )}

      {/* Floating Action Button (FAB) */}
      <Fab
        size="lg"
        placement="bottom right"
        className="bg-primary-500 hover:bg-primary-600 m-4 rounded-full shadow-lg shadow-primary-500/30 active:scale-90"
        onPress={() => router.push('/tugas/tambah')}
        aria-label="Tambah tugas baru"
      >
        <FabIcon as={AddIcon} className="text-white" />
      </Fab>
    </Box>
  );
}
