<template>
  <v-expansion-panels
    v-model="value"
    class="app-word-cloud"
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
        <div
          class="d-flex flex-wrap"
        >
          <v-chip
            v-for="word in words"
            :key="word.name"
            :to="word.path"
            class="ma-1 word-chip"
            outlined
            color="primary"
          >
            {{ word.name }}
          </v-chip>
        </div>
      </v-expansion-panel-content>
    </v-expansion-panel>
  </v-expansion-panels>
</template>

<script>
export default {
  data: () => ({
    value: 0
  }),
  computed: {
    name () {
      return this.$site.themeConfig.wordCloudName || 'Tag Cloud'
    },
    words () {
      return this[`\$${this.$site.themeConfig.wordCloudFrontmatter || 'tag'}`].toArray()
    }
  }
}
</script>

<style lang="sass">
.app-word-cloud
  .v-expansion-panel-header
    padding: 0 16px
    min-height: 48px !important
  .v-expansion-panel-content__wrap
    padding: 0 16px 16px
  .word-chip
    &:hover
      text-decoration: underline
</style>
