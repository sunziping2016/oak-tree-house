<template>
  <div
    class="posts"
  >
    <template v-for="(page, index) in $pagination.pages">
      <div
        v-if="$site.themeConfig.indexHeading && (index === 0 ||
          indexHeading(page) !== indexHeading($pagination.pages[index - 1]))"
        :id="`_${indexHeading(page)}`"
        :key="`${page.path}-date`"
        class="subtitle-1 post-heading"
      >
        <a
          :href="`#_${indexHeading(page)}`"
          class="header-anchor"
        />
        {{ indexHeading(page) }}
      </div>
      <v-card
        :key="page.path"
        class="my-2 post"
      >
        <v-img
          v-if="page.frontmatter.cover"
          class="align-end"
          height="180px"
          :src="page.frontmatter.cover"
        />
        <v-card-title
          class="post-title"
        >
          <router-link
            :to="page.path"
          >
            {{ page.title }}
          </router-link>
        </v-card-title>
        <v-card-subtitle>
          <div
            v-if="page.frontmatter.author"
            class="post-tags"
            title="作者"
          >
            <v-icon
              size="18"
            >
              mdi-account-outline
            </v-icon>
            <router-link
              class="post-link"
              :to="`/author/${page.frontmatter.author}/`"
            >
              {{ page.frontmatter.author }}
            </router-link>
          </div>
          <div
            v-if="page.frontmatter.tags"
            class="post-tags"
            title="标签"
          >
            <v-icon
              size="18"
            >
              mdi-tag-outline
            </v-icon>
            <router-link
              v-for="tag in page.frontmatter.tags"
              :key="tag"
              class="post-link post-tag"
              :to="`/tag/${tag}/`"
            >
              {{ tag }}
            </router-link>
          </div>
          <div
            v-if="page.frontmatter.category"
            class="post-tags"
            title="分类"
          >
            <v-icon
              size="18"
            >
              mdi-file-tree
            </v-icon>
            <router-link
              class="post-link"
              :to="`/category/${page.frontmatter.category}/`"
            >
              {{ page.frontmatter.category }}
            </router-link>
          </div>
          <div
            v-if="page.frontmatter.series"
            class="post-tags"
            title="连载文章"
          >
            <v-icon
              size="18"
            >
              mdi-bookshelf
            </v-icon>
            <router-link
              class="post-link"
              :to="`/series/${page.frontmatter.series}/`"
            >
              {{ page.frontmatter.series }}
            </router-link>
          </div>
        </v-card-subtitle>
        <!-- eslint-disable vue/no-v-html -->
        <v-card-text
          class="post-summary content"
          v-html="page.excerpt"
        />
        <v-card-actions>
          <div
            v-if="page.frontmatter.date"
            class="post-tags"
            title="发布时间"
          >
            <v-icon
              size="18"
            >
              mdi-calendar-month-outline
            </v-icon>
            <span>{{ new Date(page.frontmatter.date.trim()).toLocaleDateString($lang) }}</span>
          </div>
          <v-spacer />
          <v-btn
            v-if="sourceLink(page)"
            color="accent"
            :href="sourceLink(page)"
            target="_blank"
            text
          >
            {{ $site.themeConfig.viewSourceText || 'View Source' }}
          </v-btn>
          <v-btn
            color="accent"
            text
            :href="page.path"
          >
            {{ $site.themeConfig.readMoreText || 'Read More' }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </template>
  </div>
</template>

<script>
import { endingSlashRE, indexHeading, outboundRE } from '../util'

export default {
  methods: {
    indexHeading (page) {
      return indexHeading(page, this.$site.themeConfig.indexHeading)
    },
    sourceLink (page) {
      const {
        repo,
        docsDir = '',
        docsBranch = 'master',
        docsRepo = repo
      } = this.$site.themeConfig
      if (docsRepo && page.relativePath) {
        return this.createSourceLink(
          repo,
          docsRepo,
          docsDir,
          docsBranch,
          page.relativePath
        )
      }
      return null
    },
    createSourceLink (repo, docsRepo, docsDir, docsBranch, path) {
      const base = outboundRE.test(docsRepo)
        ? docsRepo
        : `https://github.com/${docsRepo}`
      return (
        base.replace(endingSlashRE, '')
        + `/tree`
        + `/${docsBranch}/`
        + (docsDir ? docsDir.replace(endingSlashRE, '') + '/' : '')
        + path
      )
    }
  }
}
</script>

<style lang="scss">
@import '~vuetify/src/styles/styles.sass';

.post {

  &-heading {
    padding-left: 2px;
    color: $accentColor;
    margin-top: -72px;
    padding-top: 72px;
  }

  &-title {
    font-size: 1.6rem;
    a {
      color: $primaryColor;
      text-decoration: none;
      &:hover {
        text-decoration: underline;
      }
    }
  }

  &-author, &-date, &-tags, &-category {
    display: inline-block;
    font-size: 16px;
    color: lighten($textColor, 25%);
    a {
      color: inherit;
      text-decoration: none;
      &:hover {
        text-decoration: underline;
      }
    }
  }

  &-link {
    color: lighten($textColor, 25%);
  }

  &-tag + &-tag {
    padding-left: 6px;
  }

  &-tags + &-tags::before {
    content: '·';
    padding: 2px;
  }

  &-summary {
    font-size: 1rem;
    p {
      margin: 0 !important;
    }
    p + p {
      margin: 1rem 0 !important;
    }
  }
}
</style>
