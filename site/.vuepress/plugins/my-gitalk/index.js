const path = require('path')

module.exports = (options) => ({
  name: 'my-gitalk',
  define: {
    MG_GITALK_CONFIG: options.config
  },
  clientRootMixin: path.resolve(__dirname, 'clientRootMixin.js')
})
