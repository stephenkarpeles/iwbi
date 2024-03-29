export default () => ({
  currentStep: 0,
  mode: 'register',
  hsr_scorecard_id: null,
  spaceTypes: [],
  libraryScorecardDocuments: [],
  analyzeMode: false,
  portfolioList: null,
  portfolioDetails: null,
  portfolio: null,
  portfolioProjects: [],
  subsetProjects: [],
  projectCurrentPage: 1,
  subsetList: [],
  scorecardAuditDocuments: [],
  allInvoices: [],
  pricingDetails: '',
  existingPortfolio: {},
  locations: [],
  portfolioMembers: [],
  checkInviteAccess: '',
  portfolioEstimateDetails: '',
  sharedDocument: '',
  documents: null,
  documentsList: [{ data: [] }],
  strategies: null,
  paginatedLocations: null,
  allLocations: null,
  sharedFilters: {},
  otherCertificationList: [
    { label: 'BREEAM', value: 'BREEAM' },
    { label: 'DGNB', value: 'DGNB' },
    { label: 'Green Star', value: 'Green Star' },
    { label: 'HQE', value: 'HQE' },
    { label: 'LEED', value: 'LEED' },
    { label: 'Living Building Challenge', value: 'Living Building Challenge' },
    { label: 'OSMOZ', value: 'OSMOZ' },
    { label: 'Other', value: 'Other' },
    {
      label: 'Project is pursuing multiple rating systems ',
      value: 'project is pursuing multiple rating systems',
    },
  ],
  featureLocationOptions: [
    { label: 'Single location', value: 'single' },
    { label: 'Multiple locations or subsets', value: 'multiple' },
    { label: 'All locations', value: 'all' },
  ],

  projectFilter: {
    filter_space_type: [],
    filter_project_type: [],
    filter_location: [],
    filter_industry: [],
    filter_area: '',
    filter_construction_status: [],
    filter_construction_type: [],
    deleted_at: 'all',
  },
  emptyProjectFilter: {
    filter_space_type: [],
    filter_project_type: [],
    filter_location: [],
    filter_industry: [],
    filter_area: '',
    filter_construction_status: [],
    filter_construction_type: [],
  },

  subsetFilters: {
    filter_space_type: [],
    filter_project_type: [],
    filter_location: [],
    filter_industry: [],
    filter_area: '',
    filter_construction_status: [],
    filter_construction_type: [],
  },
  notesList: [],
  scorecardDocuments: [],
  coachingContacts: [],
  wellReviewers: [],
  externalReviewers: [],
  ptAgents: [],
  onlyProperties: null,
  analyzeDummyData: null,
})
