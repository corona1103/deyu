import { defineConfig, presetUno, presetAttributify, presetIcons } from 'unocss'

export default defineConfig({
  presets: [
    presetUno(),
    presetAttributify(),
    presetIcons({
      scale: 1.2,
      warn: true
    })
  ],
  theme: {
    colors: {
      primary: '#8B0000',
      'primary-light': '#A52A2A',
      secondary: '#4A90D9',
      'secondary-light': '#6BA3E0',
      success: '#4CAF50',
      warning: '#FF9800',
      danger: '#F44336',
      gray: {
        50: '#F8FAFC',
        100: '#F5F7FA',
        200: '#E0E0E0',
        300: '#BDBDBD',
        400: '#9E9E9E',
        500: '#757575',
        600: '#616161',
        700: '#424242',
        800: '#333333',
        900: '#212121'
      }
    },
    breakpoints: {
      sm: '375px',
      md: '768px',
      lg: '1024px',
      xl: '1280px'
    }
  },
  shortcuts: {
    'flex-center': 'flex items-center justify-center',
    'flex-between': 'flex items-center justify-between',
    'flex-col-center': 'flex flex-col items-center justify-center',
    'btn-base': 'rounded-full font-bold cursor-pointer transition-all duration-300 active:scale-98',
    'btn-primary': 'btn-base bg-gradient-to-br from-primary to-primary-light text-white',
    'btn-secondary': 'btn-base bg-gray-100 text-gray-700',
    'card-base': 'bg-white rounded-2xl shadow-sm',
    'safe-bottom': 'pb-[env(safe-area-inset-bottom)]',
    'touch-target': 'min-w-11 min-h-11'
  },
  safelist: [
    'grid-cols-2',
    'grid-cols-3',
    'grid-cols-4',
    'md:grid-cols-3',
    'lg:grid-cols-4'
  ]
})
