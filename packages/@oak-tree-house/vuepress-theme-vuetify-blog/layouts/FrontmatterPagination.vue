<template>
  <IndexPost
    :page-name="pageName"
    :breadcrumbs="breadcrumbs"
    @ready="e => $emit('ready', arguments)"
    @updated="e => $emit('updated', arguments)"
  />
</template>

<script>
import IndexPost from '@theme/layouts/IndexPost.vue'

export default {
  components: { IndexPost },
  props: {
    frontmatterText: {
      type: String,
      required: true
    },
    frontmatterPath: {
      type: String,
      required: true
    },
    frontmatterKeyText: {
      type: String,
      required: true
    }
  },
  computed: {
    pageName () {
      return this.frontmatterText
        + ' - '
        + this.frontmatterKeyText
    },
    breadcrumbs () {
      const items = [{
        text: this.frontmatterText,
        disabled: false,
        to: this.frontmatterPath,
        exact: true
      }]
      items.push({
        text: this.frontmatterKeyText,
        disabled: false,
        to: this.$pagination.getSpecificPageLink(0),
        exact: true
      })
      return items
    }
  },
  methods: {
    openSnackbar () {
      this.$children[0].openSnackbar.apply(this.$children[0], arguments)
    }
  }
}
</script>
