import * as SecureStore from 'expo-secure-store';
import { useCallback, useEffect, useState } from 'react';

export function useSecureStore<T>(key: string, defaultValue?: T) {
  const [value, setValue] = useState<T | undefined>(defaultValue);
  const [error, setError] = useState<Error | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const load = async () => {
      try {
        const value = await SecureStore.getItemAsync(key);
        if (value) {
          setValue(JSON.parse(value));
        } else {
          setValue(defaultValue);
        }
      } catch (e) {
        setError(e as Error);
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, [defaultValue, key]);

  const set = useCallback(
    (value: T) => {
      SecureStore.setItemAsync(key, JSON.stringify(value))
        .then(() => setValue(value))
        .catch(setError);
    },
    [key]
  );

  const remove = useCallback(() => {
    SecureStore.deleteItemAsync(key)
      .then(() => setValue(defaultValue))
      .catch(setError);
  }, [defaultValue, key]);

  return { value, isLoading, error, set, remove };
}
