export default () => ({
  data: {
    countries: [],
    membership_types: [],
    sectors: [],
  },
  quote: {
    price: null,
    pricePerSite: null,
    discount: null,
    discounted: false,
  },
  calculator: {
    amount: 0,
    totalSaving: 0,
    previously: 1,
    locationsEnrolled: null,
    countLocations: 1,
  },
})
