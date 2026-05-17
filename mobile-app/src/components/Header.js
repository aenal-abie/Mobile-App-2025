import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function Header({ judul, subjudul }) {
  return (
    <View style={styles.wadah}>
      <Text style={styles.judul}>{judul}</Text>
      {subjudul ? <Text style={styles.subjudul}>{subjudul}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wadah: { gap: 6, marginBottom: 16 },
  judul: { fontSize: 28, fontWeight: '700', color: '#111827' },
  subjudul: { fontSize: 15, color: '#6b7280' },
});
