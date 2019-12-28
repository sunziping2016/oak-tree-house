const postsPath = 'site/_posts/'

module.exports = {
  names: ['check-headings'],
  description: 'Check whether heading numbering is correct',
  tags: ['headings', 'headers'],
  'function': function (params, onError) {
    if (!params.name.startsWith(postsPath)) {
      return
    }
    let hasH1 = false
    let stack = []
    for (let i = 0; i < params.tokens.length; ++i) {
      const token = params.tokens[i]
      if (token.type === 'heading_open') {
        ++i
        if (i >= params.tokens.length) {
          onError({
            lineNumber: token.lineNumber
          })
          continue
        }
        const inlineToken = params.tokens[i]
        if (!inlineToken.children || !inlineToken.children.length
            || inlineToken.children[0].type !== 'text') {
          onError({
            lineNumber: inlineToken.lineNumber
          })
        }
        const level = parseInt(token.tag.slice(1), 10) - 1
        const text = inlineToken.children[0].content
        if (level === 0) {
          // One markdown can only has one h1
          if (hasH1) {
            onError({
              lineNumber: token.lineNumber
            })
          } else {
            hasH1 = true
            // h1 should not contain number
            if (/^\d+(?:\.\d+)*\.?\s+.*$/.test(text)) {
              onError({
                lineNumber: inlineToken.lineNumber
              })
            }
          }
        } else {
          const match = text.match(/^(\d+(?:\.\d+)*)\s+.*$/)
          // h4 can omit number
          if (!match) {
            if (level < 3) {
              onError({
                lineNumber: inlineToken.lineNumber
              })
            }
          } else {
            const ord = match[1].split('.').map(x => parseInt(x, 10))
            if (ord.length !== level) {
              onError({
                lineNumber: inlineToken.lineNumber
              })
            }
            if (level > stack.length + 1) {
              // Heading should increment by 1
              onError({
                lineNumber: token.lineNumber
              })
            } else {
              for (let i = 0; i < level - 1; ++i) {
                if (stack[i] !== ord[i]) {
                  onError({
                    lineNumber: inlineToken.lineNumber
                  })
                  console.log('123')
                }
              }
              if (level > stack.length) {
                if (ord[ord.length - 1] !== 1) {
                  onError({
                    lineNumber: inlineToken.lineNumber
                  })
                }
              } else {
                if (ord[ord.length - 1] !== stack[ord.length - 1] + 1) {
                  onError({
                    lineNumber: inlineToken.lineNumber
                  })
                }
              }
            }
            stack = ord
          }
        }
      }
    }
  }
}
