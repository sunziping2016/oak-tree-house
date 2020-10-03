<template>
  <component :is="display ? 'div' : 'span'" />
</template>

<script>
import { loadScript } from '@util/loader'

export default {
  props: {
    formula: {
      type: String,
      required: true
    },
    display: {
      type: Boolean,
      default: false
    }
  },
  watch: {
    formula () {
      this.renderMathJax()
    }
  },
  mounted () {
    this.renderMathJax()
  },
  methods: {
    renderMathJax () {
      while (this.$el.lastElementChild) {
        this.$el.removeChild(this.$el.lastElementChild)
      }
      loadScript('https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-chtml.js', 'script-mathjax')
        .then(() => window.MathJax.tex2chtmlPromise(this.formula, window.MathJax.getMetricsFor(this.$el, this.display)))
        .then(html => {
          this.$el.appendChild(html)
          const sheet = document.querySelector('#MJX-CHTML-styles')
          if (sheet) sheet.parentNode.removeChild(sheet)
          document.head.appendChild(window.MathJax.chtmlStylesheet())
        })
    }
  }
}
</script>z
