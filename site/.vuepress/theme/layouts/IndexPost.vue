<template>
  <div />
</template>

<script>
export default {
  mounted () {
    console.log('index mounted')
    this.$emit('ready')
  }
}
</script>

