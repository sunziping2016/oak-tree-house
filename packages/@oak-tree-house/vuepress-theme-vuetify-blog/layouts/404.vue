<template>
  <Layout
    :content-width="720"
  >
    <template slot="sidebar">
      <SidebarLinks
        class="hidden-lg-and-up"
      />
      <v-divider v-if="$vuetify.breakpoint.mdAndDown" />
      <IndexSidebarWordCloud
        v-if="$site.themeConfig.wordCloudFrontmatter"
      />
    </template>
    <v-container
      class="py-0 mb-10 not-found"
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
import SidebarLinks from '@theme/components/SidebarLinks.vue'
import IndexSidebarWordCloud from '@theme/components/IndexSidebarWordCloud.vue'

export default {
  components: {
    Layout,
    SidebarLinks,
    IndexSidebarWordCloud
  }
}
</script>

<style lang="scss">
@import '../styles/default';
@import '~vuetify/src/styles/styles';

.not-found {
  h1 {
    color: $textColor;
  }
}
</style>
