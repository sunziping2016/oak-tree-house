function integrateGitalk (router) {
  let scriptLoaded = false
  const linkGitalk = document.createElement('link')
  linkGitalk.href = 'https://cdn.jsdelivr.net/npm/gitalk@1/dist/gitalk.css'
  linkGitalk.rel = 'stylesheet'
  document.body.appendChild(linkGitalk)
  const scriptGitalk = document.createElement('script')
  scriptGitalk.src = 'https://cdn.jsdelivr.net/npm/gitalk@1/dist/gitalk.min.js'
  scriptGitalk.addEventListener('load', () => {
    scriptLoaded = true
  })
  document.body.appendChild(scriptGitalk)
  const scriptMathjaxConfig = document.createElement('script')
  scriptMathjaxConfig.innerText = `MathJax = { tex: { inlineMath: [['$', '$']] } };`
  document.body.append(scriptMathjaxConfig)
  const scriptMathjax = document.createElement('script')
  scriptMathjax.id = 'MathJax-script'
  scriptMathjax.src = 'https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-mml-chtml.js'
  document.body.append(scriptMathjax)

  let path

  router.afterEach((to) => {
    if (to.path === path) {
      return
    }
    path = to.path
    setTimeout(() => {
      // eslint-disable-next-line no-undef
      window.hasOwnProperty('MathJax') && MathJax.typeset()
      const commentsContainer = document.getElementById('gitalk-container')
      if (!commentsContainer) {
        return
      }
      while (commentsContainer.firstChild) {
        commentsContainer.removeChild(commentsContainer.firstChild)
      }
      if (scriptLoaded) {
        loadGitalk(to)
      } else {
        scriptGitalk.addEventListener('load', () => {
          loadGitalk(to)
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

export default ({ Vue, options, router }) => {
  try {
    document && integrateGitalk(router)
  } catch (e) {
    // console.error(e.message)
  }
}
