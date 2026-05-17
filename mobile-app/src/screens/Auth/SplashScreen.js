import React from 'react';
import { SafeAreaView, Text, StyleSheet } from 'react-native';

export default function SplashScreen() {
  return (
    <SafeAreaView style={styles.layar}>
      <Text style={styles.teks}>Memuat aplikasi...</Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  layar: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#f5f7fb' },
  teks: { color: '#111827', fontSize: 16 },
});
