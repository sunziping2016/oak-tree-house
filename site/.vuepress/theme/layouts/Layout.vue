<template>
  <v-app>
    <!-- Header -->
    <v-app-bar
      app
      color="primary"
      dark
      clipped-left
      hide-on-scroll
    >
      <v-app-bar-nav-icon
        v-if="enableDrawer"
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
      :width="300"
      app
      clipped
      :permanent="$vuetify.breakpoint.mdAndUp"
      :mobile-break-point="$vuetify.breakpoint.thresholds.md"
    >
      <SidebarLinks
        class="hidden-md-and-up"
      />
    </v-navigation-drawer>
    <v-content>
      <Content />
    </v-content>
  </v-app>
</template>

<script>
import Logo from '@theme/components/Logo.vue'
import Search from '@theme/components/Search.vue'
import NavLinks from '@theme/components/NavLinks.vue'
import SidebarLinks from '@theme/components/SidebarLinks.vue'

export default {
  components: { Logo, Search, NavLinks, SidebarLinks },
  props: {
    enableDrawer: {
      type: Boolean,
      default: true
    }
  },
  data: () => ({
    drawer: false
  })
}
</script>

