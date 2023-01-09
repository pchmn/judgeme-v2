import { Flex, useToggle } from '@judgeme/react';
import { openSettings } from 'expo-linking';
import { useTranslation } from 'react-i18next';
import { ActivityIndicator } from 'react-native';
import { Button, Dialog, Portal, Text } from 'react-native-paper';

import { useOnboard } from '../hooks';
import { PageView } from './PageView';

export function LocationPermissionView({ onNext }: { onNext: () => void }) {
  const { t } = useTranslation();

  const { locationPermissionStatus, requestLocationPermission } = useOnboard();

  const [visible, toggleDialog] = useToggle();

  console.log('status', locationPermissionStatus);

  const handleOpenSettings = () => {
    openSettings();
    toggleDialog();
  };

  const handleRequestPermission = async () => {
    if (locationPermissionStatus.status === 'denied' && !locationPermissionStatus.canAskAgain) {
      toggleDialog();
      return;
    }
    await requestLocationPermission();
  };

  if (locationPermissionStatus === null) {
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
        buttonLabel={t('welcomeScreen.locationPermissionView.grantLocation')}
        imageSrc={require('./location-permission.png')}
        onPress={handleRequestPermission}
      />
      <Portal>
        <Dialog visible={visible} onDismiss={toggleDialog}>
          <Dialog.Title>{t('welcomeScreen.locationPermissionView.dialog.title')}</Dialog.Title>
          <Dialog.Content>
            <Text variant="bodyMedium">{t('welcomeScreen.locationPermissionView.dialog.description')}</Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={toggleDialog}>{t('common.cancel')}</Button>
            <Button onPress={handleOpenSettings}>{t('common.openSettings')}</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </>
  );
}
