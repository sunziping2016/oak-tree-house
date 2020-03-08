<template>
  <FrontmatterPagination
    :frontmatter-text="this.$site.themeConfig.tagText || 'Tags'"
    :frontmatter-path="'/tag'"
    :frontmatter-key-text="this.$currentTag.key"
    @ready="e => $emit('ready', arguments)"
    @updated="e => $emit('updated', arguments)"
  />
</template>

<script>
import FrontmatterPagination from '@theme/layouts/FrontmatterPagination.vue'

export default {
  components: { FrontmatterPagination },
  methods: {
    openSnackbar () {
      this.$children[0].openSnackbar.apply(this.$children[0], arguments)
    }
  }
}
</script>
