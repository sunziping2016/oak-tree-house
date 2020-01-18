<template>
  <component
    :is="layout"
    ref="child"
    @ready="onReady"
  />
</template>

<script>
import Vue from 'vue'

export default {
  data: () => ({
    ready: false
  }),
  computed: {
    layout () {
      const layout = this.getLayout()
      return Vue.component(layout)
    }
  },
  watch: {
    layout () {
      this.ready = false
    },
    ready () {
      this.$emit('ready', this.ready)
    }
  },
  methods: {
    getLayout () {
      if (this.$page.path) {
        const layout = this.$page.frontmatter.layout
        if (layout && (this.$vuepress.getLayoutAsyncComponent(layout)
          || this.$vuepress.getVueComponent(layout))) {
          return layout
        }
        return 'Layout'
      }
      return 'NotFound'
    },
    onReady () {
      this.ready = true
    }
  }
}
</script>
