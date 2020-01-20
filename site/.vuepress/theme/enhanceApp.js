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
  VFabTransition,
  VCard,
  VCardTitle,
  VCardSubtitle,
  VCardText,
  VCardActions,
  VPagination,
  VFooter,
  VBreadcrumbs
} from 'vuetify/lib'
import { Scroll } from 'vuetify/lib/directives'
import goTo from 'vuetify/es5/services/goto'

export default ({ Vue, options, router }) => {
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
      VFabTransition,
      VCard,
      VCardTitle,
      VCardSubtitle,
      VCardText,
      VCardActions,
      VPagination,
      VFooter,
      VBreadcrumbs
    },
    directives: {
      Scroll
    }
  })
  options.vuetify = new Vuetify({
    theme: {
      themes: {
        light: {
          primary: '#6699FF',
          accent: '#FF6699'
        }
      }
    },
    breakpoint: {
      thresholds: {
        xs: 420,
        sm: 720,
        md: 960,
        lg: 1280
      }
    }
  })
  router.options.scrollBehavior = (to, from, savedPosition) => {
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
