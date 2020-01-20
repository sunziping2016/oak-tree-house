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
    </template>
    <Breadcrumbs
      :breadcrumbs="breadcrumbs"
      class="mt-6"
    />
    <Posts class="py-4" />
    <Pagination />
  </Layout>
</template>

<script>
import Layout from '@theme/layouts/Layout'
import SidebarLinks from '@theme/components/SidebarLinks.vue'
import Posts from '@theme/components/Posts'
import Pagination from '@theme/components/Pagination'
import Breadcrumbs from '@theme/components/Breadcrumbs'

export default {
  components: { Layout, SidebarLinks, Posts, Pagination, Breadcrumbs },
  props: {
    breadcrumbs: {
      type: Array,
      default: null
    }
  }
}
</script>
