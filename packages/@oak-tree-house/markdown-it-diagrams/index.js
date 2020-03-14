const os = require('os')
const fs = require('fs')
const md5 = require('md5')
const path = require('path')
const { execSync } = require('child_process')

const defaultRenderers = {
  graphviz (options, content) {
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
    return `<p><img src="data:image/png;base64,${png.toString('base64')}" alt="graphviz image"></p>`
  },
  ditaa (options, content) {
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
    return `<p><img src="data:image/png;base64,${png.toString('base64')}" alt="ditta image"></p>`
  }
}

const GENERAL_RE = /^\s*([\w-]+)(?:\s*\[(\s*(?:[\w-]+(?:=(?:[\w-]+|"(?:[^\\"]|\\.)*"))?)(?:\s+(?:[\w-]+(?:=(?:[\w-]+|"(?:[^\\"]|\\.)*"))?))*)?\s*])?\s*$/

module.exports = (md, options = {}) => {
  const renderers = Array.isArray(options.renderers)
    ? options.renderers.filter(x => defaultRenderers[x])
      .map(x => ({ [x]: defaultRenderers[x] }))
      .reduce((acc, x) => Object.assign(acc, x), {})
    : options.renderers || defaultRenderers
  const fence = md.renderer.rules.fence
  md.renderer.rules.fence = (...args) => {
    try {
      const [tokens, idx] = args
      const token = tokens[idx]

      const rawInfo = token.info
      if (!rawInfo) {
        return fence(...args)
      }
      const match = rawInfo.match(GENERAL_RE)
      if (!match) {
        return fence(...args)
      }
      const renderer = renderers[match[1]]
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
      const result = renderer(attrs, token.content)
      if (typeof result === 'string') {
        return result
      }
      return fence(...args)
    } catch (e) {
      return `<p style="color: red">Failed to render: ${e.toString()}.</p>`
    }
  }
}
