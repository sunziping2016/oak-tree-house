const path = require('path')

module.exports = (options, ctx) => {
  return {
    plugins: [
      ['@vuepress/active-header-links']
    ],
    alias: {
      '@theme-event': path.resolve(__dirname, 'event.js')
    }
  }
}
