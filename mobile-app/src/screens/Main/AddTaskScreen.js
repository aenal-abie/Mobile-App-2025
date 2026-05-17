import React from 'react';
import { SafeAreaView, ScrollView, Alert, StyleSheet } from 'react-native';
import Header from '../../components/Header';
import TaskForm from '../../components/TaskForm';
import { useTaskStore } from '../../store/taskStore';

export default function AddTaskScreen({ navigation }) {
  const { buatTugas } = useTaskStore();
  const [nilai, setNilai] = React.useState({
    judul: '',
    deskripsi: '',
    mata_kuliah: '',
    prioritas: 'SEDANG',
    tgl_deadline: '',
  });

  const handleSimpan = async () => {
    if (!nilai.judul.trim()) return Alert.alert('Validasi', 'Judul wajib diisi');
    await buatTugas(nilai);
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.layar}>
      <ScrollView contentContainerStyle={styles.konten}>
        <Header judul="Tambah Tugas" subjudul="Isi data tugas baru" />
        <TaskForm nilai={nilai} setNilai={setNilai} onSubmit={handleSimpan} teksTombol="Simpan" />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  layar: { flex: 1, backgroundColor: '#f5f7fb' },
  konten: { padding: 20, flexGrow: 1 },
});
