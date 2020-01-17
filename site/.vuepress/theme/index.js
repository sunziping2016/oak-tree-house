module.exports = (options, ctx) => {
  const { themeConfig } = ctx
  const enableSmoothScroll = themeConfig.smoothScroll === true

  return {
    plugins: [
      ['@vuepress/active-header-links'],
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
      ['smooth-scroll', enableSmoothScroll]
    ]
  }
}
