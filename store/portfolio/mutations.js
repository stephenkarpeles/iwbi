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
  setPortfolioList(state, newValue) {
    state.portfolioList = newValue
  },
  storePortfolioDetails(state, payload) {
    state.portfolioDetails = payload
  },
  setPortfolio(state, newValue) {
    state.portfolio = newValue
  },
  setSubsetList(state, payload) {
    state.subsetList = payload
  },
  setPortfolioProjects(state, payload) {
    state.portfolioProjects = payload
  },
  setSubsetProjects(state, payload) {
    state.subsetProjects = payload.map((element) => {
      return {
        ...element,
        label: element.project_number + ' - ' + element.name,
        value: element.id,
      }
    })
  },
  setScorecardAuditDocuments(state, payload) {
    state.scorecardAuditDocuments = payload
  },
  setfilters(state, payload) {
    state.projectFilter[payload.key] = payload.value
  },

  setSubsetFilters(state, payload) {
    state.subsetFilters[payload.key] = payload.value
  },

  setPaginatedLocations(state, payload) {
    state.paginatedLocations = payload
  },

  setLibraryScorecardDocuments(state, payload) {
    state.libraryScorecardDocuments = payload
  },

  setAllLocations(state, payload) {
    state.allLocations = payload
    // state.subsetProjects = payload.map((element) => {
    //   return {
    //     ...element,
    //     name: element.project_number + '-' + element.name,
    //     project_name: element.name,
    //   }
    // })
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

  setStrategies(state, newValue) {
    state.strategies = newValue
  },

  setAnalyzeDummyData(state, newValue) {
    state.analyzeDummyData = newValue
  },

  resetFilters(state) {
    state.projectFilter = {
      filter_space_type: [],
      filter_project_type: [],
      filter_location: [],
      filter_industry: [],
      filter_area: '',
      filter_construction_status: [],
      filter_construction_type: [],
    }
  },
  setfeatureLocationOptions(state, payload) {
    payload[payload.length - 1].label =
      'All locations (' + state.subsetProjects.length + ')'
    state.featureLocationOptions = payload
  },

  setSharedFilters(state, payload) {
    state.sharedFilters = payload
  },

  setPortfolioPagination(state, payload) {
    state.projectCurrentPage = payload
  },
  setPortfolioMembers(state, payload) {
    state.portfolioMembers = payload
  },

  setHsrScorecardId(state, payload) {
    state.hsr_scorecard_id = payload
  },

  setCheckInviteAccess(state, payload) {
    state.checkInviteAccess = payload
  },
  setAnalyzeMode(state, payload) {
    if (typeof payload !== 'undefined') {
      state.analyzeMode = payload
    } else {
      state.analyzeMode = !state.analyzeMode
    }
  },
  setProjectLocations(state, payload) {
    state.locations = payload
  },
  setInvoiceDetails(state, payload) {
    state.allInvoices = payload
  },
  setEstimateValue(state, payload) {
    state.portfolioEstimateDetails = payload
  },
  storePricingDetails(state, payload) {
    state.pricingDetails = payload
  },
  detailsForExistingPortfolio(state, payload) {
    state.existingPortfolio = payload
  },
  setSharedDocument(state, payload) {
    state.sharedDocument = payload
  },
  setDocuments(state, payload) {
    state.documents = payload
  },
  setList(state, payload) {
    state.documentsList = payload
  },
  setNotesList(state, value) {
    state.notesList = value
  },
  setNote(state, value) {
    state.note = value
  },
  setNoteValue(state, value) {
    state.note.communication_type = value
  },
  setCommunicationType(state, payload) {
    state.communicationType = payload
  },
  setAttendees(state, payload) {
    state.attendees = payload
  },
  setScorecardDocuments(state, value) {
    state.scorecardDocuments = value
  },
  setMode(state, payload) {
    state.mode = payload
  },
  setCurrentStep(state, payload) {
    state.currentStep = payload
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
  setFilteredFieldsProperties(state, payload) {
    state.onlyProperties = payload
  },
}
