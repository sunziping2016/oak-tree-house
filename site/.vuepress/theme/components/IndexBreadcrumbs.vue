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
    }
  },
  computed: {
    breadcrumbsWithPage () {
      const items = this.breadcrumbs ? this.breadcrumbs.slice() : [{
        text: this.$site.themeConfig.homepageText || 'Homepage',
        disabled: false,
        href: '/'
      }]
      items.push({
        text: indexPageNumber(this.$pagination.paginationIndex, this.$site.themeConfig.pageNumberText),
        disabled: true
      })
      return items
    }
  }
}
</script>
