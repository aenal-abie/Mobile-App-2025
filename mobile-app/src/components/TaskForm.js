import React from 'react';
import { StyleSheet } from 'react-native';
import { VStack } from '@gluestack-ui/themed';
import Input from './Input';
import Tombol from './Button';

export default function TaskForm({ nilai, setNilai, onSubmit, teksTombol }) {
  return (
    <VStack space="md" style={styles.wadah}>
      <Input placeholder="Judul tugas" value={nilai.judul} onChangeText={(text) => setNilai({ ...nilai, judul: text })} />
      <Input placeholder="Deskripsi" value={nilai.deskripsi} onChangeText={(text) => setNilai({ ...nilai, deskripsi: text })} />
      <Input placeholder="Mata kuliah" value={nilai.mata_kuliah} onChangeText={(text) => setNilai({ ...nilai, mata_kuliah: text })} />
      <Input placeholder="Prioritas: TINGGI / SEDANG / RENDAH" value={nilai.prioritas} onChangeText={(text) => setNilai({ ...nilai, prioritas: text })} />
      <Input placeholder="Deadline: 2026-05-17 10:00:00" value={nilai.tgl_deadline} onChangeText={(text) => setNilai({ ...nilai, tgl_deadline: text })} />
      <Tombol judul={teksTombol} onPress={onSubmit} />
    </VStack>
  );
}

const styles = StyleSheet.create({
  wadah: { gap: 12 },
});
