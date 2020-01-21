<template>
  <v-content>
    <v-responsive
      class="mx-auto overflow-auto"
      :max-width="contentWidth"
    >
      <slot />
    </v-responsive>
  </v-content>
</template>

<script>
export default {
  props: {
    contentWidth: {
      type: Number,
      default: 960
    }
  }
}
</script>
