export default {
  toggleBannerVisibility({ commit, state }) {
    commit('setBannerVisibility', !state.banner.visible)
  },

  showBanner({ commit, state }, message) {
    commit('setBannerVisibility', true)
    commit('setBannerMessage', message)
  },

  clearBanner({ commit, state }, message) {
    commit('setBannerVisibility', false)
    commit('setBannerMessage', '')
    commit('setBannerActionText', '')
    commit('setBannerActionTriggered', false)
    commit('setBannerClose', true)
  },

  setBannerClose({ commit, state }, canClose) {
    commit('setBannerClose', canClose)
  },

  setBannerActionText({ state, commit }, payload) {
    commit('setBannerActionText', payload)
  },

  setBannerActionTriggered({ state, commit }, payload) {
    commit('setBannerActionTriggered', payload)
  },

  toastMessage({ commit }, payload) {
    commit('setToastVisibility', true)
    commit('setToastType', null)
    commit('setToastMessage', payload.message)
  },

  clearToast({ commit }) {
    commit('setToastVisibility', false)
    commit('setToastType', null)
    commit('setToastMessage', '')
  },
}
