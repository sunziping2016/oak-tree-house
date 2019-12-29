const path = require('path')

module.exports = {
  additionalPages: [
    {
      path: '/readme/',
      filePath: path.resolve(__dirname, '../../../README.md')
    },
    {
      path: '/todo/',
      filePath: path.resolve(__dirname, '../../../TODO.md')
    },
    {
      path: '/license/',
      filePath: path.resolve(__dirname, '../../../LICENSE.md')
    },
    {
      path: '/changelog/',
      filePath: path.resolve(__dirname, '../../../CHANGELOG.md')
    }
  ]
}
