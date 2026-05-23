import jsxA11y from 'eslint-plugin-jsx-a11y';
import reactPlugin from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import base from './base.ts';

const config = [
  ...base,

  reactPlugin.configs.flat.recommended,

  reactPlugin.configs.flat['jsx-runtime'],

  {
    settings: {
      react: {
        version: 'detect',
      },
    },
  },

  reactHooks.configs.flat['recommended-latest'],

  jsxA11y.flatConfigs.recommended,
];

export default config;
