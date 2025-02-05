import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment:'node',
    include: ['src/tests/**/*.test.ts', 'src/tests/**/*.test.tsx'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
    },
  },
});
