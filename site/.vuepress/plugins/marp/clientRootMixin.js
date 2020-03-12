// /* global MARP_PAGE_TEXT */
import './style.css'

export default {
  data: () => ({
    // element of marpitSections is:
    // {
    //   dom: REAL_SECTION_DOM,
    //   mock: MOCK_SECTION_DOM,
    //   status: 'NOT_PLAY' | 'PLAY' | 'LEFT' | 'RIGHT' |
    //           'ENTER' | 'LEAVE' | 'SLIDE_LEFT' | 'SLIDE_RIGHT'
    //   transitionEnd: TRANSITION_END
    // }
    marpitSections: [],
    marpitMask: {
      dom: null,
      status: 'NOT_PLAY', // 'NOT_PLAY' | 'PLAY' | 'ENTER' | 'LEAVE'
      transitionEnd: null
    },
    // Index of section where status is 'PLAY'
    marpitPlaying: null
  }),
  mounted () {
    this.triggerUpdateMarp()
    this.$router.afterEach((to, from) => {
      if (from.path !== to.path) {
        this.$nextTick(() => {
          this.triggerUpdateMarp()
        })
      }
    })
    window.addEventListener('keyup', this.marpitOnKeyUp)
    this.marpitMask.dom = document.createElement('div')
    this.marpitMask.dom.classList.add('marpit-mask')
    this.marpitMask.dom.style.display = 'none'
    this.marpitMask.status = 'NOT_PLAY'
    document.body.appendChild(this.marpitMask.dom)
  },
  beforeDestroy () {
    window.removeEventListener('keyup', this.marpitOnKeyUp)
    document.body.removeChild(this.marpitMask.dom)
  },
  watch: {
    '$route.query.marpit' () {
      this.updateMarpitRoute()
    }
    // 'marpitMask.status' () {
    //   console.log('marpitMask.status', this.marpitMask.status)
    // },
    // 'marpitMask.transitionEnd' () {
    //   console.log('marpitMask.transitionEnd', !!this.marpitMask.transitionEnd)
    // }
    // 'marpitSections': {
    //   deep: true,
    //   handler () {
    //     console.log(this.marpitSections.map(x => x.status))
    //   }
    // }
  },
  methods: {
    marpitMaskCancelTransitionHook () {
      if (this.marpitMask.status === 'ENTER'
        || this.marpitMask.status === 'LEAVE') {
        this.marpitMask.dom.removeEventListener(
          'transitionend', this.marpitMask.transitionEnd)
        this.marpitMask.transitionEnd = null
      }
    },
    marpitMaskAddTransitionHookOnce (func) {
      this.marpitMask.transitionEnd = () => {
        func()
        this.marpitMask.dom.removeEventListener(
          'transitionend', this.marpitMask.transitionEnd)
        this.marpitMask.transitionEnd = null
      }
      this.marpitMask.dom.addEventListener(
        'transitionend', this.marpitMask.transitionEnd)
    },
    marpitSectionCancelTransitionHook (section) {
      // console.log(this.marpitSections.indexOf(section), section.status, 'hook to be removed')
      if (section.status === 'ENTER' || section.status === 'LEAVE'
        || section.status === 'SLIDE_LEFT' || section.status === 'SLIDE_RIGHT') {
        // console.log(this.marpitSections.indexOf(section), section.status, 'hook removed')
        section.dom.removeEventListener(
          'transitionend', section.transitionEnd)
        section.transitionEnd = null
      }
    },
    marpitSectionAddTransitionHookOnce (section, func) {
      section.transitionEnd = () => {
        // console.log(this.marpitSections.indexOf(section), 'hook called')
        func()
        section.dom.removeEventListener(
          'transitionend', section.transitionEnd)
        section.transitionEnd = null
      }
      section.dom.addEventListener(
        'transitionend', section.transitionEnd)
    },
    // status should be: 'NOT_PLAY' | 'PLAY' | 'LEFT' | 'RIGHT'
    marpitSectionChangeStatus (section, status) {
      if (section.status === status
        || (section.status === 'ENTER' && status === 'PLAY')
        || (section.status === 'LEAVE' && status === 'NOT_PLAY')
        || (section.status === 'SLIDE_LEFT' && status === 'LEFT')
        || (section.status === 'SLIDE_RIGHT' && status === 'RIGHT')
      ) {
        return
      }
      // if (status !== 'PLAY' && status !== 'NOT_PLAY') {
      //   return
      // }
      // console.log(this.marpitSections.indexOf(section), status)
      this.marpitSectionCancelTransitionHook(section)
      const applyTargetStatus = () => {
        if (status === 'NOT_PLAY') {
          section.status = 'LEAVE'
          const domRect = section.mock.getBoundingClientRect()
          section.dom.style.top = `${domRect.top}px`
          section.dom.style.left = `${domRect.left}px`
          section.dom.style.width = `${domRect.width}px`
          section.dom.style.height = `${domRect.height}px`
          this.marpitSectionAddTransitionHookOnce(section, () => {
            // console.log(this.marpitSections.indexOf(section), 'hook called')
            section.dom.style.top = null
            section.dom.style.left = null
            section.dom.style.width = null
            section.dom.style.height = null
            section.dom.classList.remove('marpit-section-status-except-not-play')
            section.mock.style.display = 'none'
            section.status = 'NOT_PLAY'
          })
        } else {
          if (status === 'PLAY') {
            section.dom.classList.add('marpit-section-status-play')
            section.status = 'ENTER'
          } else if (status === 'LEFT') {
            section.dom.classList.add('marpit-section-status-left')
            section.status = 'SLIDE_LEFT'
          } else if (status === 'RIGHT') {
            section.dom.classList.add('marpit-section-status-right')
            section.status = 'SLIDE_RIGHT'
          }
          this.marpitSectionAddTransitionHookOnce(section, () => {
            section.status = status
          })
        }
      }
      if (section.status === 'NOT_PLAY') {
        const domRect = section.dom.getBoundingClientRect()
        section.dom.style.top = `${domRect.top}px`
        section.dom.style.left = `${domRect.left}px`
        section.dom.style.width = `${domRect.width}px`
        section.dom.style.height = `${domRect.height}px`
        section.mock.style.display = null
        section.dom.classList.add('marpit-section-status-except-not-play')
        setTimeout(() => {
          section.dom.style.top = null
          section.dom.style.left = null
          section.dom.style.width = null
          section.dom.style.height = null
          applyTargetStatus()
        })
      } else {
        const oldStatus = section.status
        applyTargetStatus()
        setTimeout(() => {
          if (oldStatus === 'PLAY' || oldStatus === 'ENTER') {
            section.dom.classList.remove('marpit-section-status-play')
          } else if (oldStatus === 'LEFT' || oldStatus === 'SLIDE_LEFT') {
            section.dom.classList.remove('marpit-section-status-left')
          } else if (oldStatus === 'RIGHT' || oldStatus === 'SLIDE_RIGHT') {
            section.dom.classList.remove('marpit-section-status-right')
          }
        })
      }
    },
    updateMarpitRoute () {
      let newMarpitPlaying = parseInt(this.$route.query.marpit, 10)
      if (isNaN(newMarpitPlaying)) {
        newMarpitPlaying = null
      }
      if (newMarpitPlaying === this.marpitPlaying
        || (newMarpitPlaying !== null && !this.marpitSections[newMarpitPlaying])) {
        return
      }
      if (newMarpitPlaying === null) {
        // ==== Playing -> Not playing ====
        // Mask animation
        this.marpitMaskCancelTransitionHook()
        this.marpitMask.status = 'LEAVE'
        this.marpitMask.dom.classList.remove('marpit-mask-status-play')
        this.marpitMaskAddTransitionHookOnce(() => {
          this.marpitMask.status = 'NOT_PLAY'
          this.marpitMask.dom.style.display = 'none'
        })
        this.marpitSections.forEach((section) => {
          this.marpitSectionChangeStatus(section, 'NOT_PLAY')
        })
      } else if (this.marpitPlaying === null) {
        // ==== Not Playing -> Playing ====
        // Mask animation
        this.marpitMaskCancelTransitionHook()
        this.marpitMask.dom.style.display = null
        setTimeout(() => {
          this.marpitMask.status = 'ENTER'
          this.marpitMask.dom.classList.add('marpit-mask-status-play')
          this.marpitMaskAddTransitionHookOnce(() => {
            this.marpitMask.status = 'PLAY'
          })
        })
        // Slides animation
        this.marpitSections.forEach((section, index) => {
          this.marpitSectionChangeStatus(section,
            index < newMarpitPlaying ? 'LEFT'
              : index > newMarpitPlaying ? 'RIGHT' : 'PLAY'
          )
          // this.marpitSectionChangeStatus(section,
          //   index === newMarpitPlaying ? 'PLAY'
          //     : index === newMarpitPlaying - 1 ? 'LEFT'
          //       : index === newMarpitPlaying + 1 ? 'RIGHT' : 'NOT_PLAY'
          // )
        })
      } else {
        // ==== Change section ====
        this.marpitSections.forEach((section, index) => {
          this.marpitSectionChangeStatus(section,
            index < newMarpitPlaying ? 'LEFT'
              : index > newMarpitPlaying ? 'RIGHT' : 'PLAY'
          )
          // this.marpitSectionChangeStatus(section,
          //   index === newMarpitPlaying ? 'PLAY'
          //     : index === newMarpitPlaying - 1 ? 'LEFT'
          //       : index === newMarpitPlaying + 1 ? 'RIGHT' : 'NOT_PLAY'
          // )
        })
      }
      this.marpitPlaying = newMarpitPlaying
    },
    marpitOnKeyUp (event) {
      if (this.marpitPlaying === null) {
        return
      }
      if (event.code === 'ArrowLeft') {
        if (this.marpitSections[this.marpitPlaying - 1]) {
          this.$router.push({ query: { marpit: this.marpitPlaying - 1 }})
        }
      } else if (event.code === 'ArrowRight') {
        if (this.marpitSections[this.marpitPlaying + 1]) {
          this.$router.push({ query: { marpit: this.marpitPlaying + 1 }})
        }
      } else if (event.code === 'Escape') {
        this.$router.push({ query: {}})
      }
    },
    triggerUpdateMarp () {
      if (this.ready) {
        this.updateMarp()
      } else {
        this.$once('ready', this.updateMarp)
      }
    },
    updateMarp () {
      // Remove all mocked sections
      [...document.querySelectorAll('div.marpit > svg[data-marpit-mock]')].forEach(x => {
        x.parentNode.removeChild(x)
      })
      const realSections = [...document.querySelectorAll('div.marpit > svg')]
      this.marpitSections = []
      for (let i = 0; i < realSections.length; ++i) {
        const realSection = realSections[i]
        const mockSection = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
        mockSection.dataset.marpitMock = ''
        mockSection.setAttribute('viewBox', realSection.getAttribute('viewBox'))
        mockSection.dataset.marpitSvg = ''
        mockSection.style.display = 'none'
        realSection.parentNode.insertBefore(mockSection, realSection)
        if (realSection.dataset.marpitReal === undefined) {
          realSection.dataset.marpitReal = ''
          // TODO: change to add buttons
          realSection.addEventListener('click', (event) => {
            const marpit = parseInt(this.$route.query.marpit, 10)
            if (marpit !== i) {
              this.$router.push({ query: { marpit: i }})
            }
          })
        }
        this.marpitSections.push({
          dom: realSection,
          mock: mockSection,
          status: 'NOT_PLAY'
        })
      }
      this.updateMarpitRoute()
    }
  }
}
