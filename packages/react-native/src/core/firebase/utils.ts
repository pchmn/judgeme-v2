import { FirebaseFirestoreTypes } from '@react-native-firebase/firestore';

import { DataWithId } from './types';

type Data<T, Nullable> = Nullable extends true ? T | null : T;

export function getDataFromSnapshot<
  T extends FirebaseFirestoreTypes.DocumentData,
  Nullable extends boolean = true
>(params: { snapshot: FirebaseFirestoreTypes.QueryDocumentSnapshot<T>; nullable?: Nullable }) {
  const { snapshot, nullable = true } = params;
  const data = snapshot.data() || null;

  if (!nullable && !data) {
    throw new Error('Document does not exist');
  }

  return (data ? { ...data, id: snapshot.id } : data) as Data<DataWithId<T>, Nullable>;
}
