import React from 'react';
import { SafeAreaView, ScrollView, Text, Alert, Pressable, StyleSheet } from 'react-native';
import { Box, VStack, Text as TeksGluestack } from '@gluestack-ui/themed';
import Header from '../../components/Header';
import Input from '../../components/Input';
import Tombol from '../../components/Button';
import { useAuthStore } from '../../store/authStore';
import { validasiEmail, validasiPassword } from '../../utils/validation';

export default function RegisterScreen({ navigation }) {
  const { daftar, sedangMemuat, pesanError } = useAuthStore();
  const [nama, setNama] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [kataSandi, setKataSandi] = React.useState('');
  const [konfirmasi, setKonfirmasi] = React.useState('');

  const handleDaftar = async () => {
    if (!nama.trim()) return Alert.alert('Validasi', 'Nama wajib diisi');
    if (!validasiEmail(email)) return Alert.alert('Validasi', 'Email tidak valid');
    if (!validasiPassword(kataSandi)) return Alert.alert('Validasi', 'Kata sandi minimal 6 karakter');
    if (kataSandi !== konfirmasi) return Alert.alert('Validasi', 'Konfirmasi kata sandi tidak sama');
    await daftar(nama, email, kataSandi);
  };

  return (
    <SafeAreaView style={styles.layar}>
      <ScrollView contentContainerStyle={styles.konten}>
        <Box mb={8}>
          <Header judul="Daftar" subjudul="Buat akun baru terlebih dahulu" />
        </Box>
        {pesanError ? <TeksGluestack color="$red600">{pesanError}</TeksGluestack> : null}
        <VStack space="md">
        <Input placeholder="Nama" value={nama} onChangeText={setNama} />
        <Input placeholder="Email" value={email} onChangeText={setEmail} autoCapitalize="none" keyboardType="email-address" />
        <Input placeholder="Kata sandi" value={kataSandi} onChangeText={setKataSandi} secureTextEntry />
        <Input placeholder="Konfirmasi kata sandi" value={konfirmasi} onChangeText={setKonfirmasi} secureTextEntry />
        <Tombol judul={sedangMemuat ? 'Memproses...' : 'Daftar'} onPress={handleDaftar} />
        </VStack>
        <Pressable onPress={() => navigation.goBack()}>
          <Text style={styles.link}>Sudah punya akun? Masuk</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  layar: { flex: 1, backgroundColor: '#f5f7fb' },
  konten: { padding: 20, gap: 12, flexGrow: 1, justifyContent: 'center' },
  link: { color: '#2563eb', textAlign: 'center', marginTop: 8 },
  error: { color: '#dc2626', backgroundColor: '#fee2e2', padding: 10, borderRadius: 10 },
});
