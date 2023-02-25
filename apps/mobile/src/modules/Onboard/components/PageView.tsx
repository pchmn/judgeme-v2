import { Flex } from '@kavout/react-native';
import { Image, ImageSourcePropType } from 'react-native';
import { Button, Text } from 'react-native-paper';

export function PageView({
  imageSrc,
  title,
  description,
  buttonLabel,
  onPress,
}: {
  imageSrc: ImageSourcePropType;
  title: string;
  description: string;
  buttonLabel: string;
  onPress: () => void;
}) {
  return (
    <Flex justify="space-between" flex={1} padding={50}>
      <Flex flex={1} align="center" justify="center">
        <Image source={imageSrc} style={{ width: 175, height: 175 }} />
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
        <Button mode="contained" onPress={onPress}>
          {buttonLabel}
        </Button>
      </Flex>
    </Flex>
  );
}
