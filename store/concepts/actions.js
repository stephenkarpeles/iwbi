export default {
  async getConceptsAndFeatures({ commit, rootState }) {
    return await this.$axios
      .get(
        `api/${rootState.project.project.applicable_version_id}/conceptAndFeature`
      )
      .then((res) => {
        commit('setConcepts', res.data)
      })
  },
  async getPortfolioConceptsAndFeatures({ commit, rootState }) {
    return await this.$axios
      .get(
        `api/${rootState.portfolio.portfolio.applicable_version_id}/conceptAndFeature`
      )
      .then((res) => {
        commit('setConcepts', res.data)
      })
  },
  async getSharedConceptsAndFeatures({ commit, rootState }) {
    return await this.$axios
      .get(
        `api/${rootState.shared.sharedWorkspace.applicable_version_id}/conceptAndFeature`
      )
      .then((res) => {
        commit('setConcepts', res.data)
      })
  },
}
