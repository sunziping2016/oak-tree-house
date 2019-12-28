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
  props: {
    title: { type: String, default: '' },
    name: { type: String, default: '' }
  },
  computed: {
    current () {
      return this[`\$current${this.title}`] || { pages: [] }
    }
  }
}
</script>

<style lang="stylus">
  .tag-title
    font-size 1.6em
    color lighten($textColor, 20%)
</style>
