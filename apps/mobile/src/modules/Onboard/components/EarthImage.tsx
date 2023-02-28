import { useTheme } from 'react-native-paper';
import Svg, { Defs, Ellipse, G, Path, Rect, SvgProps } from 'react-native-svg';
/* SVGR has dropped some elements not supported by react-native-svg: filter */

const EarthImage = ({ height = 250, width = 250, ...props }: SvgProps) => {
  const theme = useTheme();
  return (
    <Svg width={width} height={height} fill="none" viewBox="0 0 250 250" {...props}>
      <G filter="url(#a)">
        <Path
          d="M47 13c0-5.523 4.477-10 10-10h23c5.523 0 10 4.477 10 10s-4.477 10-10 10H57c-5.523 0-10-4.477-10-10Z"
          fill={theme.dark ? '#fff' : theme.colors.outline}
        />
      </G>
      <G filter="url(#b)">
        <Path
          d="M155 234c0-5.523 4.477-10 10-10h36c5.523 0 10 4.477 10 10s-4.477 10-10 10h-36c-5.523 0-10-4.477-10-10Z"
          fill={theme.dark ? '#fff' : theme.colors.outline}
        />
      </G>
      <G filter="url(#c)">
        <Path
          d="M183 226.5a7.5 7.5 0 0 1 7.5-7.5h35a7.5 7.5 0 0 1 0 15h-35a7.5 7.5 0 0 1-7.5-7.5Z"
          fill={theme.dark ? '#fff' : theme.colors.outline}
        />
      </G>
      <Ellipse
        cx={125.172}
        cy={125}
        rx={124.672}
        ry={125}
        fill={theme.dark ? theme.colors.secondaryContainer : theme.colors.surfaceVariant}
      />
      {/* <Circle cx={125} cy={125} r={125} fill="#5C3F41" fillOpacity={0.6} /> */}
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M170.587 241.447h-47.481c-15.891 0-28.774-12.916-28.774-28.849s12.883-28.85 28.774-28.85h12.373c6.155-1.928 6.155-10.661 0-12.589h-4.731c-12.713 0-23.019-10.333-23.019-23.079 0-12.747 10.306-23.08 23.019-23.08h50.61c12.713 0 23.019 10.333 23.019 23.08 0 12.746-10.306 23.079-23.019 23.079h-1.861c-5.475 2.401-5.475 10.188 0 12.589h46.822c2.876 0 5.653.423 8.273 1.21-13.982 25.597-36.639 45.752-64.005 56.489Z"
        fill="#73A273"
      />
      <Rect x={134.358} y={138.816} width={30.184} height={19.737} rx={9.868} fill="#638963" />
      <Rect x={126.484} y={203.289} width={62.336} height={19.737} rx={9.868} fill="#638963" />
      <Ellipse cx={202.546} cy={191.618} rx={7.546} ry={3.618} fill="#000" fillOpacity={0.1} />
      <Path
        d="M235.682 158.356c-2.411 20.484-24.71 30.344-31.12 32.771a3.5 3.5 0 0 1-3.242-.384c-5.67-3.856-25.068-18.648-22.658-39.132 1.858-15.787 16.128-27.075 31.874-25.212 15.745 1.863 27.003 16.17 25.146 31.957Z"
        fill={theme.colors.primary}
      />
      <Path
        d="M205.912 167.254c6.763.651 12.773-4.319 13.423-11.1.649-6.782-4.307-12.807-11.071-13.459-6.764-.651-12.773 4.319-13.423 11.1-.65 6.782 4.307 12.807 11.071 13.459Z"
        fill="#fff"
      />
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M83.642 11.895c0 12.747-10.306 23.08-23.02 23.08H38.679C51.262 22.818 66.388 13.29 83.18 7.268c.304 1.495.463 3.043.463 4.627ZM2.046 105.261c.108.002.216.002.325.002h103.213c15.892 0 28.774-12.916 28.774-28.85 0-15.933-12.882-28.849-28.774-28.849H58.762c-5.475-2.401-5.475-10.188 0-12.589H38.678C19.613 53.394 6.384 77.843 2.046 105.261Z"
        fill="#73A273"
      />
      <Ellipse cx={90.067} cy={85.197} rx={7.546} ry={3.618} fill="#000" fillOpacity={0.1} />
      <Rect x={87.114} y={32.237} width={64.961} height={42.928} rx={10} fill={theme.colors.primary} />
      <Path
        d="M87.114 82.42V61.85c0-2.459 2.796-3.873 4.777-2.417l13.13 9.654a3 3 0 0 1 .141 4.724l-13.13 10.916c-1.954 1.625-4.918.235-4.918-2.307Z"
        fill={theme.colors.primary}
      />
      <Rect x={99.516} y={43.191} width={40.453} height={6.809} rx={3.405} fill={theme.colors.primary} />
      <Rect x={99.516} y={43.191} width={40.453} height={6.809} rx={3.405} fill={theme.colors.primary} />
      <Rect x={99.516} y={43.191} width={40.453} height={6.809} rx={3.405} fill="#fff" />
      <Rect x={99.581} y={57.895} width={26.903} height={6.579} rx={3.289} fill="#fff" />
      <Rect x={99.581} y={57.895} width={26.903} height={6.579} rx={3.289} fill={theme.colors.primary} />
      <Rect x={99.581} y={57.895} width={26.903} height={6.579} rx={3.289} fill="#fff" />
      <Rect x={19.529} y={69.079} width={55.344} height={20.044} rx={10.022} fill="#638963" />
      <G filter="url(#d)">
        <Path
          d="M182.915 57.237c0-5.814 4.712-10.526 10.526-10.526h39.971c5.814 0 10.526 4.712 10.526 10.526 0 5.813-4.712 10.526-10.526 10.526h-39.971c-5.813 0-10.526-4.713-10.526-10.526Z"
          fill={theme.dark ? '#fff' : theme.colors.outline}
        />
      </G>
      <G filter="url(#e)">
        <Path
          d="M209.161 71.71a8.553 8.553 0 0 1 8.553-8.552h17.672a8.552 8.552 0 0 1 8.552 8.553 8.552 8.552 0 0 1-8.552 8.552h-17.672a8.553 8.553 0 0 1-8.553-8.552Z"
          fill={theme.dark ? '#fff' : theme.colors.outline}
        />
      </G>
      <G filter="url(#f)">
        <Path
          d="M43 193.132C43 184.775 49.775 178 58.132 178h34.04c8.358 0 15.132 6.775 15.132 15.132s-6.774 15.131-15.131 15.131H58.132c-8.357 0-15.132-6.774-15.132-15.131Z"
          fill={theme.dark ? '#fff' : theme.colors.outline}
        />
      </G>
      <G filter="url(#g)">
        <Path
          d="M.828 82.566c0-5.632 4.566-10.198 10.197-10.198h6.509c5.632 0 10.197 4.566 10.197 10.198 0 5.632-4.566 10.197-10.197 10.197h-6.509C5.394 92.763.828 88.198.828 82.566Z"
          fill={theme.dark ? '#fff' : theme.colors.outline}
        />
      </G>
      <G filter="url(#h)">
        <Path
          d="M36 129c0-5.523 4.477-10 10-10h23c5.523 0 10 4.477 10 10s-4.477 10-10 10H46c-5.523 0-10-4.477-10-10Z"
          fill={theme.dark ? '#fff' : theme.colors.outline}
        />
      </G>
      <G filter="url(#i)">
        <Path
          d="M90.5 90.5v0a172.452 172.452 0 0 0 99.485 99.538l2.515.962"
          stroke="#fff"
          strokeWidth={3}
          strokeLinecap="round"
          strokeDasharray="8 8"
        />
      </G>
      <Defs></Defs>
    </Svg>
  );
};

export default EarthImage;
