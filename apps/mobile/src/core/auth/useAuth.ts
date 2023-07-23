import { User } from '@kuzpot/core';
import { useEffectOnce, useFirestoreSetDoc, useSignInAnonymously } from '@kuzpot/react-native';
import { FirebaseAuthTypes } from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import { useState } from 'react';
import { ToastAndroid } from 'react-native';

import { useRegisterDevice } from './useRegisterDevice';

export function useAuth() {
  const { mutate: signInAnonymously } = useSignInAnonymously();
  const { mutate } = useFirestoreSetDoc<User>();
  const { register } = useRegisterDevice();

  const [isLoading, setIsLoading] = useState(true);

  const initUserData = (user: FirebaseAuthTypes.UserCredential) => {
    if (user.additionalUserInfo?.isNewUser) {
      mutate({
        ref: firestore().collection<User>('users').doc(user.user.uid),
        data: {
          status: 'online',
          messageStatistics: {
            receivedCount: {},
            receivedTotalCount: 0,
            sentCount: {},
            sentTotalCount: 0,
            averageReceivedDistance: 0,
            averageSentDistance: 0,
          },
        },
        options: { isCreation: true },
      });
    }
  };

  useEffectOnce(() => {
    signInAnonymously(undefined, {
      onSuccess: async (user) => {
        initUserData(user);
        try {
          await register(user.user.uid);
          setIsLoading(false);
        } catch (err) {
          setIsLoading(false);
          console.error('err', err);
          ToastAndroid.show('An error occurred', ToastAndroid.LONG);
        }
        // ToastAndroid.show('Signed in as ' + user.user.uid, ToastAndroid.LONG);
      },
      onError: () => {
        setIsLoading(false);
        ToastAndroid.show('An error occurred', ToastAndroid.LONG);
      },
    });
  });

  return { isLoading };
}
