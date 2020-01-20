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
      <IndexSidebarToc
        :pageName="tocName"
        class="mt-4"
      />
      <IndexSidebarWordCloud />
    </template>
    <ClientOnly>
      <v-container
        class="pt-0 py-0 mb-10"
      >
        <IndexBreadcrumbs
          :breadcrumbs="breadcrumbs"
          class="mt-6"
        />
        <IndexPosts class="py-4" />
        <IndexPagination />
      </v-container>
    </ClientOnly>
  </Layout>
</template>

<script>
import Layout from '@theme/layouts/Layout'
import SidebarLinks from '@theme/components/SidebarLinks.vue'
import IndexPosts from '@theme/components/IndexPosts'
import IndexPagination from '@theme/components/IndexPagination'
import IndexBreadcrumbs from '@theme/components/IndexBreadcrumbs'
import IndexSidebarToc from '@theme/components/IndexSidebarToc'
import IndexSidebarWordCloud from '@theme/components/IndexSidebarWordCloud'
import { indexPageNumber } from '../util'

export default {
  components: {
    Layout,
    SidebarLinks,
    IndexPosts,
    IndexPagination,
    IndexBreadcrumbs,
    IndexSidebarToc,
    IndexSidebarWordCloud
  },
  props: {
    breadcrumbs: {
      type: Array,
      default: null
    },
    pageName: {
      type: String,
      default: null
    }
  },
  computed: {
    tocName () {
      return (this.pageName || this.$site.themeConfig.homepageText || 'Homepage')
      + ' - '
      + indexPageNumber(this.$pagination.paginationIndex, this.$site.themeConfig.pageNumberText)
    }
  }
}
</script>
