export default {
  setProjectsByOwnershipType(state, payload) {
    if (payload) {
      state.projectsByOwnershipType = payload
    }
  },
  setProjectsByLocation(state, payload) {
    if (payload) {
      state.projectsByLocation = payload
    }
  },
  setProjectsBySpaceType(state, payload) {
    if (payload) {
      state.projectsBySpaceType = payload
    }
  },
  setConceptScores(state, payload) {
    if (payload) {
      state.conceptScores = payload
    }
  },
  setProjectGeoJsonUrl(state, payload) {
    if (payload) {
      state.projectGeoJsonUrl = payload
    }
  },
  setProjectGeoJson(state, payload) {
    if (payload) {
      state.projectGeoJson = payload
    }
  },
}
