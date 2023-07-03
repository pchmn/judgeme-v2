import 'dotenv/config';

import { CallableFunction } from 'firebase-functions/v2/https';
import firebaseFunctionsTest from 'firebase-functions-test';
import { vi } from 'vitest';

import * as functions from '../index';

const testProjectId = process.env.TEST_PROJECT_ID;

const testFunctions = firebaseFunctionsTest(
  {
    projectId: testProjectId,
  },
  process.env.GOOGLE_APPLICATION_CREDENTIALS_TEST
);

const wrapCallableFunction = <T>(fn: CallableFunction<T, unknown>) => {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  return testFunctions.wrap(fn) as CallableRequest<T, unknown>;
};

vi.mock('@logtail/node', () => {
  const Logtail = vi.fn(() => ({
    error: vi.fn(),
    info: vi.fn(),
    warn: vi.fn(),
    debug: vi.fn(),
  }));
  return { Logtail };
});

export { functions, testFunctions, testProjectId, wrapCallableFunction };
