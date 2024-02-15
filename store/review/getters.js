export default {
  pendingReview: (state) => {
    return state.allReviews
      ? state.allReviews.find((a) => a.status === 'pending')
      : ''
  },
}
