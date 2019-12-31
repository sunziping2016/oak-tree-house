const path = require('path')

const sitePath = 'site/'
const postsPath = 'site/_posts'

module.exports = {
  names: ['check-date'],
  description: 'Check whether dates in frontmatter and filename match and are in right style',
  tags: ['frontmatter'],
  'function': function (params, onError) {
    if (params.name.startsWith(sitePath)) {
      // All Markdown in site should have date field.
      let originTimeStr
      for (const line of params.frontMatterLines) {
        const match = line.match(/^date:\s+(.*)$/)
        if (match) {
          originTimeStr = match[1]
        }
      }
      if (!originTimeStr) {
        onError({
          lineNumber: 1
        })
      }
      // All Markdown's date field should be in ISO format
      const time = new Date(originTimeStr)
      const isoTimeStr = time.toISOString().replace(/\.\d+/, '')
      if (isoTimeStr !== originTimeStr) {
        onError({
          lineNumber: 1
        })
      }
      // All posts' name should begin with date
      if (params.name.startsWith(postsPath)) {
        const filename = path.basename(params.name)
        let month = `${time.getMonth() + 1}`
        if (month.length < 2) {
          month = '0' + month
        }
        let day = `${time.getDate()}`
        if (day.length < 2) {
          day = '0' + day
        }
        const start = `${time.getFullYear()}-${month}-${day}-`
        if (!filename.startsWith(start)) {
          onError({
            lineNumber: 1
          })
        }
      }
    }
  }
}
