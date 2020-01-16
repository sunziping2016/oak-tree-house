module.exports = {
  title: '橡树屋',
  description: '欢迎来到孙子平的博客',
  head: [
    ['link', { rel: 'icon', sizes: '32x32',
      href: '/assets/icons/favicon-32x32.png' }],
    ['link', { rel: 'icon', sizes: '16x16',
      href: '/assets/icons/favicon-16x16.png' }],
    ['link', { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css?family=Roboto:100,300,400,500,700,900' }],
    ['link', { rel: 'stylesheet', href: 'https://cdn.jsdelivr.net/npm/@mdi/font@4.x/css/materialdesignicons.min.css' }]
  ],
  themeConfig: {
    logo: '/assets/icons/icon-light.png',
    nav: [
      { type: 'menu', text: '检索', items: [
        { text: '检索页面', subheader: true },
        { text: '作者', link: '/author/', icon: 'mdi-account' },
        { text: '标签', link: '/tag/', icon: 'mdi-tag' },
        { text: '分类', link: '/category/', icon: 'mdi-file-tree' },
        { text: '连载文章', link: '/series/', icon: 'mdi-bookshelf' }
      ], icon: 'mdi-bookshelf' },
      { type: 'menu', text: '项目', items: [
        { text: '相关文档', subheader: true },
        { text: '读我', link: '/readme/', icon: 'mdi-book' },
        { text: '计划列表', link: '/todo/', icon: 'mdi-format-list-checks' },
        { text: '更新日志', link: '/changelog/', icon: 'mdi-file-document-box' },
        { text: '授权', link: '/license/', icon: 'mdi-license' },
        { text: '项目链接', subheader: true },
        { text: 'GitHub', link: 'https://github.com/sunziping2016/oak-tree-house', icon: 'mdi-github-face' },
        { text: 'Travis CI', link: 'https://travis-ci.com/sunziping2016/oak-tree-house', icon: 'mdi-robot' }
      ], icon: 'mdi-bridge' },
      { type: 'menu', text: '特殊页面', items: [
        { text: '自我介绍', subheader: true },
        { text: '我的项目', link: '/2018/12/04/projects/', icon: 'mdi-flag-triangle' },
        { text: '我的计划', link: '/plan.html', icon: 'mdi-format-list-bulleted' },
        { text: '关于', link: '/about.html', icon: 'mdi-account-card-details' }
      ], icon: 'mdi-post' }
    ],
    algolia: {
      apiKey: '25626fae796133dc1e734c6bcaaeac3c',
      indexName: 'docsearch'
    },
    smoothScroll: true,
    sidebar: 'auto',
    repo: 'sunziping2016/oak-tree-house',
    docsDir: 'site',
    editLinks: true,
    editLinkText: '在 GitHub 上编辑此页',
    lastUpdated: '上次更新'
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
      md.use(require('markdown-it-task-checkbox'))
      md.render = (src, env) => {
        const text = src
        const regex = /(\${1,2})((?:\\.|.)*?)\1/g
        let output = ''
        let array
        let lastIndex = 0
        while ((array = regex.exec(text)) !== null) {
          output += text.slice(lastIndex, array.index)
          output += array[0]
            .replace(/\\/g, '\\\\')
            .replace(/_/g, '\\_')
            .replace(/\*/g, '\\*')
          lastIndex = array.index + array[0].length
        }
        output += text.slice(lastIndex, -1)
        return md.renderer.render(md.parse(output, env), md.options, env)
      }
    }
  },
  sass: {
    implementation: require('sass'),
    fiber: require('fibers'),
    data: "@import '@theme/styles/variables.scss'"
  },
  scss: {
    implementation: require('sass'),
    fiber: require('fibers'),
    data: "@import '@theme/styles/variables.scss';"
  },
  configureWebpack: (config, isServer) => {
    config.plugins = config.plugins || []
    config.plugins.push(
      new (require('vuetify-loader/lib/plugin'))()
    )
  }
}
