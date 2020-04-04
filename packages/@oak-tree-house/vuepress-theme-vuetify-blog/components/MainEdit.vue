<template>
  <div class="d-flex flex-wrap py-4">
    <div
      v-if="editLink"
      class="text-no-wrap app-page-edit-link"
    >
      <a
        :href="editLink"
        target="_blank"
        rel="noopener noreferrer"
      >
        {{ editLinkText }}
        <v-icon small>
          mdi-open-in-new
        </v-icon>
      </a>
    </div>
    <v-spacer />
    <div
      v-if="lastUpdated"
      class="text-no-wrap app-page-last-updated"
    >
      <span class="app-page-last-updated-prefix">{{ lastUpdatedText }}:</span>
      <span class="app-page-last-updated-date">{{ lastUpdated }}</span>
    </div>
  </div>
</template>

<script>
import { endingSlashRE, outboundRE } from '../util'

export default {
  computed: {
    lastUpdated () {
      return this.$page.lastUpdated
    },
    lastUpdatedText () {
      if (typeof this.$themeLocaleConfig.lastUpdated === 'string') {
        return this.$themeLocaleConfig.lastUpdated
      }
      if (typeof this.$site.themeConfig.lastUpdated === 'string') {
        return this.$site.themeConfig.lastUpdated
      }
      return 'Last Updated'
    },
    editLink () {
      const showEditLink = this.$page.frontmatter.editLink === undefined
        ? this.$site.themeConfig.editLinks
        : this.$page.frontmatter.editLink
      const {
        repo,
        docsDir = '',
        docsBranch = 'master',
        docsRepo = repo
      } = this.$site.themeConfig
      if (showEditLink && docsRepo && this.$page.relativePath) {
        return this.createEditLink(
          repo,
          docsRepo,
          docsDir,
          docsBranch,
          this.$page.relativePath
        )
      }
      return null
    },
    editLinkText () {
      return (
        this.$themeLocaleConfig.editLinkText
        || this.$site.themeConfig.editLinkText
        || `Edit this page`
      )
    }
  },

  methods: {
    createEditLink (repo, docsRepo, docsDir, docsBranch, path) {
      const base = outboundRE.test(docsRepo)
        ? docsRepo
        : `https://github.com/${docsRepo}`
      return (
        base.replace(endingSlashRE, '')
        + `/edit`
        + `/${docsBranch}/`
        + (docsDir ? docsDir.replace(endingSlashRE, '') + '/' : '')
        + path
      )
    }
  }
}
</script>

<style lang="scss">
.app-page-edit-link a {
  text-decoration: none;
  &:hover {
    text-decoration: underline;
  }
}
.theme--light {
  .app-page-last-updated-prefix, .app-page-edit-link a {
    color: rgba(0, 0, 0, 0.7);
  }
  .app-page-last-updated-date {
    color: rgba(0, 0, 0, 0.5);
  }
}
</style>
