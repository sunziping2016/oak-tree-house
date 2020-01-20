<template>
  <v-content>
    <v-responsive
      class="mx-auto overflow-visible px-6"
      :max-width="contentWidth"
    >
      <v-container
        class="pa-0 mb-10"
      >
        <slot />
      </v-container>
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
