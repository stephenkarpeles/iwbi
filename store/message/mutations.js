export default {
  setFilters(state, payload) {
    state.filters = payload
  },
  setCoachMessages(state, payload) {
    state.coachMessages = payload
  },
  setMessageTable(state, payload) {
    state.messageTable = payload
  },
  setProjects(state, payload) {
    state.projects = payload
  },
  setSelectedProjects(state, payload) {
    state.selectedProjects = payload
  },
  setProjectCount(state, payload) {
    state.projectCount = payload
  },
  setProjectsinfo(state, payload) {
    state.projectsinfo = payload
  },
  setSentLogData(state, payload) {
    state.sentLogData = payload
  },
}
