<template>
  <Layout
    :content-width="840"
  >
    <template slot="sidebar">
      <SidebarLinks
        class="hidden-lg-and-up"
      />
      <v-divider v-if="$vuetify.breakpoint.mdAndDown" />
      <IndexSidebarToc
        :page-name="tocName"
        class="mt-4"
      />
      <IndexSidebarWordCloud
        v-if="$site.themeConfig.wordCloudFrontmatter"
      />
    </template>
    <IndexDummy />
    <ClientOnly>
      <v-container
        class="py-0 mb-10"
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
import Layout from '@theme/layouts/Layout.vue'
import SidebarLinks from '@theme/components/SidebarLinks.vue'
import IndexPosts from '@theme/components/IndexPosts.vue'
import IndexPagination from '@theme/components/IndexPagination.vue'
import IndexBreadcrumbs from '@theme/components/IndexBreadcrumbs.vue'
import IndexSidebarToc from '@theme/components/IndexSidebarToc.vue'
import IndexSidebarWordCloud from '@theme/components/IndexSidebarWordCloud.vue'
import IndexDummy from '@theme/components/IndexDummy.vue'
import { indexPageNumber } from '../util'

export default {
  components: {
    Layout,
    SidebarLinks,
    IndexPosts,
    IndexPagination,
    IndexBreadcrumbs,
    IndexSidebarToc,
    IndexSidebarWordCloud,
    IndexDummy
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
      + indexPageNumber(
        this.$pagination.paginationIndex,
        this.$pagination.length,
        this.$pagination._matchedPages.length,
        this.$site.themeConfig.pageNumberText
      )
    }
  }
}
</script>
