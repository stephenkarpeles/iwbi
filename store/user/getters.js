export default {
  userBillingAddress: (state) => {
    return state.currentUser.addresses.length
      ? state.currentUser.addresses.find((a) => a.is_billing === true)
      : []
  },
  userMailingAddress: (state) => {
    return state.currentUser.addresses.length
      ? state.currentUser.addresses.find((a) => a.is_primary === true)
      : []
  },
  getUser: (state) => {
    return state.currentUser
  },
  portfolioAdminAccess: (state) => {
    if (
      state.currentUser.role.includes('well-admin') ||
      state.currentUser.role.includes('portfolio-admin')
    ) {
      return true
    } else {
      return false
    }
  },
}
