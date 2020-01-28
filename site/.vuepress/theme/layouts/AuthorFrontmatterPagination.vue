<template>
  <FrontmatterPagination
    :frontmatter-text="this.$site.themeConfig.authorText || 'Authors'"
    :frontmatter-path="'/author'"
    :frontmatter-key-text="this.$currentAuthor.key"
    @ready="e => $emit('ready', arguments)"
    @updated="e => $emit('updated', arguments)"
  />
</template>

<script>
import FrontmatterPagination from '@theme/layouts/FrontmatterPagination.vue'

export default {
  components: { FrontmatterPagination }
}
</script>
