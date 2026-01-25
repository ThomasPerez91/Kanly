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
      'bg': '#F6F8FC',
      'surface': '#FFFFFF',
      'text': '#0F172A',
      'text-muted': '#475569',
      'border': '#E6EAF2',

      'brand': {
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

      'accent': {
        500: '#06B6D4',
        600: '#0891B2',
      },

      'danger': {
        500: '#EF4444',
        600: '#DC2626',
      },
    },
    borderRadius: {
      xl: '16px',
      lg: '14px',
    },
  },
  shortcuts: [
    // layout
    ['container-app', 'mx-auto w-full max-w-6xl px-4 sm:px-6'],
    ['page', 'min-h-[calc(100vh-64px)]'],

    // typography
    ['h1', 'text-3xl sm:text-5xl font-900 tracking-tight text-text'],
    ['h2', 'text-xl sm:text-2xl font-900 text-text'],
    ['muted', 'text-sm sm:text-base text-text-muted'],

    // surfaces
    ['card', 'bg-surface border border-border rounded-xl shadow-[0_10px_30px_rgba(15,23,42,0.08)]'],

    // navbar
    ['navbar-home', 'sticky top-0 z-40 bg-bg/80 backdrop-blur border-b border-border'],
    ['navbar-link', 'text-sm font-700 text-text-muted hover:text-text transition'],
    // navbar app
    ['navbar-app', 'sticky top-0 z-40 bg-bg/80 backdrop-blur border-b border-border'],
    ['navbar-app-inner', 'h-14 px-3 sm:px-4 flex items-center gap-3'],
    ['navbar-brand', 'flex items-center gap-2 font-900 tracking-tight text-text'],
    ['navbar-search-wrap', 'flex-1 flex justify-center'],
    ['navbar-actions', 'flex items-center gap-2'],

    // navbar search
    [
      'search-input',
      'w-full h-10 sm:h-11 px-3 rounded-xl bg-surface border border-border text-text placeholder:text-text-muted/70 outline-none transition focus:(border-brand-500 ring-4 ring-brand-500/15)',
    ],

    // dropdown (reusable)
    ['dropdown-panel', 'bg-surface border border-border rounded-xl shadow-soft overflow-hidden'],
    [
      'dropdown-item',
      'w-full flex items-center justify-start text-left gap-2 px-3 py-2 text-sm font-700 text-text hover:bg-bg transition',
    ],

    ['dropdown-item-muted', 'text-text-muted hover:text-text'],
    ['dropdown-sep', 'h-px w-full bg-border'],
    ['dropdown-header', 'px-3 py-2 text-xs font-900 text-text-muted uppercase tracking-wide'],
    [
      'dropdown-item-danger',
      'w-full flex items-center justify-start text-left gap-2 px-3 py-2 text-sm font-800 text-danger-600 hover:bg-danger-500/10 transition',
    ],

    ['dropdown-anim', 'origin-top-right transition duration-150 ease-out'],
    ['dropdown-enter', 'opacity-100 scale-100'],
    ['dropdown-leave', 'opacity-0 scale-95 pointer-events-none'],

    // user menu (github-like)
    [
      'avatar-btn',
      'h-10 w-10 rounded-xl border border-border bg-surface flex items-center justify-center overflow-hidden hover:bg-bg transition',
    ],
    ['avatar-img', 'h-full w-full object-cover'],
    ['avatar-fallback', 'text-sm font-900'],

    // skeleton
    ['skeleton', 'animate-pulse bg-border/70 rounded-xl'],

    // aside workspaces
    [
      'aside-workspaces',
      'fixed left-0 top-14 h-[calc(100vh-56px)] w-16 border-r border-border bg-bg/70 backdrop-blur z-40 hidden sm:flex flex-col items-center py-3',
    ],

    [
      'workspace-icon-btn',
      'h-11 w-11 rounded-xl bg-surface border border-border flex items-center justify-center hover:(bg-bg) transition',
    ],
    [
      'workspace-add-btn',
      'h-11 w-11 rounded-xl bg-brand-600 text-white flex items-center justify-center hover:bg-brand-700 transition',
    ],

    // divider
    ['divider', 'h-px w-full bg-border'],

    // inputs
    ['label', 'block mb-1 text-sm font-700 text-text'],
    [
      'input',
      'w-full h-11 px-3 rounded-lg bg-surface border border-border text-text placeholder:text-text-muted/70 outline-none transition focus:(border-brand-500 ring-4 ring-brand-500/15)',
    ],
    ['error', 'mt-1 text-xs text-danger-600'],

    // buttons
    ['shadow-soft', 'shadow-[0_10px_30px_rgba(15,23,42,0.10)]'],
    [
      'spinner',
      'inline-block h-4 w-4 rounded-full border-2 border-current border-r-transparent animate-spin',
    ],
    ['btn-label', 'leading-none'],

    ['btn-label', 'leading-none whitespace-nowrap'],
    [
      'btn-base',
      'inline-flex items-center justify-center gap-2 select-none whitespace-nowrap rounded-xl font-800 tracking-tight transition active:translate-y-[1px] disabled:(opacity-60 cursor-not-allowed) focus:outline-none focus:(ring-4 ring-brand-500/20)',
    ],

    // sizes
    ['btn-sm', 'h-9 px-3 text-sm'],
    ['btn-md', 'h-11 px-4 text-sm sm:text-base'],
    ['btn-lg', 'h-12 px-5 text-base'],

    // variants
    ['btn-primary', 'bg-brand-600 text-white hover:bg-brand-700'],
    ['btn-secondary', 'bg-brand-50 text-brand-700 border border-brand-100 hover:bg-brand-100'],
    ['btn-ghost', 'bg-transparent text-text border border-transparent hover:bg-black/5'],
    ['btn-danger', 'bg-danger-600 text-white hover:bg-danger-500'],

    // oauth neutral
    ['btn-oauth', 'bg-surface text-text border border-border hover:bg-bg'],
  ],
})
