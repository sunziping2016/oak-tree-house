<template>
  <v-content>
    <v-responsive
      class="mx-auto overflow-visible px-4"
      max-width="960"
    >
      <v-container>
        <slot>
          <Content class="content" />
          <MainEdit />
          <MainNav />
          <div id="gitalk-container" />
        </slot>
      </v-container>
    </v-responsive>
  </v-content>
</template>

<script>
import MainEdit from './MainEdit'
import MainNav from './MainNav'

export default {
  components: { MainEdit, MainNav }
}
</script>
