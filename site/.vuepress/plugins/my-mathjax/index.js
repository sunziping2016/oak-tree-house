const path = require('path')

module.exports = (options) => ({
  name: 'my-mathjax',
  clientRootMixin: path.resolve(__dirname, 'mixin.js'),
  extendMarkdown: require('./extendMarkdown')
})
