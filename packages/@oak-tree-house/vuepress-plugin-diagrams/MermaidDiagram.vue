<template>
  <p
    ref="diagram"
    class="mermaid"
    :class="pClass"
    :style="pStyle"
  >
    <loader v-if="!ready" />
  </p>
</template>

<script>
import { loadScript, generateId } from './util'
import Loader from './Loader.vue'
import event from '@diagrams-event'

export default {
  components: {
    Loader
  },
  props: {
    pStyle: {
      type: String,
      default: undefined
    },
    pClass: {
      type: String,
      default: undefined
    },
    svgStyle: {
      type: String,
      default: undefined
    },
    svgClass: {
      type: String,
      default: undefined
    }
  },
  data: () => ({
    content: '',
    ready: false
  }),
  mounted () {
    this.content = this.$slots.default.map(vnode => (vnode.text || vnode.elm.innerText)).join('')
    if (event.mermaidDiagramsStatus === 2) {
      this.render()
    } else {
      event.$once('mermaidDiagramsStatus', this.render)
    }
    if (event.mermaidDiagramsStatus === 0) {
      event.mermaidDiagramsStatus = 1
      loadScript('https://unpkg.com/mermaid@8.4.8/dist/mermaid.min.js', 'script-mermaid')
        .then(() => {
          event.mermaidDiagramsStatus = 2
          window.mermaid.mermaidAPI.initialize({
            startOnLoad: false
          })
          event.$emit('mermaidDiagramsStatus')
        })
    }
  },
  methods: {
    render () {
      const id = generateId()
      window.mermaid.mermaidAPI.render(id, this.content, (svgCode, bindFunctions) => {
        this.ready = true
        this.$nextTick(() => {
          const element = this.$refs.diagram
          element.innerHTML = svgCode
          bindFunctions && bindFunctions(element)
          const svg = this.$refs.diagram.children[0]
          if (this.svgStyle) {
            svg.setAttribute('style', this.svgStyle)
          }
          if (this.svgClass) {
            svg.setAttribute('class', this.svgClass)
          }
        })
      })
    }
  }
}
</script>

<style>
.mermaid .title {
  font-size: unset !important;
}
</style>
