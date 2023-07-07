import { FirebaseFirestoreTypes } from '@react-native-firebase/firestore';
import firestore from '@react-native-firebase/firestore';
import { useMutation } from '@tanstack/react-query';

export function useFirestoreUpdateDoc<T extends FirebaseFirestoreTypes.DocumentData>() {
  return useMutation({
    mutationFn: ({
      ref,
      data,
    }: {
      ref: FirebaseFirestoreTypes.DocumentReference<T>;
      data: FirebaseFirestoreTypes.SetValue<Partial<T>>;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    }) => ref.update({ ...data, updatedAt: firestore.FieldValue.serverTimestamp() } as any),
    onError: (error, { ref }) => console.error(`Error when setting doc`, { path: ref.path, error }),
  });
}

export function useFirestoreSetDoc<T extends FirebaseFirestoreTypes.DocumentData>() {
  return useMutation({
    mutationFn: ({
      ref,
      data,
      options,
    }: {
      ref: FirebaseFirestoreTypes.DocumentReference<T>;
      data: FirebaseFirestoreTypes.SetValue<Partial<T>>;
      options?: { isCreation?: boolean };
    }) =>
      ref.set(
        options?.isCreation
          ? ({
              ...data,
              updatedAt: firestore.FieldValue.serverTimestamp(),
              createdAt: firestore.FieldValue.serverTimestamp(),
            } as any)
          : ({ ...data, updatedAt: firestore.FieldValue.serverTimestamp() } as any),
        { merge: true }
      ),
    onError: (error, { ref }) => console.error(`Error when setting doc`, { path: ref.path, error }),
  });
}
