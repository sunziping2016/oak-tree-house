<template>
  <div
    :style="{
      position: 'relative',
      width: `${width * 100}%`,
      margin: '0 auto',
      paddingTop: `${width * aspectRatio * 100}%`
    }"
  >
    <iframe
      :src="`//player.bilibili.com/player.html?aid=${aid}&cid=${cid}&page=1`"
      allowfullscreen
      style="position:absolute;top:0;left:0;width:100%;height:100%;border:none;"
    />
  </div>
</template>

<script>
export default {
  props: {
    aid: {
      type: String,
      required: true
    },
    cid: {
      type: String,
      required: true
    },
    width: {
      type: Number,
      default: 1
    },
    aspectRatio: {
      type: Number,
      default: 0.5625
    }
  }
}
</script>
