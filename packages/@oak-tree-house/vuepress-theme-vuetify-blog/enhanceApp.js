import './styles/index.scss'
import Vuetify, {
  VApp,
  VAppBar,
  VAppBarNavIcon,
  VImg,
  VSpacer,
  VResponsive,
  VTextField,
  VMenu,
  VBtn,
  VIcon,
  VContent,
  VList,
  VDivider,
  VSubheader,
  VListItem,
  VListItemIcon,
  VListItemContent,
  VListItemTitle,
  VNavigationDrawer,
  VListGroup,
  VTreeview,
  VContainer,
  VSnackbar,
  VCard,
  VCardTitle,
  VCardSubtitle,
  VCardText,
  VCardActions,
  VPagination,
  VFooter,
  VBreadcrumbs,
  VChip,
  VSpeedDial,
  VDialog,
  VProgressCircular,
  VSwitch,
  VTimeline,
  VTimelineItem,
  VHover
} from 'vuetify/lib'
import { Scroll } from 'vuetify/lib/directives'
import goTo from 'vuetify/es5/services/goto'

export default ({ Vue, options, router, siteData }) => {
  Vue.use(Vuetify, {
    components: {
      VApp,
      VAppBar,
      VAppBarNavIcon,
      VImg,
      VSpacer,
      VResponsive,
      VTextField,
      VMenu,
      VBtn,
      VIcon,
      VContent,
      VList,
      VDivider,
      VSubheader,
      VListItem,
      VListItemIcon,
      VListItemContent,
      VListItemTitle,
      VNavigationDrawer,
      VListGroup,
      VTreeview,
      VContainer,
      VSnackbar,
      VCard,
      VCardTitle,
      VCardSubtitle,
      VCardText,
      VCardActions,
      VPagination,
      VFooter,
      VBreadcrumbs,
      VChip,
      VSpeedDial,
      VDialog,
      VProgressCircular,
      VSwitch,
      VTimeline,
      VTimelineItem,
      VHover
    },
    directives: {
      Scroll
    }
  })
  options.vuetify = new Vuetify((siteData.themeConfig && siteData.themeConfig.vuetifyConfig) || {})
  router.options.scrollBehavior = (to, from, savedPosition) => {
    if (from.path === to.path && from.hash === to.hash) {
      return false
    }
    let scrollTo = 0
    if (savedPosition) {
      scrollTo = savedPosition.y
    } else if (to.hash) {
      if (Vue.$vuepress.$get('disableScrollBehavior')) {
        return false
      }
      scrollTo = to.hash
    }
    return goTo(scrollTo).then(y => {
      return { x: 0, y }
    })
  }
}
