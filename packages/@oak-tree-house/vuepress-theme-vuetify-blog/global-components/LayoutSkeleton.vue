<template>
  <MainContent>
    <v-container
      class="pa-6 mb-10"
    >
      <v-skeleton-loader type="article@3" />
    </v-container>
  </MainContent>
</template>

<script>
import MainContent from '@theme/components/MainContent.vue'

export default {
  components: {
    MainContent
  }
}
</script>
