import { useTheme } from 'react-native-paper';
import Svg, { Circle, Path, SvgProps } from 'react-native-svg';

export const MarkerImage = ({ height = 50, width = 46, ...props }: SvgProps) => {
  const theme = useTheme();
  return (
    <Svg width={width} height={height} fill="none" viewBox="0 0 116 128" {...props}>
      <Path
        fill={theme.colors.tertiary}
        fillRule="evenodd"
        d="M64.48 119.311c1.533-2.529 4.12-4.2 6.997-4.885C97.01 108.35 116 85.393 116 58c0-32.032-25.968-58-58-58S0 25.968 0 58c0 27.393 18.99 50.35 44.523 56.426 2.877.685 5.464 2.356 6.997 4.885l3.915 6.457c1.167 1.927 3.963 1.927 5.13 0l3.915-6.457Z"
        clipRule="evenodd"
      />
      <Circle cx={44.722} cy={76.341} r={7.474} stroke={theme.colors.tertiaryContainer} strokeWidth={5} />
      <Path
        stroke={theme.colors.tertiaryContainer}
        strokeWidth={5}
        d="M78.128 76.341c0 4.25-3.242 7.474-6.975 7.474-3.733 0-6.975-3.224-6.975-7.474s3.242-7.474 6.975-7.474c3.733 0 6.975 3.224 6.975 7.474ZM52.701 76.341h10.473M24.673 60.49H91"
      />
      <Path
        fill={theme.colors.tertiaryContainer}
        fillRule="evenodd"
        d="M58.078 85.433h-.155.155Zm23.78-30.92H34.143C35.425 40.496 45.617 29.578 58 29.578c12.384 0 22.576 10.918 23.859 24.935Z"
        clipRule="evenodd"
      />
    </Svg>
  );
};
