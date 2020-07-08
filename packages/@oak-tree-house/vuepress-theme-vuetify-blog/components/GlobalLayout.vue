<template>
  <v-app
    id="vuetify-app"
  >
    <ClientOnly>
      <!-- Header -->
      <v-app-bar
        app
        clipped-left
        clipped-right
      >
        <v-app-bar-nav-icon
          @click="drawer = !drawer"
        />
        <NavLogo />
        <v-spacer />
        <NavSearch />
        <NavLinks
          v-if="$vuetify.breakpoint.smAndUp"
          class="ml-4"
        />
      </v-app-bar>
      <!-- Drawer -->
      <VNavigationDrawer
        v-model="drawer"
        app
        clipped
        :mobile-break-point="$vuetify.breakpoint.thresholds.xs"
        :width="$vuetify.breakpoint.lgAndUp ? 320 : undefined"
      >
        <SidebarHeader />
        <v-divider />
        <SidebarLinks
          v-if="$vuetify.breakpoint.xsOnly"
        />
        <v-divider
          v-if="$vuetify.breakpoint.xsOnly"
        />
        <SidebarRecent />
        <v-divider />
        <SidebarWordCloud />
        <template v-slot:append>
          <v-divider />
          <SidebarFooter />
        </template>
      </VNavigationDrawer>
      <SidebarToc
        v-if="tocLayouts.indexOf(layoutName) !== -1"
        v-model="tocDrawer"
      />
    </ClientOnly>
    <component :is="layout" />
    <ClientOnly>
      <Fab />
      <Snackbar ref="snackbar" />
      <v-footer
        v-if="$site.themeConfig.footer"
        inset
        dark
        app
        color="indigo"
        style="position: absolute"
      >
        <!-- eslint-disable vue/no-v-html -->
        <div
          class="mx-auto text-center"
          v-html="$site.themeConfig.footer"
        />
      </v-footer>
    </ClientOnly>
  </v-app>
</template>

<script>
import Vue from 'vue'
import { setGlobalInfo } from '@app/util'
import NavLogo from '@theme/components/NavLogo.vue'
import NavSearch from '@theme/components/NavSearch.vue'
import NavLinks from '@theme/components/NavLinks.vue'
import SidebarHeader from '@theme/components/SidebarHeader.vue'
import SidebarLinks from '@theme/components/SidebarLinks.vue'
import SidebarWordCloud from '@theme/components/SidebarWordCloud.vue'
import SidebarRecent from '@theme/components/SidebarRecent.vue'
import SidebarFooter from '@theme/components/SidebarFooter.vue'
import SidebarToc from '@theme/components/SidebarToc.vue'
import Fab from '@theme/components/Fab.vue'
import Snackbar from '@theme/components/Snackbar.vue'
import event from '@theme-event'

function findPageForPath (pages, path) {
  for (let i = 0; i < pages.length; i++) {
    const page = pages[i]
    if (page.path.toLowerCase() === path.toLowerCase()) {
      return page
    }
  }
  return {
    path: '',
    frontmatter: {}
  }
}

export default {
  name: 'GlobalLayout',
  components: {
    SidebarRecent,
    NavLogo,
    NavSearch,
    NavLinks,
    SidebarHeader,
    SidebarLinks,
    SidebarWordCloud,
    SidebarFooter,
    SidebarToc,
    Fab,
    Snackbar
  },
  data: () => ({
    drawer: false,
    tocDrawer: false,
    loading: false,
    target: {
      path: '',
      frontmatter: {}
    }
  }),
  computed: {
    layout () {
      setGlobalInfo('layout', this.layoutName)
      return Vue.component(this.layoutName)
    },
    layoutName () {
      return this.getLayout()
    },
    tocLayouts () {
      return this.$site.themeConfig.tocLayouts || ['Layout']
    }
  },
  mounted () {
    this.drawer = this.$vuetify.breakpoint.smAndUp && this.$frontmatter.layout !== 'Post'
    this.$router.beforeEach((to, from, next) => {
      if (to.path !== from.path && !Vue.component(to.name)) {
        this.loading = true
        this.target = findPageForPath(
          this.$site.pages,
          to.path
        )
      }
      next()
    })
    this.$router.afterEach(() => {
      this.loading = false
      this.drawer = this.$vuetify.breakpoint.smAndUp && this.$frontmatter.layout !== 'Post'
    })
    event.$on('notify', this.openSnackbar)
  },
  beforeDestroy () {
    event.$off('notify', this.openSnackbar)
  },
  methods: {
    getLayout () {
      if (this.$page.path) {
        if (this.loading) {
          if (this.target) {
            const frontmatterSkeleton = this.target.frontmatter.skeleton || `${this.target.frontmatter.layout}Skeleton`
            if (this.$vuepress.getLayoutAsyncComponent(frontmatterSkeleton)
              || this.$vuepress.getVueComponent(frontmatterSkeleton)) {
              return frontmatterSkeleton
            }
          }
          return 'LayoutSkeleton'
        } else {
          const frontmatterLayout = this.$page.frontmatter.layout || 'Layout'
          if (this.$vuepress.getLayoutAsyncComponent(frontmatterLayout)
            || this.$vuepress.getVueComponent(frontmatterLayout)) {
            return frontmatterLayout
          }
          return 'Layout'
        }
      }
      return 'NotFound'
    },
    openSnackbar (text) {
      this.$refs.snackbar.openSnackbar(text)
    }
  }
}
</script>
