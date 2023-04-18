import { useSecureStorage } from '@kuzpot/react-native';
import { Region } from 'react-native-maps';

export function useRegionOnMap() {
  const [regionOnMap, setRegionOnMap] = useSecureStorage<Region & { age: number }>('regionOnMap');

  const set = (region: Region) => {
    setRegionOnMap({ ...region, age: Date.now() });
  };

  return [regionOnMap, set] as const;
}
