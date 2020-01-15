<template>
  <v-app>
    <v-app-bar
      app
      color="primary"
      dark
      hide-on-scroll
    >
      <!-- Logo -->
      <Logo />
      <v-spacer />
      <!-- Search -->
      <Search />
      <!-- Menu -->
      <NavLinks class="hidden-small" />
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
  components: { Logo, Search, NavLinks }
}
</script>

<style lang="stylus">
@media (max-width: 720px)
  .v-application .hidden-small
    display none !important
</style>
