import 'vuetify/dist/vuetify.min.css'
import './styles/index.scss'

import Vuetify from 'vuetify'
import goTo from 'vuetify/es5/services/goto'

export default ({ Vue, options, router, siteData }) => {
  Vue.use(Vuetify)
  options.vuetify = new Vuetify((siteData.themeConfig && siteData.themeConfig.vuetifyConfig) || {})
  router.options.scrollBehavior = (to, from, savedPosition) => {
    if (from.path === to.path && from.hash === to.hash) {
      return false
    }
    let scrollTo = 0
    if (to.hash) {
      if (Vue.$vuepress.$get('disableScrollBehavior')) {
        return false
      }
      scrollTo = to.hash
    } else if (savedPosition) {
      scrollTo = savedPosition.y
    }
    return goTo(scrollTo).then(y => {
      return { x: 0, y }
    })
  }
}
