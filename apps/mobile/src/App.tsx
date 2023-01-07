import { Flex, Gap } from '@judgeme/react';
import { useTranslation } from 'react-i18next';
import { Button, useTheme } from 'react-native-paper';

export default function App() {
  const theme = useTheme();
  const { t } = useTranslation();

  return (
    <Flex backgroundColor={theme.colors.background} align="center" justify="center" flex={1}>
      <Button icon="camera" mode="contained" onPress={() => console.log('Pressed')}>
        {t('common.start')}
      </Button>
      <Gap size={16} />
      <Button icon="camera" mode="outlined" onPress={() => console.log('Pressed')}>
        {t('common.start')}
      </Button>
      <Gap size={16} />
      <Button icon="camera" mode="elevated" onPress={() => console.log('Pressed')}>
        Elevated
      </Button>
    </Flex>
  );
}
