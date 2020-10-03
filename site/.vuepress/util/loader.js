export function loadScript (src, id) {
  return new Promise((resolve, reject) => {
    const element = document.getElementById(id)
    if (element && element.dataset.loaded !== undefined) {
      resolve()
    } else if (element) {
      element.addEventListener('load', resolve)
    } else {
      const script = document.createElement('script')
      script.src = src
      script.id = id
      script.addEventListener('load', () => {
        script.dataset.loaded = ''
        resolve()
      })
      document.body.appendChild(script)
    }
  })
}

export function loadStyle (src, id) {
  return new Promise((resolve, reject) => {
    if (document.getElementById(id)) {
      resolve()
    } else {
      const style = document.createElement('link')
      style.rel = 'stylesheet'
      style.href = src
      style.id = id
      style.addEventListener('load', resolve)
      document.body.appendChild(style)
    }
  })
}
