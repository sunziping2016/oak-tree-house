module.exports = {
  title: '橡树屋',
  description: '欢迎来到孙子平的博客',
  head: [
    ['link', { rel: 'icon', sizes: '32x32',
      href: `/assets/icons/favicon-32x32.png` }],
    ['link', { rel: 'icon', sizes: '16x16',
      href: `/assets/icons/favicon-16x16.png` }]
  ],
  themeConfig: {
    nav: [
      { text: '主页', link: '/' },
      { text: '检索', items: [
        { text: '作者', link: '/author/' },
        { text: '标签', link: '/tag/' },
        { text: '分类', link: '/category/' },
        { text: '连载', link: '/series/' }
      ] },
      { text: '项目', items: [
        { text: '读我', link: '/readme/' },
        { text: '计划列表', link: '/todo/' },
        { text: '更新日志', link: '/changelog/' },
        { text: '授权', link: '/license/' },
        { text: 'Travis CI', link: 'https://travis-ci.com/sunziping2016/oak-tree-house' }
      ] },
      { text: '特殊页面', items: [
        { text: '我的项目', link: '/2018/12/04/projects/' },
        { text: '我的计划', link: '/plan.html' },
        { text: '关于', link: '/about.html' }
      ] }
    ],
    sidebar: 'auto',
    repo: 'sunziping2016/oak-tree-house',
    docsDir: 'site',
    editLinks: true,
    editLinkText: '在 GitHub 上编辑此页',
    lastUpdated: '上次更新',
    algolia: {
      apiKey: '5eac05703da4f5923e426c2e44baa411',
      indexName: 'szp'
    }
  },
  plugins: [
    ['@vuepress/last-updated', {
      transformer (timestamp, lang) {
        return new Date(timestamp).toLocaleString('zh-CN')
      }
    }],
    ['@vuepress/medium-zoom'],
    [require('./plugins/vuepress-plugin-rss.js'),
      {
        base_url: '/',
        site_url: 'https://szp.io',
        count: 20
      }
    ],
    [require('./plugins/additional-pages')],
    ['@vuepress/blog', {
      directories: [
        {
          id: 'post',
          dirname: '_posts',
          path: '/',
          itemPermalink: '/:year/:month/:day/:slug',
          pagination: {
            lengthPerPage: 10
          }
        }
      ],
      frontmatters: [
        {
          id: 'tag',
          keys: ['tags'],
          path: '/tag/',
          scopeLayout: 'TagFrontmatterPagination',
          frontmatter: {
            title: 'Tag',
            name: '标签'
          },
          pagination: {
            lengthPerPage: 10
          }
        },
        {
          id: 'category',
          keys: ['category'],
          path: '/category/',
          scopeLayout: 'CategoryFrontmatterPagination',
          frontmatter: {
            title: 'Category',
            name: '分类'
          },
          pagination: {
            lengthPerPage: 10
          }
        },
        {
          id: 'author',
          keys: ['author'],
          path: '/author/',
          scopeLayout: 'AuthorFrontmatterPagination',
          frontmatter: {
            title: 'Author',
            name: '作者'
          },
          pagination: {
            lengthPerPage: 10
          }
        },
        {
          id: 'series',
          keys: ['series'],
          path: '/series/',
          scopeLayout: 'SeriesFrontmatterPagination',
          frontmatter: {
            title: 'Series',
            name: '连载文章'
          },
          pagination: {
            lengthPerPage: 10
          }
        }
      ]
    }]
  ],
  markdown: {
    extractHeaders: ['h2', 'h3', 'h4'],
    extendMarkdown: md => {
      md.use(require('markdown-it-checkbox'))
      md.render = (src, env) => {
        const text = src
        const regex = /(\${1,2})((?:\\.|.)*)\1/g
        let output = ''
        let array
        let lastIndex = 0
        while ((array = regex.exec(text)) !== null) {
          output += text.slice(lastIndex, array.index)
          output += array[0]
            .replace(/\\/g, '\\\\')
            .replace(/_/g, '\\_')
          lastIndex = array.index + array[0].length
        }
        output += text.slice(lastIndex, -1)
        return md.renderer.render(md.parse(output, env), md.options, env)
      }
    }
  }
}
