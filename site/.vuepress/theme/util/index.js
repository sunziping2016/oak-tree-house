export const outboundRE = /^[a-z]+:/i

export function isExternal (path) {
  return outboundRE.test(path)
}

export function isMailto (path) {
  return /^mailto:/.test(path)
}

export function isTel (path) {
  return /^tel:/.test(path)
}

export function resolveHeaders (pages, currentPath) {
  return pages.map(page => {
    const stack = [
      {
        id: page.path,
        name: page.title,
        link: page.path,
        top: true,
        children: []
      }
    ]
    if (page.headers) {
      for (const header of page.headers) {
        if (header.level > 1 && header.level <= stack.length + 1) {
          const parent = stack[header.level - 2]
          const child = {
            id: `${page.path}#${header.slug}`,
            name: header.title,
            link: page.path === currentPath ? `#${header.slug}`
              : `${page.path}#${header.slug}`,
            parent,
            children: []
          }
          parent.children.push(child)
          stack[header.level - 1] = child
        }
      }
    }
    return stack[0]
  })
}
