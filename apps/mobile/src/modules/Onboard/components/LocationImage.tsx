import { useTheme } from 'react-native-paper';
import Svg, { Circle, Ellipse, Path, SvgProps } from 'react-native-svg';

const LocationImage = ({ height = 250, width = 250, ...props }: SvgProps) => {
  const theme = useTheme();
  return (
    <Svg width={width} height={height} fill="none" viewBox="0 0 253 253" {...props}>
      <Circle
        cx={126.153}
        cy={126.157}
        r={125}
        transform="rotate(179.469 126.153 126.157)"
        fill={theme.colors.secondaryContainer}
      />
      <Path
        d="M211.676 217.322 70.418 14.239a124.09 124.09 0 0 1 26.015-9.526l133.23 191.54a125.65 125.65 0 0 1-17.987 21.069Z"
        fill={theme.colors.onSecondary}
      />
      <Path
        d="M3.056 147.999 233.51 62.092a124.347 124.347 0 0 1 11.223 24.415l-234.18 87.296a124.102 124.102 0 0 1-7.497-25.804Z"
        fill={theme.colors.onSecondary}
      />
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M237.903 70.087c8.309 16.529 13.061 35.165 13.244 54.912.303 32.635-11.929 62.465-32.204 84.915l-57.092-93.279 76.052-46.548Z"
        fill={theme.colors.tertiary}
      />
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M211.676 217.322 70.418 14.239a124.09 124.09 0 0 1 26.016-9.526l133.23 191.54a125.702 125.702 0 0 1-17.988 21.069Z"
        fill={theme.dark ? theme.colors.onSecondary : theme.colors.outline}
      />
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M10.553 173.803a124.105 124.105 0 0 1-7.497-25.804L233.51 62.092a124.345 124.345 0 0 1 11.223 24.415l-234.18 87.296Z"
        fill={theme.dark ? theme.colors.onSecondary : theme.colors.outline}
      />
      <Ellipse cx={125.918} cy={186.5} rx={20.918} ry={9.5} fill="#000" fillOpacity={0.1} />
      <Path
        d="M187.705 105.895c.026 43.634-45.176 69.891-58.272 76.582a7.655 7.655 0 0 1-7.031 0c-13.104-6.691-58.338-32.948-58.365-76.582-.02-33.629 27.647-60.89 61.797-60.89 34.149 0 61.85 27.261 61.871 60.89Z"
        fill={theme.colors.primary}
      />
      <Path
        d="M124.147 131.909c14.568 1.378 27.512-9.135 28.911-23.482 1.399-14.347-9.277-27.094-23.845-28.472-14.568-1.378-27.512 9.136-28.911 23.482-1.399 14.347 9.277 27.094 23.845 28.472Z"
        fill="#fff"
      />
    </Svg>
  );
};

export default LocationImage;
