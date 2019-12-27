<template>
  <Layout>
  </Layout>
</template>

<script>
import Layout from '@parent-theme/layouts/Layout.vue';

export default {
  components: { Layout },
  computed: {
    pages() {
      return this.$pagination.pages;
    }
  }
}
</script>
