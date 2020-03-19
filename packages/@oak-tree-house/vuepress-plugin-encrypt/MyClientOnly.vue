<script>
export default {
  functional: true,
  // eslint-disable-next-line vue/require-render-return
  render (h, { parent, children, listeners }) {
    if (parent._isMounted) {
      if (listeners.contentReady) {
        listeners.contentReady()
      }
      return children
    } else {
      parent.$once('hook:mounted', () => {
        parent.$forceUpdate()
      })
    }
  }
}
</script>
