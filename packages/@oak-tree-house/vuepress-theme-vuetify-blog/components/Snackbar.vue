<template>
  <v-snackbar
    v-model="snackbar"
  >
    {{ snackbarText }}
    <v-btn
      color="accent"
      text
      @click="snackbar = false"
    >
      {{ $site.themeConfig.snackbarCloseText || 'close' }}
    </v-btn>
  </v-snackbar>
</template>

<script>
export default {
  data: () => ({
    snackbar: false,
    snackbarText: ''
  }),
  mounted () {
    this.$emit('ready')
  },
  methods: {
    openSnackbar (text) {
      this.snackbarText = text
      this.snackbar = true
    }
  }
}
</script>

