import React from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Alert } from 'react-native';
import Header from '../../components/Header';
import TaskForm from '../../components/TaskForm';
import { useTaskStore } from '../../store/taskStore';

export default function EditTaskScreen({ route, navigation }) {
  const { id } = route.params || {};
  const { tugas, perbaruiTugas } = useTaskStore();
  const tugasLama = tugas.find((item) => item.id === id) || {};

  const [nilai, setNilai] = React.useState({
    judul: tugasLama.judul || '',
    deskripsi: tugasLama.deskripsi || '',
    mata_kuliah: tugasLama.mata_kuliah || '',
    prioritas: tugasLama.prioritas || 'SEDANG',
    tgl_deadline: tugasLama.tgl_deadline || '',
  });

  const handleSimpan = async () => {
    if (!nilai.judul.trim()) return Alert.alert('Validasi', 'Judul wajib diisi');
    await perbaruiTugas(id, nilai);
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.layar}>
      <ScrollView contentContainerStyle={styles.konten}>
        <Header judul="Edit Tugas" subjudul="Ubah data tugas" />
        <TaskForm nilai={nilai} setNilai={setNilai} onSubmit={handleSimpan} teksTombol="Perbarui" />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  layar: { flex: 1, backgroundColor: '#f5f7fb' },
  konten: { padding: 20, flexGrow: 1 },
});
