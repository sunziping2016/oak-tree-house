const fs = require('fs')
const path = require('path')
const katex = require('katex')
const mjAPI = require('mathjax-node')
const deasync = require('deasync')

module.exports = function extendMarkdown (md, options, context) {
  mjAPI.config({
    displayErrors: false
  })
  const outDir = path.join(context.outDir, options.formulaDir
    || 'assets' + path.sep + 'formulas')
  fs.mkdirSync(outDir, { recursive: true })
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
  function mathRender (content, inline) {
    // return katex.renderToString(content, {
    //   throwOnError: false
    // })
    let data
    let done = false
    mjAPI.typeset({
      ex: 8,
      cjkCharWidth: 16,
      math: content,
      format: inline ? 'inline-TeX' : 'TeX',
      svg: true,
      timeout: 30 * 1000
    }, (d) => {
      data = d
      done = true
    })
    deasync.loopWhile(() => !done)
    if (data.errors) {
      console.error(`Failed to render formula: ${content}`)
      data.errors.forEach(x => console.error(x))
      return `<span style="color:red">Failed to render formula: ${
        escapeHtml(content)
      }</span>`
    } else {
      return data.svg
    }
  }
  function inlineMathRender (tokens, idx) {
    return mathRender(tokens[idx].realContent, true)
    // return '$' + escapeHtml(tokens[idx].realContent) + '$'
  }
  function blockMathRender (tokens, idx) {
    return mathRender(tokens[idx].realContent, false)
    // return '$$' + escapeHtml(tokens[idx].realContent) + '$$'
  }
  md.inline.ruler.after('escape', 'inline_math', inlineMath)
  md.block.ruler.after('blockquote', 'block_math', blockMath, {
    alt: ['paragraph', 'reference', 'blockquote', 'list']
  })
  md.renderer.rules.inline_math = inlineMathRender
  md.renderer.rules.block_math = blockMathRender
}
