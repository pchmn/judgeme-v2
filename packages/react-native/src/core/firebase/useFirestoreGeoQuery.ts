import { Document } from '@kuzpot/core';
import { FirebaseFirestoreTypes } from '@react-native-firebase/firestore';
import { QueryKey } from '@tanstack/react-query';
import { geohashQueryBounds } from 'geofire-common';
import { useCallback, useMemo } from 'react';

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

let initialData: Document<any>[] = [];

function useFirestoreQueries<T extends FirebaseFirestoreTypes.DocumentData>(
  queryKey: QueryKey,
  queries: Record<string, FirebaseFirestoreTypes.Query<T>>,
  options?: { enabled?: boolean }
) {
  const subscribeFn = useCallback(
    (onData: (data: Document<T>[]) => void, onError?: (error: Error) => void) => {
      const unsubscribes: (() => void)[] = [];
      const data: Record<string, Document<T>[]> = {};
      onData(initialData);

      for (const key in queries) {
        unsubscribes.push(
          queries[key].onSnapshot(
            (snapshot) => {
              const docs = snapshot.docs.map((doc) => getDataFromSnapshot({ snapshot: doc, nullable: false }));
              const oldDocs = data[key] || [];
              const updatedDocs = [];
              for (const doc of docs) {
                const oldDoc = oldDocs.find((oldDoc) => oldDoc.id === doc.id);
                if (oldDoc) {
                  Object.assign(oldDoc, doc);
                  updatedDocs.push(oldDoc);
                } else {
                  updatedDocs.push(doc);
                }
              }
              data[key] = updatedDocs;

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

  return useFirestoreData<Document<T>[]>(queryKey, fetchFn, subscribeFn, { ...options, initialData });
}
