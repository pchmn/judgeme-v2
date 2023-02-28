import { useTheme } from 'react-native-paper';
import Svg, { Ellipse, Path, SvgProps } from 'react-native-svg';

const LocationImage = (props: SvgProps) => {
  const theme = useTheme();
  return (
    <Svg width={245} height={251} fill="none" {...props}>
      <Path
        fill={theme.dark ? theme.colors.secondary : theme.colors.secondary}
        d="m77.465 94.05 18.792-1.415 11.24 149.915-18.792 1.416z"
      />
      <Path
        fill={theme.dark ? theme.colors.secondary : theme.colors.secondary}
        d="m36.584 163.674 2.896-18.665 178.054 27.76-2.897 18.664z"
      />
      <Path
        d="M64.17 92.788h114.128a15 15 0 0 1 14.286 10.427l39.3 122.778c3.099 9.679-4.122 19.573-14.285 19.573H26.959c-10.065 0-17.274-9.718-14.355-19.351l37.21-122.778a15 15 0 0 1 14.356-10.65Z"
        stroke={theme.dark ? theme.colors.outline : theme.colors.outline}
        strokeWidth={10}
      />
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M96.644 97.788h81.654a10 10 0 0 1 9.524 6.951l21.359 66.727-108.278-16.88-4.259-56.798ZM107.349 240.566h110.249c6.776 0 11.59-6.596 9.524-13.049l-12.18-38.052-.305 1.968-112.284-17.505 4.996 66.638ZM36.715 163.899l-19.326 63.766c-1.946 6.422 2.86 12.901 9.57 12.901h61.49l-5.219-69.619-45.207-7.048h-1.308Z"
        fill={theme.dark ? theme.colors.secondaryContainer : theme.colors.secondaryContainer}
      />
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M77.745 97.788H64.169a10 10 0 0 0-9.57 7.099l-12.293 40.564 39.474 6.153-4.035-53.816Z"
        fill="#73A273"
      />
      <Ellipse cx={153.5} cy={139.5} rx={20.5} ry={9.5} fill="#000" fillOpacity={0.1} />
      <Path
        d="M213.245 61.455c.026 43.635-44.271 69.891-57.105 76.582a7.364 7.364 0 0 1-6.891 0c-12.842-6.691-57.171-32.947-57.198-76.582-.02-33.628 27.093-60.89 60.56-60.89 33.466 0 60.613 27.262 60.634 60.89Z"
        fill={theme.colors.primary}
      />
      <Path
        d="M150.957 87.47c14.277 1.378 26.962-9.136 28.333-23.482 1.371-14.347-9.091-27.094-23.368-28.472-14.276-1.378-26.961 9.136-28.332 23.482-1.372 14.347 9.091 27.094 23.367 28.472Z"
        fill="#fff"
      />
    </Svg>
  );
};

export default LocationImage;
