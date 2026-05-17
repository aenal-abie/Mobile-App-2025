import React from 'react';
import { SafeAreaView, View, Text, FlatList, StyleSheet, RefreshControl } from 'react-native';
import { Box, HStack, VStack } from '@gluestack-ui/themed';
import Header from '../../components/Header';
import TaskCard from '../../components/TaskCard';
import Tombol from '../../components/Button';
import { useTaskStore } from '../../store/taskStore';
import { useAuthStore } from '../../store/authStore';

export default function HomeScreen({ navigation }) {
  const { tugas, ambilTugas, sedangMemuat } = useTaskStore();
  const { pengguna, keluar } = useAuthStore();

  React.useEffect(() => {
    ambilTugas();
  }, [ambilTugas]);

  return (
    <SafeAreaView style={styles.layar}>
      <View style={styles.konten}>
        <Box mb={4}>
          <Header judul="Catatan Tugas" subjudul={`Halo, ${pengguna?.nama || 'Pengguna'}`} />
        </Box>
        <HStack space="sm" mb={12}>
          <Tombol judul="Tambah" onPress={() => navigation.navigate('AddTask')} />
          <Tombol judul="Profil" onPress={() => navigation.navigate('Profile')} warna="#2563eb" />
        </HStack>
        <FlatList
          data={tugas}
          keyExtractor={(item) => String(item.id)}
          renderItem={({ item }) => (
            <TaskCard tugas={item} onPress={() => navigation.navigate('TaskDetail', { id: item.id })} />
          )}
          refreshControl={<RefreshControl refreshing={sedangMemuat} onRefresh={ambilTugas} />}
          ListEmptyComponent={<Text style={styles.kosong}>Belum ada tugas</Text>}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  layar: { flex: 1, backgroundColor: '#f5f7fb' },
  konten: { flex: 1, padding: 20 },
  kosong: { textAlign: 'center', color: '#6b7280', marginTop: 20 },
});
