import { Flex, Space, useToggle } from '@judgeme/react';
import { openSettings } from 'expo-linking';
import { useForegroundPermissions } from 'expo-location';
import { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Image, ImageSourcePropType } from 'react-native';
import { StyleSheet } from 'react-native';
import PagerView from 'react-native-pager-view';
import { ActivityIndicator, Button, Dialog, Portal, Text } from 'react-native-paper';

const styles = StyleSheet.create({
  viewPager: {
    flex: 1,
  },
  page: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export function WelcomeScreen() {
  const { t } = useTranslation();

  const pagerViewRef = useRef<PagerView>(null);

  const setPage = (page: number) => {
    pagerViewRef.current?.setPage(page);
  };

  return (
    <Flex flex={1}>
      <PagerView ref={pagerViewRef} style={styles.viewPager} initialPage={0} scrollEnabled={false}>
        <ExplanationView onNextPress={() => setPage(1)} key="1" />
        <LocationPermissionView key="2" />
      </PagerView>
    </Flex>
  );
}

function PageView({
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

function ExplanationView({ onNextPress }: { onNextPress: () => void }) {
  const { t } = useTranslation();

  return (
    <PageView
      title={t('welcomeScreen.explalantionView.title')}
      description={t('welcomeScreen.explalantionView.description')}
      buttonLabel={t('common.next')}
      imageSrc={require('./users-around-world.png')}
      onPress={onNextPress}
    />
  );
}

function LocationPermissionView() {
  const { t } = useTranslation();

  const [status, requestPermission] = useForegroundPermissions();

  const [visible, toggle] = useToggle();

  console.log('status', status);

  const handleOpenSettings = () => {
    openSettings();
    toggle();
  };

  const handleRequestPermission = async () => {
    if (status.status === 'denied' && !status.canAskAgain) {
      toggle();
      return;
    }
    const requestStatus = await requestPermission();
    console.log('status', requestStatus);
  };

  if (status === null) {
    return (
      <Flex flex={1} align="center" justify="center">
        <ActivityIndicator size="large" />
      </Flex>
    );
  }

  return (
    <>
      <PageView
        title={t('welcomeScreen.locationPermissionView.title')}
        description={t('welcomeScreen.locationPermissionView.description')}
        buttonLabel={t('common.grantPermission')}
        imageSrc={require('./location-permission.png')}
        onPress={handleRequestPermission}
      />
      <Portal>
        <Dialog visible={visible} onDismiss={toggle}>
          <Dialog.Content>
            <Text variant="bodyMedium">{t('welcomeScreen.locationPermissionView.openSettingsDescription')}</Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={toggle}>{t('common.cancel')}</Button>
            <Button onPress={handleOpenSettings}>{t('common.openSettings')}</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </>
  );
}
