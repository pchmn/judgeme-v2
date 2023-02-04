import { https } from 'firebase-functions';
import { CallableContext } from 'firebase-functions/v1/https';

const { HttpsError } = https;

export { CallableContext, HttpsError };
