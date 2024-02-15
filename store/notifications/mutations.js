export default {
  setBannerVisibility(state, newValue) {
    if (process.client) {
      state.banner.visible = newValue
      localStorage.setItem('showNotificationBanner', newValue)
    }
  },

  setBannerMessage(state, newValue) {
    state.banner.message = newValue
  },

  setBannerClose(state, newValue) {
    state.banner.canDismiss = newValue
  },

  setBannerActionText(state, payload) {
    state.banner.cta.text = payload
  },

  setBannerActionTriggered(state, payload) {
    state.banner.cta.triggered = payload
  },

  setToastVisibility(state, newValue) {
    state.toast.visible = newValue
  },

  setToastMessage(state, newValue) {
    state.toast.message = newValue
  },

  setToastType(state, newValue) {
    state.toast.message = newValue
  },

  initialise(state) {
    if (
      localStorage.getItem('showNotificationBanner') &&
      localStorage.getItem('showNotificationBanner') === 'true'
    ) {
      state.banner.visible = localStorage.getItem('showNotificationBanner')
    }
  },
}
