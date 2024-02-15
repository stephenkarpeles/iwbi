export default {
  // start functions of shared-workspace receritification //
  async getHSRRecertification({ commit, rootState }, payload) {
    return await this.$axios
      .get(
        `api/portfolio/${rootState.shared.sharedWorkspace.id}/recertification`
      )
      .then((res) => {
        commit('setRecertificationList', res.data)
      })
  },
  async createHSRRecertification({ state, dispatch }, payload) {
    return await this.$axios
      .post(`api/portfolio/${payload.id}/recertification`, payload)
      .then((res) => {
        dispatch('getHSRRecertification')
      })
  },
  recertHSRLocationUpdateNotification({ state, rootState }, payload) {
    return this.$axios.get(
      `api/portfolio/${rootState.shared.sharedWorkspace.id}/hsr-recert/zendesk`,
      {
        params: { ...payload },
      }
    )
  },
  updateRecert({ state, rootState }, payload) {
    return this.$axios.put(
      `api/portfolio/${rootState.shared.sharedWorkspace.id}/recertification/${payload.id}`,
      payload
    )
  },
  // end of shared-workspace functions //

  // start functions of project receritification //
  async getrecertificationList({ commit, rootState }) {
    return await this.$axios
      .get(`api/project/${rootState.project.project.id}/recertification`)
      .then((res) => {
        commit('setRecertificationList', res.data)
      })
  },
  async createProjectRecertificationList({ state, dispatch }, payload) {
    return await this.$axios
      .post(`api/project/${payload.id}/recertification`, payload)
      .then((res) => {
        dispatch('getrecertificationList')
      })
  },
  updateProjectRecert({ state, rootState }, payload) {
    return this.$axios.put(
      `api/project/${rootState.project.project.id}/recertification/${payload.id}`,
      payload
    )
  },
  async projectHSRPricing({ commit }, projectId) {
    return await this.$axios
      .get(`api/project/${projectId.id}/hsr-pricing?recert_price=true`)
      .then((res) => {
        commit('setProjectHSRPricing', res.data)
      })
  },
  // end functions of project receritification //
}
