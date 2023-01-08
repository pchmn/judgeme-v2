import AsyncStorage from '@react-native-async-storage/async-storage';
import { useCallback, useEffect, useState } from 'react';

export function useAsyncStorage<T>(
  key: string,
  defaultValue?: T
): {
  value: T | null | undefined;
  isLoading: boolean;
  error: Error | null;
  set: (value: T) => void;
  remove: () => void;
} {
  const [value, setValue] = useState<T>(defaultValue);
  const [error, setError] = useState<Error | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const load = async () => {
      try {
        const value = await AsyncStorage.getItem(key);
        if (value) {
          setValue(JSON.parse(value));
        } else {
          setValue(null);
        }
      } catch (e) {
        setError(e);
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, [key]);

  const set = useCallback(
    (value: T) => {
      AsyncStorage.setItem(key, JSON.stringify(value))
        .then(() => setValue(value))
        .catch(setError);
    },
    [key]
  );

  const remove = useCallback(() => {
    AsyncStorage.removeItem(key)
      .then(() => setValue(null))
      .catch(setError);
  }, [key]);

  return { value, isLoading, error, set, remove };
}
