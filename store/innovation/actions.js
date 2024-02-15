export default {
  async getAdminInnovationsList({ commit }, payload) {
    let str = ''
    if (payload.type_internal === 'all') {
      payload.type_internal = ''
    }

    for (const key in payload) {
      const val = payload[key] === null ? '' : payload[key]
      if (val) {
        if (str !== '') {
          str += '&'
        }
        str += key + '=' + encodeURIComponent(val)
      }
    }
    return await this.$axios
      .get(`api/admin/innovationProposals?${str}`)
      .then((res) => {
        commit('setAdminInnovationsList', res.data)
      })
  },
  async createInnovation({ state, dispatch }, payload) {
    await this.$axios
      .post(
        `api/${payload.module_type}/${payload.module_id}/innovationProposal`,
        payload
      )
      .then((res) => {
        return res.data
      })
  },
  async getInnovation({ state, dispatch }, payload) {
    let innovations = null
    await this.$axios
      .get(
        `api/${payload.module_type}/${payload.module_id}/innovationProposal`,
        payload
      )
      .then((res) => {
        innovations = res.data.data
      })

    return innovations
  },
}
