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
        <!-- menu -->
        <SidebarLinks
          class="hidden-md-and-up"
        />
        <v-divider v-if="$vuetify.breakpoint.smAndDown" />
        <!-- TOC -->
        <SidebarToc
          v-if="enableToc"
          class="mt-4"
        />
      </v-navigation-drawer>
    </ClientOnly>
    <MainContent>
      <slot />
    </MainContent>
  </v-app>
</template>

<script>
import Logo from '@theme/components/Logo.vue'
import Search from '@theme/components/Search.vue'
import NavLinks from '@theme/components/NavLinks.vue'
import SidebarLinks from '@theme/components/SidebarLinks.vue'
import SidebarToc from '@theme/components/SidebarToc.vue'
import MainContent from '@theme/components/MainContent.vue'

export default {
  components: {
    Logo,
    Search,
    NavLinks,
    SidebarLinks,
    SidebarToc,
    MainContent
  },
  props: {
    enableToc: {
      type: Boolean,
      default: true
    }
  },
  data: () => ({
    drawer: false
  })
}
</script>

