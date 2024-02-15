export default {
  concepts(state, payload) {
    state.concepts = payload
  },
  setStrategy(state, payload) {
    state.strategy = payload
  },
  conceptsv1(state, payload) {
    state.conceptsv1 = payload
  },
  conceptshsr(state, payload) {
    state.conceptshsr = payload
  },
  setAdminAltList(state, newValue) {
    state.adminAltList = newValue
  },
}
