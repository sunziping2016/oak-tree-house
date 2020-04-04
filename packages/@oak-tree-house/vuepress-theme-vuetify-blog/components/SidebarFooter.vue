<template>
  <div class="px-4 py-3 d-flex align-center">
    <div
      v-if="version"
    >
      <v-icon>mdi-tag-outline</v-icon>
      {{ version }}
    </div>
    <v-spacer />
    <v-btn
      icon
      @click="$vuetify.theme.dark = !$vuetify.theme.dark"
    >
      <v-icon>mdi-brightness-{{ $vuetify.theme.dark ? '4' : '7' }}</v-icon>
    </v-btn>
    <div />
  </div>
</template>

<script>
export default {
  computed: {
    version () {
      return this.$site.themeConfig.sidebarFooter && this.$site.themeConfig.sidebarFooter.version
    }
  }
}
</script>
