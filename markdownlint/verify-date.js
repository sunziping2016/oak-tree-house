const path = require('path')

const sitePath = 'site/'

module.exports = {
  names: ['verify-date'],
  description: 'Check whether dates in frontmatter and filename match and are in right style',
  tags: ['frontmatter'],
  'function': function (params, onError) {
    if (params.name.startsWith(sitePath)) {
      console.log(params.name)
    }
  }
}
