import { useAppTheme } from '@kuzpot/react-native';
import Svg, { Circle, Path, SvgProps } from 'react-native-svg';

const NotificationsImage = ({ height = 250, width = 250, ...props }: SvgProps) => {
  const theme = useAppTheme();
  return (
    <Svg width={width} height={height} fill="none" viewBox="0 0 250 250" {...props}>
      <Circle
        cx={125}
        cy={125}
        transform="rotate(179.469 125 125)"
        fill={theme.colors.secondaryContainer}
        r={123.858}
      />
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M240.647 169.437c-9.429 24.519-26.438 45.303-48.181 59.452H96.178a7 7 0 0 1-7-7v-45.452a7 7 0 0 1 7-7h144.469Z"
        fill={theme.dark ? theme.colors.onSecondary : theme.colors.onSecondary + 'B3'}
      />
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M233.253 185.227a122.985 122.985 0 0 1-4.212 7h-72.948a3.5 3.5 0 1 1 0-7h77.16ZM219.521 205.045a125.176 125.176 0 0 1-6.407 7h-57.021a3.5 3.5 0 1 1 0-7h63.428Z"
        fill={theme.colors.secondary}
      />
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M109.022 189.255a3 3 0 0 0-3 3V208.003c0 1.652 1.889 2.592 3.207 1.595l3.84-2.905c.068-.051.132-.106.191-.163h18.497a3 3 0 0 0 3-3v-11.275a3 3 0 0 0-3-3h-22.735Z"
        fill={theme.colors.secondary}
        fillOpacity={0.5}
      />
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M245.229 95.123a124.117 124.117 0 0 1 3.623 28.729 124.09 124.09 0 0 1-3.546 30.723H96.178a7 7 0 0 1-7-7v-45.452a7 7 0 0 1 7-7h149.051Z"
        fill={theme.colors.primary}
      />
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M248.064 110.913c.262 2.314.461 4.648.593 7h-92.564a3.5 3.5 0 1 1 0-7h91.971ZM248.729 130.73c-.107 2.351-.28 4.685-.516 7h-92.12a3.5 3.5 0 1 1 0-7h92.636Z"
        fill={theme.colors.onPrimary}
      />
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M109.022 114.94a3 3 0 0 0-3 3V133.688c0 1.652 1.889 2.592 3.207 1.596l3.84-2.905a2.03 2.03 0 0 0 .191-.164h18.497a3 3 0 0 0 3-3V117.94a3 3 0 0 0-3-3h-22.735Z"
        fill={theme.colors.onPrimary}
        fillOpacity={0.5}
      />
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M191.994 20.808C213.847 34.888 231 55.662 240.531 80.26H96.178a7 7 0 0 1-7-7V27.808a7 7 0 0 1 7-7h95.816Z"
        fill={theme.dark ? theme.colors.onSecondary : theme.colors.onSecondary + 'B3'}
      />
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M211.752 36.598a124.615 124.615 0 0 1 6.602 7h-62.261a3.5 3.5 0 1 1 0-7h55.659ZM228.152 56.415a123.57 123.57 0 0 1 4.335 7h-76.394a3.5 3.5 0 1 1 0-7h72.059Z"
        fill={theme.colors.secondary}
      />
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M109.022 40.625a3 3 0 0 0-3 3v15.749c0 1.651 1.889 2.591 3.207 1.595l3.84-2.905c.068-.051.132-.106.191-.164h18.497a3 3 0 0 0 3-3V43.625a3 3 0 0 0-3-3h-22.735Z"
        fill={theme.colors.secondary}
        fillOpacity={0.5}
      />
    </Svg>
  );
};

export default NotificationsImage;
