<template>
  <div style="display: none">
    <ul>
      <li
        v-for="page in $pagination.pages"
        :key="page.path"
      >
        <a :href="page.path">
          {{ page.title }}
        </a>
      </li>
    </ul>
    <ul>
      <li
        v-for="i in $pagination.length"
        :key="i"
      >
        <a :href="$pagination.getSpecificPageLink(i - 1)">
          Page {{ i }}
        </a>
      </li>
    </ul>
  </div>
</template>
