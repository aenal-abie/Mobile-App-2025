import React from 'react';
import { SafeAreaView, ScrollView, Text, View, StyleSheet, Alert } from 'react-native';
import { Box, VStack } from '@gluestack-ui/themed';
import Header from '../../components/Header';
import Tombol from '../../components/Button';
import { useTaskStore } from '../../store/taskStore';
import { formatTanggalWaktu } from '../../utils/formatting';

export default function TaskDetailScreen({ route, navigation }) {
  const { id } = route.params || {};
  const { tugas, ambilDetailTugas, hapusTugas, tandaiSelesai } = useTaskStore();
  const item = tugas.find((data) => data.id === id);
  const [detail, setDetail] = React.useState(item);

  React.useEffect(() => {
    ambilDetailTugas(id).then(setDetail);
  }, [ambilDetailTugas, id]);

  const handleHapus = async () => {
    Alert.alert('Hapus Tugas', 'Yakin ingin menghapus tugas ini?', [
      { text: 'Batal' },
      {
        text: 'Hapus',
        style: 'destructive',
        onPress: async () => {
          await hapusTugas(id);
          navigation.goBack();
        },
      },
    ]);
  };

  if (!detail) return null;

  return (
    <SafeAreaView style={styles.layar}>
      <ScrollView contentContainerStyle={styles.konten}>
        <Box mb={4}>
          <Header judul={detail.judul} subjudul={detail.status} />
        </Box>
        <View style={styles.kartu}>
          <Text style={styles.label}>Deskripsi</Text>
          <Text style={styles.nilai}>{detail.deskripsi || '-'}</Text>
          <Text style={styles.label}>Mata Kuliah</Text>
          <Text style={styles.nilai}>{detail.mata_kuliah || '-'}</Text>
          <Text style={styles.label}>Deadline</Text>
          <Text style={styles.nilai}>{formatTanggalWaktu(detail.tgl_deadline)}</Text>
          <Text style={styles.label}>Selesai</Text>
          <Text style={styles.nilai}>{formatTanggalWaktu(detail.tgl_selesai)}</Text>
        </View>
        <Tombol
          judul={detail.sudah_selesai ? 'Tandai Belum Selesai' : 'Tandai Selesai'}
          onPress={async () => {
            const hasil = await tandaiSelesai(id);
            setDetail(hasil);
          }}
        />
        <Tombol judul="Edit" warna="#2563eb" onPress={() => navigation.navigate('EditTask', { id })} />
        <Tombol judul="Hapus" warna="#dc2626" onPress={handleHapus} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  layar: { flex: 1, backgroundColor: '#f5f7fb' },
  konten: { padding: 20, gap: 12, flexGrow: 1 },
  kartu: { backgroundColor: '#fff', padding: 16, borderRadius: 16, gap: 8, borderWidth: 1, borderColor: '#e5e7eb' },
  label: { color: '#6b7280', fontSize: 12, textTransform: 'uppercase' },
  nilai: { color: '#111827', fontSize: 15 },
});
