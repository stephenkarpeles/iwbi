export default {
  setMembershipList(state, payload) {
    state.membershipList = payload
  },
  setMembership(state, payload) {
    state.membership = payload
  },
  setOrganizationsList(state, newValue) {
    state.organizationsList = newValue
  },
  setAdminOrganizationsList(state, newValue) {
    state.adminOrganizationsList = newValue
  },
  setOrganizationFilters(state, newValue) {
    state.organizationFilters = newValue
  },
}
