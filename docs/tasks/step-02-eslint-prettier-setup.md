# Step 02 — Shared ESLint + Prettier Configuration

## Objective

Establish a shared linting and formatting setup across the monorepo.

Goals:

- Single source of truth
- Consistent rules across frontend and backend
- TypeScript-first configuration
- React support
- Nest support
- Minimal custom rules
- Production-oriented defaults

Do NOT:

- Add husky
- Add lint-staged
- Add commit hooks
- Add Sonar
- Add custom lint rules unless necessary

These can be added later.

---

## Required Packages

Install at workspace root:

```bash
pnpm add -D \
eslint \
prettier \
typescript-eslint \
@eslint/js \
eslint-config-prettier \
eslint-plugin-import \
eslint-plugin-unused-imports \
eslint-plugin-react \
eslint-plugin-react-hooks \
eslint-plugin-jsx-a11y \
globals
```

For frontend workspace:

```bash
pnpm add -D -F web \
eslint-plugin-react-refresh
```

---

## Expected Folder Structure

```txt
packages/

    eslint-config/
        base.js
        react.js
        nest.js

    prettier-config/
        index.js
```

---

## Create Shared Prettier Config

Create:

packages/prettier-config/index.js

```js
module.exports = {
  semi: true,
  singleQuote: true,
  trailingComma: 'all',
  tabWidth: 2,
  printWidth: 100,
  arrowParens: 'always',
};
```

Reasoning:

- single quotes → cleaner TS ecosystem consistency
- trailing commas → cleaner diffs
- print width 100 → practical balance
- avoid excessive stylistic preferences

---

## Create Base ESLint Config

Create:

packages/eslint-config/base.js

```js
const js = require('@eslint/js');
const tseslint = require('typescript-eslint');
const globals = require('globals');
const prettier = require('eslint-config-prettier');
const unusedImports = require('eslint-plugin-unused-imports');

module.exports = tseslint.config(
  js.configs.recommended,

  ...tseslint.configs.recommended,

  prettier,

  {
    languageOptions: {
      globals: globals.node,
    },

    plugins: {
      'unused-imports': unusedImports,
    },

    rules: {
      'unused-imports/no-unused-imports': 'error',

      '@typescript-eslint/no-explicit-any': 'warn',

      '@typescript-eslint/no-unused-vars': 'off',
    },
  },
);
```

---

## React Config

Create:

packages/eslint-config/react.js

```js
const base = require('./base');

const reactPlugin = require('eslint-plugin-react');
const reactHooks = require('eslint-plugin-react-hooks');
const jsxA11y = require('eslint-plugin-jsx-a11y');

module.exports = [
  ...base,

  reactPlugin.configs.flat.recommended,

  reactHooks.configs['recommended-latest'],

  jsxA11y.flatConfigs.recommended,
];
```

---

## Nest Config

Create:

packages/eslint-config/nest.js

```js
const base = require('./base');

module.exports = [...base];
```

No Nest-specific rules yet.

Nest generally works well with TypeScript defaults.

---

## Configure Frontend

Create:

apps/web/eslint.config.js

```js
const config = require('../../packages/eslint-config/react');

module.exports = config;
```

---

## Configure Backend

Create:

apps/api/eslint.config.js

```js
const config = require('../../packages/eslint-config/nest');

module.exports = config;
```

---

## Add Prettier Usage

Create root:

.prettierrc

```js
module.exports = require('./packages/prettier-config');
```

Create:

.prettierignore

```txt
node_modules
dist
coverage
.next
.turbo
```

---

## Update Root Scripts

Update package.json:

```json
{
  "scripts": {
    "dev": "turbo dev",
    "build": "turbo build",

    "lint": "turbo lint",

    "lint:fix": "turbo lint -- --fix",

    "format": "prettier . --write",

    "format:check": "prettier . --check",

    "test": "turbo test"
  }
}
```

---

## Validation

Verify:

```bash
pnpm lint

pnpm format:check
```

Expected:

✓ No ESLint errors

✓ No Prettier errors

✓ Frontend linting works

✓ Backend linting works

---

## Commit

```bash
git add .

git commit -m "chore: setup shared eslint and prettier configuration"
```

---

## Notes

Avoid:

- Airbnb config
- massive rule overrides
- stylistic ESLint plugins
- heavy custom rules

Keep linting focused on correctness rather than preferences.
