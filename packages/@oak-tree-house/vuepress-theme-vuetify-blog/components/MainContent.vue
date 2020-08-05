<template>
  <v-main>
    <v-responsive
      class="mx-auto overflow-auto"
      :max-width="contentWidth"
    >
      <slot />
    </v-responsive>
    <v-footer
      v-if="$site.themeConfig.footer"
      inset
      dark
      absolute
      color="indigo"
    >
      <!-- eslint-disable vue/no-v-html -->
      <div
        class="mx-auto text-center"
        v-html="$site.themeConfig.footer"
      />
    </v-footer>
  </v-main>
</template>

<script>
export default {
  props: {
    contentWidth: {
      type: Number,
      default: 960
    }
  }
}
</script>
