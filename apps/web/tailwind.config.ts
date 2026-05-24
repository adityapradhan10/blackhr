import type { Config } from 'tailwindcss';
import formsPlugin from '@tailwindcss/forms';
import colors from 'tailwindcss/colors';

const config = {
  content: ['./index.html', './src/**/*.{ts,tsx}', './node_modules/@tremor/react/dist/**/*.{js,jsx}'],
  plugins: [formsPlugin],
  safelist: [
    {
      pattern:
        /^(bg-(?:slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-(?:50|100|200|300|400|500|600|700|800|900|950))$/,
      variants: ['hover', 'data-[selected]'],
    },
    {
      pattern:
        /^(text-(?:slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-(?:50|100|200|300|400|500|600|700|800|900|950))$/,
      variants: ['hover', 'data-[selected]'],
    },
    {
      pattern:
        /^(border-(?:slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-(?:50|100|200|300|400|500|600|700|800|900|950))$/,
      variants: ['hover', 'data-[selected]'],
    },
    {
      pattern:
        /^(ring-(?:slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-(?:50|100|200|300|400|500|600|700|800|900|950))$/,
    },
    {
      pattern:
        /^(stroke-(?:slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-(?:50|100|200|300|400|500|600|700|800|900|950))$/,
    },
    {
      pattern:
        /^(fill-(?:slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-(?:50|100|200|300|400|500|600|700|800|900|950))$/,
    },
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        'tremor-default': '0.5rem',
        'tremor-full': '9999px',
        'tremor-small': '0.375rem',
      },
      boxShadow: {
        'dark-tremor-card': '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
        'dark-tremor-dropdown': '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
        'dark-tremor-input': '0 1px 2px 0 rgb(0 0 0 / 0.05)',
        'tremor-card': '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
        'tremor-dropdown': '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
        'tremor-input': '0 1px 2px 0 rgb(0 0 0 / 0.05)',
      },
      colors: {
        'dark-tremor': {
          background: {
            DEFAULT: colors.gray[900],
            emphasis: colors.gray[300],
            muted: '#131A2B',
            subtle: colors.gray[800],
          },
          border: {
            DEFAULT: colors.gray[800],
          },
          brand: {
            DEFAULT: colors.blue[500],
            emphasis: colors.blue[400],
            faint: '#0B1229',
            inverted: colors.blue[950],
            muted: colors.blue[950],
            subtle: colors.blue[800],
          },
          content: {
            DEFAULT: colors.gray[500],
            emphasis: colors.gray[200],
            inverted: colors.gray[950],
            strong: colors.gray[50],
            subtle: colors.gray[600],
          },
          ring: {
            DEFAULT: colors.gray[800],
          },
        },
        tremor: {
          background: {
            DEFAULT: colors.white,
            emphasis: colors.gray[700],
            muted: colors.gray[50],
            subtle: colors.gray[100],
          },
          border: {
            DEFAULT: colors.gray[200],
          },
          brand: {
            DEFAULT: colors.blue[500],
            emphasis: colors.blue[700],
            faint: colors.blue[50],
            inverted: colors.white,
            muted: colors.blue[200],
            subtle: colors.blue[400],
          },
          content: {
            DEFAULT: colors.gray[500],
            emphasis: colors.gray[700],
            inverted: colors.white,
            strong: colors.gray[900],
            subtle: colors.gray[400],
          },
          ring: {
            DEFAULT: colors.gray[200],
          },
        },
      },
      fontSize: {
        'tremor-default': ['0.875rem', { lineHeight: '1.25rem' }],
        'tremor-label': ['0.75rem', { lineHeight: '1rem' }],
        'tremor-metric': ['1.875rem', { lineHeight: '2.25rem' }],
        'tremor-title': ['1.125rem', { lineHeight: '1.75rem' }],
      },
    },
  },
} satisfies Config;

export default config;
