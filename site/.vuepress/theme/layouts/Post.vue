<template>
  <Layout>
    <template #page-bottom>
      <div id="gitalk-container"
           class="content"
      ></div>
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
</style>
