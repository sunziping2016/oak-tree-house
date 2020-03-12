<template>
  <div>
    <v-treeview
      :items="tocWithoutParent"
      dense
      transition
      hoverable
      :active.sync="tocActive"
      :open.sync="tocOpen"
    >
      <template v-slot:label="{ item }">
        <router-link
          :to="item.link"
          class="toc-label"
          :class="{ 'toc-label-top': item.top }"
        >
          {{ item.name }}
        </router-link>
      </template>
    </v-treeview>
    <!-- For selector -->
    <div
      v-if="!$page.frontmatter.marp"
      style="display: none"
    >
      <a
        v-for="item in Object.values(tocIds)"
        :key="item.id"
        :href="item.link"
        class="sidebar-link"
      >
        {{ item.name }}
      </a>
    </div>
  </div>
</template>

<script>
import { resolveHeaders } from '../util'

export default {
  props: {
    items: {
      type: Array,
      default: null
    }
  },
  data: () => ({
    tocActive: [],
    tocOpen: [],
    toc: []
  }),
  computed: {
    tocWithoutParent () {
      function removeParent (toc) {
        return toc.map(x => {
          x = Object.assign({}, x)
          delete x.parent
          x.children = removeParent(x.children)
          return x
        })
      }
      return removeParent(this.toc)
    },
    tocIds () {
      function getSlugs (toc) {
        return toc.reduce((acc, x) =>
          Object.assign(acc, { [x.id]: x }, getSlugs(x.children)), {})
      }
      return getSlugs(this.toc)
    }
  },
  watch: {
    $route () {
      this.updateTocOpenAndActive()
    }
  },
  mounted () {
    this.updateToc()
    this.updateTocOpenAndActive()
    this.$root.$refs.layout.$on('updated', this.updateTocListener)
  },
  beforeDestroy () {
    this.$root.$refs.layout.$off('updated', this.updateTocListener)
  },
  methods: {
    updateTocListener () {
      this.$nextTick(() => this.updateToc())
    },
    resolveHeaders,
    updateToc () {
      if (this.items) {
        this.toc = this.items
      } else if (this.$page.frontmatter
        && Array.isArray(this.$page.frontmatter.sidebar)) {
        this.toc = resolveHeaders(
          this.$page.frontmatter.sidebar.map(
            path => this.$site.pages.find(page => page.regularPath === path))
            .filter(x => x),
          this.$page.path,
          this.$site.themeConfig.extractHeaders
        )
      } else {
        this.toc = resolveHeaders(
          [this.$page],
          this.$page.path,
          this.$site.themeConfig.extractHeaders
        )
      }
    },
    updateTocOpenAndActive () {
      const currentSlug = decodeURIComponent(
        this.$route.path + this.$route.hash)
      const currentHeader = this.tocIds[currentSlug]
      if (currentHeader === undefined) {
        return
      }
      const open = []
      let temp = currentHeader
      while (temp !== undefined) {
        if (temp.id) {
          open.push(temp.id)
        }
        temp = temp.parent
      }
      // this.tocOpen = [...new Set(this.tocOpen.concat(open))]
      this.tocOpen = open
      this.tocActive = [currentSlug]
    }
  }
}
</script>

<style lang="scss">
.toc-label {
  white-space: normal;
  display: block;
  text-decoration: none;
  color: inherit !important;
}
.toc-label-top {
  font-weight: bold;
}
</style>
