<template>
  <div>
    <v-speed-dial
      v-model="fab"
      right
      bottom
      fixed
      direction="top"
      transition="slide-y-reverse-transition"
    >
      <template v-slot:activator>
        <v-btn
          v-model="fab"
          color="blue darken-2"
          dark
          fab
        >
          <v-icon v-if="fab">
            mdi-close
          </v-icon>
          <v-icon v-else>
            mdi-plus
          </v-icon>
        </v-btn>
      </template>
      <v-btn
        v-if="sourceLink"
        fab
        dark
        small
        color="green"
        :href="sourceLink"
        target="_blank"
      >
        <v-icon>mdi-code-tags</v-icon>
      </v-btn>
      <v-btn
        fab
        dark
        small
        color="purple"
        @click="infoDialog = true"
      >
        <v-icon>mdi-information-outline</v-icon>
      </v-btn>
      <v-btn
        fab
        dark
        small
        color="orange"
        @click="onShare"
      >
        <v-icon>mdi-share-variant</v-icon>
      </v-btn>
      <v-btn
        fab
        dark
        small
        color="red"
        @click="toTop"
      >
        <v-icon>mdi-chevron-up</v-icon>
      </v-btn>
    </v-speed-dial>
    <v-dialog
      v-model="shareDialog"
      :max-width="dialogWidth"
    >
      <v-card>
        <v-card-title class="headline indigo--text">
          {{ $site.themeConfig.shareDialogHeading || 'Share this Page...' }}
        </v-card-title>
        <v-card-text>
          <div class="subtitle-1 red--text">
            {{ $site.themeConfig.shareDialogLinkText || 'Link' }}
          </div>
          <p id="share-page-link">
            {{ sharePageUrl }}
          </p>
          <div class="subtitle-1 red--text">
            {{ $site.themeConfig.shareDialogQRCodeText || 'QRCode' }}
          </div>
          <div
            class="text-center"
          >
            <img
              v-if="sharePageDataUrl"
              :src="sharePageDataUrl"
              alt="Page QRCode"
              width="240"
              height="240"
            >
            <v-progress-circular
              v-else
              indeterminate
              color="gray"
            />
          </div>
          <div class="d-flex justify-space-between align-center">
            <div class="subtitle-1 red--text">
              {{ $site.themeConfig.shareDialogIncludeFullPathText || 'Include Full Path' }}
            </div>
            <v-switch
              v-model="shareFullPath"
              dense
            />
          </div>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn
            color="green darken-1"
            text
            @click="onShareLink"
          >
            {{ $site.themeConfig.shareDialogLinkText || 'Link' }}
            <v-icon right>
              mdi-content-copy
            </v-icon>
          </v-btn>
          <v-btn
            color="green darken-1"
            text
            @click="onShareQRCode"
          >
            {{ $site.themeConfig.shareDialogQRCodeText || 'QRCode' }}
            <v-icon right>
              mdi-download
            </v-icon>
          </v-btn>
          <v-btn
            color="red darken-1"
            text
            @click="shareDialog = false"
          >
            {{ $site.themeConfig.shareDialogCloseText || 'Close' }}
            <v-icon right>
              mdi-close
            </v-icon>
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog
      v-model="infoDialog"
      :max-width="dialogWidth"
    >
      <v-card>
        <v-card-title class="headline indigo--text">
          {{ $site.themeConfig.infoDialogHeading || 'Page Info...' }}
        </v-card-title>
        <v-card-text>
          <div
            v-for="(value, key) in this.$page.frontmatter"
            :key="key"
            class="d-flex justify-space-between align-center"
          >
            <div class="subtitle-1 red--text pr-4 text-no-wrap">
              {{ key }}
            </div>
            <div class="overflow-auto indigo--text">
              <div
                v-if="key === 'sidebar'"
                class="d-flex flex-column"
              >
                <div
                  v-for="entry in value"
                  :key="entry"
                >
                  <router-link
                    :to="$site.pages.find(page => page.regularPath === entry).path"
                    class="indigo--text"
                  >
                    {{ entry }}
                  </router-link>
                </div>
              </div>
              <div
                v-else-if="$site.themeConfig.infoDialogFrontmatterKeys
                  && $site.themeConfig.infoDialogFrontmatterKeys[key]
                  && $site.themeConfig.infoDialogFrontmatterKeys[key].id"
              >
                <v-chip
                  v-if="!Array.isArray(value)"
                  outlined
                  color="indigo"
                  :to="that[`\$${$site.themeConfig.infoDialogFrontmatterKeys[key].id}`].map[value].path"
                  class="ma-1"
                >
                  {{ value }}
                </v-chip>
                <v-chip
                  v-else
                  v-for="item in value"
                  :key="item"
                  outlined
                  color="indigo"
                  :to="that[`\$${$site.themeConfig.infoDialogFrontmatterKeys[key].id}`].map[item].path"
                  class="ma-1"
                >
                  {{ item}}
                </v-chip>
              </div>
              <span
                v-else-if="typeof value === 'string'"
              >
                {{ value }}
              </span>
              <span v-else>
                {{ JSON.stringify(value) }}
              </span>
            </div>
          </div>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn
            color="red darken-1"
            text
            @click="infoDialog = false"
          >
            {{ $site.themeConfig.infoDialogCloseText || 'Close' }}
            <v-icon right>
              mdi-close
            </v-icon>
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import qrcode from 'qrcode-generator'
import { endingSlashRE, outboundRE } from '../util'

export default {
  data: () => ({
    fab: false,
    shareFullPath: false,
    shareDialog: false,
    infoDialog: false
  }),
  computed: {
    that () {
      return this
    },
    sharePageUrl () {
      if (this.shareFullPath) {
        return location.origin + this.$route.fullPath
      }
      return location.origin + this.$route.path
    },
    sharePageDataUrl () {
      if (this.sharePageUrl) {
        const qr = qrcode(0, 'L')
        qr.addData(this.sharePageUrl)
        qr.make()
        return qr.createDataURL(8, 8)
      }
      return ''
    },
    sourceLink () {
      const {
        repo,
        docsDir = '',
        docsBranch = 'master',
        docsRepo = repo
      } = this.$site.themeConfig
      if (docsRepo && this.$page.relativePath) {
        return this.createSourceLink(
          repo,
          docsRepo,
          docsDir,
          docsBranch,
          this.$page.relativePath
        )
      }
      return null
    },
    dialogWidth () {
      return this.$vuetify.breakpoint.xsOnly ? 320
        : this.$vuetify.breakpoint.smAndDown ? 400 : 500
    }
  },
  methods: {
    toTop () {
      this.$router.push({ hash: '' }).catch(() => {})
      this.$vuetify.goTo(0)
    },
    onShare () {
      this.shareDialog = true
    },
    onShareLink () {
      const selection = window.getSelection()
      const range = document.createRange()
      range.selectNodeContents(document.getElementById('share-page-link'))
      selection.removeAllRanges()
      selection.addRange(range)
      document.execCommand('Copy')
      selection.removeAllRanges()
      this.$root.$refs.layout.$refs.child.openSnackbar(
        this.$site.themeConfig.shareDialogLinkCopiedText || 'Success copyied page link')
      this.shareDialog = false
    },
    onShareQRCode () {
      const link = document.createElement('a')
      link.download = document.title
      link.href = this.sharePageDataUrl
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      this.shareDialog = false
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
