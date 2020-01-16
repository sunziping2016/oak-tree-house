module.exports = (options, ctx) => {
  const { themeConfig } = ctx
  const enableSmoothScroll = themeConfig.smoothScroll === true

  return {
    plugins: [
      ['@vuepress/active-header-links'],
      ['smooth-scroll', enableSmoothScroll]
    ]
  }
}
