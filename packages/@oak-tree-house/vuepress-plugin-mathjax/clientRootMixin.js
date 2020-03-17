import event from '@mathjax-event'

export default {
  data: () => ({
    scriptMathjax: null,
    scriptMathJaxLoaded: false
  }),
  mounted () {
    // const linkKatex = document.createElement('link')
    // linkKatex.href = 'https://cdn.jsdelivr.net/npm/katex@0.11.1/dist/katex.min.css'
    // linkKatex.rel = 'stylesheet'
    // document.body.append(linkKatex)
    window.MathJax = { tex: { inlineMath: [['$', '$']] }}
    this.scriptMathjax = document.createElement('script')
    this.scriptMathjax.id = 'MathJax-script'
    this.scriptMathjax.src = 'https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-mml-chtml.js'
    this.scriptMathjax.addEventListener('load', () => {
      this.scriptMathJaxLoaded = true
    })
    document.body.append(this.scriptMathjax)
    this.triggerMathjaxTypeset()
    this.$router.afterEach((to, from) => {
      if (from.path !== to.path) {
        this.$nextTick(() => {
          this.triggerMathjaxTypeset()
        })
      }
    })
    event.$on('contentReady', this.triggerMathjaxTypeset)
  },
  methods: {
    triggerMathjaxTypeset () {
      if (this.scriptMathJaxLoaded) {
        window.MathJax.typeset()
      } else {
        this.scriptMathjax.addEventListener('load', () => {
          this.triggerMathjaxTypeset()
        })
      }
    }
  }
}
