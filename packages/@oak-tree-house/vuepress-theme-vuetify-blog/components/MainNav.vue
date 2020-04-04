<template>
  <div
    v-if="prev || next"
    class="app-nav"
  >
    <v-divider />
    <div
      class="d-flex py-4 flex-wrap"
    >
      <div
        v-if="prev"
      >
        <router-link
          v-if="prev"
          :to="prev.path"
        >
          <v-icon
            small
            color="primary"
          >
            mdi-arrow-left
          </v-icon>
          {{ prev.title || prev.path }}
        </router-link>
      </div>
      <v-spacer />
      <div
        v-if="next"
      >
        <router-link
          v-if="next"
          :to="next.path"
        >
          {{ next.title || next.path }}
          <v-icon
            small
            color="primary"
          >
            mdi-arrow-right
          </v-icon>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  computed: {
    prev () {
      let prev = this.$page.frontmatter.prev
      if (!prev && this.$page.frontmatter.sidebar) {
        const index = this.$page.frontmatter.sidebar.findIndex(x => x === this.$page.regularPath)
        if (index !== -1) {
          prev = this.$page.frontmatter.sidebar[index - 1]
        }
      }
      if (!prev) {
        return null
      }
      return this.$site.pages.find(x => x.regularPath === prev)
    },

    next () {
      let next = this.$page.frontmatter.next
      if (!next && this.$page.frontmatter.sidebar) {
        const index = this.$page.frontmatter.sidebar.findIndex(x => x === this.$page.regularPath)
        if (index !== -1) {
          next = this.$page.frontmatter.sidebar[index + 1]
        }
      }
      if (!next) {
        return null
      }
      return this.$site.pages.find(x => x.regularPath === next)
    }
  }
}
</script>

<style lang="scss">
.app-nav a {
  text-decoration: none;
  &:hover {
    text-decoration: underline;
  }
}
</style>
