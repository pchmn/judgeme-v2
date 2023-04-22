import { useEffectOnce, useSignInAnonymously } from '@kuzpot/react-native';
import { useState } from 'react';
import { ToastAndroid } from 'react-native';

import { useRegisterDevice } from './useRegisterDevice';

export function useAuth() {
  const { mutate: signInAnonymously } = useSignInAnonymously();
  const { register } = useRegisterDevice();

  const [isLoading, setIsLoading] = useState(true);

  useEffectOnce(() => {
    signInAnonymously(undefined, {
      onSuccess: async (user) => {
        console.log('user', user.user.uid);
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
