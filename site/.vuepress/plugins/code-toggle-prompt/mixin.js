const pythonPromptStartHtml = '<span class="token operator">&gt;&gt;</span>'
  + '<span class="token operator">&gt;</span> '
const pythonPromptStartHtml2 = '<span class="token punctuation">.</span><span class="token punctuation">.</span><span class="token punctuation">.</span> '

export default {
  mounted () {
    this.triggerUpdateTogglePromptButtons()
    this.$router.afterEach((to, from) => {
      if (from.path !== to.path) {
        this.$nextTick(() => {
          this.triggerUpdateTogglePromptButtons()
        })
      }
    })
    this.$on('updated', this.triggerUpdateTogglePromptButtons)
  },
  methods: {
    triggerUpdateTogglePromptButtons () {
      if (this.ready) {
        this.updateTogglePromptButtons()
      } else {
        this.$once('ready', this.updateTogglePromptButtons)
      }
    },
    updateTogglePromptButtons () {
      const candidateBlocks = [...document.querySelectorAll('div.language-python')]
      const blocks = candidateBlocks.filter(x => x.innerText.startsWith('>>> '))
      for (const block of blocks) {
        if (block.querySelector('.toggle-prompt-button')) {
          continue
        }
        const togglePromptButton = document.createElement('span')
        togglePromptButton.classList.add('toggle-prompt-button')
        togglePromptButton.innerText = '>>>'
        block.prepend(togglePromptButton)
        const innerBlock = block.querySelector('code')
        const innerHtmlWithPrompt = innerBlock.innerHTML
        const innerHTMLWithoutPrompt = innerHtmlWithPrompt.split('\n')
          .map(x => x.startsWith(pythonPromptStartHtml) ? x.slice(pythonPromptStartHtml.length)
            : x.startsWith(pythonPromptStartHtml2) ? x.slice(pythonPromptStartHtml2.length) : '')
          .filter(x => x)
          .join('\n')
        let promptOn = true
        togglePromptButton.addEventListener('click', () => {
          promptOn = !promptOn
          innerBlock.innerHTML = promptOn ? innerHtmlWithPrompt : innerHTMLWithoutPrompt
          togglePromptButton.classList.toggle('toggle-prompt-button-off', !promptOn)
        })
      }
    }
  }
}
