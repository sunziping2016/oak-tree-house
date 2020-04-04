const path = require('path')

module.exports = (options, ctx) => {
  return {
    alias: {
      '@theme-event': path.resolve(__dirname, 'event.js')
    },
    globalLayout: path.resolve(__dirname, 'components/GlobalLayout.vue')
  }
}
