export default {
  getData({ commit }) {
    return this.$axios.get('/api/hsr-pricing/data').then((res) => {
      commit('setData', res.data)
    })
  },
  calculateQuote({ commit }, payload) {
    return this.$axios
      .get('/api/hsr-pricing/quote', { params: payload })
      .then((res) => {
        commit('setQuote', res.data)
      })
  },
}
