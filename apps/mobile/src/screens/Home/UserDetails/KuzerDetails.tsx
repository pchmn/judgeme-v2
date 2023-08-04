import {
  Document,
  formatDistance,
  formatDistanceBetween,
  Kuzer,
  Message,
  SUBSCRIBE_KUZER_BY_ID,
  SUBSCRIBE_MESSAGES,
} from '@kuzpot/core';
import { Flex, Skeleton, Text, useAppTheme, useSubscription } from '@kuzpot/react-native';
import { useNhostClient } from '@nhost/react';
import { colord } from 'colord';
import { LocationObjectCoords } from 'expo-location';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { LayoutChangeEvent } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';
import { IconButton, Menu, TouchableRipple } from 'react-native-paper';
import { SharedValue } from 'react-native-reanimated';

import { InboxIcon } from './InboxIcon';
import { SendIcon } from './SendIcon';

export function KuzerDetails({
  id,
  positionValue,
  currentPosition,
  onLayout,
}: {
  id: string;
  positionValue: SharedValue<number>;
  currentPosition?: LocationObjectCoords;
  onLayout?: (event: LayoutChangeEvent) => void;
}) {
  const nhost = useNhostClient();

  const { data: messages, loading: messagesLoading } = useSubscription<Message[]>(SUBSCRIBE_MESSAGES);
  const { data: kuzer, loading: kuzerLoading } = useSubscription<Kuzer>(SUBSCRIBE_KUZER_BY_ID, { id });
  const loading = kuzerLoading || messagesLoading;

  const orderedMessagesReceived = useMemo(
    () => (kuzer && messages ? orderMessageStatistics(kuzer?.messageStatistics, messages) : undefined),
    [kuzer, messages]
  );

  const sendMessage = async (message: Message) => {
    const result = await nhost.functions
      .call('send-message', {
        to: id,
        messageId: message?.id,
      })
      .catch((error) => console.log('ERROR !!!!', error));

    console.log('result', result);
  };

  return (
    <Flex
      paddingX="lg"
      gap="lg"
      position="relative"
      onLayout={(event) => {
        !loading && onLayout && onLayout(event);
      }}
    >
      <KuzerInfos loading={loading} kuzer={kuzer} currentPosition={currentPosition} />

      <KuzerStatistics loading={loading} messagesReceived={orderedMessagesReceived} />

      <BottomActions loading={loading} messages={messages} onSend={sendMessage} />
    </Flex>
  );
}

function KuzerInfos({
  loading,
  kuzer,
  currentPosition,
}: {
  loading: boolean;
  kuzer?: Kuzer;
  currentPosition?: LocationObjectCoords;
}) {
  const theme = useAppTheme();
  const { t } = useTranslation();

  return (
    <Flex gap="xs">
      <Flex direction="row" align="baseline" gap="lg">
        <Flex direction="row" align="baseline" gap="sm">
          {loading ? (
            <>
              <Skeleton height={24} width={100} />
              <Skeleton height={16} width={100} />
            </>
          ) : (
            <>
              <Text variant="titleMedium">{kuzer?.name}</Text>
              {currentPosition && (
                <Text variant="bodySmall" color={theme.colors.outline}>
                  {t('homeScreen.userDetails.distance', {
                    distance: formatDistanceBetween(currentPosition, kuzer?.geopoint.coordinates || [0, 0]),
                  })}
                </Text>
              )}
            </>
          )}
        </Flex>
        {!loading && (
          <Flex
            backgroundColor={kuzer?.status === 'online' ? '#26A69A66' : colord(theme.colors.error).alpha(0.4).toHex()}
            align="center"
            justify="center"
            paddingX="xs"
            borderRadius={5}
          >
            <Text variant="bodySmall" color="#fff" fontSize={8} style={{ textTransform: 'uppercase' }}>
              {kuzer?.status === 'online' ? t('homeScreen.userDetails.online') : t('homeScreen.userDetails.offline')}
            </Text>
          </Flex>
        )}
      </Flex>
      {loading ? (
        <Skeleton height={16} width={275} style={{ marginTop: 4 }} />
      ) : (
        <Flex direction="row" gap="sm">
          <Flex direction="row" gap="xs" align="center">
            <InboxIcon height={16} width={16} color={theme.colors.outline} />
            <Text variant="bodyMedium" color={theme.colors.outline}>
              {t('homeScreen.userDetails.receivedCount', {
                count: kuzer?.messageStatistics.receivedTotalCount,
                averageDistance: formatDistance(kuzer?.messageStatistics.averageReceivedDistance || 0),
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
                count: kuzer?.messageStatistics.sentTotalCount,
                averageDistance: formatDistance(kuzer?.messageStatistics.averageSentDistance || 0),
              })}
            </Text>
          </Flex>
        </Flex>
      )}
    </Flex>
  );
}

let badgeHeight = 0;
let badgeWidth = 0;
function KuzerStatistics({
  loading,
  messagesReceived,
}: {
  loading: boolean;
  messagesReceived?: {
    id: string;
    emoji: string;
    count: number;
  }[];
}) {
  const theme = useAppTheme();
  const { t } = useTranslation();

  return (
    <Flex gap="md">
      <Text variant="labelMedium" color={theme.colors.onSurfaceVariant}>
        {t('homeScreen.userDetails.messagesReceived')}
      </Text>
      <FlatList
        horizontal
        showsHorizontalScrollIndicator={false}
        data={messagesReceived || Array(5)}
        ItemSeparatorComponent={() => <Flex width={12} />}
        renderItem={
          !loading && messagesReceived
            ? ({ item: { id, emoji, count } }) => (
                <Flex
                  key={id}
                  direction="row"
                  backgroundColor={theme.colors.surfaceContainerHigh}
                  paddingX="md"
                  paddingY={6}
                  gap="md"
                  borderRadius={14}
                  onLayout={({ nativeEvent: { layout } }) => {
                    badgeHeight = layout.height;
                    badgeWidth = layout.width;
                  }}
                >
                  <Text variant="bodyLarge">{emoji}</Text>
                  <Text variant="bodyLarge">{count}</Text>
                </Flex>
              )
            : () => <Skeleton height={badgeHeight} width={badgeWidth} borderRadius={14} />
        }
      ></FlatList>
    </Flex>
  );
}

let buttonHeight = 0;
let selectHeight = 0;
function BottomActions({
  loading,
  messages,
  onSend,
}: {
  loading: boolean;
  messages?: Message[];
  onSend: (message: Message) => void;
}) {
  const theme = useAppTheme();
  const { t } = useTranslation();

  const [visible, setVisible] = useState(false);
  const [messageSelected, setMessageSelected] = useState<Message>();

  const openMenu = () => setVisible(true);

  const closeMenu = () => setVisible(false);

  const handleSend = () => {
    if (messageSelected) {
      onSend(messageSelected);
    }
  };

  return (
    <Flex direction="row" gap="md" justify="space-between" align="center" paddingY="lg">
      <Flex flex={1}>
        <Menu
          visible={visible}
          onDismiss={closeMenu}
          anchor={
            loading ? (
              <Skeleton height={selectHeight} borderRadius={25} style={{ overflow: 'hidden' }} />
            ) : (
              <TouchableRipple
                onPress={openMenu}
                rippleColor="rgba(0, 0, 0, .32)"
                borderless
                style={{ borderRadius: 25 }}
                onLayout={({ nativeEvent: { layout } }) => {
                  selectHeight = layout.height;
                }}
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
            )
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

      {loading ? (
        <Skeleton
          height={buttonHeight}
          width={buttonHeight}
          borderRadius={buttonHeight}
          style={{ margin: 6, marginRight: 0 }}
        />
      ) : (
        <IconButton
          icon="send"
          mode="contained"
          containerColor={theme.colors.primary}
          iconColor={theme.colors.onPrimary}
          onPress={handleSend}
          disabled={!messageSelected}
          style={{ marginRight: 0 }}
          onLayout={({ nativeEvent: { layout } }) => {
            buttonHeight = layout.height;
          }}
        />
      )}
    </Flex>
  );
}

function orderMessageStatistics(messageStatistics: Kuzer['messageStatistics'], messages: Document<Message>[]) {
  return messages
    ?.map(({ id, emoji }) => ({
      id,
      emoji,
      count: messageStatistics.receivedCount[id] || 0,
    }))
    .sort((a, b) => b.count - a.count);
}
