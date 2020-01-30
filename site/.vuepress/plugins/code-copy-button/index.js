const path = require('path')

module.exports = (options) => ({
  name: 'code-copy-button',
  define: {
    CCB_CODE_COPIED_TEXT: options.codeCopiedText || 'Code snippet copied'
  },
  clientRootMixin: path.resolve(__dirname, 'mixin.js')
})
