import { PropsWithChildren } from 'react';
import { View, ViewStyle } from 'react-native';

interface FlexProps {
  direction?: 'row' | 'column';
  align?: 'flex-start' | 'center' | 'flex-end' | 'stretch' | 'baseline';
  justify?: 'flex-start' | 'center' | 'flex-end' | 'space-between' | 'space-around' | 'space-evenly';
  wrap?: 'nowrap' | 'wrap' | 'wrap-reverse';
  gap?: number;
  height?: number | string;
  width?: number | string;
  padding?: number;
  backgroundColor?: string;
  flex?: number;
  style?: ViewStyle;
}

export function Flex({
  children,
  direction = 'column',
  align,
  justify,
  wrap,
  style,
  ...otherProps
}: PropsWithChildren<FlexProps>) {
  return (
    <View
      style={{
        display: 'flex',
        flexDirection: direction,
        alignItems: align,
        justifyContent: justify,
        flexWrap: wrap,
        ...style,
        ...otherProps,
      }}
    >
      {children}
    </View>
  );
}
