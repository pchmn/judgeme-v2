import { Document, formatDistance, formatDistanceBetween, Kuzer, Message } from '@kuzpot/core';
import { Flex, Text, useAppTheme, useFirestoreQuery } from '@kuzpot/react-native';
import firestore from '@react-native-firebase/firestore';
import { firebase } from '@react-native-firebase/functions';
import { colord } from 'colord';
import { LocationObjectCoords } from 'expo-location';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { LayoutChangeEvent } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { IconButton, Menu, TouchableRipple } from 'react-native-paper';
// import { Text } from 'react-native-paper';
import { SharedValue } from 'react-native-reanimated';

import { InboxIcon } from './InboxIcon';
import { SendIcon } from './SendIcon';

export function UserDetails({
  user,
  positionValue,
  currentPosition,
  onLayout,
}: {
  user: Kuzer;
  positionValue: SharedValue<number>;
  currentPosition?: LocationObjectCoords;
  onLayout?: (event: LayoutChangeEvent) => void;
}) {
  const [kuzer, setKuzer] = useState<Kuzer>(user);
  const { data: messages } = useFirestoreQuery<Message>(['messages'], firestore().collection('messages'));

  const { t } = useTranslation();

  const theme = useAppTheme();
  const [messageSelected, setMessageSelected] = useState<Document<Message>>();

  const sendMessage = async () => {
    const result = await firebase.app().functions('europe-west1').httpsCallable('sendMessage')({
      to: user.id,
      message: messageSelected?.id,
    });
    console.log('result', result);
  };

  const [visible, setVisible] = useState(false);

  const openMenu = () => setVisible(true);

  const closeMenu = () => setVisible(false);

  return (
    <Flex paddingX="lg" gap="lg" position="relative" onLayout={onLayout}>
      <Flex gap="xs">
        <Flex direction="row" align="baseline" gap="lg">
          <Flex direction="row" align="baseline" gap="sm">
            <Text variant="titleMedium">{kuzer.name}</Text>
            {currentPosition && (
              <Text variant="bodySmall" color={theme.colors.outline}>
                {t('homeScreen.userDetails.distance', {
                  distance: formatDistanceBetween(currentPosition, kuzer.geopoint.coordinates),
                })}
              </Text>
            )}
          </Flex>
          <Flex
            backgroundColor={kuzer.status === 'online' ? '#26A69A66' : colord(theme.colors.error).alpha(0.4).toHex()}
            align="center"
            justify="center"
            paddingX="xs"
            borderRadius={5}
          >
            <Text variant="bodySmall" color="#fff" fontSize={8} style={{ textTransform: 'uppercase' }}>
              {kuzer.status === 'online' ? t('homeScreen.userDetails.online') : t('homeScreen.userDetails.offline')}
            </Text>
          </Flex>
        </Flex>
        <Flex direction="row" gap="sm">
          <Flex direction="row" gap="xs" align="center">
            <InboxIcon height={16} width={16} color={theme.colors.outline} />
            <Text variant="bodyMedium" color={theme.colors.outline}>
              {t('homeScreen.userDetails.receivedCount', {
                count: kuzer.messageStatistics.receivedTotalCount,
                averageDistance: formatDistance(kuzer.messageStatistics.averageReceivedDistance),
              })}
            </Text>
          </Flex>
          <Text variant="bodyMedium" color={theme.colors.outline}>
            •
          </Text>
          <Flex direction="row" gap="xs" align="center">
            <SendIcon height={16} width={16} color={theme.colors.outline} />
            <Text variant="bodyMedium" color={theme.colors.outline}>
              {t('homeScreen.userDetails.sentCount', {
                count: kuzer.messageStatistics.sentTotalCount,
                averageDistance: formatDistance(kuzer.messageStatistics.averageSentDistance),
              })}
            </Text>
          </Flex>
        </Flex>
      </Flex>

      <Flex gap="md">
        <Text variant="labelMedium" color={theme.colors.onSurfaceVariant}>
          {t('homeScreen.userDetails.messagesReceived')}
        </Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <Flex direction="row" gap="md">
            {orderMessageStatistics(kuzer.messageStatistics, messages)?.map(({ emoji, id }) => (
              <Flex
                key={id}
                direction="row"
                backgroundColor={theme.colors.surfaceContainerHigh}
                paddingX="md"
                paddingY={6}
                gap="md"
                borderRadius={14}
              >
                <Text variant="bodyLarge">{emoji}</Text>
                <Text variant="bodyLarge">{kuzer.messageStatistics.receivedCount[id] || 0}</Text>
              </Flex>
            ))}
          </Flex>
        </ScrollView>
      </Flex>

      <Flex direction="row" gap="md" justify="space-between" align="center" paddingY="lg">
        <Flex flex={1}>
          <Menu
            visible={visible}
            onDismiss={closeMenu}
            anchor={
              <TouchableRipple
                onPress={openMenu}
                rippleColor="rgba(0, 0, 0, .32)"
                borderless
                style={{ borderRadius: 25 }}
              >
                <Flex
                  direction="row"
                  align="center"
                  paddingY="md"
                  paddingX="xl"
                  backgroundColor={theme.colors.surfaceContainerHigh}
                  borderRadius={25}
                >
                  {messageSelected ? (
                    <Flex direction="row" gap="sm">
                      <Text variant="bodyLarge">{messageSelected.emoji}</Text>
                      <Text variant="bodyLarge">{messageSelected.translations['en']}</Text>
                    </Flex>
                  ) : (
                    <Text color={theme.colors.outline}>{t('homeScreen.userDetails.chooseMessage')}</Text>
                  )}
                </Flex>
              </TouchableRipple>
            }
            anchorPosition="bottom"
            contentStyle={{ borderRadius: 12 }}
          >
            {messages?.map((message) => (
              <TouchableRipple
                key={message.id}
                rippleColor="rgba(0, 0, 0, .32)"
                onPress={() => {
                  setMessageSelected(message);
                  setVisible(false);
                }}
              >
                <Flex key={message.id} direction="row" gap="lg" align="center" paddingY="md" paddingX="lg">
                  <Text variant="bodyLarge">{message.emoji}</Text>
                  <Text variant="bodyLarge">{message.translations['en']}</Text>
                </Flex>
              </TouchableRipple>
            ))}
          </Menu>
        </Flex>

        <IconButton
          icon="send"
          mode="contained"
          containerColor={theme.colors.primary}
          iconColor={theme.colors.onPrimary}
          onPress={sendMessage}
          disabled={!messageSelected}
        />
      </Flex>

      {/* <Animated.View style={[textStyle]}>
        <Text>{user.id} 🎉</Text>
      </Animated.View>
      <RadioButton.Group onValueChange={(newValue) => setValue(newValue)} value={value}>
        <Flex gap={16}>
          {messages?.map((message) => (
            <Surface
              key={message.id}
              style={{
                borderRadius: 12,
              }}
              elevation={value === message.id ? 1 : 0}
            >
              <TouchableRipple
                onPress={() => setValue(message.id)}
                borderless
                style={{
                  borderRadius: 12,
                }}
                rippleColor={`${theme.colors.primary}80`}
              >
                <Flex
                  direction="row"
                  align="center"
                  paddingY={12}
                  paddingX={16}
                  gap={16}
                  style={{
                    borderColor:
                      value === message.id ? theme.colors.primary : theme.colors.outline + (theme.dark ? '80' : '1A'),
                    backgroundColor: value === message.id ? theme.colors.surfaceVariant : theme.colors.background,
                    borderWidth: 1,
                    borderRadius: 12,
                  }}
                >
                  <Text variant="titleLarge" style={{ opacity: value === message.id ? 1 : 0.9 }}>
                    {message.emoji}
                  </Text>
                  <Flex direction="row" justify="space-between" align="center" flex={1}>
                    <Text variant="bodyLarge" style={{ opacity: value === message.id ? 1 : 0.9 }}>
                      {message.translations.fr}
                    </Text>
                    <IconCheck color={value === message.id ? theme.colors.primary : 'transparent'} />
                  </Flex>
                </Flex>
              </TouchableRipple>
            </Surface>
          ))}
        </Flex>
      </RadioButton.Group> */}
      {/* <Button mode="contained" onPress={sendMessage}>
        Send message
      </Button> */}
    </Flex>
  );
}

function orderMessageStatistics(messageStatistics: Kuzer['messageStatistics'], messages?: Document<Message>[]) {
  return messages
    ?.map(({ id, emoji }) => ({
      id,
      emoji,
      count: messageStatistics.receivedCount[id] || 0,
    }))
    .sort((a, b) => b.count - a.count);
}
