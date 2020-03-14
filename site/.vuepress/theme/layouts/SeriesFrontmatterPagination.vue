<template>
  <FrontmatterPagination
    :frontmatter-text="this.$site.themeConfig.seriesText || 'Series'"
    :frontmatter-path="'/series'"
    :frontmatter-key-text="this.$currentSeries.key"
  />
</template>

<script>
import FrontmatterPagination from '@theme/layouts/FrontmatterPagination.vue'

export default {
  components: { FrontmatterPagination }
}
</script>
