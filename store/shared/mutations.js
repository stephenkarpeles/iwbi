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
  setDocuments(state, payload) {
    state.documents = payload
  },
  setWprDocuments(state, payload) {
    state.wprDocuments = payload
  },

  setfilters(state, payload) {
    state.filters[payload.key] = payload.value
  },
  resetFilters(state) {
    state.filters = {
      filter_space_type: [],
      filter_project_type: [],
      filter_location: [],
      filter_industry: [],
      filter_area: '',
      filter_construction_status: [],
      filter_construction_type: [],
    }
  },
  setSubsetFilters(state, payload) {
    state.subsetFilters[payload.key] = payload.value
  },
  resetSubsetFilters(state) {
    state.subsetFilters = {
      filter_space_type: [],
      filter_project_type: [],
      filter_location: [],
      filter_industry: [],
      filter_area: '',
      filter_construction_status: [],
      filter_construction_type: [],
    }
  },
  setSharedFilters(state, payload) {
    state.sharedFilters = payload
  },
  setAdminPortfolioList(state, payload) {
    state.adminPortfolioList = payload
  },
  storeSharedDetails(state, payload) {
    state.sharedWorkspace = payload
  },
  storeInvoiceDetails(state, payload) {
    state.allInvoices = payload
  },
  storePricingDetails(state, payload) {
    state.pricingDetails = payload
  },
  setActiveTab(state, payload) {
    state.activeTab = payload
  },
  setMode(state, payload) {
    state.mode = payload
  },
  setWprMode(state, payload) {
    state.wprMode = payload
  },
  setCurrentStep(state, payload) {
    state.currentStep = payload
  },

  setPortfolio(state, payload) {
    state.portfolio = payload
  },
  setPortfoiloInvoices(state, payload) {
    state.portfolioInvoices = payload
  },
  setPaginatedLocations(state, payload) {
    state.paginatedLocations = payload
  },
  setAllLocations(state, payload) {
    state.allLocations = payload
    state.subsetProjects = payload.map((element) => {
      return {
        ...element,
        name: element.project_number + '-' + element.name,
        project_name: element.name,
      }
    })
  },
  setScorecardDocuments(state, payload) {
    state.scorecardDocuments = payload
  },
  setScorecardAuditDocuments(state, payload) {
    state.scorecardAuditDocuments = payload
  },
  setProjectSummary(state, payload) {
    state.projectSummary = payload
  },
  setList(state, payload) {
    state.documentsList = payload
  },
  setShowFeatures(state, payload) {
    state.showFeatures = payload
  },
  setPartsSelected(state, payload) {
    state.partSelected = payload
  },
  setFeatureSelected(state, payload) {
    state.featureSelected = payload
  },
  setParts(state, payload) {
    state.parts = payload.parts
  },
  setFeatureandParts(state, payload) {
    const temp = []
    const data = payload.response
    if (data) {
      data.map((concept) => {
        Object.values(concept.features).map((feature) => {
          const featureOrder =
            feature.feature_order <= 9
              ? '0' + feature.feature_order
              : feature.feature_order
          const featureName = feature.name
          const part = []
          Object.values(feature.parts).map((parts) => {
            const partName =
              concept.feature_prefix +
              featureOrder +
              '.' +
              parts.part_number +
              ' ' +
              parts.name
            part.push({
              name: partName,
              feature_name: featureName,
              id: parts.id,
              feature_id: feature.id,
              part_prefix:
                concept.feature_prefix + featureOrder + '.' + parts.part_number,
            })
            return partName
          })
          temp.push({
            concept_name: concept.name,
            feature: featureName,
            parts: part,
          })
          return featureOrder
        })
        return data
      })
    }
    state.featureandParts = temp
  },
  setSubsetProjects(state, payload) {
    state.subsetProjects = payload.map((element) => {
      return {
        label: element.project_number + ' - ' + element.name,
        value: element.id,
      }
    })
  },
  setSubsetList(state, payload) {
    state.subsetList = payload
  },
  setStrategies(state, newValue) {
    state.strategies = newValue
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
  resetAllVariables(state) {
    state.activeTab = null
    state.loading = false
    state.adminPortfolioList = null
    state.sharedWorkspace = {}
    state.currentPage = 1
    state.allInvoices = []
    state.pricingDetails = null
    state.portfolio = null
    state.portfolioInvoices = null
    state.paginatedLocations = null
    state.allLocations = null
    state.subsetProjects = []
    state.scorecardDocuments = []
    state.scorecardAuditDocuments = []
    state.projectSummary = []
    state.documentsList = [{ data: [] }]
    state.documents = null
    state.featureandParts = []
    state.showFeatures = false
    state.strategies = null
    state.coachingContacts = null
    state.wellReviewers = null
    state.externalReviewers = null
    state.ptAgents = null
    state.sharedFilters = {}
    state.subsetList = []
    state.filters = {
      filter_space_type: [],
      filter_project_type: [],
      filter_location: [],
      filter_industry: [],
      filter_area: '',
      filter_construction_status: [],
      filter_construction_type: [],
    }
    state.subsetFilters = {
      filter_space_type: [],
      filter_project_type: [],
      filter_location: [],
      filter_industry: [],
      filter_area: '',
      filter_construction_status: [],
      filter_construction_type: [],
    }
  },
}
