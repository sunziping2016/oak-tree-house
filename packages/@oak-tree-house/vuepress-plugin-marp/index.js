const path = require('path')
const { Marp } = require('@marp-team/marp-core')

function enableOrDisableMarp (md, enable, original, modified) {
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
    'marpit_collect',
    'marp_emoji',
    // 'marp_math_initialize', conflict to my mathjax plugin
    'marp_fitting_header',
    'marp_size',
    'marp_size_apply',
    'marp_size_apply_advanced_background',
    'marp_core_script'
  ])
  md.block.ruler[enableText]([
    'marpit_comment',
    'marpit_style_parse'
    // 'marp_math_block', conflict to my mathjax plugin
  ])
  md.inline.ruler[enableText]([
    'marpit_inline_comment'
    // 'marp_math_inline', conflict to my mathjax plugin
  ])
  md.inline.ruler2[enableText]([
    'marpit_parse_image',
    'marpit_apply_image',
    'marpit_background_image'
  ])
  md.core.process = enable ? modified.core_process : original.core_process
  md.renderer.rules.html_inline = enable ? modified.renderer_rules_html_inline : original.renderer_rules_html_inline
  md.renderer.rules.html_block = enable ? modified.renderer_rules_html_block : original.renderer_rules_html_block
  md.renderer.rules.code_block = enable ? modified.renderer_rules_code_block : original.renderer_rules_code_block
  md.renderer.rules.fence = enable ? modified.renderer_rules_code_fence : original.renderer_rules_code_fence
}

module.exports = (options) => ({
  name: 'marp',
  clientRootMixin: path.resolve(__dirname, 'clientRootMixin.js'),
  alias: {
    '@marp-event': path.resolve(__dirname, 'event.js')
  },
  define: {
    MARP_FIRST_SLIDE_ICON: options.firstSlideIcon,
    MARP_PREVIOUS_SLIDE_ICON: options.prevSlideIcon,
    MARP_NEXT_SLIDE_ICON: options.nextSlideIcon,
    MARP_LAST_SLIDE_ICON: options.lastSlideIcon,
    MARP_ENTER_FULLSCREEN_ICON: options.enterFullscreenIcon,
    MARP_EXIT_FULLSCREEN_ICON: options.exitFullscreenIcon,
    MARP_ENTER_PLAY_ICON: options.enterPlayIcon,
    MARP_EXIT_PLAY_ICON: options.exitPlayIcon
  },
  extendMarkdown (md) {
    const original = {
      core_process: md.core.process,
      renderer_rules_html_inline: md.renderer.rules.html_inline,
      renderer_rules_html_block: md.renderer.rules.html_block,
      renderer_rules_code_block: md.renderer.rules.code_block,
      renderer_rules_code_fence: md.renderer.rules.fence
    }
    const marp = new Marp()
    marp.customDirectives.global = {}
    delete marp.customDirectives.global.size
    marp.applyMarkdownItPlugins(md) // call to protected member as a dirty hack
    const modified = {
      core_process: md.core.process,
      renderer_rules_html_inline: md.renderer.rules.html_inline, // for marp_html
      renderer_rules_html_block: md.renderer.rules.html_block, // for marp_html
      renderer_rules_code_block: md.renderer.rules.code_block,
      renderer_rules_code_fence: md.renderer.rules.fence
    }
    const render = md.render
    // conflict to my mathjax plugin
    md.core.ruler.disable('marp_math_initialize')
    md.block.ruler.disable('marp_math_block')
    md.inline.ruler.disable('marp_math_inline')
    md.render = (src, env) => {
      env = env || {}
      if (env.frontmatter.marp) {
        enableOrDisableMarp(md, true, original, modified)
        const { html, css } = marp.render(src, env)
        md.$data.hoistedTags = md.$data.hoistedTags || []
        md.$data.hoistedTags.push(`<style>${css}</style>`)
        return html
      } else {
        enableOrDisableMarp(md, false, original, modified)
        return render.call(md, src, env)
      }
    }
  }
})
