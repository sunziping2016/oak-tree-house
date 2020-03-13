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
    marpitPlaying: null,
    marpitDock: null,
    marpitFirstButton: null,
    marpitPrevButton: null,
    marpitPageText: null,
    marpitNextButton: null,
    marpitLastButton: null,
    marpitFullscreenButton: null,
    marpitExitPlayButton: null,
    marpitMouseMoveTimeoutTime: 5000,
    marpitMouseMoveTimeout: null,
    marpitTouchPos: null,
    marpitSavedScrollPos: NaN,
    marpitExpectedPlaying: null
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
    this.$on('updated', this.triggerUpdateMarp)
    this.marpitMask.dom = document.createElement('div')
    this.marpitMask.dom.classList.add('marpit-mask')
    this.marpitMask.dom.style.display = 'none'
    this.marpitMask.status = 'NOT_PLAY'
    document.body.appendChild(this.marpitMask.dom)
    this.marpitDock = document.createElement('div')
    this.marpitDock.classList.add('marpit-dock')
    this.marpitDock.classList.add('marpit-dock-disabled')
    this.marpitFirstButton = document.createElement('span')
    this.marpitFirstButton.classList.add('marpit-dock-first-button')
    this.marpitFirstButton.innerHTML = '<i class="mdi mdi-chevron-double-left"></i>'
    this.marpitDock.appendChild(this.marpitFirstButton)
    this.marpitPrevButton = document.createElement('span')
    this.marpitPrevButton.classList.add('marpit-dock-prev-button')
    this.marpitPrevButton.innerHTML = '<i class="mdi mdi-chevron-left"></i>'
    this.marpitDock.appendChild(this.marpitPrevButton)
    this.marpitPageText = document.createElement('span')
    this.marpitPageText.classList.add('marpit-dock-page-text')
    this.marpitDock.appendChild(this.marpitPageText)
    this.marpitNextButton = document.createElement('span')
    this.marpitNextButton.classList.add('marpit-dock-next-button')
    this.marpitNextButton.innerHTML = '<i class="mdi mdi-chevron-right"></i>'
    this.marpitDock.appendChild(this.marpitNextButton)
    this.marpitLastButton = document.createElement('span')
    this.marpitLastButton.classList.add('marpit-dock-last-button')
    this.marpitLastButton.innerHTML = '<i class="mdi mdi-chevron-double-right"></i>'
    this.marpitDock.appendChild(this.marpitLastButton)
    this.marpitFullscreenButton = document.createElement('span')
    this.marpitFullscreenButton.classList.add('marpit-dock-fullscreen-button')
    this.marpitFullscreenButton.innerHTML = '<i class="mdi mdi-fullscreen"></i>'
    this.marpitDock.appendChild(this.marpitFullscreenButton)
    this.marpitExitPlayButton = document.createElement('span')
    this.marpitExitPlayButton.classList.add('marpit-dock-exit-button')
    this.marpitExitPlayButton.innerHTML = '<i class="mdi mdi-exit-to-app"></i>'
    this.marpitDock.appendChild(this.marpitExitPlayButton)
    this.marpitFirstButton.addEventListener('click', () => {
      if (this.marpitSections.length && this.marpitExpectedPlaying !== 0) {
        this.marpitApplyPlaying(0)
      }
    })
    this.marpitPrevButton.addEventListener('click', () => {
      if (this.marpitExpectedPlaying !== null && this.marpitExpectedPlaying > 0) {
        this.marpitApplyPlaying(this.marpitExpectedPlaying - 1)
      }
    })
    this.marpitNextButton.addEventListener('click', () => {
      if (this.marpitExpectedPlaying !== null && this.marpitExpectedPlaying + 1 < this.marpitSections.length) {
        this.marpitApplyPlaying(this.marpitExpectedPlaying + 1)
      }
    })
    this.marpitLastButton.addEventListener('click', () => {
      if (this.marpitSections.length && this.marpitExpectedPlaying !== this.marpitSections.length - 1) {
        this.marpitApplyPlaying(this.marpitSections.length - 1)
      }
    })
    this.marpitFullscreenButton.addEventListener('click', () => {
      if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen()
          .then(() => {
            this.marpitFullscreenButton.innerHTML = '<i class="mdi mdi-fullscreen-exit"></i>'
          })
      } else {
        if (document.exitFullscreen) {
          document.exitFullscreen()
            .then(() => {
              this.marpitFullscreenButton.innerHTML = '<i class="mdi mdi-fullscreen"></i>'
            })
        }
      }
    })
    this.marpitExitPlayButton.addEventListener('click', () => {
      if (this.marpitExpectedPlaying !== null) {
        this.marpitApplyPlaying(null)
      }
    })
    document.body.appendChild(this.marpitDock)
    document.addEventListener('keyup', this.marpitOnKeyUp)
  },
  beforeDestroy () {
    document.removeEventListener('keyup', this.marpitOnKeyUp)
    document.body.removeChild(this.marpitMask.dom)
    document.body.removeChild(this.marpitDock)
  },
  watch: {
    marpitExpectedPlaying () {
      this.updateMarpitRoute()
    }
  },
  computed: {
    // marpitExpectedPlaying () {
    //   let newMarpitPlaying = parseInt(this.$route.query.marpit, 10)
    //   if (isNaN(newMarpitPlaying)) {
    //     newMarpitPlaying = null
    //   }
    //   return newMarpitPlaying
    // }
  },
  methods: {
    marpitApplyPlaying (newPlaying) {
      // if (newPlaying === null) {
      //   this.$router.push({ query: {}})
      // } else {
      //   this.$router.push({ query: { marpit: newPlaying }})
      // }
      this.marpitExpectedPlaying = newPlaying
    },
    marpitOnMouseMove (evt) {
      // Prevent receive mouse moving event on touching
      if (evt.movementX === 0 && evt.movementY === 0) {
        return
      }
      this.marpitDock.classList.remove('marpit-dock-disabled')
      this.marpitResetMouseMoveTimeout()
    },
    marpitOnTouchStart (evt) {
      const firstTouch = evt.touches[0]
      this.marpitTouchPos = {
        x: firstTouch.clientX,
        y: firstTouch.clientY
      }
    },
    marpitOnTouchMove (evt) {
      // Disable vertical scroll
      evt.preventDefault()
    },
    marpitOnTouchEnd (evt) {
      if (!this.marpitTouchPos) {
        return
      }
      const xDiff = this.marpitTouchPos.x - evt.changedTouches[0].clientX
      const yDiff = this.marpitTouchPos.y - evt.changedTouches[0].clientY
      if (xDiff === 0 && yDiff === 0) {
        this.marpitDock.classList.remove('marpit-dock-disabled')
        this.marpitResetMouseMoveTimeout()
      } else if (Math.abs(xDiff) > Math.abs(yDiff)) {
        if (xDiff > 0) {
          if (this.marpitExpectedPlaying !== null && this.marpitExpectedPlaying + 1 < this.marpitSections.length) {
            this.marpitApplyPlaying(this.marpitExpectedPlaying + 1)
          }
        } else {
          if (this.marpitExpectedPlaying !== null && this.marpitExpectedPlaying > 0) {
            this.marpitApplyPlaying(this.marpitExpectedPlaying - 1)
          }
        }
      }
      this.marpitTouchPos = null
    },
    marpitOnScroll () {
      const i = Math.round(pageYOffset / innerHeight)
      if (this.marpitExpectedPlaying !== i) {
        this.marpitApplyPlaying(i)
      }
    },
    marpitResetMouseMoveTimeout () {
      if (this.marpitMouseMoveTimeout) {
        clearTimeout(this.marpitMouseMoveTimeout)
      }
      this.marpitMouseMoveTimeout = setTimeout(() => {
        this.marpitDock.classList.add('marpit-dock-disabled')
      }, this.marpitMouseMoveTimeoutTime)
    },
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
      if (section.status === 'ENTER' || section.status === 'LEAVE'
        || section.status === 'SLIDE_LEFT' || section.status === 'SLIDE_RIGHT') {
        section.dom.removeEventListener(
          'transitionend', section.transitionEnd)
        section.transitionEnd = null
      }
    },
    marpitSectionAddTransitionHookOnce (section, func) {
      section.transitionEnd = () => {
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
      this.marpitSectionCancelTransitionHook(section)
      const applyTargetStatus = () => {
        if (status === 'NOT_PLAY') {
          if (section.status === 'LEFT' || section.status === 'RIGHT') {
            section.dom.classList.remove('marpit-section-status-except-not-play')
            section.mock.style.display = 'none'
            section.status = 'NOT_PLAY'
          } else {
            section.status = 'LEAVE'
            const domRect = section.mock.getBoundingClientRect()
            section.dom.style.top = `${domRect.top}px`
            section.dom.style.left = `${domRect.left}px`
            section.dom.style.width = `${domRect.width}px`
            section.dom.style.height = `${domRect.height}px`
            this.marpitSectionAddTransitionHookOnce(section, () => {
              section.dom.style.top = null
              section.dom.style.left = null
              section.dom.style.width = null
              section.dom.style.height = null
              section.dom.classList.remove('marpit-section-status-except-not-play')
              section.mock.style.display = 'none'
              section.status = 'NOT_PLAY'
            })
          }
        } else if (status === 'PLAY') {
          section.dom.classList.add('marpit-section-status-play')
          section.status = 'ENTER'
          this.marpitSectionAddTransitionHookOnce(section, () => {
            scrollTo(pageXOffset, window.innerHeight * this.marpitSections.indexOf(section))
            section.status = 'PLAY'
          })
        } else {
          if (status === 'LEFT') {
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
        if (status === 'LEFT' || status === 'RIGHT') {
          section.mock.style.display = null
          section.dom.classList.add('marpit-section-status-except-not-play')
          if (status === 'LEFT') {
            section.dom.classList.add('marpit-section-status-left')
            section.status = 'LEFT'
          } else if (status === 'RIGHT') {
            section.dom.classList.add('marpit-section-status-right')
            section.status = 'RIGHT'
          }
        } else {
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
        }
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
      const newMarpitPlaying = this.marpitExpectedPlaying
      if (newMarpitPlaying === this.marpitPlaying
        || (newMarpitPlaying !== null && !this.marpitSections[newMarpitPlaying])) {
        return
      }
      // ==== Prepare Dock, Action and Scroll Bar ====
      if (newMarpitPlaying === null) {
        // ==== Playing -> Not playing ====
        this.marpitDock.classList.add('marpit-dock-disabled')
        document.removeEventListener('mousemove', this.marpitOnMouseMove)
        document.removeEventListener('touchstart', this.marpitOnTouchStart)
        document.removeEventListener('touchmove', this.marpitOnTouchMove)
        document.removeEventListener('touchend', this.marpitOnTouchEnd)
        document.removeEventListener('scroll', this.marpitOnScroll)
        document.body.style.minHeight = null
        scrollTo(pageXOffset, this.marpitSavedScrollPos)
        this.marpitSavedScrollPos = NaN
      } else if (this.marpitPlaying === null) {
        // ==== Not Playing -> Playing ====
        this.marpitDock.classList.remove('marpit-dock-disabled')
        document.addEventListener('mousemove', this.marpitOnMouseMove)
        document.addEventListener('touchstart', this.marpitOnTouchStart)
        document.addEventListener('touchmove', this.marpitOnTouchMove, { passive: false })
        document.addEventListener('touchend', this.marpitOnTouchEnd)
        this.marpitResetMouseMoveTimeout()
        this.marpitSavedScrollPos = pageYOffset
        document.body.style.minHeight = `${this.marpitSections.length}00vh`
        document.addEventListener('scroll', this.marpitOnScroll)
        // console.log(document.body.offsetHeight, window.innerHeight)
      }
      // ==== Prev and first button ====
      if (newMarpitPlaying === 0) {
        this.marpitFirstButton.classList.add('marpit-dock-button-disabled')
        this.marpitPrevButton.classList.add('marpit-dock-button-disabled')
      } else {
        this.marpitFirstButton.classList.remove('marpit-dock-button-disabled')
        this.marpitPrevButton.classList.remove('marpit-dock-button-disabled')
      }
      // ==== Next and last button ====
      if (newMarpitPlaying + 1 === this.marpitSections.length) {
        this.marpitNextButton.classList.add('marpit-dock-button-disabled')
        this.marpitLastButton.classList.add('marpit-dock-button-disabled')
      } else {
        this.marpitNextButton.classList.remove('marpit-dock-button-disabled')
        this.marpitLastButton.classList.remove('marpit-dock-button-disabled')
      }
      // ==== Dock text ====
      this.marpitPageText.innerText = `Page ${newMarpitPlaying + 1} of ${this.marpitSections.length}`
      // ==== Animation ====
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
        })
      } else {
        // ==== Change section ====
        this.marpitSections.forEach((section, index) => {
          this.marpitSectionChangeStatus(section,
            index < newMarpitPlaying ? 'LEFT'
              : index > newMarpitPlaying ? 'RIGHT' : 'PLAY'
          )
        })
      }
      this.marpitPlaying = newMarpitPlaying
    },
    marpitOnKeyUp (event) {
      if (this.marpitPlaying === null) {
        return
      }
      if (event.code === 'ArrowLeft') {
        if (this.marpitSections[this.marpitExpectedPlaying - 1]) {
          this.marpitApplyPlaying(this.marpitExpectedPlaying - 1)
        }
      } else if (event.code === 'ArrowRight') {
        if (this.marpitSections[this.marpitExpectedPlaying + 1]) {
          this.marpitApplyPlaying(this.marpitExpectedPlaying + 1)
        }
      } else if (event.code === 'Escape') {
        this.marpitApplyPlaying(null)
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
      // Prevent hash change triggered update event
      if (this.marpitPlaying !== null) {
        return
      }
      // Remove all mocked sections
      [...document.querySelectorAll('div.marpit > svg[data-marpit-mock]'),
        ...document.querySelectorAll('div.marpit > div.marpit-play-button'),
        ...document.querySelectorAll('div.marpit > div.marpit-id')
      ].forEach(x => {
        x.parentNode.removeChild(x)
      })
      const realSections = [...document.querySelectorAll('div.marpit > svg')]
      this.marpitSections = []
      for (let i = 0; i < realSections.length; ++i) {
        const realSection = realSections[i]
        ;[...realSection.querySelectorAll((
          this.$site.themeConfig.extractHeaders || ['h2', 'h3'])
          .map(x => `${x}[id]`).join(','))].forEach(x => {
          const id = x.getAttribute('id')
          x.removeAttribute('id')
          const divId = document.createElement(x.tagName)
          divId.classList.add('marpit-id')
          divId.setAttribute('id', id)
          divId.innerHTML = x.innerHTML
          const anchor = x.querySelector('a')
          if (anchor) {
            anchor.parentNode.removeChild(anchor)
          }
          realSection.parentNode.insertBefore(divId, realSection)
        })
        const mockSection = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
        mockSection.dataset.marpitMock = ''
        mockSection.setAttribute('viewBox', realSection.getAttribute('viewBox'))
        mockSection.dataset.marpitSvg = ''
        mockSection.style.display = 'none'
        realSection.parentNode.insertBefore(mockSection, realSection)
        const playButton = document.createElement('div')
        playButton.classList.add('marpit-play-button')
        playButton.innerHTML = '<i class="mdi mdi-play"></i>'
        playButton.addEventListener('click', (event) => {
          if (this.marpitExpectedPlaying !== i) {
            this.marpitApplyPlaying(i)
            this.marpitApplyPlaying(i)
          }
        })
        realSection.parentNode.insertBefore(playButton, realSection.nextSibling)
        this.marpitSections.push({
          dom: realSection,
          mock: mockSection,
          status: 'NOT_PLAY'
        })
      }
      this.marpitExpectedPlaying = null
      this.updateMarpitRoute()
    }
  }
}
