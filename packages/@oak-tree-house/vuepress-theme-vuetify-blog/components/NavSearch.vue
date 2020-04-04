<template>
  <v-responsive
    class="shrink app-search"
  >
    <v-text-field
      id="app-search-text-field"
      ref="search"
      v-model="search"
      :label="label"
      color="primary"
      dense
      flat
      hide-details
      prepend-inner-icon="mdi-magnify"
      rounded
      solo
      @blur="onBlur"
      @keydown.esc="onEsc"
    />
  </v-responsive>
</template>

<script>
export default {
  data: () => ({
    docSearch: {},
    label: '',
    search: ''
  }),
  watch: {
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
            inputSelector: '#app-search-text-field',
            handleSelected (input, event, suggestion) {
              const { pathname, hash } = new URL(suggestion.url)
              vm.$router.push(`${pathname}${hash}`)
            }
          }
        ))
      })
    },
    onBlur () {
      this.resetSearch()
    },
    onEsc () {
      this.$refs.search.blur()
    },
    resetSearch () {
      this.$nextTick(() => {
        this.search = ''
      })
    }
  }
}
</script>

<style lang="scss">
@import '~vuetify/src/styles/styles';

.app-search {
  overflow: visible !important;
}

#app-search-text-field {
  width: 12rem;
  transition: width $primary-transition;
}

@media #{map-get($display-breakpoints, 'sm-and-down')} {
  .app-search {
    :not(.v-input--is-focused) > .v-input__control > .v-input__slot {
      padding: 0 0 0 14px !important;
      background: rgba(255, 255, 255, 0) !important;
    }
  }
  #app-search-text-field {
    width: 0;
    &:focus {
      width: 12rem;
    }
  }
}

@media #{map-get($display-breakpoints, 'xs-only')} {
  #app-search-text-field {
    &:focus {
      width: 6rem;
    }
  }
  .app-search {
    .ds-dropdown-menu {
      min-width: calc(100vw - 32px) !important;
      max-width: calc(100vw - 32px) !important;
    }
  }
}

#app {
  .algolia-docsearch-suggestion--title {
    margin-bottom: 0;
  }

  .algolia-autocomplete {
    a {
      text-decoration: none !important;
    }

    & > span {
      @include elevation(8)
    }

    &:before, &:after {
      display: none;
    }

    .ds-dataset-1 {
      border: none !important;
    }
  }
}

</style>
