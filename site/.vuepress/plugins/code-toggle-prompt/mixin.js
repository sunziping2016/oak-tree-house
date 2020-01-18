const pythonPromptStartHtml = '<span class="token operator">&gt;&gt;</span>'
  + '<span class="token operator">&gt;</span> '

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
        const interactiveButton = document.createElement('span')
        interactiveButton.classList.add('toggle-prompt-button')
        interactiveButton.innerText = '>>>'
        block.prepend(interactiveButton)
        const innerBlock = block.querySelector('code')
        const innerHtmlWithPrompt = innerBlock.innerHTML
        const innerHTMLWithoutPrompt = innerHtmlWithPrompt.split('\n')
          .map(x => x.startsWith(pythonPromptStartHtml) ? x.slice(pythonPromptStartHtml.length) : '')
          .filter(x => x)
          .join('\n')
        let promptOn = true
        interactiveButton.addEventListener('click', () => {
          promptOn = !promptOn
          innerBlock.innerHTML = promptOn ? innerHtmlWithPrompt : innerHTMLWithoutPrompt
          interactiveButton.classList.toggle('toggle-prompt-button-off', !promptOn)
        })
      }
    }
  }
}
