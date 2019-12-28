import md5 from 'md5'

function integrateGitalk (router) {

  const linkGitalk = document.createElement('link')
  linkGitalk.href = 'https://cdn.jsdelivr.net/npm/gitalk@1/dist/gitalk.css'
  linkGitalk.rel = 'stylesheet'
  document.body.appendChild(linkGitalk)
  const scriptGitalk = document.createElement('script')
  scriptGitalk.src = 'https://cdn.jsdelivr.net/npm/gitalk@1/dist/gitalk.min.js'
  document.body.appendChild(scriptGitalk)

  router.afterEach((to) => {
    const commentsContainer = document.getElementById('gitalk-container')
    if (!commentsContainer) {
      return
    }
    while (commentsContainer.firstChild) {
      commentsContainer.removeChild(commentsContainer.firstChild)
    }
    if (scriptGitalk.onload) {
      loadGitalk(to)
    } else {
      scriptGitalk.onload = () => {
        loadGitalk(to)
      }
    }
  })

  function loadGitalk (to) {
    // eslint-disable-next-line no-undef
    if (typeof Gitalk !== 'undefined' && Gitalk instanceof Function) {
      renderGitalk(md5(to.path))
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
      language: 'zh-CN'
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
