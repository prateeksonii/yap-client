import antfu from '@antfu/eslint-config'
import pluginRouter from '@tanstack/eslint-plugin-router'

export default antfu({
  formatters: true,
  react: true,
  stylistic: true,
  ignores: ['**/routeTree.gen.ts', '**/components/ui/*.tsx', '**.md'],
}, {
  plugins: {
    '@tanstack/router': pluginRouter,
  },
  rules: {
    '@tanstack/router/create-route-property-order': 'error',
  },
})
