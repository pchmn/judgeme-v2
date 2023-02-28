import { useTheme } from 'react-native-paper';
import Svg, { Path, Rect, SvgProps } from 'react-native-svg';

const NotificationsImage = (props: SvgProps) => {
  const theme = useTheme();
  return (
    <Svg width={250} height={250} fill="none" {...props}>
      <Rect x={1.984} width={248.016} height={71.3} rx={15} fill={theme.colors.secondaryContainer} />
      <Rect x={77.381} y={18.953} width={146.825} height={9.928} rx={4.964} fill="#fff" />
      <Rect x={77.381} y={43.321} width={146.825} height={9.928} rx={4.964} fill="#fff" />
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M25.833 24.368a5 5 0 0 0-5 5v11.724l.001.104c.006.258 0 .516 0 .774v5c0 2.478 2.833 3.888 4.81 2.393l3.508-2.654c.436-.33.934-.617 1.482-.617h21.335a5 5 0 0 0 5-5V29.368a5 5 0 0 0-5-5H25.833Z"
        fill="#fff"
        fillOpacity={0.5}
      />
      <Rect x={1.984} y={89.35} width={248.016} height={71.3} rx={15} fill={theme.colors.primary} />
      <Rect x={77.381} y={108.303} width={146.825} height={9.928} rx={4.964} fill="#fff" />
      <Rect x={77.381} y={132.672} width={146.825} height={9.928} rx={4.964} fill="#fff" />
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M25.833 113.718a5 5 0 0 0-5 5v11.724c0 .166.008.33.024.491a3.127 3.127 0 0 0-.024.387v5c0 2.478 2.834 3.888 4.81 2.393l3.509-2.654a3 3 0 0 0 .61-.617H51.97a5 5 0 0 0 5-5v-11.724a5 5 0 0 0-5-5H25.833Z"
        fill="#fff"
        fillOpacity={0.5}
      />
      <Rect y={178.7} width={248.016} height={71.3} rx={15} fill={theme.colors.secondaryContainer} />
      <Rect x={75.397} y={197.653} width={146.825} height={9.928} rx={4.964} fill="#fff" />
      <Rect x={75.397} y={222.022} width={146.825} height={9.928} rx={4.964} fill="#fff" />
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M23.85 203.069a5 5 0 0 0-5 5v11.724c0 .165.007.329.023.49a3.147 3.147 0 0 0-.024.387v5.001c0 2.477 2.834 3.887 4.81 2.392l3.509-2.654c.24-.181.443-.389.61-.616h22.207a5 5 0 0 0 5-5v-11.724a5 5 0 0 0-5-5H23.849Z"
        fill="#fff"
        fillOpacity={0.5}
      />
    </Svg>
  );
};

export default NotificationsImage;
