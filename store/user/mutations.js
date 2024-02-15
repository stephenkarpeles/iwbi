export default {
  setUser(state, newValue) {
    state.currentUser = newValue
  },
  setAdminUsersList(state, newValue) {
    state.adminUsersList = newValue
  },
  setPublicUsersList(state, newValue) {
    state.publicUsersList = newValue
  },
}
