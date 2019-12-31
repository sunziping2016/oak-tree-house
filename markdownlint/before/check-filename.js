const path = require('path')

const lowercaseIgnore = [
  'CHANGELOG.md',
  'LICENSE.md',
  'README.md',
  'TODO.md'
]

const postsPath = 'site/_posts/'

module.exports = {
  names: ['check-filename'],
  description: 'Check whether filename is in kebab-case and contains correct date',
  tags: ['filename', 'frontmatter'],
  'function': function (params, onError) {
    const basename = path.basename(params.name)
    if (lowercaseIgnore.indexOf(params.name) === -1) {
      // All Markdown file should be in kebab-case
      if (!/^[a-z0-9]+(?:-[a-z0-9]+)*.md$/.test(basename)) {
        onError({
          lineNumber: 1
        })
      }
    }
    if (params.name.startsWith(postsPath)) {
      if (!/^[0-9]{4}-[0-9]{2}-[0-9]{2}-[a-z0-9]+(?:-[a-z0-9]+)*.md$/.test(basename)) {
        onError({
          lineNumber: 1
        })
      }
    }
    // console.log(params.name)
  }
}
