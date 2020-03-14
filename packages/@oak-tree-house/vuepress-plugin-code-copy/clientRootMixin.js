import event from '@code-copy-event'
import './style.css'

/* global CC_COPY_ICON */

export default {
  mounted () {
    this.updateCopyButtons()
    this.$router.afterEach((to, from) => {
      if (from.path !== to.path) {
        this.$nextTick(() => {
          this.updateCopyButtons()
        })
      }
    })
    event.$on('contentReady', this.updateCopyButtons)
  },
  methods: {
    updateCopyButtons () {
      const codeblocks = [...document.querySelectorAll('div[class^="language-"]')]
      for (const block of codeblocks) {
        if (block.querySelector('.copy-button')) {
          continue
        }
        const copyButton = document.createElement('span')
        copyButton.classList.add('copy-button')
        copyButton.innerHTML = CC_COPY_ICON || '<i class="mdi mdi-content-copy"></i>'
        block.prepend(copyButton)
        copyButton.addEventListener('click', () => {
          const innerBlock = block.querySelector('code')
          const selection = window.getSelection()
          const range = document.createRange()
          range.selectNodeContents(innerBlock)
          selection.removeAllRanges()
          selection.addRange(range)
          document.execCommand('Copy')
          event.$emit('code-copied')
        })
      }
    }
  }
}
