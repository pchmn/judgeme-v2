import { Message, UserDocument } from '@kuzpot/core';
import { Flex, useAppTheme, useFirestoreQuery } from '@kuzpot/react-native';
import { DataWithId } from '@kuzpot/react-native/src/core/firebase/types';
import firestore from '@react-native-firebase/firestore';
import { firebase } from '@react-native-firebase/functions';
import { useState } from 'react';
import { Button, RadioButton, Surface, Text, TouchableRipple } from 'react-native-paper';
import Animated, { Extrapolate, interpolate, SharedValue, useAnimatedStyle } from 'react-native-reanimated';

import { IconCheck } from '@/shared/components';

export function UserDetails({
  user,
  positionValue,
}: {
  user: DataWithId<UserDocument>;
  positionValue: SharedValue<number>;
}) {
  const { data: messages } = useFirestoreQuery<Message>(['messages'], firestore().collection('messages'));

  // console.log('position', position, insets, navbarHeight);

  const theme = useAppTheme();
  const [value, setValue] = useState('');

  const sendMessage = async () => {
    const result = await firebase.app().functions('europe-west1').httpsCallable('sendMessage')({
      to: user.id,
      message: value,
    });
    console.log('result', result);
  };

  const textStyle = useAnimatedStyle(() => {
    const scale = interpolate(positionValue.value, [0, 1], [0.2, 0.9], Extrapolate.CLAMP);

    return {
      transform: [{ scale }],
    };
  });

  return (
    <Flex padding={16} gap={16} style={{ position: 'relative' }}>
      <Animated.View
        style={[
          {
            height: 100,
            width: 100,
            borderRadius: 50,
            backgroundColor: 'red',
          },
          textStyle,
        ]}
      ></Animated.View>
      <Animated.View style={[textStyle]}>
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
                    {/* <RadioButton value={message.id} /> */}
                  </Flex>
                </Flex>
              </TouchableRipple>
            </Surface>
          ))}
        </Flex>
      </RadioButton.Group>
      <Button mode="contained" onPress={sendMessage}>
        Send message
      </Button>
    </Flex>
  );
}
