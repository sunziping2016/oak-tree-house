<template>
  <p
    ref="diagram"
    :class="pClass"
    :style="pStyle"
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
    if (event.flowchartDiagramsStatus === 2) {
      this.render()
    } else {
      event.$once('flowcharDiagramsReady', this.render)
    }
    if (event.flowchartDiagramsStatus === 0) {
      event.flowchartDiagramsStatus = 1
      loadScript('https://cdnjs.cloudflare.com/ajax/libs/raphael/2.3.0/raphael.min.js', 'script-raphael')
        .then(() =>
          loadScript('https://cdnjs.cloudflare.com/ajax/libs/flowchart/1.13.0/flowchart.min.js', 'script-flowchart'))
        .then(() => {
          event.flowchartDiagramsStatus = 2
          event.$emit('flowcharDiagramsReady')
        })
    }
  },
  methods: {
    render () {
      const diagram = window.flowchart.parse(this.content)
      diagram.drawSVG(this.$refs.diagram)
      this.ready = true
      this.$nextTick(() => {
        const svg = this.$refs.diagram.children[0]
        const width = svg.getAttribute('width')
        const height = svg.getAttribute('height')
        svg.setAttribute('viewBox', `0 0 ${width} ${height}`)
        svg.removeAttribute('height')
        if (this.svgStyle) {
          svg.setAttribute('style', this.svgStyle)
        }
        if (this.svgClass) {
          svg.setAttribute('class', this.svgClass)
        }
      })
    }
  }
}
</script>
