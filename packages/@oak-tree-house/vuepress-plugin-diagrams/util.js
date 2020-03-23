export function loadScript (src, id) {
  return new Promise((resolve, reject) => {
    if (document.getElementById(id)) {
      resolve()
    } else {
      const script = document.createElement('script')
      script.src = src
      script.id = id
      script.addEventListener('load', resolve)
      document.body.appendChild(script)
    }
  })
}

export function generateId () {
  return '_' + Math.random().toString(36).substr(2, 9)
}
