const path = require('path')
const extendMarkdown = require('./extendMarkdown')

module.exports = (options, context) => ({
  name: 'my-mathjax',
  alias: {
    '@mathjax-event': path.resolve(__dirname, 'event.js')
  },
  clientRootMixin: path.resolve(__dirname, 'clientRootMixin.js'),
  extendMarkdown: (md) => {
    extendMarkdown(md, options, context)
  }
})
