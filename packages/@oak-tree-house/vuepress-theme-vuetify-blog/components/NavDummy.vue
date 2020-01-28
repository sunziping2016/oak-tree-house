<template>
  <nav style="display: none">
    <ul
      v-for="item in $site.themeConfig.nav"
      :key="item.text"
    >
      <li
        :key="item.text"
      >
        <ul
          v-if="item.type === 'menu'"
        >
          <li
            v-for="subItem in item.items.filter(x => !x.subheader)"
            :key="subItem.text"
          >
            <a :href="subItem.link">{{ subItem.text }}</a>
          </li>
        </ul>
        <a
          v-else
          :href="item.link"
        >
          {{ item.text }}
        </a>
      </li>
    </ul>
  </nav>
</template>
