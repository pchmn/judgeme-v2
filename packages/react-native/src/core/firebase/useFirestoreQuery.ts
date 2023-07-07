import { FirebaseFirestoreTypes } from '@react-native-firebase/firestore';
import { QueryKey } from '@tanstack/react-query';
import { useCallback } from 'react';

import { DataWithId } from './types';
import { useFirestoreData } from './useFirestoreData';
import { getDataFromSnapshot } from './utils';

export function useFirestoreQuery<T extends FirebaseFirestoreTypes.DocumentData>(
  queryKey: QueryKey,
  query: FirebaseFirestoreTypes.Query<T>,
  options?: { enabled?: boolean }
) {
  const subscribeFn = useCallback(
    (onData: (data: DataWithId<T>[]) => void, onError?: (error: Error) => void) => {
      const unsubscribe = query.onSnapshot(
        (snapshot) => {
          onData(snapshot.docs.map((doc) => getDataFromSnapshot({ snapshot: doc, nullable: false })));
        },
        (error) => {
          if (onError) onError(error);
        }
      );

      return unsubscribe;
    },
    [query]
  );

  const fetchFn = useCallback(async () => {
    const snapshot = await query.get();
    return snapshot.docs.map((doc) => getDataFromSnapshot({ snapshot: doc, nullable: false }));
  }, [query]);

  return useFirestoreData<DataWithId<T>[]>(queryKey, fetchFn, subscribeFn, {
    ...options,
    initialData: [],
  });
}
