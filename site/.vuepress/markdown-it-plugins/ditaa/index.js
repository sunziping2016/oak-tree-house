const os = require('os')
const fs = require('fs')
const md5 = require('md5')
const path = require('path')
const { execSync } = require('child_process')
const DITAA_RE = /^\s*ditaa\s*\[\s*compile(\s+no-separation)?\s*]\s*$/

module.exports = md => {
  const fence = md.renderer.rules.fence
  md.renderer.rules.fence = (...args) => {
    try {
      const [tokens, idx] = args
      const token = tokens[idx]

      const rawInfo = token.info
      if (!rawInfo || token.compiled) {
        return fence(...args)
      }
      const match = rawInfo.match(DITAA_RE)
      if (!match) {
        return fence(...args)
      }
      let command = 'ditaa -o'
      if (match[1]) {
        command += ' -E'
      }
      const id = md5(token.content)
      const textFilename = path.join(os.tmpdir(), `${id}.txt`)
      fs.writeFileSync(textFilename, token.content)
      execSync(command + ` "${textFilename}"`)
      const png = fs.readFileSync(path.join(os.tmpdir(), `${id}.png`))
      return `<p><img src="data:image/png;base64,${png.toString('base64')}" alt="graphviz image"></p>`
    } catch (e) {
      return `<p style="color: red">Failed to render ditta: ${e.toString()}.</p>`
    }
  }
}
