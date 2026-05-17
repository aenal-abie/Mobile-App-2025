import React from 'react';
import { SafeAreaView, ScrollView, Text, Alert, Pressable, StyleSheet } from 'react-native';
import { Box, VStack, Text as TeksGluestack } from '@gluestack-ui/themed';
import Header from '../../components/Header';
import Input from '../../components/Input';
import Tombol from '../../components/Button';
import { useAuthStore } from '../../store/authStore';
import { validasiEmail, validasiPassword } from '../../utils/validation';

export default function LoginScreen({ navigation }) {
  const { masuk, sedangMemuat, pesanError } = useAuthStore();
  const [email, setEmail] = React.useState('');
  const [kataSandi, setKataSandi] = React.useState('');

  const handleMasuk = async () => {
    if (!validasiEmail(email)) return Alert.alert('Validasi', 'Email tidak valid');
    if (!validasiPassword(kataSandi)) return Alert.alert('Validasi', 'Kata sandi minimal 6 karakter');
    await masuk(email, kataSandi);
  };

  return (
    <SafeAreaView style={styles.layar}>
      <ScrollView contentContainerStyle={styles.konten}>
        <Box mb={8}>
          <Header judul="Masuk" subjudul="Silakan login untuk melihat tugas" />
        </Box>
        {pesanError ? <TeksGluestack color="$red600">{pesanError}</TeksGluestack> : null}
        <VStack space="md">
        <Input placeholder="Email" value={email} onChangeText={setEmail} autoCapitalize="none" keyboardType="email-address" />
        <Input placeholder="Kata sandi" value={kataSandi} onChangeText={setKataSandi} secureTextEntry />
        <Tombol judul={sedangMemuat ? 'Memproses...' : 'Masuk'} onPress={handleMasuk} />
        </VStack>
        <Pressable onPress={() => navigation.navigate('Register')}>
          <Text style={styles.link}>Belum punya akun? Daftar</Text>
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
