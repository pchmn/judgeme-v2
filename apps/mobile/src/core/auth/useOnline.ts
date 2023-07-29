import { Kuzer, UPDATE_KUZER_MUTATION } from '@kuzpot/core';
import { useUpdateMutation } from '@kuzpot/react-native';
import { useUserData } from '@nhost/react';
import { useEffect } from 'react';
import { AppState } from 'react-native';

let didInit = false;

export function useOnline() {
  const userData = useUserData();
  const [mutateUser] = useUpdateMutation<Kuzer>(UPDATE_KUZER_MUTATION);

  useEffect(() => {
    if (!userData?.id) {
      return;
    }

    const setOnlineStatus = (status: 'online' | 'offline') => {
      mutateUser(userData.id, { status });
    };

    if (!didInit) {
      didInit = true;
      setOnlineStatus('online');
    }

    const subscription = AppState.addEventListener('change', (nextAppState) => {
      setOnlineStatus(nextAppState === 'active' ? 'online' : 'offline');
    });

    return () => {
      subscription.remove();
    };
  }, [mutateUser, userData?.id]);
}
