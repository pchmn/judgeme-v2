import { Flex, Space } from '@kavout/react';
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
        <Space height={100} />
        <Text variant="headlineLarge" style={{ textAlign: 'center', fontWeight: '800' }}>
          {title}
        </Text>
        <Space height={10} />
        <Text variant="bodyLarge" style={{ textAlign: 'center' }}>
          {description}
        </Text>
      </Flex>

      <Flex align="center" justify="center">
        <Button mode="contained" onPress={onPress}>
          {buttonLabel}
        </Button>
      </Flex>
    </Flex>
  );
}
