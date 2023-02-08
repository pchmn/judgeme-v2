/// <reference types="vitest" />

import { defineConfig } from 'vite';

export default defineConfig({
  test: {
    environment: 'node',
    setupFiles: `${__dirname}/src/__test__/setup.ts`,
  },
});
