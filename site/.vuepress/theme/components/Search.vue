<template>
  <v-responsive
    class="mr-0 mr-md-6 shrink search-wrapper"
  >
    <v-text-field
      id="search"
      ref="search"
      v-model="search"
      :label="label"
      color="primary"
      dense
      flat
      hide-details
      prepend-inner-icon="mdi-magnify"
      rounded
      solo-inverted
      @blur="onBlur"
      @keydown.esc="onEsc"
    />
  </v-responsive>
</template>

<script>
export default {
  data: () => ({
    docSearch: {},
    isSearching: false,
    label: '',
    search: ''
  }),
  watch: {
    isSearching (val) {
      if (val) {
        this.$refs.search.focus()
        return
      }
      this.resetSearch()
    },
    search (val) {
      if (val) return
      this.docSearch.autocomplete.autocomplete.close()
      this.docSearch.autocomplete.autocomplete.setVal('')
    }
  },
  mounted () {
    this.label = this.$site.themeConfig.searchPlaceholder || ''
    this.initialize()
  },
  beforeDestroy () {
    document.onkeydown = null
    this.docSearch.autocomplete.autocomplete.close()
    this.docSearch.autocomplete.autocomplete.setVal('')
  },
  methods: {
    initialize () {
      const vm = this
      Promise.all([
        import(/* webpackChunkName: "docsearch" */ 'docsearch.js/dist/cdn/docsearch.min.js'),
        import(/* webpackChunkName: "docsearch" */ 'docsearch.js/dist/cdn/docsearch.min.css')
      ]).then(([docsearch]) => {
        docsearch = docsearch.default
        vm.docSearch = docsearch(Object.assign(
          {},
          vm.$site.themeConfig.algolia,
          {
            debug: true,
            inputSelector: '#search',
            handleSelected (input, event, suggestion) {
              const { pathname, hash } = new URL(suggestion.url)
              vm.$router.push(`${pathname}${hash}`)
            }
          }
        ))
      })
    },
    onBlur () {
      // this.resetSearch()
    },
    onEsc () {
      this.$refs.search.blur()
    },
    resetSearch () {
      this.$nextTick(() => (this.search = undefined))
    }
  }
}
</script>

<style lang="stylus">
.search-wrapper
  overflow visible

.v-input--is-focused>.v-input__control>.v-input__slot
  background #fff !important

#search
  width 10rem
  transition width 0.3s cubic-bezier(0.25, 0.8, 0.5, 1)

@media (max-width: 960px)
  .search-wrapper
    .v-input__slot
      padding 0 0 0 14px !important
      background hsla(0,0%,100%,0) !important
  #search
    width 0
    &:focus
      width 10rem

@media (max-width: 600px)
  #search:focus
    width 8rem
  .search-wrapper
    .ds-dropdown-menu
      min-width calc(100vw - 32px) !important
      max-width calc(100vw - 32px) !important

#app
  .algolia-docsearch-suggestion--title
    margin-bottom: 0
  .algolia-autocomplete
    a
      text-decoration: none !important
    &>span
      box-shadow: 0 5px 5px -3px rgba(0, 0, 0, 0.2), 0 8px 10px 1px rgba(0, 0, 0, 0.14), 0 3px 14px 2px rgba(0, 0, 0, 0.12) !important
    &:before, &:after
      display: none
    .ds-dataset-1
      border: none !important
</style>
