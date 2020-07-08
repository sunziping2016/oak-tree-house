import './styles/index.scss'

import Vuetify, {
  VApp,
  VAppBar,
  VAppBarNavIcon,
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
  VListItemSubtitle,
  VNavigationDrawer,
  VListGroup,
  VSkeletonLoader,
  VImg,
  VSwitch,
  VTextField,
  VResponsive,
  VSpacer,
  VAvatar,
  VContainer,
  VChip,
  VHover,
  VCard,
  VCardTitle,
  VCardSubtitle,
  VCardText,
  VCardActions,
  VTimeline,
  VTimelineItem,
  VBreadcrumbs,
  VPagination,
  VTreeview,
  VSpeedDial,
  VDialog,
  VSnackbar,
  VFooter,
  VExpansionPanels,
  VExpansionPanel,
  VExpansionPanelHeader,
  VExpansionPanelContent
} from 'vuetify/lib'
import { Scroll } from 'vuetify/lib/directives'
import goTo from 'vuetify/es5/services/goto'

export default ({ Vue, options, router, siteData }) => {
  Vue.use(Vuetify, {
    components: {
      VApp,
      VAppBar,
      VAppBarNavIcon,
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
      VListItemSubtitle,
      VNavigationDrawer,
      VListGroup,
      VSkeletonLoader,
      VImg,
      VSwitch,
      VTextField,
      VResponsive,
      VSpacer,
      VAvatar,
      VContainer,
      VChip,
      VHover,
      VCard,
      VCardTitle,
      VCardSubtitle,
      VCardText,
      VCardActions,
      VTimeline,
      VTimelineItem,
      VBreadcrumbs,
      VPagination,
      VTreeview,
      VSpeedDial,
      VDialog,
      VSnackbar,
      VFooter,
      VExpansionPanels,
      VExpansionPanel,
      VExpansionPanelHeader,
      VExpansionPanelContent
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
