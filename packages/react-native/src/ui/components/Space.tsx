import { PropsWithChildren } from 'react';
import { View } from 'react-native';

interface GapProps {
  height?: number;
  width?: number;
}

export function Space({ children, height, width }: PropsWithChildren<GapProps>) {
  return <View style={{ height, width }}>{children}</View>;
}
