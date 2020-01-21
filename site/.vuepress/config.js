module.exports = {
  title: '橡树屋',
  description: '欢迎来到孙子平的博客',
  locales: {
    '/': {
      lang: 'zh-CN'
    }
  },
  head: [
    ['link', { rel: 'icon', sizes: '32x32',
      href: '/assets/icons/favicon-32x32.png' }],
    ['link', { rel: 'icon', sizes: '16x16',
      href: '/assets/icons/favicon-16x16.png' }],
    ['link', { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css?family=Roboto:100,300,400,500,700,900' }],
    ['link', { rel: 'stylesheet', href: 'https://cdn.jsdelivr.net/npm/@mdi/font@4.x/css/materialdesignicons.min.css' }],
    ['meta', { name: 'theme-color', content: '#6699FF' }]
  ],
  themeConfig: {
    logo: '/assets/icons/icon-light.png',
    nav: [
      {
        type: 'menu', text: '检索', items: [
          { text: '检索页面', subheader: true },
          { text: '作者', link: '/author/', icon: 'mdi-account' },
          { text: '标签', link: '/tag/', icon: 'mdi-tag' },
          { text: '分类', link: '/category/', icon: 'mdi-file-tree' },
          { text: '连载文章', link: '/series/', icon: 'mdi-bookshelf' }
        ], icon: 'mdi-bookshelf'
      },
      {
        type: 'menu', text: '此网站', items: [
          { text: '相关文档', subheader: true },
          { text: 'README', link: '/readme/', icon: 'mdi-book' },
          { text: '计划列表', link: '/todo/', icon: 'mdi-format-list-checks' },
          { text: '更新日志', link: '/changelog/', icon: 'mdi-file-document-box' },
          { text: '授权', link: '/license/', icon: 'mdi-license' },
          { text: '项目链接', subheader: true },
          {
            text: 'GitHub',
            link: 'https://github.com/sunziping2016/oak-tree-house',
            icon: 'mdi-github-face'
          },
          {
            text: 'Travis CI',
            link: 'https://travis-ci.com/sunziping2016/oak-tree-house',
            icon: 'mdi-robot'
          }
        ], icon: 'mdi-bridge'
      },
      {
        type: 'menu', text: '特殊页面', items: [
          { text: '自我介绍', subheader: true },
          {
            text: '我的项目',
            link: '/2018/12/04/projects/',
            icon: 'mdi-flag-triangle'
          },
          { text: '友情链接', link: '/links.html', icon: 'mdi-link' },
          { text: '关于', link: '/about.html', icon: 'mdi-account-card-details' }
        ], icon: 'mdi-post'
      }
    ],
    algolia: {
      apiKey: '5eac05703da4f5923e426c2e44baa411',
      indexName: 'szp'
    },
    // smoothScroll: true,
    snackbarCloseText: '关闭',
    repo: 'sunziping2016/oak-tree-house',
    docsDir: 'site',
    editLinks: true,
    editLinkText: '在 GitHub 上编辑此页',
    lastUpdated: '上次更新',
    indexHeading: '`${date.getFullYear()}年${date.getMonth() + 1}月`',
    footer: ['© 2016-2020 Ziping Sun', '京ICP备 17062397号'],
    homepageText: '主页',
    pageNumberText: '`第${index + 1}页 (共${totalPage}页 ${totalPost}篇)`',
    viewSourceText: '查看源码',
    readMoreText: '阅读更多',
    wordCloudName: '标签云',
    wordCloudFrontmatter: 'tag',
    frontmatterKeyHeading: '`目前共计 ${number} 个${name}`',
    tagText: '标签',
    categoryText: '分类',
    authorText: '作者',
    seriesText: '连载文章',
    notFoundText: '回到主页'
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
        site_url: 'https://szp15.com',
        count: 20
      }
    ],
    [require('./plugins/additional-pages')],
    [require('./plugins/code-copy-button'), {
      codeCopiedText: '成功复制代码片段'
    }],
    [require('./plugins/code-toggle-prompt')],
    [require('./plugins/my-mathjax')],
    [require('./plugins/my-gitalk'), {
      config: {
        clientID: 'bb23e02c8bd429ed1021',
        clientSecret: 'bee29c595c6ce8ec5b5c85698872bda46c5da0d6',
        repo: 'oak-tree-house',
        owner: 'sunziping2016',
        admin: ['sunziping2016'],
        distractionFreeMode: false,
        language: 'zh-CN',
        createIssueManually: true
      }
    }],
    ['@vuepress/blog', {
      directories: [
        {
          id: 'post',
          dirname: '_posts',
          path: '/',
          itemPermalink: '/:year/:month/:day/:slug',
          title: '文章',
          pagination: {
            lengthPerPage: 10,
            getPaginationPageTitle (pageNumber) {
              return `第${pageNumber}页 | 文章`
            }
          }
        }
      ],
      frontmatters: [
        {
          id: 'tag',
          keys: ['tags'],
          path: '/tag/',
          title: '标签',
          scopeLayout: 'TagFrontmatterPagination',
          frontmatter: {
            name: '标签'
          },
          pagination: {
            lengthPerPage: 10,
            layout: 'TagFrontmatterPagination',
            getPaginationPageTitle (pageNumber, key) {
              return `第${pageNumber}页 - ${key} | 标签`
            }
          }
        },
        {
          id: 'category',
          keys: ['category'],
          path: '/category/',
          title: '分类',
          scopeLayout: 'CategoryFrontmatterPagination',
          frontmatter: {
            name: '分类'
          },
          pagination: {
            lengthPerPage: 10,
            layout: 'CategoryFrontmatterPagination',
            getPaginationPageTitle (pageNumber, key) {
              return `第${pageNumber}页 - ${key} | 分类`
            }
          }
        },
        {
          id: 'author',
          keys: ['author'],
          path: '/author/',
          title: '作者',
          scopeLayout: 'AuthorFrontmatterPagination',
          frontmatter: {
            name: '作者'
          },
          pagination: {
            lengthPerPage: 10,
            layout: 'AuthorFrontmatterPagination',
            getPaginationPageTitle (pageNumber, key) {
              return `第${pageNumber}页 - ${key} | 作者`
            }
          }
        },
        {
          id: 'series',
          keys: ['series'],
          path: '/series/',
          title: '连载文章',
          scopeLayout: 'SeriesFrontmatterPagination',
          frontmatter: {
            name: '连载文章'
          },
          pagination: {
            lengthPerPage: 10,
            layout: 'SeriesFrontmatterPagination',
            getPaginationPageTitle (pageNumber, key) {
              return `第${pageNumber}页 - ${key} | 连载文章`
            }
          }
        }
      ]
    }]
  ],
  markdown: {
    extractHeaders: ['h2', 'h3', 'h4'],
    extendMarkdown: md => {
      const originHighlight = md.options.highlight
      md.options.highlight = (str, lang) => {
        if (lang === 'text') {
          return originHighlight(str)
        }
        return originHighlight(str, lang)
      }
      md.use(require('markdown-it-task-checkbox'))
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
