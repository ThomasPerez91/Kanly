import {
  defineConfig,
  presetWind4,
  presetWebFonts,
  presetTypography,
  transformerDirectives,
  transformerVariantGroup,
} from 'unocss'

export default defineConfig({
  presets: [
    presetWind4({
      preflights: {
        reset: true,
        theme: true,
      },
    }),
    presetTypography(),
    presetWebFonts({
      fonts: {
        sans: 'Inter:400,500,600,700',
        mono: 'JetBrains Mono:400,500,600',
      },
    }),
  ],

  transformers: [transformerDirectives(), transformerVariantGroup()],

  theme: {
    colors: {
      bg: {
        DEFAULT: '#F8FAFC',
        dark: '#0B1220',
      },
      surface: {
        DEFAULT: '#FFFFFF',
        dark: '#0F1A2B',
      },
      border: {
        DEFAULT: '#E2E8F0',
        dark: '#22314A',
      },
      text: {
        'DEFAULT': '#0F172A',
        'muted': '#475569',
        'dark': '#E5E7EB',
        'muted-dark': '#9CA3AF',
      },

      brand: {
        50: '#EEF2FF',
        100: '#E0E7FF',
        200: '#C7D2FE',
        300: '#A5B4FC',
        400: '#818CF8',
        500: '#6366F1',
        600: '#4F46E5',
        700: '#4338CA',
        800: '#3730A3',
        900: '#312E81',
      },

      success: {
        50: '#ECFDF5',
        600: '#16A34A',
        700: '#15803D',
      },
      warning: {
        50: '#FFFBEB',
        600: '#D97706',
        700: '#B45309',
      },
      danger: {
        50: '#FEF2F2',
        600: '#DC2626',
        700: '#B91C1C',
      },
    },
  },

  shortcuts: {
    // --- Layout / Surfaces ---
    'app-shell': 'min-h-screen bg-bg text-text dark:(bg-bg-dark text-text-dark)',
    'container-app': 'mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8',
    'page': 'container-app py-10',

    'card':
      'rounded-xl bg-surface border border-border shadow-sm dark:(bg-surface-dark border-border-dark)',
    'card-hover': 'card transition hover:shadow-md',
    'divider': 'h-px w-full bg-border dark:bg-border-dark',

    // --- Typography ---
    'h1': 'text-3xl sm:text-4xl font-700 tracking-tight',
    'h2': 'text-2xl font-700 tracking-tight',
    'muted': 'text-sm text-text-muted dark:text-text-muted-dark',

    // --- Focus ring (accessibilité) ---
    'focus-ring':
      'focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 focus-visible:ring-offset-bg dark:focus-visible:ring-offset-bg-dark',

    // --- Buttons ---
    'btn':
      'inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-600 transition disabled:(opacity-60 cursor-not-allowed) focus-ring',
    'btn-primary': 'btn bg-brand-600 text-white hover:bg-brand-700',
    'btn-secondary':
      'btn bg-gray-100 text-text hover:bg-gray-200 dark:(bg-white/10 text-text-dark hover:bg-white/15)',
    'btn-ghost': 'btn bg-transparent hover:bg-gray-100 dark:hover:bg-white/10',
    'btn-danger': 'btn bg-danger-600 text-white hover:bg-danger-700',

    // tailles boutons
    'btn-sm': 'px-3 py-1.5 text-xs rounded-md',
    'btn-lg': 'px-5 py-3 text-base rounded-xl',

    // --- Inputs ---
    'input':
      'w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm outline-none focus:(ring-2 ring-brand-500 border-brand-500) dark:(bg-surface-dark border-border-dark text-text-dark)',
    'label': 'block text-sm font-600 mb-1',
    'error': 'mt-1 text-sm text-danger-600',

    // --- Navbar (home) ---
    'navbar-home': 'w-full py-4',
    'navbar-link':
      'text-sm font-600 text-text/80 hover:text-text dark:(text-text-dark/80 hover:text-text-dark)',
  },
})
