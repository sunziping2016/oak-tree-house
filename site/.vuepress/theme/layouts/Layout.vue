<template>
  <v-app>
    <!-- Header -->
    <ClientOnly>
      <v-app-bar
        app
        color="primary"
        dark
        clipped-left
      >
        <v-app-bar-nav-icon
          v-if="enableDrawer"
          class="hidden-md-and-up"
          @click="drawer = !drawer"
        />
        <!-- Logo -->
        <Logo />
        <v-spacer />
        <!-- Search -->
        <Search />
        <!-- Menu -->
        <NavLinks class="hidden-sm-and-down" />
      </v-app-bar>
      <v-navigation-drawer
        v-model="drawer"
        :width="300"
        app
        clipped
        :permanent="$vuetify.breakpoint.mdAndUp"
        :mobile-break-point="$vuetify.breakpoint.thresholds.md"
      >
        <!-- menu -->
        <SidebarLinks
          class="hidden-md-and-up"
        />
        <v-divider v-if="$vuetify.breakpoint.smAndDown && toc.length" />
        <!-- TOC -->
        <v-treeview
          :items="tocWithoutParent"
          class="mt-2"
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
        <!-- TOC for selector -->
        <div style="display: none">
          <a
            v-for="item in Object.values(tocIds)"
            :key="item.id"
            :href="item.link"
            class="sidebar-link"
          >
            {{ item.name }}
          </a>
        </div>
      </v-navigation-drawer>
    </ClientOnly>
    <v-content>
      <Content />
    </v-content>
  </v-app>
</template>

<script>
import Logo from '@theme/components/Logo.vue'
import Search from '@theme/components/Search.vue'
import NavLinks from '@theme/components/NavLinks.vue'
import SidebarLinks from '@theme/components/SidebarLinks.vue'
import { resolveHeaders } from '../util'

export default {
  components: { Logo, Search, NavLinks, SidebarLinks },
  props: {
    enableDrawer: {
      type: Boolean,
      default: true
    }
  },
  data: () => ({
    drawer: false,
    tocActive: [],
    tocOpen: []
  }),
  computed: {
    toc () {
      if (this.$page.frontmatter
        && Array.isArray(this.$page.frontmatter.sidebar)) {
        return resolveHeaders(
          this.$page.frontmatter.sidebar.map(
            path => this.$site.pages.find(page => page.regularPath === path))
          .filter(x => x))
      }
      return resolveHeaders([this.$page])
    },
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
      this.updateToc()
    }
  },
  mounted () {
    this.updateToc()
  },
  methods: {
    resolveHeaders,
    updateToc () {
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

