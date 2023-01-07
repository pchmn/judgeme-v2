import { PropsWithChildren } from 'react';
import { View } from 'react-native';

interface GapProps {
  size?: number;
  direction?: 'row' | 'column';
}

export function Gap({ children, direction = 'column', size }: PropsWithChildren<GapProps>) {
  return (
    <View style={{ height: direction === 'column' ? size : undefined, width: direction === 'row' ? size : undefined }}>
      {children}
    </View>
  );
}
