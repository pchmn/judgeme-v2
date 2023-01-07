import { PropsWithChildren } from 'react';
import { StyleSheet, View } from 'react-native';

interface FlexProps {
  direction?: 'row' | 'column';
  align?: 'flex-start' | 'center' | 'flex-end' | 'stretch' | 'baseline';
  justify?: 'flex-start' | 'center' | 'flex-end' | 'space-between' | 'space-around' | 'space-evenly';
  wrap?: 'nowrap' | 'wrap' | 'wrap-reverse';
  gap?: number;
  height?: number | string;
  width?: number | string;
  backgroundColor?: string;
  flex?: number;
}

export function Flex({ children, ...otherProps }: PropsWithChildren<FlexProps>) {
  return <View style={styles(otherProps).container}>{children}</View>;
}

const styles = ({ direction = 'column', align, justify, wrap, gap, ...otherProps }: FlexProps) =>
  StyleSheet.create({
    container: {
      display: 'flex',
      flexDirection: direction,
      alignItems: align,
      justifyContent: justify,
      flexWrap: wrap,
      gap,
      ...otherProps,
    },
  });
