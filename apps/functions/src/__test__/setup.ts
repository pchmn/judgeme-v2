import 'dotenv/config';

import firebaseFunctionsTest from 'firebase-functions-test';

import * as functions from '../index';

const testProjectId = process.env.TEST_PROJECT_ID;

const testFunctions = firebaseFunctionsTest(
  {
    projectId: testProjectId,
  },
  process.env.GOOGLE_APPLICATION_CREDENTIALS_TEST
);

export { functions, testFunctions, testProjectId };
