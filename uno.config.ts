import { defineConfig, presetWind3, presetIcons, presetWebFonts } from 'unocss'

export default defineConfig({
  presets: [
    presetWind3(),
    presetIcons(),
    presetWebFonts({
      fonts: {
        sans: 'Inter:400,500,600,700',
      },
    }),
  ],

  theme: {
    fontFamily: {
      sans: 'Inter, ui-sans-serif, system-ui',
    },
  },

  shortcuts: {
    'btn':
      'inline-flex items-center justify-center rounded-lg px-3 py-2 text-sm font-medium transition',
    'btn-primary': 'btn bg-black text-white hover:bg-zinc-800',
    'btn-ghost': 'btn hover:bg-zinc-100',
    'card': 'rounded-xl border border-zinc-200 bg-white shadow-sm',
  },

  safelist: [
    // utile pour Kanban / labels
    'bg-red-500',
    'bg-blue-500',
    'bg-green-500',
    'bg-yellow-500',
    'bg-purple-500',
  ],
})
