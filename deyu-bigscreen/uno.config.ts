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
      danger: '#F44336'
    }
  },
  shortcuts: {
    'flex-center': 'flex items-center justify-center',
    'flex-between': 'flex items-center justify-between'
  }
})
