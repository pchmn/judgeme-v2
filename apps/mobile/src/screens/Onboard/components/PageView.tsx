import { Flex, useAppTheme } from '@kuzpot/react-native';
import { View } from 'react-native';
import { Button, Text } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export function PageView({
  image,
  title,
  description,
  buttonLabel,
  onPress,
  onSkip,
}: {
  image?: React.ReactNode;
  title: string;
  description: string;
  buttonLabel: string;
  onPress: () => void;
  onSkip?: () => void;
}) {
  const theme = useAppTheme();
  const insets = useSafeAreaInsets();

  return (
    <Flex
      justify="space-between"
      flex={1}
      paddingX={20}
      paddingY={50}
      style={{ backgroundColor: theme.colors.background, position: 'relative' }}
    >
      <Flex flex={1} align="center" justify="center">
        {image}
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
      {onSkip && (
        <View style={{ position: 'absolute', top: (insets.top || 0) + 20, right: 30 }}>
          <Button mode="text" onPress={onSkip}>
            Passer
          </Button>
        </View>
      )}
    </Flex>
  );
}
