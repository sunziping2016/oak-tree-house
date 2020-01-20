<template>
  <v-app>
    <!-- Header -->
    <ClientOnly>
      <v-app-bar
        app
        color="primary"
        dark
        clipped-left
      >
        <v-app-bar-nav-icon
          class="hidden-md-and-up"
          @click="drawer = !drawer"
        />
        <!-- Logo -->
        <Logo />
        <v-spacer />
        <!-- Search -->
        <Search />
        <!-- Menu -->
        <NavLinks class="hidden-sm-and-down" />
      </v-app-bar>
      <v-navigation-drawer
        v-model="drawer"
        :width="320"
        app
        clipped
        :permanent="$vuetify.breakpoint.mdAndUp"
        :mobile-break-point="$vuetify.breakpoint.thresholds.md"
      >
        <slot name="sidebar">
          <!-- menu -->
          <SidebarLinks
            class="hidden-md-and-up"
          />
          <v-divider v-if="$vuetify.breakpoint.smAndDown" />
          <!-- TOC -->
          <SidebarToc
            class="mt-4"
          />
        </slot>
      </v-navigation-drawer>
    </ClientOnly>
    <MainContent
      ref="abc"
      :content-width="contentWidth"
    >
      <slot>
        <Content class="content" />
        <ClientOnly>
          <MainEdit />
          <MainNav />
          <div id="gitalk-container" />
        </ClientOnly>
      </slot>
    </MainContent>
    <ClientOnly>
      <Snackbar ref="snackbar" />
      <Fab />
      <v-footer
        v-if="$site.themeConfig.footer"
        inset
        dark
        app
        color="indigo"
        style="position: absolute"
      >
        <div class="ma-auto">
          {{ $site.themeConfig.footer }}
        </div>
      </v-footer>
    </ClientOnly>
  </v-app>
</template>

<script>
import Logo from '@theme/components/Logo.vue'
import Search from '@theme/components/Search.vue'
import NavLinks from '@theme/components/NavLinks.vue'
import SidebarLinks from '@theme/components/SidebarLinks.vue'
import SidebarToc from '@theme/components/SidebarToc.vue'
import MainContent from '@theme/components/MainContent.vue'
import Fab from '@theme/components/Fab.vue'
import Snackbar from '@theme/components/Snackbar'
import MainEdit from '@theme/components/MainEdit'
import MainNav from '@theme/components/MainNav'

export default {
  components: {
    Logo,
    Search,
    NavLinks,
    SidebarLinks,
    SidebarToc,
    MainContent,
    Snackbar,
    Fab,
    MainEdit,
    MainNav
  },
  props: {
    contentWidth: {
      type: Number,
      default: 960
    }
  },
  data: () => ({
    drawer: false
  }),
  mounted () {
    this.$emit('ready')
  },
  updated () {
    this.$emit('updated')
  },
  methods: {
    openSnackbar (text) {
      this.$refs.snackbar.openSnackbar(text)
    }
  }
}
</script>

