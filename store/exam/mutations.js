export default {
  setAllExams(state, payload) {
    state.allExams = payload
  },
  setSchedule(state, payload) {
    state.showScheduling = payload
  },
  setMode(state, payload) {
    state.mode = payload
  },
  setdiscountedPrice(state, payload) {
    state.discountedPrice = payload
  },
  setExam(state, payload) {
    state.exam = payload
  },
  destroyEverything(state) {
    state.allExams = state.exam = state.opted = state.atp = ''
  },
  setOption(state, payload) {
    state.opted = payload
  },
  resetAsidResponse(state) {
    state.asidResponse = ''
  },
  setModal(state, payload) {
    state.showModal = payload
  },
  setCeHours(state, payload) {
    state.ceHours = payload
  },
  setCredentialInvoices(state, payload) {
    state.credentialInvoices = payload
  },
  setUpdateHours(state, payload) {
    state.updateHours = payload
  },
  setEditHours(state, payload) {
    state.editHours = payload
  },
  setAllAp(state, payload) {
    state.allAps = payload
  },
  setAtp(state, payload) {
    state.atp = payload
  },
  setAdminEditMode(state, payload) {
    state.adminEditMode = payload
  },
  setInvoices(state, payload) {
    state.invoices = payload
  },
  setAdminExamsList(state, payload) {
    state.adminExamsList = payload
  },
}
