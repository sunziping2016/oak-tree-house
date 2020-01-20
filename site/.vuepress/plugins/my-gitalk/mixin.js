/* global MG_GITALK_CONFIG */

export default {
  data: () => ({
    scriptGitalk: null,
    scriptGitalkLoaded: false
  }),
  mounted () {
    const linkGitalk = document.createElement('link')
    linkGitalk.href = 'https://cdn.jsdelivr.net/npm/gitalk@1/dist/gitalk.css'
    linkGitalk.rel = 'stylesheet'
    document.body.appendChild(linkGitalk)
    this.scriptGitalk = document.createElement('script')
    this.scriptGitalk.src = 'https://cdn.jsdelivr.net/npm/gitalk@1/dist/gitalk.min.js'
    this.scriptGitalk.addEventListener('load', () => {
      this.scriptGitalkLoaded = true
    })
    document.body.appendChild(this.scriptGitalk)
    this.triggerLoadGitalk()
    this.$router.afterEach((to, from) => {
      if (from.path !== to.path) {
        this.$nextTick(() => {
          this.triggerLoadGitalk()
        })
      }
    })
    this.$on('updated', this.triggerLoadGitalk)
  },
  methods: {
    triggerLoadGitalk () {
      if (this.ready && this.scriptGitalkLoaded) {
        const commentsContainer = document.getElementById('gitalk-container')
        if (commentsContainer) {
          if (commentsContainer.dataset.rendered === this.$route.path) {
            return
          }
          commentsContainer.dataset.rendered = this.$route.path
          while (commentsContainer.firstChild) {
            commentsContainer.removeChild(commentsContainer.firstChild)
          }
          const gitalk = new window.Gitalk(Object.assign({
            id: this.$route.path,
            body: `${location.protocol}//${location.host}${location.pathname}`
          }, MG_GITALK_CONFIG))
          gitalk.render('gitalk-container')
        }
      } else if (!this.ready) {
        this.$once('ready', this.triggerLoadGitalk)
      } else {
        this.scriptGitalk.addEventListener('load', () => {
          this.triggerLoadGitalk()
        })
      }
    }
  }
}
