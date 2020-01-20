<template>
  <v-pagination
    :length="$pagination.length"
    :value="$pagination.paginationIndex + 1"
    @input="x => $router.push($pagination.getSpecificPageLink(x - 1)).catch(() => {})"
  />
</template>
