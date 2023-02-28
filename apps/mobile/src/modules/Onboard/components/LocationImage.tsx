import { useTheme } from 'react-native-paper';
import Svg, { Ellipse, Path, SvgProps } from 'react-native-svg';

const LocationImage = ({ height = 250, width = 250, ...props }: SvgProps) => {
  const theme = useTheme();
  return (
    <Svg width={width} height={height} fill="none" viewBox="0 0 250 250" {...props}>
      <Path fill={theme.colors.secondary} d="m79.046 94.05 19.176-1.415 11.47 149.915-19.177 1.416z" />
      <Path fill={theme.colors.secondary} d="m37.33 163.674 2.956-18.664 181.687 27.758-2.956 18.665z" />
      <Path
        d="M65.089 92.788h117.236a15 15 0 0 1 14.259 10.343l40.102 122.777c3.167 9.696-4.058 19.658-14.258 19.658H27.12c-10.101 0-17.315-9.782-14.33-19.432l37.968-122.778a15 15 0 0 1 14.33-10.568Z"
        stroke={theme.colors.outline}
        strokeWidth={10}
      />
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M98.617 97.788h83.708a10 10 0 0 1 9.506 6.895l21.823 66.815-110.692-16.912-4.346-56.798ZM109.54 240.566h112.888c6.8 0 11.617-6.641 9.505-13.105l-12.541-38.397-.375 2.369-114.575-17.505 5.098 66.638ZM37.27 163.899l-19.704 63.712c-1.99 6.434 2.82 12.955 9.554 12.955h63.135l-5.326-69.619-46.13-7.048h-1.53Z"
        fill={theme.colors.secondaryContainer}
      />
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M79.332 97.788H65.089a10 10 0 0 0-9.554 7.045l-12.552 40.589 40.466 6.182-4.117-53.816Z"
        fill="#73A273"
      />
      <Ellipse cx={156.633} cy={139.5} rx={20.918} ry={9.5} fill="#000" fillOpacity={0.1} />
      <Path
        d="M217.596 61.455c.027 43.635-45.175 69.891-58.271 76.582a7.65 7.65 0 0 1-7.032 0c-13.104-6.691-58.338-32.947-58.364-76.582-.02-33.628 27.646-60.89 61.796-60.89s61.85 27.262 61.871 60.89Z"
        fill={theme.colors.primary}
      />
      <Path
        d="M154.038 87.47c14.568 1.378 27.512-9.136 28.911-23.482 1.399-14.347-9.277-27.094-23.845-28.472-14.568-1.378-27.512 9.136-28.911 23.482-1.399 14.347 9.277 27.094 23.845 28.472Z"
        fill="#fff"
      />

      {/* <Path
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
      /> */}
    </Svg>
  );
};

export default LocationImage;
