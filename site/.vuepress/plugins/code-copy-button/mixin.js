/* global CCB_CODE_COPIED_TEXT */

export default {
  mounted () {
    this.triggerUpdateCopyButtons()
    this.$router.afterEach((to, from) => {
      if (from.path !== to.path) {
        this.$nextTick(() => {
          this.triggerUpdateCopyButtons()
        })
      }
    })
    this.$on('updated', this.triggerUpdateCopyButtons)
  },
  methods: {
    triggerUpdateCopyButtons () {
      if (this.ready) {
        this.updateCopyButtons()
      } else {
        this.$once('ready', this.updateCopyButtons)
      }
    },
    updateCopyButtons () {
      const codeblocks = [...document.querySelectorAll('div[class^="language-"]')]
      for (const block of codeblocks) {
        if (block.querySelector('.copy-button')) {
          continue
        }
        const copyButton = document.createElement('span')
        copyButton.classList.add('copy-button')
        copyButton.innerHTML = '<i class="mdi mdi-content-copy"></i>'
        block.prepend(copyButton)
        copyButton.addEventListener('click', () => {
          const innerBlock = block.querySelector('code')
          const selection = window.getSelection()
          const range = document.createRange()
          range.selectNodeContents(innerBlock)
          selection.removeAllRanges()
          selection.addRange(range)
          document.execCommand('Copy')
          if (this.$refs.child.openSnackbar) {
            this.$refs.child.openSnackbar(CCB_CODE_COPIED_TEXT)
          }
        })
      }
    }
  }
}
