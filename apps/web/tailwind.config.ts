import type { Config } from 'tailwindcss';

const config = {
  content: ['./index.html', './src/**/*.{ts,tsx}', '../../node_modules/@tremor/**/*.{js,ts,jsx,tsx}'],
} satisfies Config;

export default config;
