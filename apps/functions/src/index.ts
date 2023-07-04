import { install } from 'source-map-support';
install();

import { FunctionName, FunctionParams } from '@kuzpot/core';
import { setGlobalOptions } from 'firebase-functions/v2';
import { CallableFunction, onCall } from 'firebase-functions/v2/https';

setGlobalOptions({ region: 'europe-west1', maxInstances: 10 });

const functions: Record<FunctionName, CallableFunction<FunctionParams[FunctionName], unknown>> = {
  sendMessage: onCall<FunctionParams['sendMessage']>(async (req) => {
    return await (await import('./sendMessage')).default(req);
  }),
};

const { sendMessage } = functions;

export { sendMessage };
