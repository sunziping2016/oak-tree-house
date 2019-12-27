module.exports = {
  themeConfig: {
    sidebar: 'auto'
  },
  plugins: [
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
      ]
    }]
  ]
}
