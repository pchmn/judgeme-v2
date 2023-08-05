import { INSERT_KUZER, Kuzer } from '@kuzpot/core';
import { useInsertMutation } from '@kuzpot/react-native';
import { useAuthenticationStatus, useSignInAnonymous, useUserData } from '@nhost/react';
import { useCallback, useEffect, useState } from 'react';
import * as Sentry from 'sentry-expo';

import { useRegisterDevice } from './useRegisterDevice';

let isInit = false;

export function useAuth() {
  const { register } = useRegisterDevice();

  const { isAuthenticated, isLoading: authLoading } = useAuthenticationStatus();
  const { signInAnonymous } = useSignInAnonymous();
  const [mutateUser] = useInsertMutation<Kuzer>(INSERT_KUZER);
  const userData = useUserData();

  const [isLoading, setIsLoading] = useState(true);

  const initUser = useCallback(
    async (userId: string) => {
      Sentry.Native.setUser({ id: userId, role: 'anonymous' });
      try {
        await mutateUser({
          id: userId,
          status: 'online',
        });
        await register(userId);
        setIsLoading(false);
      } catch (err) {
        Sentry.Native.captureException(err);
        console.error('nhost err', err);
        setIsLoading(false);
      }
    },
    [mutateUser, register]
  );

  useEffect(() => {
    if (!authLoading && !isAuthenticated && !isInit) {
      signInAnonymous()
        .then((user) => {
          if (user.user) {
            initUser(user.user.id);
          }
        })
        .catch((err) => {
          Sentry.Native.captureException(err);
          console.error('nhost err', err);
          setIsLoading(false);
        });
      isInit = true;
    } else if (!isInit && !authLoading && isAuthenticated && userData?.id) {
      initUser(userData.id);
      isInit = true;
    }
  }, [authLoading, initUser, isAuthenticated, signInAnonymous, userData?.id, register]);

  return { isLoading };
}
