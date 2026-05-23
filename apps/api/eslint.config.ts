import globals from 'globals';
import config from '../../packages/eslint-config/nest.ts';

export default [
  ...config,
  {
    files: ['test/**/*.ts'],
    languageOptions: {
      globals: globals.jest,
    },
  },
];
