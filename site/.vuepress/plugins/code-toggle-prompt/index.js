const path = require('path')

module.exports = (options) => ({
  name: 'code-toggle-prompt-button',
  clientRootMixin: path.resolve(__dirname, 'mixin.js')
})
