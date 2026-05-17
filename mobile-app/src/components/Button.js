import React from 'react';
import { Button, ButtonText } from '@gluestack-ui/themed';

export default function Tombol({ judul, onPress, warna = '$black', warnaTeks = '$white' }) {
  return (
    <Button action="primary" bg={warna} onPress={onPress} borderRadius={12} py={12}>
      <ButtonText color={warnaTeks} fontWeight="$bold">
        {judul}
      </ButtonText>
    </Button>
  );
}
