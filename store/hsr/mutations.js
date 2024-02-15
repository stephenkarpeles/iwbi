export default {
  setData(state, payload) {
    state.data = payload
  },
  setQuote(state, payload) {
    if (payload && payload.per_property_amount) {
      state.calculator.amount = +payload.per_property_amount
      state.calculator.totalSaving =
        payload.total_discount_without_previous_discounts_percentage
    }
  },
  updateCalculator(state, payload) {
    if (Object.prototype.hasOwnProperty.call(payload, 'countLocations')) {
      state.calculator.countLocations = +payload.countLocations
    }

    if (Object.prototype.hasOwnProperty.call(payload, 'locationsEnrolled')) {
      state.calculator.locationsEnrolled = payload.locationsEnrolled
    }

    if (Object.prototype.hasOwnProperty.call(payload, 'previously')) {
      state.calculator.previously = payload.previously
    }
  },
}
