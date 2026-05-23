const base = require('./base');

const reactPlugin = require('eslint-plugin-react');
const reactHooks = require('eslint-plugin-react-hooks');
const jsxA11y = require('eslint-plugin-jsx-a11y');

module.exports = [
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
