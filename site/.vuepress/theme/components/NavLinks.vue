<template>
  <nav>
    <template v-for="item in $site.themeConfig.nav">
      <v-menu
        v-if="item.type === 'menu'"
        :key="item.text"
        bottom
        left
        max-height="calc(100% - 16px)"
        offset-y
        transition="slide-y-transition"
      >
        <template v-slot:activator="{ attrs, on }">
          <v-btn
            text
            v-bind="attrs"
            v-on="on"
          >
            <span class="subtitle-1 font-weight-light">
              {{ item.text }}
            </span>
            <v-icon
              right
            >
              mdi-menu-down
            </v-icon>
          </v-btn>
        </template>

        <v-list
          dense
          nav
        >
          <template v-for="(subItem, index) in item.items">
            <v-divider
              v-if="index !== 0 && subItem.subheader"
              :key="`${subItem.text}-divider`"
            />
            <v-subheader
              v-if="subItem.subheader"
              :key="subItem.text"
              v-text="subItem.text"
            />
            <v-list-item
              v-else
              :key="subItem.text"
              :to="isExternal(subItem.link) ? undefined : subItem.link"
              :href="isExternal(subItem.link) ? subItem.link : undefined"
              :target="!isExternal(subItem.link) || isMailto(subItem.link) || isTel(subItem.link) ? undefined : '_blank'"
              color="primary"
              ripple
            >
              <v-list-item-icon v-if="subItem.icon">
                <v-icon v-text="subItem.icon" />
              </v-list-item-icon>
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
          </template>
        </v-list>
      </v-menu>
      <v-btn
        v-else
        :key="item.text"
        :to="isExternal(item.link) ? undefined : item.link"
        :href="isExternal(item.link) ? item.link : undefined"
        :target="!isExternal(item.link) || isMailto(item.link) || isTel(item.link) ? undefined : '_blank'"
        text
      >
        {{ item.text }}
      </v-btn>
    </template>
  </nav>
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
