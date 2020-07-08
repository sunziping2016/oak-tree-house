const path = require('path')
const execSync = require('child_process').execSync

function getVersion () {
  // Tag CommitId Time Host
  let tag
  try {
    tag = execSync('git describe --tags $(git rev-list --tags --max-count=1)', {
      encoding: 'utf-8'
    }).trim()
  } catch (e) {
    // do nothing
  }
  let commitId
  try {
    commitId = execSync('git log --format="%h" -n 1', {
      encoding: 'utf-8'
    }).trim()
  } catch (e) {
    // do nothing
  }
  if (tag && commitId) {
    return `${tag}#${commitId}`
  } else if (tag) {
    return `${tag}`
  } else if (commitId) {
    return `${commitId}`
  } else {
    return undefined
  }
}

module.exports = {
  // base: '/~sun/', // for test
  title: '橡树屋',
  description: '欢迎来到孙子平的博客',
  locales: {
    '/': {
      lang: 'zh-CN'
    }
  },
  head: [
    ['link', { rel: 'icon', sizes: '32x32', href: '/assets/icons/favicon-32x32.png' }],
    ['link', { rel: 'icon', sizes: '16x16', href: '/assets/icons/favicon-16x16.png' }],
    ['link', { rel: 'manifest', href: '/manifest.json' }],
    // ['meta', { name: 'theme-color', content: '#9A7ED8' }],
    ['meta', { name: 'apple-mobile-web-app-capable', content: 'yes' }],
    ['meta', { name: 'apple-mobile-web-app-status-bar-style', content: 'default' }],
    ['link', { rel: 'apple-touch-icon', href: '/assets/icons/icon152.png' }],
    ['link', { rel: 'mask-icon', href: '/assets/icons/icon-purple.svg', color: '#FFF' }],
    ['meta', { name: 'msapplication-TileImage', content: '/assets/icons/icon-purple144.png' }],
    ['meta', { name: 'msapplication-TileColor', content: '#FFF' }],
    ['link', { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css?family=Roboto:100,300,400,500,700,900' }],
    ['link', { rel: 'stylesheet', href: 'https://cdn.jsdelivr.net/npm/@mdi/font@4.x/css/materialdesignicons.min.css' }]
  ],
  themeConfig: {
    vuetifyConfig: {
      theme: {
        themes: {
          light: {
            primary: '#9c27b0'
          },
          dark: {
            primary: '#ce93d8'
          }
        }
      }
    },
    logo: {
      light: '/assets/icons/icon-purple.png',
      dark: '/assets/icons/icon-light.png'
    },
    nav: [
      { text: '索引', link: '/', icon: 'mdi-format-list-bulleted' },
      {
        type: 'menu', text: '归档', items: [
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
    sidebarHeader: {
      avatar: '/assets/site/avatar.png',
      background: '/assets/site/shanghai.png',
      bio: '正在尝试着热爱生活<br>从热爱自己开始'
    },
    sidebarFooter: {
      version: getVersion()
    },
    extractHeaders: ['h2', 'h3', 'h4'],
    tocLayouts: ['Layout', 'Post'],
    repo: 'sunziping2016/oak-tree-house',
    docsDir: 'site',
    editLinks: true,
    editLinkText: '在 GitHub 上编辑此页',
    lastUpdated: '上次更新',
    footer: `<i class="mdi mdi-copyright"></i>2016-2020 Ziping Sun<br>京ICP备 17062397号`,
    snackbarCloseText: '关闭',
    notFoundText: '回到主页',
    indexHeading: '`${date.getFullYear()}年${date.getMonth() + 1}月`',
    homepageText: '主页',
    pageNumberText: '`第${index + 1}页 (共${totalPage}页 ${totalPost}篇)`',
    viewSourceText: '查看源码',
    readMoreText: '阅读更多',
    frontmatterKeyHeading: '`目前共计 ${number} 个${name}`',
    wordCloudName: '标签云',
    wordCloudFrontmatter: 'tag',
    tagText: '标签',
    categoryText: '分类',
    authorText: '作者',
    seriesText: '连载文章',
    shareDialogHeading: '分享本页...',
    shareDialogLinkText: '链接',
    shareDialogQRCodeText: '二维码',
    shareDialogIncludeFullPathText: '包含完整路径',
    shareDialogCloseText: '关闭',
    shareDialogLinkCopiedText: '成功复制页面链接',
    infoDialogHeading: '页面信息',
    infoDialogCloseText: '关闭',
    infoDialogFrontmatterKeys: {
      'tags': { id: 'tag' },
      'category': { id: 'category' },
      'author': { id: 'author' },
      'series': { id: 'series' }
    },
    recentlyUpdatedName: '最近更新',
    recentlyUpdatedNumber: 5,
    recentlyUpdatedChip: "date.toISOString().replace(/\\..*/, '').replace('T', ' ')"
  },
  plugins: [
    ['@vuepress/pwa'],
    ['@vuepress/last-updated'],
    ['@vuepress/medium-zoom', {
      selector: '.content img'
    }],
    ['container', {
      type: 'tip',
      defaultTitle: {
        '/': '提示'

      }
    }],
    ['container', {
      type: 'warning',
      defaultTitle: {
        '/': '注意'
      }
    }],
    ['container', {
      type: 'danger',
      defaultTitle: {
        '/': '警告'
      }
    }],
    ['container', {
      type: 'details',
      before: info => `<details class="custom-block details">${info ? `<summary>${info}</summary>` : ''}\n`,
      after: () => '</details>\n'
    }],
    ['@oak-tree-house/code-copy'],
    ['@oak-tree-house/code-toggle'],
    ['@oak-tree-house/mathjax'],
    ['@oak-tree-house/diagrams'],
    ['@oak-tree-house/gitalk', {
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
    ['@oak-tree-house/encrypt', {
      contentTitle: '加密的内容',
      unencryptedText: '内容已显示在下方，发布时应当加密。',
      encryptedText: '这部分内容已被加密，你需要输入正确的密钥才能查看。',
      decryptedText: '内容被成功解密并显示在下方。',
      decryptButtonText: '解密',
      unencryptedIcon: 'mdi mdi-lock-alert',
      encryptedIcon: 'mdi mdi-lock',
      decryptedIcon: 'mdi mdi-lock-open'
    }],
    ['@oak-tree-house/marp'],
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
    }],
    [{
      name: 'additional-pages',
      additionalPages: [{
        path: '/readme/',
        filePath: path.resolve(__dirname, '../../README.md')
      }, {
        path: '/license/',
        filePath: path.resolve(__dirname, '../../LICENSE.md')
      }, {
        path: '/changelog/',
        filePath: path.resolve(__dirname, '../../CHANGELOG.md')
      }]
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
      md.use(require('markdown-it-footnote'))
      md.use(require('markdown-it-attrs'), {
        allowedAttributes: ['style', 'class']
      })
      md.use(require('markdown-it-multimd-table'), {
        multiline: true,
        rowspan: true,
        headerless: true
      })
    }
  },
  chainWebpack (config, isServer) {
    for (const lang of ['sass', 'scss']) {
      for (const name of ['modules', 'normal']) {
        const rule = config.module.rule(lang).oneOf(name)
        rule.uses.delete('sass-loader')
        rule
          .use('sass-loader')
          .loader('sass-loader')
          .options({
            implementation: require('sass'),
            sassOptions: {
              fiber: require('fibers'),
              indentedSyntax: lang === 'sass'
            }
          })
      }
    }
  },
  configureWebpack: (config, isServer) => {
    config.plugins = config.plugins || []
    config.plugins.push(
      new (require('vuetify-loader/lib/plugin'))()
    )
  }
}
