const path = require('path')

module.exports = (options) => ({
  name: 'code-toggle-prompt-button',
  alias: {
    '@code-toggle-event': path.resolve(__dirname, 'event.js')
  },
  clientRootMixin: path.resolve(__dirname, 'clientRootMixin.js')
})
