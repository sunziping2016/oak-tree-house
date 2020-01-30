<template>
  <SidebarToc :items="items" />
</template>

<script>
import SidebarToc from '@theme/components/SidebarToc.vue'
import { indexHeading } from '../util'

export default {
  components: { SidebarToc },
  props: {
    pageName: {
      type: String,
      default: null
    }
  },
  computed: {
    items () {
      const items = [
        {
          id: this.$page.path,
          name: this.pageName,
          link: this.$page.path,
          top: true,
          children: []
        }
      ]
      const headings = []
      for (const page of this.$pagination.pages) {
        const heading = indexHeading(page, this.$site.themeConfig.indexHeading)
        if (!headings[headings.length - 1]
          || headings[headings.length - 1].heading !== heading) {
          headings.push({
            heading,
            children: [page]
          })
        } else {
          headings[headings.length - 1].children.push(page)
        }
      }
      for (const heading of headings) {
        const subItem = {
          id: `${this.$page.path}#_${heading.heading}`,
          name: heading.heading,
          link: `#_${heading.heading}`,
          parent: items[0],
          children: []
        }
        items[0].children.push(subItem)
        for (const page of heading.children) {
          subItem.children.push({
            id: page.path,
            name: page.title,
            link: page.path,
            parent: subItem,
            children: []
          })
        }
      }
      if (!this.$site.themeConfig.indexHeading) {
        items[0].children = items[0].children[0].children
      }
      return items
    }
  }
}
</script>
