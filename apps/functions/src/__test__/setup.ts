import 'dotenv/config';

import firebaseFunctionsTest from 'firebase-functions-test';

import * as functions from '../index';

const testProjectId = 'test-project-5ce23';

const testFunctions = firebaseFunctionsTest(
  {
    projectId: testProjectId,
  },
  process.env.GOOGLE_APPLICATION_CREDENTIALS_TEST
);

export { functions, testFunctions, testProjectId };
