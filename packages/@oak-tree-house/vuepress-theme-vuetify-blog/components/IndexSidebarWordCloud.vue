<template>
  <v-container class="ma-1">
    <div
      class="font-weight-bold .subtitle-1 my-1"
    >
      {{ name }}
    </div>
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
  </v-container>
</template>

<script>
export default {
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

<style lang="scss">
.word-chip {
  &:hover {
    text-decoration: underline;
  }
}
</style>
