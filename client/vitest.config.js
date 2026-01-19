import { defineConfig, mergeConfig } from 'vitest/config'
import viteConfig from './vite.config'

export default mergeConfig(
  viteConfig,
  defineConfig({
    test: {
      globals: true,
      environment: 'jsdom',
      setupFiles: ['./src/test/setup.js'],
      css: true,
      coverage: {
        provider: 'v8',
        reporter: ['text', 'json', 'html', 'lcov'],
        exclude: [
          'node_modules/',
          'src/test/',
          '**/*.test.{js,jsx}',
          '**/*.config.js',
          '**/index.js',
          'src/main.jsx',
          'src/assets/',
          'src/constants/'
        ],
        thresholds: {
          statements: 70,
          branches: 65,
          functions: 70,
          lines: 70
        }
      },
      include: ['**/*.test.{js,jsx}'],
      exclude: ['node_modules', 'dist', '.idea', '.git', '.cache']
    }
  })
)
