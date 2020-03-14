<template>
  <FrontmatterPagination
    :frontmatter-text="this.$site.themeConfig.categoryText || 'Categories'"
    :frontmatter-path="'/category'"
    :frontmatter-key-text="this.$currentCategory.key"
  />
</template>

<script>
import FrontmatterPagination from '@theme/layouts/FrontmatterPagination.vue'

export default {
  components: { FrontmatterPagination }
}
</script>
