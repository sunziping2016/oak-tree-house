import './theme/styles/index.scss'

const pythonPromptStartHtml = '<span class="token operator">&gt;&gt;</span>'
  + '<span class="token operator">&gt;</span> '

function integrate (router) {
  let scriptGitalkLoaded = false
  let scriptMathJaxLoaded = false
  const linkGitalk = document.createElement('link')
  linkGitalk.href = 'https://cdn.jsdelivr.net/npm/gitalk@1/dist/gitalk.css'
  linkGitalk.rel = 'stylesheet'
  document.body.appendChild(linkGitalk)
  const scriptGitalk = document.createElement('script')
  scriptGitalk.src = 'https://cdn.jsdelivr.net/npm/gitalk@1/dist/gitalk.min.js'
  scriptGitalk.addEventListener('load', () => {
    scriptGitalkLoaded = true
  })
  document.body.appendChild(scriptGitalk)
  const scriptMathjaxConfig = document.createElement('script')
  scriptMathjaxConfig.innerText = `MathJax = { tex: { inlineMath: [['$', '$']] } };`
  document.body.append(scriptMathjaxConfig)
  const scriptMathjax = document.createElement('script')
  scriptMathjax.id = 'MathJax-script'
  scriptMathjax.src = 'https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-mml-chtml.js'
  scriptMathjax.addEventListener('load', () => {
    scriptMathJaxLoaded = true
  })
  document.body.append(scriptMathjax)
  // const scriptFontawesome = document.createElement('script')
  // scriptFontawesome.src = 'https://kit.fontawesome.com/f413503533.js'
  // scriptFontawesome.crossOrigin = 'anonymous'
  // document.body.append(scriptFontawesome)

  let path
  router.afterEach((to) => {
    if (to.path === path) {
      return
    }
    path = to.path
    setTimeout(() => {
      // Detect all code blocks
      const codeblocks = [...document.querySelectorAll('div[class^="language-"]')]
      for (const block of codeblocks) {
        const copyButton = document.createElement('span')
        copyButton.classList.add('copy-button')
        copyButton.innerHTML = '<i class="far fa-clone"></i>'
        block.prepend(copyButton)
        copyButton.addEventListener('click', () => {
          const innerBlock = block.querySelector('code')
          const selection = window.getSelection()
          const range = document.createRange()
          range.selectNodeContents(innerBlock)
          selection.removeAllRanges()
          selection.addRange(range)
          document.execCommand('Copy')
          selection.removeAllRanges()
        })
      }
      // Detect Python interactive code blocks
      const candidateBlocks = [...document.querySelectorAll('div.language-python')]
      const blocks = candidateBlocks.filter(x => x.innerText.startsWith('>>> '))
      for (const block of blocks) {
        const interactiveButton = document.createElement('span')
        interactiveButton.classList.add('interactive-button')
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
          interactiveButton.classList.toggle('interactive-button-off', !promptOn)
        })
      }
      // Install Gitalk
      const commentsContainer = document.getElementById('gitalk-container')
      if (!commentsContainer) {
        return
      }
      while (commentsContainer.firstChild) {
        commentsContainer.removeChild(commentsContainer.firstChild)
      }
      if (scriptGitalkLoaded) {
        loadGitalk(to)
      } else {
        scriptGitalk.addEventListener('load', () => {
          loadGitalk(to)
        })
      }
      // Typeset MathJax
      if (scriptMathJaxLoaded) {
        window.MathJax.typeset()
      } else {
        scriptMathjax.addEventListener('load', () => {
          window.MathJax.typeset()
        })
      }
    })
  })

  function loadGitalk (to) {
    // eslint-disable-next-line no-undef
    if (typeof Gitalk !== 'undefined' && Gitalk instanceof Function) {
      renderGitalk(to.path)
    }
  }
  function renderGitalk (fullPath) {
    // eslint-disable-next-line no-undef
    const gitalk = new Gitalk({
      clientID: 'bb23e02c8bd429ed1021',
      clientSecret: 'bee29c595c6ce8ec5b5c85698872bda46c5da0d6', // come from github development
      repo: 'oak-tree-house',
      owner: 'sunziping2016',
      admin: ['sunziping2016'],
      id: fullPath,
      body: `${location.protocol}//${location.host}${location.pathname}`,
      distractionFreeMode: false,
      language: 'zh-CN',
      createIssueManually: true
    })
    gitalk.render('gitalk-container')
  }
}

import Vuetify, {
  VApp,
  VAppBar,
  VAppBarNavIcon,
  VImg,
  VSpacer,
  VResponsive,
  VTextField,
  VMenu,
  VBtn,
  VIcon,
  VContent,
  VList,
  VDivider,
  VSubheader,
  VListItem,
  VListItemIcon,
  VListItemContent,
  VListItemTitle,
  VNavigationDrawer,
  VListGroup,
  VTreeview
} from 'vuetify/lib'

export default ({ Vue, options, router, siteData }) => {
  Vue.use(Vuetify, {
    components: {
      VApp,
      VAppBar,
      VAppBarNavIcon,
      VImg,
      VSpacer,
      VResponsive,
      VTextField,
      VMenu,
      VBtn,
      VIcon,
      VContent,
      VList,
      VDivider,
      VSubheader,
      VListItem,
      VListItemIcon,
      VListItemContent,
      VListItemTitle,
      VNavigationDrawer,
      VListGroup,
      VTreeview
    }
  })
  options.vuetify = new Vuetify({
    breakpoint: {
      thresholds: {
        xs: 420,
        sm: 720,
        md: 960,
        lg: 1280
      }
    }
  })
  if (typeof document !== 'undefined') {
    integrate(router)
  }
}
