<template>
  <component
    :is="$vuetify.breakpoint.smAndDown ? 'div' : 'v-timeline'"
    class="posts my-0 my-md-4"
    :dense="$vuetify.breakpoint.smAndDown ? undefined : true"
    :align-top="$vuetify.breakpoint.smAndDown ? undefined : true"
  >
    <template v-for="(page, index) in $pagination.pages">
      <component
        :is="$vuetify.breakpoint.smAndDown ? 'div' : 'v-timeline-item'"
        v-if="$site.themeConfig.indexHeading && (index === 0 ||
          indexHeading(page) !== indexHeading($pagination.pages[index - 1]))"
        :key="`${page.path}-date`"
        :color="$vuetify.breakpoint.smAndDown ? undefined : 'red'"
      >
        <div
          :id="`_${indexHeading(page)}`"
          class="post-heading red--text"
        >
          <a
            :href="`#_${indexHeading(page)}`"
            class="header-anchor"
          />
          {{ indexHeading(page) }}
        </div>
      </component>
      <component
        :is="$vuetify.breakpoint.smAndDown ? 'div' : 'v-timeline-item'"
        :key="page.path"
        :color="$vuetify.breakpoint.smAndDown ? undefined : 'purple'"
        class="post"
        :small="$vuetify.breakpoint.smAndDown ? undefined : true"
      >
        <v-hover>
          <template v-slot="{ hover }">
            <v-card
              :key="page.path"
              :elevation="hover ? 6 : 2"
              class="my-2"
            >
              <v-img
                v-if="page.frontmatter.cover"
                class="align-end"
                height="180px"
                :src="$withBase(page.frontmatter.cover)"
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
                v-html="page.excerpt || page.frontmatter.summary"
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
                  color="primary"
                  :href="sourceLink(page)"
                  target="_blank"
                  text
                >
                  {{ $site.themeConfig.viewSourceText || 'View Source' }}
                </v-btn>
                <v-btn
                  color="primary"
                  text
                  :to="page.path"
                >
                  {{ $site.themeConfig.readMoreText || 'Read More' }}
                </v-btn>
              </v-card-actions>
            </v-card>
          </template>
        </v-hover>
      </component>
    </template>
  </component>
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
@import '~vuetify/src/styles/styles';

.post {
  .v-timeline-item__body {
    z-index: 2;
  }

  &-heading {
    margin-top: -64px;
    padding-top: 72px;
    font-size: 1.2em;
    pointer-events: none;
  }

  &-title {
    font-size: 1.6rem;
    a {
      text-decoration: none;
      &:hover {
        text-decoration: underline;
      }
    }
  }

  &-author, &-date, &-tags, &-category {
    display: inline-block;
    font-size: 16px;
    a {
      color: inherit;
      text-decoration: none;
      &:hover {
        text-decoration: underline;
      }
    }
  }

  &-link {
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

.posts {
  .v-timeline-item {
    padding-bottom: 8px;
  }
  .post {
    .v-timeline-item__dot {
      margin-top: 16px;
    }
  }
}
</style>
