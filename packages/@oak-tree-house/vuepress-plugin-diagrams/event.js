import Vue from 'vue'

export default new Vue({
  data: () => ({
    // 0 for not started, 1 for loading, 2 for loaded
    sequenceDiagramsStatus: 0,
    flowchartDiagramsStatus: 0,
    mermaidDiagramsStatus: 0
  })
})
