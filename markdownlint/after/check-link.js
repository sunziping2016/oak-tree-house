const path = require('path')
const fs = require('fs')

const distPath = 'site/.vuepress/dist'
const externalLinkList = 'external-link-list.txt'

function checkPath (externalLinks, src) {
  if (src.startsWith('http://') || src.startsWith('https://')) {
    externalLinks.add(src)
    return true
  }
  if (!src.startsWith('/')) {
    // Only absolute path is supported
    return false
  }
  const filePath = path.join(distPath, src.slice(1))
  try {
    const stat = fs.statSync(filePath)
    if (stat.isDirectory()) {
      fs.statSync(path.join(filePath, 'index.html'))
    }
  } catch (e) {
    return false
  }
  return true
}

module.exports = {
  names: ['check-link'],
  description: 'Check whether source of link exists',
  tags: ['link'],
  'function': function (params, onError) {
    const externalLinks = new Set()
    try {
      fs.readFileSync(externalLinkList, {encoding: 'utf8'})
        .split('\n').filter(x => x).forEach(x => externalLinks.add(x))
    } catch (e) {
      // do nothing
    }
    for (const token of params.tokens) {
      if (token.type === 'inline' && token.children) {
        for (const childToken of token.children) {
          let src
          if (childToken.type === 'link_open') {
            childToken.attrs.filter(x => x[0] === 'href').forEach(x => {
              src = x[1]
            })
          } else if (childToken.type === 'image') {
            childToken.attrs.filter(x => x[0] === 'src').forEach(x => {
              src = x[1]
            })
          } else if (childToken.type === 'html_inline') {
            const match = childToken.content.match(/\bsrc="((?:[^"\\]|\\.)*)"/)
            if (match) {
              src = match[1]
            }
          }
          // TODO: image and video
          if (src && !checkPath(externalLinks, src)) {
            onError({
              lineNumber: childToken.lineNumber
            })
          }
        }
      } else if (token.type === 'html_block') {
        const match = token.content.match(/\bsrc="((?:[^"\\]|\\.)*)"/)
        if (match) {
          const src = match[1]
          if (src && !checkPath(externalLinks, src)) {
            onError({
              lineNumber: token.lineNumber
            })
          }
        }
      }
    }
    fs.writeFileSync(externalLinkList,
      [...externalLinks].map(x => x + '\n').join('')
    )
  }
}
