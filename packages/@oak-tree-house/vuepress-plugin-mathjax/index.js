const path = require('path')

module.exports = (options) => ({
  name: 'my-mathjax',
  alias: {
    '@mathjax-event': path.resolve(__dirname, 'event.js')
  },
  clientRootMixin: path.resolve(__dirname, 'clientRootMixin.js'),
  extendMarkdown: require('./extendMarkdown')
})
