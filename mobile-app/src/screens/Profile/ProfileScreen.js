import React from 'react';
import { SafeAreaView, View, Text, StyleSheet } from 'react-native';
import Header from '../../components/Header';
import Tombol from '../../components/Button';
import { useAuthStore } from '../../store/authStore';

export default function ProfileScreen() {
  const { pengguna, keluar } = useAuthStore();

  return (
    <SafeAreaView style={styles.layar}>
      <View style={styles.konten}>
        <Header judul="Profil" subjudul="Informasi pengguna" />
        <View style={styles.kartu}>
          <Text style={styles.label}>Nama</Text>
          <Text style={styles.nilai}>{pengguna?.nama || '-'}</Text>
          <Text style={styles.label}>Email</Text>
          <Text style={styles.nilai}>{pengguna?.email || '-'}</Text>
        </View>
        <Tombol judul="Logout" warna="#dc2626" onPress={keluar} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  layar: { flex: 1, backgroundColor: '#f5f7fb' },
  konten: { padding: 20, gap: 12, flex: 1 },
  kartu: { backgroundColor: '#fff', padding: 16, borderRadius: 16, gap: 6, borderWidth: 1, borderColor: '#e5e7eb' },
  label: { color: '#6b7280', fontSize: 12, textTransform: 'uppercase' },
  nilai: { color: '#111827', fontSize: 15, marginBottom: 8 },
});
