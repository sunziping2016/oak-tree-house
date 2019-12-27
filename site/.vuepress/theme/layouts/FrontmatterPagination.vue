<template>
  <IndexPost>
    <slot slot="pagination-top">
      <h1 class="tag-title">
        {{ name }} {{ current.key }} 共{{ current.pages.length }}篇
      </h1>
    </slot>
  </IndexPost>
</template>

<script>
import IndexPost from '@theme/layouts/IndexPost.vue'

export default {
  components: { IndexPost },
  computed: {
    current () {
      return this.$currentTag || this.$currentCategory
        || this.$currentAuthor || this.$currentSeries
    },
    name () {
      switch (this.current.scope) {
        case 'tag':
          return '标签'
        case 'category':
          return '分类'
        case 'author':
          return '作者'
        case 'series':
          return '连载文章'
        default:
          return '未知分类'
      }
    }
  }
}
</script>

<style lang="stylus">
  .tag-title
    font-size 1.6em
    color lighten($textColor, 20%)
</style>
