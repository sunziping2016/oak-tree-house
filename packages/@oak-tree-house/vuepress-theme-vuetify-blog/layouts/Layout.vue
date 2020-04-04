<template>
  <MainContent
    :content-width="contentWidth"
  >
    <slot>
      <v-container
        class="pa-6 mb-10"
      >
        <h1
          style="display: none"
        >
          {{ $page.frontmatter.title }}
        </h1>
        <Content class="content" />
        <ClientOnly>
          <MainEdit />
          <MainNav />
        </ClientOnly>
        <div id="gitalk-container" />
      </v-container>
    </slot>
  </MainContent>
</template>

<script>
import MainContent from '@theme/components/MainContent.vue'
import MainEdit from '@theme/components/MainEdit.vue'
import MainNav from '@theme/components/MainNav.vue'
import event from '@theme-event'

export default {
  components: {
    MainContent,
    MainEdit,
    MainNav
  },
  props: {
    contentWidth: {
      type: Number,
      default: 960
    }
  },
  mounted () {
    event.$emit('contentReady')
  }
}
</script>
