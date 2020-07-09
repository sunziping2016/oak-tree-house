<template>
  <v-list
    dense
    class="sidebar-links"
  >
    <template v-for="item in $site.themeConfig.nav">
      <v-list-group
        v-if="item.type === 'menu'"
        :key="item.text"
        :prepend-icon="item.icon"
        no-action
      >
        <template v-slot:activator>
          <v-list-item-content>
            <v-list-item-title v-text="item.text" />
          </v-list-item-content>
        </template>
        <v-list-item
          v-for="subItem in item.items.filter(x => !x.subheader)"
          :key="subItem.text"
          :to="isExternal(subItem.link) ? undefined : subItem.link"
          :href="isExternal(subItem.link) ? subItem.link : undefined"
          :target="!isExternal(subItem.link) || isMailto(subItem.link) || isTel(subItem.link) ? undefined : '_blank'"
        >
          <v-list-item-content>
            <v-list-item-title>
              <span v-text="subItem.text" />
              <v-icon
                v-if="isExternal(subItem.link)"
                x-small
              >
                mdi-open-in-new
              </v-icon>
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list-group>
      <v-list-item
        v-else
        :key="item.text"
        :to="isExternal(item.link) ? undefined : item.link"
        :href="isExternal(item.link) ? item.link : undefined"
        :target="!isExternal(item.link) || isMailto(item.link) || isTel(item.link) ? undefined : '_blank'"
      >
        <v-list-item-icon v-if="item.icon">
          <v-icon v-text="item.icon" />
        </v-list-item-icon>
        <v-list-item-content>
          <v-list-item-title>
            <span v-text="item.text" />
            <v-icon
              v-if="isExternal(item.link)"
              x-small
            >
              mdi-open-in-new
            </v-icon>
          </v-list-item-title>
        </v-list-item-content>
      </v-list-item>
    </template>
  </v-list>
</template>

<script>
import { isExternal, isMailto, isTel } from '../util'

export default {
  methods: {
    isExternal,
    isMailto,
    isTel
  }
}
</script>

<style lang="scss">
.sidebar-links {
  .v-list-item {
    min-height: 45px;
  }
  .v-list-item__title {
    font-size: 1rem !important;
  }
}
</style>
