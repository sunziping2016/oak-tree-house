<template>
  <Layout>
    <ul style="display: none">
      <li
        v-for="word in $frontmatterKey.list"
        :key="word.name"
      >
        <a
          :href="word.path"
        >
          {{ word.name }}
        </a>
      </li>
    </ul>
    <ClientOnly>
      <v-container
        class="py-0 mb-10"
      >
        <IndexBreadcrumbs
          class="mt-6"
          :breadcrumbs="breadcrumbs"
          :enable-pagination-index="false"
        />
        <div class="my-4 headline">
          {{ heading }}
        </div>
        <v-chip
          v-for="word in $frontmatterKey.list"
          :key="word.name"
          :to="word.path"
          class="ma-1 frontmatter-key-chip"
          outlined
          color="primary"
        >
          {{ `${word.name} (${word.pages.length})` }}
        </v-chip>
      </v-container>
    </ClientOnly>
  </Layout>
</template>

<script>
import Layout from '@theme/layouts/Layout.vue'
import IndexBreadcrumbs from '@theme/components/IndexBreadcrumbs.vue'
import { frontmatterKeyHeading } from '../util'

export default {
  components: {
    Layout,
    IndexBreadcrumbs
  },
  computed: {
    breadcrumbs () {
      return [{
        text: this.$page.frontmatter.name,
        disabled: false,
        to: this.$page.path
      }]
    },
    heading () {
      return frontmatterKeyHeading(
        this.$page.frontmatter.name,
        this.$frontmatterKey.list.length,
        this.$site.themeConfig.frontmatterKeyHeading
      )
    }
  },
  mounted () {
    console.log(123)
  }
}
</script>

<style lang="scss">
  .frontmatter-key-chip {
    &:hover {
      text-decoration: underline;
    }
  }
</style>
