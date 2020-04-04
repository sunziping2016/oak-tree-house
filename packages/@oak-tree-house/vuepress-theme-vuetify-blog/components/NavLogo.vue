<template>
  <router-link
    :to="$localePath"
    class="d-flex align-center app-logo"
  >
    <v-img
      v-if="logo"
      :alt="$siteTitle"
      class="shrink mr-2"
      contain
      :src="$withBase(logo)"
      transition="scale-transition"
      width="25"
    />
    <span
      v-if="$siteTitle"
      class="headline shrink"
    >{{ $siteTitle }}</span>
  </router-link>
</template>

<script>
export default {
  computed: {
    logo () {
      if (!this.$site.themeConfig.logo) {
        return null
      }
      if (typeof this.$site.themeConfig.logo === 'object') {
        return this.$vuetify.theme.dark
          ? this.$site.themeConfig.logo.dark
          : this.$site.themeConfig.logo.light
      }
      return this.$site.themeConfig.logo
    }
  }
}
</script>

<style lang="scss">
.app-logo {
  text-decoration: none;
}
</style>
