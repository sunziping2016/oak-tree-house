const os = require('os')
const fs = require('fs')
const md5 = require('md5')
const rimraf = require('rimraf')
const ncp = require('ncp').ncp
const path = require('path')
const { promisify } = require('util')
const { execSync } = require('child_process')

const GENERAL_RE = /^\s*([\w-]+)(?:\s*\[(\s*(?:[\w-]+(?:=(?:[\w-]+|"(?:[^\\"]|\\.)*"))?)(?:\s+(?:[\w-]+(?:=(?:[\w-]+|"(?:[^\\"]|\\.)*"))?))*)?\s*])?\s*$/

module.exports = function (options, context) {
  const diagramPath = options.diagramPath || '/assets/diagrams'
  const tempDiagramPath = path.join(context.tempPath, 'diagrams')
  if (context.isProd) {
    rimraf.sync(tempDiagramPath)
  }
  fs.mkdirSync(tempDiagramPath, { recursive: true })
  function generateFromPng (png, options, env) {
    let src
    if (options.inline || env.forceInline) {
      src = `data:image/png;base64,${png.toString('base64')}`
    } else {
      const hash = md5(png)
      const filename = `${hash}.png`
      const wholeFilename = path.join(tempDiagramPath, filename)
      fs.writeFileSync(wholeFilename, png)
      src = `${diagramPath}/${filename}`
    }
    return `<p${
      options['p-style'] ? ` style="${options['p-style']}"` : ''
    }${
      options['p-class'] ? ` class="${options['p-class']}"` : ''
    }><img src="${src}" alt="graphviz image"${
      options['img-style'] ? ` style="${options['img-style']}"` : ''
    }${
      options['img-class'] ? ` class="${options['img-class']}"` : ''
    }></p>`
  }
  return {
    name: 'vuepress-plugin-diagrams',
    alias: {
      '@diagrams-event': path.resolve(__dirname, 'event.js')
    },
    extendMarkdown (md) {
      const defaultRenderers = {
        graphviz (options, content, env) {
          if (!options.render) {
            return
          }
          const cmd = options.engine && [
            'dot',
            'neato',
            'twopi',
            'circo',
            'fdp',
            'sfdp',
            'patchwork',
            'osage'
          ].includes(options.engine) ? options.engine : 'dot'
          const png = execSync(`${cmd} -Tpng`, { input: content })
          return generateFromPng(png, options, env)
        },
        ditaa (options, content, env) {
          if (!options.render) {
            return
          }
          let command = 'ditaa -o'
          if (options['no-separation']) {
            command += ' -E'
          }
          const id = md5(content)
          const textFilename = path.join(os.tmpdir(), `${id}.txt`)
          fs.writeFileSync(textFilename, content)
          execSync(command + ` "${textFilename}"`)
          const png = fs.readFileSync(path.join(os.tmpdir(), `${id}.png`))
          return generateFromPng(png, options, env)
        },
        sequence (options, content) {
          if (!options.render) {
            return
          }
          return `<SequenceDiagram${
            options['svg-class'] ? ` svg-class="${options['svg-class']}"` : ''
          }${
            options['p-style'] ? ` p-style="${options['p-style']}"` : ''
          }${
            options['p-class'] ? ` p-class="${options['p-class']}"` : ''
          }>${content}</SequenceDiagram>`
        },
        flowchart (options, content) {
          if (!options.render) {
            return
          }
          return `<FlowchartDiagram${
            options['p-style'] ? ` p-style="${options['p-style']}"` : ''
          }${
            options['p-class'] ? ` p-class="${options['p-class']}"` : ''
          }>${content}</FlowchartDiagram>`
        }
      }
      const fence = md.renderer.rules.fence
      md.renderer.rules.fence = (...args) => {
        try {
          // eslint-disable-next-line no-unused-vars
          const [tokens, idx, _, env] = args
          const token = tokens[idx]

          const rawInfo = token.info
          if (!rawInfo) {
            return fence(...args)
          }
          const match = rawInfo.match(GENERAL_RE)
          if (!match) {
            return fence(...args)
          }
          const renderer = defaultRenderers[match[1]]
          if (!renderer) {
            return fence(...args)
          }
          const attrs = {}
          if (match[2]) {
            const attrRe = /\s*([\w-]+)(?:=([\w-]+|"(?:[^\\"]|\\.)*"))?/g
            let attrMatch
            while ((attrMatch = attrRe.exec(match[2])) !== null) {
              if (attrMatch[2] === undefined) {
                attrs[attrMatch[1]] = true
              } else if (attrMatch[2].startsWith('"')) {
                attrs[attrMatch[1]] = JSON.parse(attrMatch[2])
              } else {
                attrs[attrMatch[1]] = attrMatch[2]
              }
            }
          }
          const result = renderer(attrs, token.content, env)
          if (typeof result === 'string') {
            return result
          }
          return fence(...args)
        } catch (e) {
          return `<p style="color: red">Failed to render: ${e.toString()}.</p>`
        }
      }
    },
    beforeDevServer (app, server) {
      app.get(`${diagramPath}/:id`, (req, res) => {
        const filePath = path.join(tempDiagramPath, req.params.id)
        if (fs.existsSync(filePath)) {
          res.sendFile(filePath)
        } else {
          res.status(404).send('Not found')
        }
      })
    },
    async generated () {
      await (promisify(ncp)(tempDiagramPath,
        context.outDir + diagramPath.replace(/\//g, path.sep)))
    },
    plugins: [
      ['@vuepress/register-components', {
        components: [
          {
            name: 'SequenceDiagram',
            path: path.resolve(__dirname, 'SequenceDiagram.vue')
          },
          {
            name: 'FlowchartDiagram',
            path: path.resolve(__dirname, 'FlowchartDiagram.vue')
          }
        ]
      }]
    ]
  }
}
