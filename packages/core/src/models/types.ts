export type Document<T> = T & { id: string; createdAt?: Date; updatedAt?: Date };

export interface BaseModel {
  id: string;
  createdAt: Date;
  updatedAt: Date;
}
