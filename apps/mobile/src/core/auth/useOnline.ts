import { User } from '@kuzpot/core';
import { useFirebaseAuthUser, useFirestoreSetDoc } from '@kuzpot/react-native';
import firestore from '@react-native-firebase/firestore';
import { useEffect } from 'react';
import { AppState } from 'react-native';

let didInit = false;

export function useOnline() {
  const { data: currentUser } = useFirebaseAuthUser();
  const { mutate } = useFirestoreSetDoc<User>();

  useEffect(() => {
    const setOnlineStatus = (status: 'online' | 'offline') => {
      mutate({
        ref: firestore().collection<User>('users').doc(currentUser?.uid),
        data: {
          status,
        },
      });
    };

    if (!didInit && currentUser?.uid) {
      didInit = true;
      setOnlineStatus('online');
    }

    const subscription = AppState.addEventListener('change', (nextAppState) => {
      if (currentUser?.uid) {
        setOnlineStatus(nextAppState === 'active' ? 'online' : 'offline');
      }
    });

    return () => {
      subscription.remove();
    };
  }, [currentUser?.uid, mutate]);
}
