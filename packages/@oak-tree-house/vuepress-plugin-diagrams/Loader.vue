<template>
  <svg
    class="circular-loader"
    viewBox="25 25 50 50"
  >
    <circle
      class="loader-path"
      cx="50"
      cy="50"
      r="20"
      fill="none"
    />
  </svg>
</template>

<script>
export default {}
</script>

<style>
.circular-loader {
  animation: rotate 2s linear infinite;
  transform-origin: center center;
  height: 2em;
  width: 2em;
}

.loader-path {
  stroke-dasharray: 150, 200;
  stroke-dashoffset: -10;
  animation: dash 1.5s ease-in-out infinite;
  stroke: purple;
  stroke-linecap: round;
  stroke-width: 5;
}

@keyframes rotate {
  100% {
    -webkit-transform: rotate(360deg);
    transform: rotate(360deg);
  }
}

@keyframes dash {
  0% {
    stroke-dasharray: 1,200;
    stroke-dashoffset: 0;
  }
  50% {
    stroke-dasharray: 89,200;
    stroke-dashoffset: -35;
  }
  100% {
    stroke-dasharray: 89,200;
    stroke-dashoffset: -124;
  }
}
</style>
