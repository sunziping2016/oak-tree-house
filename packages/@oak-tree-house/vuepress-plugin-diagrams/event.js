import Vue from 'vue'

export default new Vue({
  data: () => ({
    sequenceDiagramsStatus: 0,  // 0 for not started, 1 for loading, 2 for loaded
    flowchartDiagramsStatus: 0
  })
})
