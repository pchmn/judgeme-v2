import { FirebaseFirestoreTypes } from '@react-native-firebase/firestore';
import { QueryKey } from '@tanstack/react-query';
import { geohashQueryBounds } from 'geofire-common';
import { useCallback, useMemo } from 'react';

import { DataWithId } from './types';
import { useFirestoreData } from './useFirestoreData';
import { getDataFromSnapshot } from './utils';

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

let initialData: DataWithId<any>[] = [];

function useFirestoreQueries<T extends FirebaseFirestoreTypes.DocumentData>(
  queryKey: QueryKey,
  queries: Record<string, FirebaseFirestoreTypes.Query<T>>,
  options?: { enabled?: boolean }
) {
  const subscribeFn = useCallback(
    (onData: (data: DataWithId<T>[]) => void, onError?: (error: Error) => void) => {
      const unsubscribes: (() => void)[] = [];
      const data: Record<string, DataWithId<T>[]> = {};
      onData(initialData);

      for (const key in queries) {
        unsubscribes.push(
          queries[key].onSnapshot(
            (snapshot) => {
              data[key] = snapshot.docs.map((doc) => getDataFromSnapshot({ snapshot: doc, nullable: false }));

              if (Object.keys(data).length === Object.keys(queries).length) {
                // Emit data when all queries are done
                onData(Object.values(data).flat());
                initialData = Object.values(data).flat();
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
    return data
      .map((snapshot) => snapshot.docs.map((doc) => getDataFromSnapshot({ snapshot: doc, nullable: false })))
      .flat();
  };

  return useFirestoreData<DataWithId<T>[]>(queryKey, fetchFn, subscribeFn, { ...options, initialData });
}
