import { Flex } from '@kavout/react-native';
import { ImageSourcePropType } from 'react-native';
import { Button, Text, useTheme } from 'react-native-paper';

export function PageView({
  imageSrc,
  image,
  title,
  description,
  buttonLabel,
  onPress,
  onSkip,
}: {
  imageSrc?: ImageSourcePropType;
  image?: React.ReactNode;
  title: string;
  description: string;
  buttonLabel: string;
  onPress: () => void;
  onSkip?: () => void;
}) {
  const theme = useTheme();

  return (
    <Flex
      justify="space-between"
      flex={1}
      paddingX={20}
      paddingY={50}
      style={{ backgroundColor: theme.colors.background }}
    >
      <Flex flex={1} align="center" justify="center">
        {image}
        {/* <Image source={imageSrc} style={{ width: 250, height: 250 }} /> */}
        {/* <Flex
          padding={60}
          align="center"
          justify="center"
          style={{ backgroundColor: theme.colors.secondary + '33', borderRadius: 200 }}
        >
          <Image source={imageSrc} style={{ width: 200, height: 200 }} />
        </Flex> */}
      </Flex>

      <Flex align="center" justify="center" gap={50} style={{ alignSelf: 'flex-end', width: '100%' }}>
        <Flex gap={20}>
          <Text variant="headlineSmall" style={{ textAlign: 'center' }}>
            {title}
          </Text>
          <Text variant="bodyMedium" style={{ textAlign: 'center', opacity: 0.75, lineHeight: 25 }}>
            {description}
          </Text>
        </Flex>

        <Flex gap={10}>
          <Button mode="contained" onPress={onPress}>
            {buttonLabel}
          </Button>
          {onSkip && (
            <Button mode="text" onPress={onSkip}>
              Passer
            </Button>
          )}
        </Flex>
      </Flex>
    </Flex>
  );
}
