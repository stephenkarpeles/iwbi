const PREVIOUSLY_AMOUNT = 2500
export default {
  isPrevious: (state) => {
    return (
      +state.calculator.countLocations === 1 &&
      state.calculator.previously !== null &&
      +state.calculator.previously === 0
    )
  },
  isEnroll: (state) => {
    return (
      state.calculator.locationsEnrolled !== null &&
      +state.calculator.locationsEnrolled === 0
    )
  },
  totalPrice: (state, getters) => {
    return state.calculator.countLocations * getters.pricePerLocation
  },
  totalSaving: (state, getters) => {
    if (
      state.calculator.totalSaving &&
      state.calculator.countLocations >= 1 &&
      !getters.isEnroll
    ) {
      return state.calculator.totalSaving
    }

    return null
  },
  pricePerLocation: (state, getters) => {
    if (getters.isEnroll) {
      return 0
    }

    if (getters.isPrevious) {
      return PREVIOUSLY_AMOUNT
    }

    if (!state.calculator.amount) {
      return 0
    }

    return state.calculator.amount
  },
}
