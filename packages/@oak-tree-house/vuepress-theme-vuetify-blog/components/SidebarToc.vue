<template>
  <v-navigation-drawer
    v-scroll="onScroll"
    app
    clipped
    disable-resize-watcher
    right
    :width="320"
    class="app-toc-drawer"
    :value="value"
    @input="$emit('input', $event)"
  >
    <div
      class="app-toc-toggle-button"
    >
      <div>
        <v-btn
          icon
          color="primary"
          @click="$emit('input', !value)"
        >
          <v-icon
            v-text="!value ? 'mdi-table-of-contents' : 'mdi-chevron-right'"
          />
        </v-btn>
      </div>
    </div>
    <div class="font-weight-bold ml-4 mt-4">
      Contents
    </div>
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
          v-if="item.link"
          :to="item.link"
          :title="item.name"
          class="app-toc-item"
          :class="[`app-toc-item-depth${item.depth}`]"
        >
          {{ item.name }}
        </router-link>
        <span
          v-else
          :title="item.name"
          class="app-toc-item"
          :class="[`app-toc-item-${item.depth}`]"
        >
          {{ item.name }}
        </span>
      </template>
    </v-treeview>
  </v-navigation-drawer>
</template>

<script>
import event from '@theme-event'
import { resolveHeaders } from '../util'

export default {
  props: {
    value: {
      type: Boolean,
      required: true
    }
  },
  data: () => ({
    toc: [],
    tocActive: [],
    tocOpen: [],
    scrollOffset: 0,
    scrollTimeout: 0,
    routerHook: null
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
    tocFlatten () {
      function flatten (toc) {
        const flat = []
        toc.forEach(item => {
          flat.push(item)
          flat.push(...flatten(item.children))
        })
        return flat
      }
      return flatten(this.toc)
    },
    tocFlattenHashes () {
      return this.tocFlatten.filter(x => x.hash)
    },
    tocCurrentPage () {
      return this.tocFlatten.find(item => item.page === this.$page)
    }
  },
  mounted () {
    this.updateToc()
    this.updateTocOpen()
    event.$on('contentReady', this.updateTocListener)
    this.routerHook = this.$router.afterEach(this.updateTocListener)
  },
  beforeDestroy () {
    event.$off('contentReady', this.updateTocListener)
    this.routerHook()
  },
  methods: {
    updateTocListener () {
      this.$nextTick(() => {
        this.updateToc()
        this.updateTocOpen()
      })
    },
    updateToc () {
      this.toc = resolveHeaders(
        this.$page.frontmatter.sidebar || [this.$page.regularPath],
        this.$site.pages,
        this.$page.path,
        this.$site.themeConfig.extractHeaders
      )
    },
    updateTocOpen () {
      if (!this.tocCurrentPage) {
        this.tocOpen = []
      } else {
        const open = []
        let current = this.tocCurrentPage
        while (current) {
          open.push(current.id)
          current = current.parent
        }
        // eslint-disable-next-line no-inner-declarations
        function pushChildren (item) {
          item.children.forEach(x => {
            open.push(x.id)
            pushChildren(x)
          })
        }
        pushChildren(this.tocCurrentPage)
        this.tocOpen = open
      }
    },
    updateTocActive () {
      const list = this.tocFlattenHashes.slice().reverse()
      const item = list.find(item => {
        const section = document.getElementById(item.hash)
        if (!section) {
          return false
        }
        return section.offsetTop < this.scrollOffset
      })
      if (item) {
        this.tocActive = [item.id]
      } else {
        this.tocActive = []
      }
    },
    onScroll () {
      this.scrollOffset = window.pageYOffset
        || document.documentElement.offsetTop
        || 0
      clearTimeout(this.scrollTimeout)
      this.scrollTimeout = setTimeout(this.updateTocActive, 50)
    }
  }
}
</script>

<style lang="scss">
.v-navigation-drawer.app-toc-drawer {
  overflow: visible;
  .v-treeview--dense .v-treeview-node__root {
    min-height: 32px;
  }
}
.app-toc-toggle-button {
  position: relative;
  & > div {
    margin-top: 12px;
    .v-navigation-drawer--is-mobile & {
      margin-top: 76px;
    }
    visibility: visible;
    position: fixed;
    left: -36px;
    box-sizing: border-box;
    border-radius: 18px 0 0 18px;
    .theme--light & {
      background-color: #FFFFFF;
      border-left: 1px solid rgba(0, 0, 0, 0.12);
      border-top: 1px solid rgba(0, 0, 0, 0.12);
      border-bottom: 1px solid rgba(0, 0, 0, 0.12);
    }
    .theme--dark & {
      background-color: #363636;
      border-left: 1px solid rgba(255, 255, 255, 0.12);;
      border-top: 1px solid rgba(255, 255, 255, 0.12);;
      border-bottom: 1px solid rgba(255, 255, 255, 0.12);;
    }
    & > button {
    }
  }
}

.app-toc-item {
  display: inline-block;
  white-space: normal;
  text-decoration: none;
  padding: 2px 0;
  .theme--light & {
    color: rgba(0, 0, 0, 0.87);
  }
  .theme--dark & {
    color: #FFFFFF;
  }
}
a.app-toc-item:hover {
  text-decoration: underline;
}
.app-toc-item-depth0 {
  font-weight: bold;
}
</style>
