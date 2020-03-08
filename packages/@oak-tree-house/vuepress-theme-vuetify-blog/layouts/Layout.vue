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
        <NavLogo />
        <v-spacer />
        <!-- Search -->
        <NavSearch
          v-if="$site.themeConfig.algolia"
        />
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
    <NavDummy />
    <MainContent
      :content-width="contentWidth"
    >
      <slot>
        <v-container
          class="px-6 py-0 mb-10"
        >
          <h1
            style="display: none"
          >
            {{ $page.frontmatter.title }}
          </h1>
          <Content class="content" />
          <ClientOnly>
            <MainEdit />
            <MainNav />
            <div id="gitalk-container" />
          </ClientOnly>
        </v-container>
      </slot>
    </MainContent>
    <ClientOnly>
      <slot name="fab">
        <Fab />
      </slot>
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
import NavLogo from '@theme/components/NavLogo.vue'
import NavSearch from '@theme/components/NavSearch.vue'
import NavLinks from '@theme/components/NavLinks.vue'
import SidebarLinks from '@theme/components/SidebarLinks.vue'
import SidebarToc from '@theme/components/SidebarToc.vue'
import MainContent from '@theme/components/MainContent.vue'
import Fab from '@theme/components/Fab.vue'
import Snackbar from '@theme/components/Snackbar.vue'
import MainEdit from '@theme/components/MainEdit.vue'
import MainNav from '@theme/components/MainNav.vue'
import NavDummy from '@theme/components/NavDummy.vue'

export default {
  components: {
    NavLogo,
    NavSearch,
    NavLinks,
    SidebarLinks,
    SidebarToc,
    MainContent,
    Snackbar,
    Fab,
    MainEdit,
    MainNav,
    NavDummy
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

