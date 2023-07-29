import { gql, useSubscription } from '@apollo/client';
import { Kuzer, SEARCH_NEARBY_KUZERS } from '@kuzpot/core';
import { useState } from 'react';

export interface GeoOptions {
  minLat: number;
  minLong: number;
  maxLat: number;
  maxLong: number;
}

export function useNearbyKuzers(options?: GeoOptions) {
  const [kuzers, setKuzers] = useState<Kuzer[]>();
  const { data, loading, error } = useSubscription<{ search_nearby_kuzers: Kuzer[] }>(gql(SEARCH_NEARBY_KUZERS), {
    variables: { ...options },
  });

  if (!loading && JSON.stringify(data?.search_nearby_kuzers) !== JSON.stringify(kuzers)) {
    setKuzers(data?.search_nearby_kuzers as Kuzer[]);
  }

  return {
    data: kuzers,
    loading,
    error,
  };
}
