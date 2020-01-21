<template>
  <Layout
    :content-width="720"
    @ready="e => $emit('ready', arguments)"
    @updated="e => $emit('updated', arguments)"
  >
    <template slot="sidebar">
      <SidebarLinks
        class="hidden-md-and-up"
      />
      <v-divider v-if="$vuetify.breakpoint.smAndDown" />
      <IndexSidebarWordCloud />
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
import Layout from '@theme/layouts/Layout'
import SidebarLinks from '@theme/components/SidebarLinks.vue'
import IndexSidebarWordCloud from '@theme/components/IndexSidebarWordCloud'

export default {
  components: {
    Layout,
    SidebarLinks,
    IndexSidebarWordCloud
  }
}
</script>

<style lang="scss">
@import '~vuetify/src/styles/styles.sass';

.not-found {
  h1 {
    color: $textColor;
  }
}
</style>
