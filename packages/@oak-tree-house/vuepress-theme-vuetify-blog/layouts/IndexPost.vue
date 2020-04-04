<template>
  <Layout>
    <IndexDummy />
    <ClientOnly>
      <v-container
        class="py-0 mb-10"
      >
        <IndexBreadcrumbs
          :breadcrumbs="breadcrumbs"
          class="mt-6 ml-0 ml-md-8"
        />
        <IndexPosts class="py-4" />
        <IndexPagination
          class="pl-0 pl-md-8"
        />
      </v-container>
    </ClientOnly>
  </Layout>
</template>

<script>
import Layout from '@theme/layouts/Layout.vue'
import IndexDummy from '@theme/components/IndexDummy.vue'
import IndexBreadcrumbs from '@theme/components/IndexBreadcrumbs.vue'
import IndexPosts from '@theme/components/IndexPosts.vue'
import IndexPagination from '@theme/components/IndexPagination.vue'

export default {
  components: {
    Layout,
    IndexDummy,
    IndexBreadcrumbs,
    IndexPosts,
    IndexPagination
  },
  props: {
    breadcrumbs: {
      type: Array,
      default: null
    }
  }
}
</script>
