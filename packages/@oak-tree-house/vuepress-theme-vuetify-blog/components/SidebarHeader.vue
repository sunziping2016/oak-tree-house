<template>
  <div class="app-sidebar-header">
    <v-img
      v-if="background"
      :src="$withBase(background)"
      eager
    />
    <v-avatar
      v-if="avatar"
      :size="64"
      class="ma-4"
    >
      <img
        :src="$withBase(avatar)"
        alt="Avatar"
      >
    </v-avatar>
    <!-- eslint-disable vue/no-v-html -->
    <div
      v-if="bio"
      class="app-sidebar-header-bio ma-4"
      v-html="bio"
    />
  </div>
</template>

<script>
export default {
  computed: {
    avatar () {
      return this.$site.themeConfig.sidebarHeader && this.$site.themeConfig.sidebarHeader.avatar
    },
    background () {
      return this.$site.themeConfig.sidebarHeader && this.$site.themeConfig.sidebarHeader.background
    },
    bio () {
      return this.$site.themeConfig.sidebarHeader && this.$site.themeConfig.sidebarHeader.bio
    }
  }
}
</script>

<style lang="scss">
.app-sidebar-header {
  position: relative;
  height: 200px;
  & > .v-image {
    position: absolute;
    height: 100%;
  }
  & > .app-sidebar-header-bio {
    position: absolute;
    bottom: 0;
    color: #fff;
    text-shadow: black 0.1em 0.1em 0.2em;
  }
}
</style>
