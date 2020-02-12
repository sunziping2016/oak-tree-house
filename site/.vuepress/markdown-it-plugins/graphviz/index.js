const { execSync } = require('child_process')
const GRAPHVIZ_RE = /^\s*graphviz\s*\[\s*compile(?:\s+engine=(\w+))?\s*]\s*$/

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
      const match = rawInfo.match(GRAPHVIZ_RE)
      if (!match) {
        return fence(...args)
      }
      const cmd = match[1] && [
        'dot',
        'neato',
        'twopi',
        'circo',
        'fdp',
        'sfdp',
        'patchwork',
        'osage'
      ].includes(match[1]) ? match[1] : 'dot'
      const png = execSync(`${cmd} -Tpng`, { input: token.content })
      return `<p><img src="data:image/png;base64,${png.toString('base64')}" alt="graphviz image"></p>`
    } catch (e) {
      return `<p style="color: red">Failed to render graphviz: ${e.toString()}.</p>`
    }
  }
}
