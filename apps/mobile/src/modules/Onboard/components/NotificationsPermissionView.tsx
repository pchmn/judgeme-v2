import { Flex, useToggle } from '@kavout/react-native';
import { openSettings } from 'expo-linking';
import { NotificationPermissionsStatus } from 'expo-notifications';
import { useCallback, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { ActivityIndicator, Dimensions } from 'react-native';
import { Button, Dialog, Portal, Text } from 'react-native-paper';

import { useNotificationsPermissions } from '../hooks/useNotificationsPermissions';
import NotificationsImage from './NotificationsImage';
import { PageView } from './PageView';

const width = Dimensions.get('window').width;

export function NotificationsPermissionView({ onNext, onSkip }: { onNext?: () => void; onSkip?: () => void }) {
  const { t } = useTranslation();

  const { notificationsPermission, requestPermissions, isLoading } = useNotificationsPermissions();

  const [visible, toggleDialog] = useToggle();

  const handleOpenSettings = () => {
    openSettings();
    toggleDialog();
  };

  const checkLocationPermission = useCallback(
    (permissions?: NotificationPermissionsStatus) => {
      if (permissions && permissions.granted) {
        onNext?.();
      }
    },
    [onNext]
  );

  const handleRequestPermission = async () => {
    if (notificationsPermission?.status === 'denied' && !notificationsPermission.canAskAgain) {
      toggleDialog();
      return;
    }
    await requestPermissions();
  };

  useEffect(() => {
    checkLocationPermission(notificationsPermission);
  }, [checkLocationPermission, notificationsPermission]);

  if (isLoading) {
    return (
      <Flex flex={1} align="center" justify="center">
        <ActivityIndicator size="large" />
      </Flex>
    );
  }

  return (
    <>
      <PageView
        title={t('welcomeScreen.notificationsPermissionView.title')}
        description={t('welcomeScreen.notificationsPermissionView.description')}
        buttonLabel={t('welcomeScreen.notificationsPermissionView.grantNotifications')}
        image={<NotificationsImage height={width / 1.75} width={width / 1.75} />}
        onPress={handleRequestPermission}
        onSkip={onSkip}
      />
      <Portal>
        <Dialog visible={visible} onDismiss={toggleDialog}>
          <Dialog.Title>{t('welcomeScreen.notificationsPermissionView.dialog.title')}</Dialog.Title>
          <Dialog.Content>
            <Text variant="bodyMedium">{t('welcomeScreen.notificationsPermissionView.dialog.description')}</Text>
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
