const path = require('path')

module.exports = (options, ctx) => {
  return {
    plugins: [
      ['@vuepress/active-header-links']
    ],
    globalLayout: path.resolve(__dirname, 'layouts/GlobalLayout.vue')
  }
}
