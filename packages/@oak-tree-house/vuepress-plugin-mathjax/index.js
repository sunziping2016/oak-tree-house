const fs = require('fs')
const path = require('path')
const { promisify } = require('util')
const { execSync } = require('child_process')
const md5 = require('md5')
const rimraf = require('rimraf')
const ncp = require('ncp').ncp
const mathjax = require('mathjax-full/js/mathjax.js').mathjax
const TeX = require('mathjax-full/js/input/tex.js').TeX
const SVG = require('mathjax-full/js/output/svg.js').SVG
const LiteAdaptor = require('mathjax-full/js/adaptors/liteAdaptor.js').LiteAdaptor
const RegisterHTMLHandler = require('mathjax-full/js/handlers/html.js').RegisterHTMLHandler
const AllPackages = require('mathjax-full/js/input/tex/AllPackages.js').AllPackages

class MyAdaptor extends LiteAdaptor {
  nodeSize (node, em = 1, local = null) {
    const cjk = this.options.cjkWidth
    const width = this.options.normalWidth
    const text = this.textContent(node)
    let w = 0
    for (const c of text.split('')) {
      w += (c.codePointAt(0) > 128 ? cjk : width)
    }
    return [w, 0]
  }
}

MyAdaptor.OPTIONS = {
  ...LiteAdaptor.OPTIONS,
  cjkWidth: 1,
  normalWidth: 0.6
}

const adaptor = new MyAdaptor({
  cjkWidth: 1,
  normalWidth: 0.6
})
RegisterHTMLHandler(adaptor)

const tex = new TeX({ packages: AllPackages })
const svg = new SVG({ fontCache: 'local' })
const html = mathjax.document('', { InputJax: tex, OutputJax: svg })

module.exports = function (options, context) {
  options.formulaPath = options.formulaPath || '/assets/formulas'
  const tempFormulaPath = path.join(context.tempPath, 'formulas')
  if (context.isProd) {
    rimraf.sync(tempFormulaPath)
  }
  fs.mkdirSync(tempFormulaPath, { recursive: true })
  return {
    name: 'my-mathjax',
    extendMarkdown (md) {
      function isValidDelim (state, pos) {
        const max = state.posMax
        const prevChar = pos > 0 ? state.src.charCodeAt(pos - 1) : -1
        const nextChar = pos + 1 <= max ? state.src.charCodeAt(pos + 1) : -1
        let canOpen = true
        let canClose = true

        if (prevChar === 0x20/* " " */ || prevChar === 0x09/* \t */
          || (nextChar >= 0x30/* "0" */ && nextChar <= 0x39/* "9" */)) {
          canClose = false
        }
        if (nextChar === 0x20/* " " */ || nextChar === 0x09/* \t */) {
          canOpen = false
        }

        return {
          can_open: canOpen,
          can_close: canClose
        }
      }

      function inlineMath (state, silent) {
        if (state.src[state.pos] !== '$') {
          return false
        }
        const res = isValidDelim(state, state.pos)
        if (!res.can_open) {
          if (!silent) {
            state.pending += '$'
          }
          state.pos += 1
          return true
        }
        const start = state.pos + 1
        let match = start
        while ((match = state.src.indexOf('$', match)) !== -1) {
          let pos = match - 1
          while (state.src[pos] === '\\') { pos -= 1 }
          // Even number of escapes, potential closing delimiter found
          if (((match - pos) % 2) === 1) {
            break
          }
          match += 1
        }
        if (match === -1) {
          if (!silent) {
            state.pending += '$'
            state.pos = start
            return true
          }
        }
        if (match - start === 0) {
          if (!silent) {
            state.pending += '$$'
          }
          state.pos = start + 1
          return true
        }
        const res2 = isValidDelim(state, match)
        if (!res2.can_close) {
          if (!silent) {
            state.pending += '$'
          }
          state.pos = start
          return true
        }
        if (!silent) {
          const token = state.push('inline_math', '', 0)
          token.markup = '$'
          token.realContent = state.src.slice(start, match)
        }
        state.pos = match + 1
        return true
      }
      function blockMath (state, start, end, silent) {
        let found = false
        let pos = state.bMarks[start] + state.tShift[start]
        let max = state.eMarks[start]
        if (pos + 2 > max) {
          return false
        }
        if (state.src.slice(pos, pos + 2) !== '$$') {
          return false
        }
        pos += 2
        let firstLine = state.src.slice(pos, max)
        if (silent) {
          return true
        }
        if (firstLine.trim().slice(-2) === '$$') {
          firstLine = firstLine.trim().slice(0, -2)
          found = true
        }
        let next = start
        let lastPos
        let lastLine
        while (!found) {
          next++
          if (next >= end) {
            break
          }
          pos = state.bMarks[next] + state.tShift[next]
          max = state.eMarks[next]
          if (pos < max && state.tShift[next] < state.blkIndent) {
            break
          }
          if (state.src.slice(pos, max).trim().slice(-2) === '$$') {
            lastPos = state.src.slice(0, max).lastIndexOf('$$')
            lastLine = state.src.slice(pos, lastPos)
            found = true
          }
        }
        state.line = next + 1
        const token = state.push('block_math', '', 0)
        token.block = true
        token.realContent = (firstLine && firstLine.trim() ? firstLine + '\n' : '')
          + state.getLines(start + 1, next, state.tShift[start], true)
          + (lastLine && lastLine.trim() ? lastLine : '')
        token.map = [start, state.line]
        token.markup = '$$'
        return true
      }
      function escapeHtml (unsafe) {
        return unsafe
          .replace(/&/g, '&amp;')
          .replace(/</g, '&lt;')
          .replace(/>/g, '&gt;')
          .replace(/"/g, '&quot;')
          .replace(/'/g, '&#039;')
      }
      const cache = {}
      function mathRender (content, inline) {
        try {
          if (cache[content]) {
            return cache[content]
          }
          const node = adaptor.firstChild(html.convert(content, {
            display: !inline,
            em: 16,
            ex: 8,
            containerWidth: 80 * 16
          }))
          const output = adaptor.outerHTML(node)
          const width = Math.round(parseFloat(adaptor.getAttribute(node, 'width').slice(0, -2)) * 8)
          const height = Math.round(parseFloat(adaptor.getAttribute(node, 'height').slice(0, -2)) * 8)
          const verticalAlign = parseFloat(adaptor.getStyle(node, 'vertical-align').slice(0, -2)) * 8
          const png = execSync(`rsvg-convert --width ${width} --height ${height} `, { input: output })
          const hash = md5(png)
          const filename = `${hash}.png`
          const wholeFilename = path.join(tempFormulaPath, filename)
          fs.writeFileSync(wholeFilename, png)
          const result = inline
            ? `<img class="mathjax-inline" style="vertical-align: ${verticalAlign}px" alt="formula" data-formula="${escapeHtml(content)}" src="${options.formulaPath}/${filename}">`
            : `<p class="mathjax-block"><img style="vertical-align: ${verticalAlign}px" alt="formula" data-formula="${escapeHtml(content)}" src="${options.formulaPath}/${filename}"></p>`
          cache[content] = result
          return result
        } catch (e) {
          console.error(`Failed to render formula: ${content}`)
          console.error(e)
          return ''
            + `<${inline ? 'span' : 'div'} style="color:red">`
            + `Failed to render formula: ${escapeHtml(content)}`
            + `</${inline ? 'span' : 'div'}>`
        }
      }
      function inlineMathRender (tokens, idx) {
        return mathRender(tokens[idx].realContent, true)
      }
      function blockMathRender (tokens, idx) {
        return mathRender(tokens[idx].realContent, false)
      }
      md.inline.ruler.after('escape', 'inline_math', inlineMath)
      md.block.ruler.after('blockquote', 'block_math', blockMath, {
        alt: ['paragraph', 'reference', 'blockquote', 'list']
      })
      md.renderer.rules.inline_math = inlineMathRender
      md.renderer.rules.block_math = blockMathRender
    },
    enhanceAppFiles: path.resolve(__dirname, 'enhanceApp.js'),
    beforeDevServer (app, server) {
      app.get(`${options.formulaPath}/:id`, (req, res) => {
        const filePath = path.join(tempFormulaPath, req.params.id)
        if (fs.existsSync(filePath)) {
          res.sendFile(filePath)
        } else {
          res.status(404).send('Not found')
        }
      })
    },
    async generated () {
      await (promisify(ncp)(tempFormulaPath,
        context.outDir + options.formulaPath.replace(/\//g, path.sep)))
    }
  }
}
