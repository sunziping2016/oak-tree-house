<template>
  <IndexPost
    :page-name="pageName"
    :breadcrumbs="breadcrumbs"
    @ready="e => $emit('ready', arguments)"
    @updated="e => $emit('updated', arguments)"
  />
</template>

<script>
import IndexPost from '@theme/layouts/IndexPost'

export default {
  components: { IndexPost },
  computed: {
    pageName () {
      return (this.$site.themeConfig.categoryText || 'Categories')
        + ' - '
        + this.$currentCategory.key
    },
    breadcrumbs () {
      const items = [{
        text: this.$site.themeConfig.categoryText || 'Categories',
        disabled: false,
        to: '/category',
        exact: true
      }]
      items.push({
        text: this.$currentCategory.key,
        disabled: false,
        to: this.$pagination.getSpecificPageLink(0),
        exact: true
      })
      return items
    }
  }
}
</script>
