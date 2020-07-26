<template>
  <v-snackbar
    v-model="snackbar"
  >
    {{ snackbarText }}
    <v-btn
      :color="snackbarButtonColor"
      text
      v-on="snackbarButtonAction ? { 'click': snackbarButtonAction } : {}"
    >
      {{ snackbarButtonText }}
    </v-btn>
  </v-snackbar>
</template>

<script>
export default {
  data: () => ({
    snackbar: false,
    snackbarText: '',
    snackbarButtonAction: null,
    snackbarButtonText: '',
    snackbarButtonColor: ''
  }),
  mounted () {
    this.$emit('ready')
  },
  methods: {
    openSnackbar (action) {
      if (typeof action === 'string') {
        action = { text: action }
      }
      this.snackbarText = action.text
      this.snackbarButtonAction = action.buttonAction || (() => {
        this.snackbar = false
      })
      this.snackbarButtonText = action.buttonText
        || this.$site.themeConfig.snackbarCloseText || 'close'
      this.snackbarButtonColor = action.buttonColor || 'red'
      if (this.snackbar === true) {
        this.snackbar = false
        this.$nextTick(() => {
          this.snackbar = true
        })
      } else {
        this.snackbar = true
      }
    }
  }
}
</script>
