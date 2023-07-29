import { INSERT_KUZER_MUTATION, Kuzer } from '@kuzpot/core';
import { useInsertMutation } from '@kuzpot/react-native';
import { useAuthenticationStatus, useSignInAnonymous, useUserData } from '@nhost/react';
import { useCallback, useEffect, useState } from 'react';

import { useRegisterDevice } from './useRegisterDevice';

let isInit = false;

export function useAuth() {
  const { register } = useRegisterDevice();

  const { isAuthenticated, isLoading: authLoading } = useAuthenticationStatus();
  const { signInAnonymous } = useSignInAnonymous();
  const [mutateUser] = useInsertMutation<Kuzer>(INSERT_KUZER_MUTATION);
  const userData = useUserData();

  const [isLoading, setIsLoading] = useState(true);

  const initUser = useCallback(
    async (userId: string) => {
      await mutateUser({
        id: userId,
        status: 'online',
      });
    },
    [mutateUser]
  );

  useEffect(() => {
    if (!authLoading && !isAuthenticated && !isInit) {
      signInAnonymous()
        .then((user) => {
          setIsLoading(false);
          if (user.user) {
            initUser(user.user.id);
            register(user.user.id);
          }
        })
        .catch((err) => {
          console.error('nhost err', err);
          setIsLoading(false);
        });
      isInit = true;
    } else if (!isInit && !authLoading && isAuthenticated && userData?.id) {
      isInit = true;
      setIsLoading(false);
      register(userData?.id);
    }
  }, [authLoading, initUser, isAuthenticated, signInAnonymous, userData?.id, register]);

  return { isLoading };
}
