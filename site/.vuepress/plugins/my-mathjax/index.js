const path = require('path')

module.exports = (options) => ({
  name: 'my-mathjax',
  clientRootMixin: path.resolve(__dirname, 'clientRootMixin.js'),
  extendMarkdown: require('./extendMarkdown')
})
