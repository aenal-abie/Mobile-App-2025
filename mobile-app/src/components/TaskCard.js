import React from 'react';
import { Pressable, Text, View, StyleSheet } from 'react-native';
import { Box, HStack, VStack, Badge, BadgeText } from '@gluestack-ui/themed';
import { formatTanggal } from '../utils/formatting';

export default function TaskCard({ tugas, onPress }) {
  return (
    <Pressable onPress={onPress}>
      <Box bg="$white" borderWidth={1} borderColor="$coolGray200" borderRadius={16} p={16} mb={12}>
        <VStack space="sm">
          <Text style={styles.judul}>{tugas.judul}</Text>
          <Text style={styles.kecil}>{tugas.mata_kuliah || 'Tanpa mata kuliah'}</Text>
          <HStack justifyContent="space-between" alignItems="center">
            <Badge bg="$blue500" borderRadius={999}>
              <BadgeText color="$white">{tugas.prioritas}</BadgeText>
            </Badge>
            <Text style={styles.kecil}>{formatTanggal(tugas.tgl_deadline)}</Text>
          </HStack>
        </VStack>
      </Box>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  kartu: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    gap: 8,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  judul: { fontSize: 16, fontWeight: '700', color: '#111827' },
  kecil: { color: '#6b7280' },
  baris: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  badge: { color: '#2563eb', fontWeight: '700' },
});
