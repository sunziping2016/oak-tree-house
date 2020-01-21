const path = require('path')

module.exports = (options) => ({
  name: 'my-mathjax',
  clientRootMixin: path.resolve(__dirname, 'mixin.js'),
  extendMarkdown: md => {
    md.render = (src, env) => {
      const text = src
      const regex = /(\${1,2})((?:\\.|.)*?)\1/g
      let output = ''
      let array
      let lastIndex = 0
      while ((array = regex.exec(text)) !== null) {
        output += text.slice(lastIndex, array.index)
        output += array[0]
          .replace(/\\/g, '\\\\')
          .replace(/_/g, '\\_')
          .replace(/\*/g, '\\*')
        lastIndex = array.index + array[0].length
      }
      output += text.slice(lastIndex, -1)
      return md.renderer.render(md.parse(output, env), md.options, env)
    }
  }
})
