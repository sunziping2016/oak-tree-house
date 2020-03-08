<template>
  <IndexPost
    @ready="e => $emit('ready', arguments)"
    @updated="e => $emit('updated', arguments)"
  />
</template>

<script>
import IndexPost from '@theme/layouts/IndexPost.vue'

export default {
  components: { IndexPost },
  methods: {
    openSnackbar () {
      this.$children[0].openSnackbar.apply(this.$children[0], arguments)
    }
  }
}
</script>
