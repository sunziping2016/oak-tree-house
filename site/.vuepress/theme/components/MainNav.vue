<template>
  <div
    v-if="prev || next"
    class="page-nav"
  >
    <v-divider />
    <p class="inner">
      <span
        v-if="prev"
        class="prev"
      >
        <v-icon
          small
          color="accent"
        >
          mdi-arrow-left
        </v-icon>
        <router-link
          v-if="prev"
          class="prev"
          :to="prev.path"
        >
          {{ prev.title || prev.path }}
        </router-link>
      </span>

      <span
        v-if="next"
        class="next"
      >
        <router-link
          v-if="next"
          :to="next.path"
        >
          {{ next.title || next.path }}
        </router-link>
        <v-icon
          small
          color="accent"
        >
          mdi-arrow-right
        </v-icon>
      </span>
    </p>
  </div>
</template>

<script>
export default {
  computed: {
    prev () {
      const prev = this.$page.frontmatter.prev
      if (!prev) {
        return null
      }
      return this.$site.pages.find(x => x.regularPath === prev)
    },

    next () {
      const next = this.$page.frontmatter.next
      if (!next) {
        return null
      }
      return this.$site.pages.find(x => x.regularPath === next)
    }
  }
}
</script>

<style lang="scss">
@import '~vuetify/src/styles/styles.sass';

.page-nav {
  padding-bottom: 0;
  a {
    color: $accentColor;
    text-decoration: none;
  }

  .inner {
    min-height: 2rem;
    margin-top: 0;
    padding-top: 1rem;
    overflow: auto; // clear float
  }

  .next {
    float: right;
  }
}
</style>
