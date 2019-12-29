<template>
  <div
    class="theme-container"
    :class="pageClasses"
    @touchstart="onTouchStart"
    @touchend="onTouchEnd"
  >
    <Navbar
      v-if="shouldShowNavbar"
      @toggle-sidebar="toggleSidebar"
    />

    <div
      class="sidebar-mask"
      @click="toggleSidebar(false)"
    />

    <Sidebar
      :items="sidebarItems"
      @toggle-sidebar="toggleSidebar"
    >
      <template #top>
        <slot name="sidebar-top" />
      </template>
      <template #bottom>
        <slot name="sidebar-bottom" />
      </template>
    </Sidebar>

    <Home v-if="$page.frontmatter.home" />

    <Page
      v-else
      :sidebar-items="sidebarItems"
    >
      <template #top>
        <slot name="page-top" />
      </template>
      <template #bottom>
        <slot name="page-bottom" />
      </template>
    </Page>
  </div>
</template>

<script>
import Home from '@theme/components/Home.vue'
import Navbar from '@theme/components/Navbar.vue'
import Page from '@theme/components/Page.vue'
import Sidebar from '@theme/components/Sidebar.vue'
import { resolveSidebarItems } from '../util'

const pythonPromptStartHtml = '<span class="token operator">&gt;&gt;</span>'
  + '<span class="token operator">&gt;</span> '

export default {
  name: 'Layout',

  components: {
    Home,
    Page,
    Sidebar,
    Navbar
  },

  data () {
    return {
      isSidebarOpen: false
    }
  },

  computed: {
    shouldShowNavbar () {
      const { themeConfig } = this.$site
      const { frontmatter } = this.$page
      if (
        frontmatter.navbar === false
        || themeConfig.navbar === false) {
        return false
      }
      return (
        this.$title
        || themeConfig.logo
        || themeConfig.repo
        || themeConfig.nav
        || this.$themeLocaleConfig.nav
      )
    },

    shouldShowSidebar () {
      const { frontmatter } = this.$page
      function getSidebarLength (items) {
        let length = 0
        for (const item of items) {
          if (item.type === 'group') {
            length += getSidebarLength(item.children)
          } else {
            ++length
          }
        }
        return length
      }
      return (
        !frontmatter.home
        && frontmatter.sidebar !== false
        && getSidebarLength(this.sidebarItems)
      )
    },

    sidebarItems () {
      return resolveSidebarItems(
        this.$page,
        this.$page.regularPath,
        this.$site,
        this.$localePath
      )
    },

    pageClasses () {
      const userPageClass = this.$page.frontmatter.pageClass
      return [
        {
          'no-navbar': !this.shouldShowNavbar,
          'sidebar-open': this.isSidebarOpen,
          'no-sidebar': !this.shouldShowSidebar
        },
        userPageClass
      ]
    }
  },

  mounted () {
    this.$router.afterEach(() => {
      this.isSidebarOpen = false
    })
    // Detect Python interactive code blocks
    const candidateBlocks = [...document.querySelectorAll('div.language-python')]
    const blocks = candidateBlocks.filter(x => x.innerText.startsWith('>>> '))
    for (const block of blocks) {
      const copyButton = document.createElement('span')
      copyButton.classList.add('copy-button')
      copyButton.innerText = '>>>'
      block.prepend(copyButton)
      const innerBlock = block.querySelector('code')
      const innerHtmlWithPrompt = innerBlock.innerHTML
      const innerHTMLWithoutPrompt = innerHtmlWithPrompt.split('\n')
        .map(x => x.startsWith(pythonPromptStartHtml) ? x.slice(pythonPromptStartHtml.length) : '')
        .filter(x => x)
        .join('\n')
      let promptOn = true
      copyButton.addEventListener('click', () => {
        promptOn = !promptOn
        innerBlock.innerHTML = promptOn ? innerHtmlWithPrompt : innerHTMLWithoutPrompt
        copyButton.classList.toggle('copy-button-off', !promptOn)
      })
    }
  },

  methods: {
    toggleSidebar (to) {
      this.isSidebarOpen = typeof to === 'boolean' ? to : !this.isSidebarOpen
      this.$emit('toggle-sidebar', this.isSidebarOpen)
    },

    // side swipe
    onTouchStart (e) {
      this.touchStart = {
        x: e.changedTouches[0].clientX,
        y: e.changedTouches[0].clientY
      }
    },

    onTouchEnd (e) {
      const dx = e.changedTouches[0].clientX - this.touchStart.x
      const dy = e.changedTouches[0].clientY - this.touchStart.y
      if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 40) {
        if (dx > 0 && this.touchStart.x <= 80) {
          this.toggleSidebar(true)
        } else {
          this.toggleSidebar(false)
        }
      }
    }
  }
}
</script>

<style lang="stylus">
.copy-button
  position absolute
  z-index 3
  padding 0.8em 0.4em 0.2em
  right 3em
  font-size 0.75rem
  color rgba(255,255,255,0.4)
  cursor pointer
  border-left 1px solid rgba(255,255,255,0.4)
  border-right 1px solid rgba(255,255,255,0.4)
  border-bottom 1px solid rgba(255,255,255,0.4)
  border-radius 0 0 0.4em 0.4em
  &-off
    text-decoration line-through
</style>
