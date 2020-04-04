export const endingSlashRE = /\/$/
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

export function resolveHeaders (toc, pages, currentPath, extractHeaders) {
  extractHeaders = extractHeaders || ['h2', 'h3']
  function resolvePageHeaders (page, parent) {
    const stack = [
      {
        id: page.path,
        name: page.title,
        link: page.path,
        parent,
        children: [],
        page: page
      }
    ]
    let headers
    if (page.path === currentPath) {
      const headings = document.querySelectorAll(extractHeaders.map(x => `.content ${x}[id]`).join(','))
      headers = [].map.call(headings, x => ({
        level: parseInt(x.tagName.slice(1), 10),
        slug: x.getAttribute('id'),
        title: x.innerText.slice(1).trim()
      }))
    } else {
      headers = page.headers
    }
    if (headers) {
      for (const header of headers) {
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
          if (page.path === currentPath) {
            child.hash = `${header.slug}`
          }
          parent.children.push(child)
          stack[header.level - 1] = child
        }
      }
    }
    return stack[0]
  }
  function resolveArrayHeaders (items, parent = null) {
    if (!Array.isArray(items)) {
      return []
    }
    return items.map(item => {
      if (typeof item === 'object') {
        const name = Object.keys(item)
        if (name.length !== 1) {
          return null
        }
        const subToc = item[name[0]]
        const result = {
          id: name[0],
          name: name[0],
          parent
        }
        result.children = resolveArrayHeaders(subToc, result)
        return result
      } else if (typeof item === 'string') {
        const page = pages.find(page => page.regularPath === item)
        if (!page) {
          return null
        }
        return resolvePageHeaders(page, parent)
      } else {
        return null
      }
    }).filter(x => x)
  }
  const result = resolveArrayHeaders(toc)
  function addDepth (items, depth = 0) {
    items.forEach(item => {
      item.depth = depth
      addDepth(item.children, depth + 1)
    })
  }
  addDepth(result)
  return result
}

export function indexHeading (page, indexHeading) {
  return Function('date', `"use strict";return (${indexHeading});`)(
    new Date(page.frontmatter.date.trim())
  )
}

export function indexPageNumber (index, totalPage, totalPost, pageNumberText) {
  return Function('index', 'totalPage', 'totalPost',
    `"use strict";return (${pageNumberText});`)(
    index,
    totalPage,
    totalPost
  ) || `Page ${index + 1}`
}

export function frontmatterKeyHeading (name, number, frontmatterKeyHeading) {
  return Function('name', 'number', `"use strict";return (${frontmatterKeyHeading});`)(
    name,
    number
  )
}
