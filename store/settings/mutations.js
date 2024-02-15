export default {
  setNavState(state, newValue) {
    localStorage.setItem('navExpanded', newValue)
    state.navExpanded = newValue
  },

  setSidebarTab(state, newValue) {
    state.sidebarTab = newValue
  },

  setScorecardBannerState(state, newValue) {
    localStorage.setItem('showScorecardBanner', newValue)
    state.showScorecardBanner = newValue
  },

  initialise(state) {
    if (localStorage.getItem('navExpanded')) {
      state.navExpanded = localStorage.getItem('navExpanded')
    }

    if (localStorage.getItem('showScorecardBanner')) {
      state.showScorecardBanner = localStorage.getItem('showScorecardBanner')
    }
  },
}
