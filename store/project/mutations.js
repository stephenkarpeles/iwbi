export default {
  setSpaceTypes(state, spaceTypes) {
    const options = []

    for (let i = 0; i < spaceTypes.length; i++) {
      const spaceOption = {
        value: spaceTypes[i].id.toString(),
        label: spaceTypes[i].name,
      }

      options.push(spaceOption)
    }

    state.spaceTypes = options
  },
  setStandards(state, newValue) {
    state.standards = newValue
  },
  setV2Projects(state, newValue) {
    state.projectsList = newValue
  },
  setProjects(state, newValue) {
    state.projectsList = newValue
  },
  setProject(state, newValue) {
    state.project = newValue
  },
  setProjectEstimate(state, newValue) {
    state.estimate = newValue
  },
  detailsForExistingProject(state, payload) {
    state.existingProjects = payload
  },
  setAccessLevel(state, payload) {
    state.accessLevel = payload
  },
  setProjectPricing(state, payload) {
    state.pricingDetails = payload
  },
  setProjectInvoices(state, newValue) {
    state.projectInvoices = newValue
  },
  setStrategies(state, newValue) {
    state.strategies = newValue
  },
  setProjectDocuments(state, newValue) {
    state.projectDocuments = newValue
  },
  setAdminProjectsList(state, newValue) {
    state.adminProjectsList = newValue
  },
  setCoachingContacts(state, newValue) {
    state.coachingContacts = newValue
  },
  setWellReviewers(state, newValue) {
    state.wellReviewers = newValue
  },
  setExternalReviewers(state, newValue) {
    state.externalReviewers = newValue
  },
  setPtAgents(state, newValue) {
    state.ptAgents = newValue
  },
  setDirectoryProjects(state, newValue) {
    state.directoryProjects = newValue
  },
  setProjectDirectoryFilters(state, newValue) {
    state.projectDirectoryFilters = newValue
  },
}
