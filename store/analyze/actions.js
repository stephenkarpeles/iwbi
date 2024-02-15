export default {
  loadProjectBreakdown({ state, commit, rootState }, payload) {
    const id = rootState.portfolio.portfolio.id || payload.id
    if (id) {
      this.$axios
        .get('api/portfolio/' + id + '/project/summary', {
          token: rootState.authentication.token,
        })
        .then((response) => {
          commit('setProjectsByLocation', response.data.location)
          commit('setProjectsBySpaceType', response.data.space_types)
          commit('setProjectsByOwnershipType', response.data.project_type)
        })
    }
  },
  loadConceptScores({ state, commit, rootState }, payload) {
    const id = rootState.portfolio.portfolio.id || payload.id
    if (id) {
      this.$axios
        .get('api/portfolio/' + id + '/score', {
          token: rootState.authentication.token,
        })
        .then((response) => {
          commit('setConceptScores', response.data)
        })
    }
  },
  createProjectGeoJsonUrl({ state, commit, rootState }, payload) {
    const id = rootState.portfolio.portfolio.id || payload.id
    let url = ''

    if (id) {
      url =
        'api/portfolio/' +
        id +
        '/project/locations-map?token=' +
        rootState.authentication.token
      commit('setProjectGeoJsonUrl', url)
    }
  },
  loadProjectGeoJson({ state, commit, rootState }, payload) {
    const id = rootState.portfolio.portfolio.id || payload.id
    if (id) {
      this.$axios
        .get('api/portfolio/' + id + '/project/locations-map', {
          token: rootState.authentication.token,
        })
        .then((response) => {
          commit('setProjectGeoJson', response.data)
        })
    }
  },
}
