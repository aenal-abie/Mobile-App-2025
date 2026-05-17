import React from 'react';
import { Input, InputField } from '@gluestack-ui/themed';

export default function KotakInput({ ...props }) {
  return (
    <Input borderRadius={12} bg="$white" borderColor="$coolGray300" borderWidth={1}>
      <InputField placeholderTextColor="#9ca3af" {...props} />
    </Input>
  );
}
