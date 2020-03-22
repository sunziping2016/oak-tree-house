<template>
  <p
    ref="diagram"
    :class="pClass || undefined"
    :style="pStyle || undefined"
  />
</template>

<script>
import { loadScript } from './util'
import event from '@diagrams-event'

export default {
  props: {
    theme: {
      type: String,
      default: 'simple'
    },
    svgClass: {
      type: String,
      default: undefined
    },
    pStyle: {
      type: String,
      default: undefined
    },
    pClass: {
      type: String,
      default: undefined
    }
  },
  data: () => ({
    content: ''
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
      const diagram = window.Diagram.parse(this.content)
      diagram.drawSVG(this.$refs.diagram, {
        theme: this.theme,
        css_class: this.svgClass
      })
    }
  }
}
</script>
