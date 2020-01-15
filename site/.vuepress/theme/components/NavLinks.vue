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
          <template v-for="(menuItem, index) in item.items">
            <v-divider
              v-if="index !== 0 && menuItem.subheader"
              :key="`${menuItem.text}-divider`"
            />
            <v-subheader
              v-if="menuItem.subheader"
              :key="menuItem.text"
              v-text="menuItem.text"
            />
            <v-list-item
              v-else
              :key="menuItem.text"
              :to="isExternal(menuItem.link) ? undefined : menuItem.link"
              :href="isExternal(menuItem.link) ? menuItem.link : undefined"
              :target="!isExternal(menuItem.link) || isMailto(menuItem.link) || isTel(menuItem.link) ? undefined : '_blank'"
              color="primary"
              ripple
            >
              <v-list-item-avatar
                v-if="menuItem.avatar"
                :color="menuItem.avatarColor"
              >
                <v-icon
                  dark
                  v-text="menuItem.avatar"
                />
              </v-list-item-avatar>
              <v-list-item-icon v-else-if="menuItem.icon">
                <v-icon v-text="menuItem.icon" />
              </v-list-item-icon>
              <v-list-item-content>
                <v-list-item-title>
                  <span v-text="menuItem.text" />
                  <v-icon
                    v-if="isExternal(menuItem.link)"
                    x-small
                  >
                    mdi-open-in-new
                  </v-icon>
                </v-list-item-title>
                <v-list-item-subtitle v-if="menuItem.subtext">
                  <span v-text="menuItem.subtext" />
                </v-list-item-subtitle>
              </v-list-item-content>
              <v-chip
                v-if="menuItem.chip"
                :color="menuItem.chipColor"
                x-small
                text-color="white"
              >
                {{ chip }}
              </v-chip>
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
