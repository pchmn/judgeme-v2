import { Kuzer, SEARCH_VISIBLE_KUZERS } from '@kuzpot/core';
import { useSubscription } from '@kuzpot/react-native';

export interface GeoQueryOptions {
  minLat: number;
  minLong: number;
  maxLat: number;
  maxLong: number;
}

export function useNearbyKuzers(options?: GeoQueryOptions) {
  return useSubscription<Kuzer[], GeoQueryOptions>(SEARCH_VISIBLE_KUZERS, options);
}
