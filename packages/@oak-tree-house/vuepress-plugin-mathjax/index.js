const fs = require('fs')
const path = require('path')
const extendMarkdown = require('./extendMarkdown')

module.exports = function (options, context) {
  options.formulaDir = options.formulaDir || 'assets/formulas'
  options.outDir = options.outDir || path.join(context.outDir, options.formulaDir)
  return {
    name: 'my-mathjax',
    alias: {
      '@mathjax-event': path.resolve(__dirname, 'event.js')
    },
    extendMarkdown (md) {
      extendMarkdown(md, options, context)
    },
    enhanceAppFiles: path.resolve(__dirname, 'enhanceApp.js'),
    beforeDevServer (app, server) {
      app.get(`/${options.formulaDir}/:id`, (req, res) => {
        const filePath = path.join(options.outDir, req.params.id)
        if (fs.existsSync(filePath)) {
          res.sendFile(filePath)
        } else {
          res.status(404).send('Not found')
        }
      })
    }
  }
}
