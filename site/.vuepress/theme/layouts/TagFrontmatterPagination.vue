<template>
  <FrontmatterPagination
    :frontmatter-text="this.$site.themeConfig.tagText || 'Tags'"
    :frontmatter-path="'/tag'"
    :frontmatter-key-text="this.$currentTag.key"
  />
</template>

<script>
import FrontmatterPagination from '@theme/layouts/FrontmatterPagination.vue'

export default {
  components: { FrontmatterPagination }
}
</script>
