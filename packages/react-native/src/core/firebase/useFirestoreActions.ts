import { FirebaseFirestoreTypes } from '@react-native-firebase/firestore';
import { useMutation } from '@tanstack/react-query';

export function useFirestoreSetDoc<T extends FirebaseFirestoreTypes.DocumentData>() {
  return useMutation({
    mutationFn: ({
      ref,
      data,
    }: {
      ref: FirebaseFirestoreTypes.DocumentReference<T>;
      data: FirebaseFirestoreTypes.SetValue<Partial<T>>;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    }) => ref.set(data as any, { merge: true }),
    onError: (error, { ref }) => console.error(`Error when setting doc`, { path: ref.path, error }),
  });
}
