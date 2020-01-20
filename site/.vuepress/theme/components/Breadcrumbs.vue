<template>
  <v-breadcrumbs
    :items="breadcrumbsWithPage"
    class="pa-0"
    large
  />
</template>

<script>
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
        text: Function('index', `"use strict";return (${this.$site.themeConfig.pageNumberText});`)(
          this.$pagination.paginationIndex
        ) || `Page ${this.$pagination.paginationIndex + 1}`,
        disabled: true
      })
      return items
    }
  }
}
</script>
