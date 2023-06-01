import { UserDocument } from '@kuzpot/core';
import { Flex } from '@kuzpot/react-native';
import { DataWithId } from '@kuzpot/react-native/src/core/firebase/types';
import { firebase } from '@react-native-firebase/functions';
import { Button, Text } from 'react-native-paper';

export function UserDetails({ user }: { user: DataWithId<UserDocument> }) {
  const sendMessage = async () => {
    const result = await firebase.app().functions('europe-west1').httpsCallable('sendMessage')({
      to: user.id,
      message: 'love_you',
    });
    console.log('result', result);
  };

  return (
    <Flex padding={16} gap={16}>
      <Text>{user.id} 🎉</Text>
      <Button mode="contained" onPress={sendMessage}>
        Send message
      </Button>
    </Flex>
  );
}
