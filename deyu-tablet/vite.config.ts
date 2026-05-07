import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import UnoCSS from 'unocss/vite'
import { resolve } from 'path'

export default defineConfig({
  base: '/deyu/deyu-tablet/',
  plugins: [
    vue(),
    UnoCSS()
  ],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
      '@shared': resolve(__dirname, '../packages/shared')
    },
    dedupe: ['vue', 'socket.io-client']
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@use "@/assets/styles/variables" as *;`
      }
    }
  },
  server: {
    port: 3001,
    open: true
  }
})
