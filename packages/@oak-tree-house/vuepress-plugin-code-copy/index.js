const path = require('path')

module.exports = (options) => ({
  name: 'code-copy-button',
  alias: {
    '@code-copy-event': path.resolve(__dirname, 'event.js')
  },
  define: {
    'CC_COPY_ICON': options.copyIcon
  },
  clientRootMixin: path.resolve(__dirname, 'clientRootMixin.js')
})
