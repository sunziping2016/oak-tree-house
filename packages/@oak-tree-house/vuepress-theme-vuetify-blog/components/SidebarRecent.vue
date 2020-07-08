<template>
  <v-expansion-panels
    v-model="value"
    class="app-recently-updated"
    accordion
    flat
    tile
  >
    <v-expansion-panel>
      <v-expansion-panel-header
        class="font-weight-bold .subtitle-1"
      >
        {{ name }}
      </v-expansion-panel-header>
      <v-expansion-panel-content>
        <v-list
          dense
          flat
          rounded
        >
          <v-list-item
            v-for="page in pages"
            :key="page.path"
            :to="page.path"
          >
            <v-list-item-content>
              <v-list-item-title class="body-2">
                {{ page.title }}
              </v-list-item-title>
              <v-list-item-subtitle>
                {{ recentChip(page) }}
              </v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </v-expansion-panel-content>
    </v-expansion-panel>
  </v-expansion-panels>
</template>

<script>
import { recentChip } from '../util'

export default {
  data: () => ({
    value: 0
  }),
  computed: {
    name () {
      return this.$site.themeConfig.recentlyUpdatedName || 'Recently Updated'
    },
    pages () {
      const pages = this.$site.pages
        .filter(x => x.lastUpdated)
      pages.sort((a, b) => {
        const timeA = new Date(a.lastUpdated)
        const timeB = new Date(b.lastUpdated)
        return timeA > timeB ? -1 : timeA < timeB ? 1 : 0
      })
      return pages.slice(0, this.$site.themeConfig.recentlyUpdatedNumber || 5)
    }
  },
  methods: {
    recentChip (page) {
      return recentChip(page, this.$site.themeConfig.recentlyUpdatedChip
        || 'date.toLocaleString()')
    }
  }
}
</script>

<style lang="sass">
.app-recently-updated
  .v-expansion-panel-header
    padding: 0 16px
    min-height: 48px !important
  .v-expansion-panel-content__wrap
    padding: 0
</style>
