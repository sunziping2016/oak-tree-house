<template>
  <Layout>
    <template #page-bottom>
      <div
        id="gitalk-container"
        class="content"
      />
    </template>
  </Layout>
</template>

<script>
import Layout from '@theme/layouts/Layout'

export default {
  components: { Layout }
}
</script>

<style lang="stylus">
.content
  max-width $contentWidth
  margin 0 auto
  padding 0 2.5rem
  @media (max-width: $MQNarrow)
    padding 0 2rem
  @media (max-width: $MQMobileNarrow)
    padding 0 1.5rem
</style>
