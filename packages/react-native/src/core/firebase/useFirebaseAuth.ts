import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth';
import { useMutation } from '@tanstack/react-query';
import { useCallback } from 'react';

import { useFirestoreData } from './useFirestoreData';

export function useFirebaseAuthUser() {
  const subscribeFn = useCallback((onData: (data: FirebaseAuthTypes.User | null) => void) => {
    return auth().onAuthStateChanged((firebaseUser) => {
      onData(firebaseUser);
    });
  }, []);

  const fetchFn = useCallback(async () => {
    return auth().currentUser;
  }, []);

  return useFirestoreData<FirebaseAuthTypes.User | null>(['firebaseAuth'], fetchFn, subscribeFn);
}

export function useSignInAnonymously() {
  return useMutation({ mutationFn: () => auth().signInAnonymously() });
}

export function useSignOut() {
  return useMutation({ mutationFn: () => auth().signOut() });
}
