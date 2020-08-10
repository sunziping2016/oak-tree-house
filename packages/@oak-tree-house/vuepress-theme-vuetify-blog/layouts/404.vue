<template>
  <Layout
    :content-width="720"
  >
    <v-container
      class="py-0"
      style="margin-bottom: 80px"
    >
      <h1 class="my-4">
        404 Not Found
      </h1>
      <router-link to="/">
        {{ $site.themeConfig.notFoundText || 'Take me home.' }}
      </router-link>
    </v-container>
  </Layout>
</template>

<script>
import Layout from '@theme/layouts/Layout.vue'

export default {
  components: {
    Layout
  }
}
</script>
