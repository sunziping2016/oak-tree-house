<template>
  <router-link
    :to="$localePath"
    class="d-flex align-center"
  >
    <v-img
      v-if="$site.themeConfig.logo"
      :alt="$siteTitle"
      class="shrink mr-2"
      contain
      :src="$withBase($site.themeConfig.logo)"
      transition="scale-transition"
      width="25"
    />
    <span
      v-if="$siteTitle"
      class="white--text headline mt-1 shrink"
    >{{ $siteTitle }}</span>
  </router-link>
</template>
