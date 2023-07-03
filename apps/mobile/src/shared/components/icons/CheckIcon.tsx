// icon:check-lg | Bootstrap https://icons.getbootstrap.com/ | Bootstrap
import Svg, { Path, SvgProps } from 'react-native-svg';

export function IconCheck({ height = 24, width = 24, color = '#fff', ...props }: SvgProps) {
  return (
    <Svg fill="none" stroke={color} strokeWidth={1.5} height={height} width={width} viewBox="0 0 24 24" {...props}>
      <Path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
    </Svg>
  );
}
