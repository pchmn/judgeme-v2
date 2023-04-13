import { useTheme } from 'react-native-paper';
import Svg, { Circle, Ellipse, Path, SvgProps } from 'react-native-svg';

const LocationImage = ({ height = 250, width = 250, ...props }: SvgProps) => {
  const theme = useTheme();
  return (
    <Svg width={width} height={height} fill="none" viewBox="0 0 253 253" {...props}>
      <Circle
        cx={127.154}
        cy={127.159}
        transform="rotate(179.343 127.154 127.159)"
        fill={theme.colors.secondaryContainer}
        r={125}
      />
      <Path
        d="M212.877 218.135 71.173 15.363A124.093 124.093 0 0 1 97.168 5.78l133.651 191.246a125.644 125.644 0 0 1-17.942 21.109Z"
        fill={theme.dark ? theme.colors.onSecondary : theme.colors.onSecondary + 'B3'}
      />
      <Path
        d="M4.105 149.271 234.37 62.857a124.341 124.341 0 0 1 11.277 24.39L11.66 175.059a124.085 124.085 0 0 1-7.555-25.787Z"
        fill={theme.dark ? theme.colors.onSecondary : theme.colors.onSecondary + 'B3'}
      />
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M230.864 196.959c13.703-20.321 21.584-44.871 21.282-71.233-.156-13.547-2.46-26.565-6.586-38.735l-72.525 27.217 57.829 82.751Z"
        fill={theme.colors.tertiary}
      />
      <Ellipse
        cx={127.639}
        cy={185.548}
        rx={20.918}
        ry={9.5}
        transform="rotate(-.126 127.639 185.548)"
        fill="#000"
        fillOpacity={0.1}
      />
      <Path
        d="M188.686 106.76c.14 43.635-44.993 69.99-58.072 76.71a7.655 7.655 0 0 1-7.031.016c-13.121-6.662-58.424-32.819-58.564-76.454-.108-33.628 27.488-60.95 61.637-61.025 34.15-.075 61.922 27.125 62.03 60.753Z"
        fill={theme.colors.primary}
      />
      <Path
        d="M125.161 132.915c14.571 1.345 27.491-9.196 28.859-23.546 1.367-14.35-9.336-27.074-23.907-28.42-14.572-1.345-27.492 9.197-28.86 23.546-1.367 14.35 9.336 27.074 23.908 28.42Z"
        fill="#fff"
      />
    </Svg>
  );
};

export default LocationImage;
