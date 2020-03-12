const path = require('path')
const { Marpit } = require('@marp-team/marpit')

function enableOrDisableMarp (md, enable, originCoreProcess, marpCoreProccess) {
  const enableText = enable ? 'enable' : 'disable'
  md.core.ruler[enableText]([
    'marpit_slide',
    'marpit_directives_front_matter',
    'marpit_directives_global_parse',
    'marpit_directives_parse',
    'marpit_directives_apply',
    'marpit_header_and_footer',
    'marpit_heading_divider',
    'marpit_slide_containers',
    'marpit_containers', // can omit
    'marpit_inline_svg',
    'marpit_apply_color',
    'marpit_apply_background_image',
    'marpit_sweep',
    'marpit_sweep_paragraph',
    'marpit_style_assign',
    'marpit_fragment',
    'marpit_apply_fragment',
    'marpit_collect'
  ])
  md.block.ruler[enableText]([
    'marpit_comment',
    'marpit_style_parse'
  ])
  md.inline.ruler[enableText]([
    'marpit_inline_comment'
  ])
  md.inline.ruler2[enableText]([
    'marpit_parse_image',
    'marpit_apply_image',
    'marpit_background_image'
  ])
  md.core.process = enable ? marpCoreProccess : originCoreProcess
}

module.exports = (options) => ({
  name: 'marp',
  clientRootMixin: path.resolve(__dirname, 'clientRootMixin.js'),
  extendMarkdown (md) {
    const originCoreProcess = md.core.process
    const marpit = new Marpit({
      markdown: md,
      inlineSVG: true
    })
    const marpCoreProccess = md.core.process
    const render = md.render
    md.render = (src, env) => {
      env = env || {}
      if (env.frontmatter.marp) {
        enableOrDisableMarp(md, true, originCoreProcess, marpCoreProccess)
        const { html, css } = marpit.render(src, env)
        md.$data.hoistedTags = md.$data.hoistedTags || []
        md.$data.hoistedTags.push(`<style>${css}</style>`)
        return html
      } else {
        enableOrDisableMarp(md, false, originCoreProcess, marpCoreProccess)
        return render.call(md, src, env)
      }
    }
  }
})
