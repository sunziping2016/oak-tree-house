<template>
  <v-app>
    <!-- Header -->
    <v-app-bar
      app
      color="primary"
      dark
      hide-on-scroll
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
    <v-content>
      <Content />
    </v-content>
  </v-app>
</template>

<script>
import Logo from '@theme/components/Logo.vue'
import Search from '@theme/components/Search.vue'
import NavLinks from '@theme/components/NavLinks.vue'

export default {
  components: { Logo, Search, NavLinks },
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

