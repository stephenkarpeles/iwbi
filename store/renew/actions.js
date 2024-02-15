export default {
  async GetRenewLocation({ commit }, payload) {
    await commit('SetRenewLocation', payload)
  },
}
