<template>
  <p
    ref="diagram"
    :class="pClass || undefined"
    :style="pStyle || undefined"
  >
    <Loader v-if="!ready" />
  </p>
</template>

<script>
import { loadScript } from './util'
import Loader from './Loader.vue'
import event from '@diagrams-event'

export default {
  components: {
    Loader
  },
  props: {
    theme: {
      type: String,
      default: 'simple'
    },
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
    // this.content = this.$refs.content.innerText
    if (event.sequenceDiagramsStatus === 2) {
      this.render()
    } else {
      event.$once('sequenceDiagramsReady', this.render)
    }
    if (event.sequenceDiagramsStatus === 0) {
      event.sequenceDiagramsStatus = 1
      Promise.all([
        loadScript('https://cdn.jsdelivr.net/npm/lodash@4.17.15/lodash.min.js', 'script-loadash'),
        loadScript('https://cdn.jsdelivr.net/npm/snapsvg@0.5.1/dist/snap.svg.min.js', 'script-snapsvg'),
        loadScript('https://cdn.jsdelivr.net/npm/webfontloader@1.6.28/webfontloader.min.js', 'script-webfontloader')
      ]).then(() =>
        loadScript('https://cdn.jsdelivr.net/npm/@rokt33r/js-sequence-diagrams@2.0.6-2/dist/sequence-diagram-min.min.js', 'script-sequence-diagrams')
      ).then(() => {
        event.sequenceDiagramsStatus = 2
        event.$emit('sequenceDiagramsReady')
      })
    }
  },
  methods: {
    render () {
      const options = {
        theme: this.theme,
        css_class: this.svgClass
      }
      if (!(options.theme in window.Diagram.themes)) {
        throw new Error('Unsupported theme: ' + options.theme)
      }
      const Theme = window.Diagram.themes[options.theme]
      new Theme(window.Diagram.parse(this.content), options, (drawing) => {
        this.ready = true
        this.$nextTick(() => {
          drawing.draw(this.$refs.diagram)
          const svg = this.$refs.diagram.children[0]
          const width = svg.getAttribute('width').slice(0, -2)
          const height = svg.getAttribute('height').slice(0, -2)
          svg.setAttribute('viewBox', `0 0 ${width} ${height}`)
          svg.removeAttribute('height')
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
