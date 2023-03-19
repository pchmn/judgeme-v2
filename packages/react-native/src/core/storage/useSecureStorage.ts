import { randomUUID } from 'expo-crypto';
import { getGenericPassword, setGenericPassword } from 'react-native-keychain';
import { MMKV, useMMKVObject } from 'react-native-mmkv';

let storage: MMKV;

const ENCRYPTION_KEY = 'MMKV_ENCRYPTION_KEY';
const ENCRYPTION_SERVICE = 'MMKV_ENCRYPTION_SERVICE';

async function getEncryptionKey() {
  const existingCredentials = await getGenericPassword({
    service: ENCRYPTION_SERVICE,
  });
  if (!existingCredentials) {
    const password = randomUUID();
    await setGenericPassword(ENCRYPTION_KEY, password, {
      service: ENCRYPTION_SERVICE,
    });
    return password;
  }
  return existingCredentials.password;
}

export async function initSecureStorage() {
  const encryptionKey = await getEncryptionKey();
  storage = new MMKV({
    id: 'kavout-storage',
    encryptionKey,
  });
}

export function useSecureStorage<T>(key: string, initialValue?: T) {
  if (!storage) {
    throw new Error('Secure storage is not initialized');
  }

  const [mmkvValue, setMmkvValue] = useMMKVObject<T>(key, storage);

  const clear = () => setMmkvValue(undefined);

  return [mmkvValue ?? initialValue, setMmkvValue, clear] as const;
}
