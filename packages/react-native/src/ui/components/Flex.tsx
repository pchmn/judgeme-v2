import { PropsWithChildren } from 'react';
import { LayoutChangeEvent, View, ViewStyle } from 'react-native';

interface FlexProps {
  direction?: 'row' | 'column';
  align?: 'flex-start' | 'center' | 'flex-end' | 'stretch' | 'baseline';
  justify?: 'flex-start' | 'center' | 'flex-end' | 'space-between' | 'space-around' | 'space-evenly';
  wrap?: 'nowrap' | 'wrap' | 'wrap-reverse';
  gap?: number;
  height?: number | string;
  width?: number | string;
  padding?: number;
  paddingY?: number;
  paddingX?: number;
  backgroundColor?: string;
  flex?: number;
  style?: ViewStyle;
  onLayout?: (event: LayoutChangeEvent) => void;
}

export function Flex({
  children,
  direction = 'column',
  align,
  justify,
  wrap,
  paddingX,
  paddingY,
  style,
  onLayout,
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
        paddingHorizontal: paddingX,
        paddingVertical: paddingY,
        ...style,
        ...otherProps,
      }}
      onLayout={onLayout}
    >
      {children}
    </View>
  );
}
