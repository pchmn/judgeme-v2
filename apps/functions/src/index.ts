import { FunctionName } from '@judgeme/core';
import { region } from 'firebase-functions/v1';

const functions: Record<FunctionName, unknown> = {
  sendMessage: region('europe-west1').https.onCall(async (data, context) => {
    await (await import('./sendMessage')).default(data, context);
  }),
};

const { sendMessage } = functions;

export { sendMessage };
