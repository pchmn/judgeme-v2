import { FunctionName } from '@kuzpot/core';
import { CloudFunction, region } from 'firebase-functions';

const functions: Record<FunctionName, CloudFunction<unknown>> = {
  sendMessage: region('europe-west1').https.onCall(async (data, context) => {
    return await (await import('./sendMessage')).default(data, context);
  }),
};

const { sendMessage } = functions;

export { sendMessage };
