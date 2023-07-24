import Svg, { Path, SvgProps } from 'react-native-svg';

export function SendIcon({ height = 24, width = 24, color = '#000', ...props }: SvgProps) {
  return (
    <Svg width={width} height={height} viewBox="0 0 20 20" fill="none" {...props}>
      <Path
        fill={color}
        d="M2.5 16.666V3.333L18.333 10 2.5 16.666Zm1.25-1.937 11.333-4.73L3.75 5.209v3.5L8.792 10 3.75 11.25v3.479Z"
      />
    </Svg>
  );
}
