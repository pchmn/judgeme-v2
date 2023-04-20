import { FirebaseFirestoreTypes } from '@react-native-firebase/firestore';
import { QueryKey } from '@tanstack/react-query';
import { geohashQueryBounds } from 'geofire-common';
import { useCallback, useMemo } from 'react';

import { useFirestoreData } from './useFirestoreData';

export interface GeoQueryOptions {
  center: { latitude: number; longitude: number };
  radius: number;
}

export function useFirestoreGeoQuery<T extends FirebaseFirestoreTypes.DocumentData>(
  ref: FirebaseFirestoreTypes.CollectionReference<T>,
  options?: GeoQueryOptions & { key?: keyof T }
) {
  const queries = useMemo(() => {
    if (!options) return {};
    const { center, radius, key = 'geohash' } = options;
    const bounds = geohashQueryBounds([center.latitude, center.longitude], radius);
    const queries: Record<string, FirebaseFirestoreTypes.Query<T>> = {};
    for (const b of bounds) {
      queries[`${b[0]}-${b[1]}`] = ref.orderBy(key).startAt(b[0]).endAt(b[1]);
    }
    return queries;
  }, [ref, options]);

  return useFirestoreQueries([ref.path, JSON.stringify(options)], queries, {
    enabled: !!options,
  });
}

function useFirestoreQueries<T extends FirebaseFirestoreTypes.DocumentData>(
  queryKey: QueryKey,
  queries: Record<string, FirebaseFirestoreTypes.Query<T>>,
  options?: { enabled?: boolean }
) {
  const subscribeFn = useCallback(
    (onData: (data: T[]) => void, onError?: (error: Error) => void) => {
      const unsubscribes: (() => void)[] = [];
      const data: Record<string, T[]> = {};
      onData(Object.values(data).flat());

      for (const key in queries) {
        unsubscribes.push(
          queries[key].onSnapshot(
            (snapshot) => {
              const docs = snapshot.docs.map((doc) => doc.data());

              if (docs.length === 0) {
                // console.log('no docs found', docs);
                if (data[key]) {
                  // If there are no docs, but there were docs before, then we need to remove them
                  delete data[key];
                  onData(Object.values(data).flat());
                }
              } else if (docs.length > 0) {
                // If there are docs, then we need to add them
                data[key] = docs;
                console.log('docs found', Object.values(data).flat());
                onData(Object.values(data).flat());
              }
            },
            (error) => {
              onError?.(error);
            }
          )
        );
      }

      return () => {
        unsubscribes.forEach((unsubscribe) => unsubscribe());
      };
    },
    [queries]
  );

  const fetchFn = async () => {
    const data = await Promise.all(Object.values(queries).map((query) => query.get()));
    return data.map((snapshot) => snapshot.docs.map((doc) => doc.data())).flat();
  };

  return useFirestoreData<T[]>(queryKey, fetchFn, subscribeFn, options);
}
