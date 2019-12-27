<template>
  <Layout :enable-comments="false">
    <slot slot="page-top">
      <div class="theme-default-content">
        <h1 class="tags-title">
          目前共计{{ $frontmatterKey.list.length }}个{{ name }}
        </h1>
        <div class="tags">
          <NavLink
            v-for="tag in $frontmatterKey.list"
            :key="tag.name"
            class="tag"
            :item="{ text: `${tag.name}(${tag.pages.length})`, link: tag.path }"
          />
        </div>
      </div>
    </slot>
  </Layout>
</template>

<script>
import Layout from '@theme/layouts/Layout.vue'
import NavLink from '@theme/components/NavLink.vue'

export default {
  components: { Layout, NavLink },
  computed: {
    name () {
      return this.$page.frontmatter.name
    }
  }
}
</script>

<style lang="stylus">
  .tags
    .tag
      display inline-block
      white-space nowrap
      font-size 20px
      padding 2px 6px
</style>
