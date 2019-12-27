<template>
  <Layout>
    <template #page-top>
      <div class="theme-default-content">
        <slot name="pagination-top" />

        <section class="posts">
          <article
            v-for="page in pages"
            :key="page.path"
            class="post"
          >
            <h1 class="post-title">
              <NavLink :item="{ link: page.path, text: page.title}" />
            </h1>

            <div
              v-if="page.frontmatter.author"
              class="post-author"
            >
              <UserIcon />
              <span>{{ page.frontmatter.author }}</span>
            </div>

            <div
              v-if="page.frontmatter.date"
              class="post-date"
            >
              <ClockIcon />
              <span>{{ new Date(page.frontmatter.date.trim()).toLocaleDateString('zh') }}</span>
            </div>

            <div
              v-if="page.frontmatter.tags"
              class="post-tags"
            >
              <TagIcon />
              <NavLink
                v-for="tag in page.frontmatter.tags"
                :key="tag"
                class="post-tag"
                :item="{ link: `/tag/${tag}/`, text: `#${tag}` }"
              />
            </div>
            <p class="post-summary">
              {{ page.frontmatter.summary || page.summary }}
            </p>
          </article>
        </section>
        <div
          v-if="$pagination.length > 1"
          class="post-pagination"
        >
          <Pagination />
        </div>
        <slot name="pagination-bottom" />
      </div>
    </template>
  </Layout>
</template>

<script>
import Layout from '@theme/layouts/Layout.vue'
import NavLink from '@theme/components/NavLink.vue'
import { Pagination } from '@vuepress/plugin-blog/lib/client/components'
import { UserIcon, ClockIcon, TagIcon } from 'vue-feather-icons'

export default {
  components: { Layout, Pagination, NavLink, UserIcon, ClockIcon, TagIcon },
  computed: {
    pages () {
      return this.$pagination.pages
    }
  }
}
</script>

<style lang="stylus">
  .post
    padding 1rem 0
    &-title
      font-size 1.8rem
      margin 0.2rem 0
    &-author, &-date, &-tags
      display inline-block
      font-size 16px
      color lighten($textColor, 25%)
      svg
        width 14px
        height 14px
        margin 0 -2px -1px 4px
    &-tag
      color lighten($textColor, 25%)
    &-tag + &-tag
      padding-left 6px
    &-author + &-date::before, &-date + &-tags::before
      content '·'
      padding 2px
    &-summary
      margin-top 0.8rem
      margin-bottom 0.8rem
    & + &
      border-top 1px solid $borderColor
  .post-pagination
    text-align center
</style>

