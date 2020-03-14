const path = require('path')

module.exports = (options) => ({
  name: 'my-gitalk',
  alias: {
    '@gitalk-event': path.resolve(__dirname, 'event.js')
  },
  define: {
    MG_GITALK_CONFIG: options.config
  },
  clientRootMixin: path.resolve(__dirname, 'clientRootMixin.js')
})
