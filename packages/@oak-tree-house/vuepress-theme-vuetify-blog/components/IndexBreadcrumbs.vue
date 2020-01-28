<template>
  <v-breadcrumbs
    :items="breadcrumbsWithPage"
    class="pa-0"
    large
  />
</template>

<script>
import { indexPageNumber } from '../util'

export default {
  props: {
    breadcrumbs: {
      type: Array,
      default: null
    },
    enablePaginationIndex: {
      type: Boolean,
      default: true
    }
  },
  computed: {
    breadcrumbsWithPage () {
      const items = this.breadcrumbs ? this.breadcrumbs.slice() : []
      items.unshift({
        text: this.$site.themeConfig.homepageText || 'Homepage',
        disabled: false,
        to: '/',
        exact: true
      })
      if (this.enablePaginationIndex) {
        items.push({
          text: indexPageNumber(
            this.$pagination.paginationIndex,
            this.$pagination.length,
            this.$pagination._matchedPages.length,
            this.$site.themeConfig.pageNumberText),
          disabled: true
        })
      }
      return items
    }
  }
}
</script>
