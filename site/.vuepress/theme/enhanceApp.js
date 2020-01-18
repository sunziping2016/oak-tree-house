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
  VFabTransition
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
      VFabTransition
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
}
