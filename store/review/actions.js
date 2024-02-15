export default {
  resubmitReview({ commit, state }, payload) {
    return this.$axios.post(
      `api/project-review/${payload.project_id}/${payload.review_id}/resubmit`,
      payload
    )
  },
  resubmitSharedReview({ commit, state }, payload) {
    return this.$axios.post(
      `api/portfolio/${payload.project_id}/review/${payload.review_id}/resubmit`,
      payload
    )
  },

  deleteNote({ commit, state }, payload) {
    return this.$axios.delete(
      `api/project-review/${payload.project_id}/${payload.review_id}/note/${payload.note_id}`,
      payload
    )
  },

  addNote({ commit, state }, payload) {
    return this.$axios.post(
      `api/project-review/${payload.project_id}/${payload.review_id}/note`,
      payload
    )
  },

  deleteSharedNote({ commit, state }, payload) {
    return this.$axios.delete(
      `api/portfolio/${payload.project_id}/review/${payload.review_id}/note/${payload.note_id}`,
      payload
    )
  },

  addSharedNote({ commit, state }, payload) {
    return this.$axios.post(
      `api/portfolio/${payload.project_id}/review/${payload.review_id}/note`,
      payload
    )
  },

  updateReview({ commit, state }, payload) {
    return this.$axios.put(
      `api/admin/project-review/${payload.project_id}/${payload.id}/update`,
      payload
    )
  },

  returnReview({ commit, state }, payload) {
    return this.$axios.post(
      `api/admin/project-review/${payload.project_id}/${payload.id}/return`,
      payload
    )
  },

  returnPortfolioReview({ commit, state }, payload) {
    return this.$axios.post(
      `api/portfolio/${payload.portfolio_id}/${payload.id}/return`,
      payload
    )
  },

  updatePortfolioReview({ commit, state }, payload) {
    return this.$axios.put(
      `api/portfolio/${payload.portfolio_id}/review/${payload.id}`,
      payload
    )
  },
  getReviewList({ commit, state }, payload) {
    return this.$axios
      .get('api/project-review/' + payload + '/all')
      .then((res) => {
        commit('setAllReviews', res.data)
      })
  },
  getSharedReviewList({ commit, state }, payload) {
    return this.$axios
      .get('api/portfolio/' + payload + '/review')
      .then((res) => {
        commit('setAllReviews', res.data)
      })
  },
  submitReview({ dispatch, state, rootState }, payload) {
    return new Promise((resolve, reject) => {
      this.$axios
        .post('api/project-review/' + payload.id, payload.reviewData)
        .then((response) => {
          if (payload.type === 'project') {
            dispatch('getReviewList', rootState.project.project.id)
          } else {
            dispatch('getReviewList', rootState.shared.sharedWorkspace.id)
          }
          resolve()
        })
        .catch((error) => {
          reject(error)
        })
    })
  },
  submitPortfolioReview({ dispatch, state, rootState }, payload) {
    return new Promise((resolve, reject) => {
      this.$axios
        .post('api/portfolio/' + payload.id + '/review', payload)
        .then((response) => {
          dispatch('getSharedReviewList', payload.id)
          resolve(response)
        })
        .catch((error) => {
          reject(error.response)
        })
    })
  },
  submitReviewObservation({ state }, payload) {
    return new Promise((resolve, reject) => {
      this.$axios
        .put(payload.url, payload.data)
        .then((response) => {
          resolve(response)
        })
        .then((err) => {
          reject(err.response)
        })
    })
  },
  reset({ commit }) {
    commit('reset')
  },
  downloadReport({ rootState }, payload) {
    const token = rootState.authentication.token
    if (payload.doctype === 'excel') {
      window.open(
        this.$axios.defaults.baseURL +
          'api/admin/' +
          payload.type +
          '/' +
          payload.pId +
          '/review/' +
          payload.rId +
          '/excelExport' +
          '?token=' +
          token,
        '_blank'
      )
    } else if (payload.doctype === 'pdf') {
      window.open(
        this.$axios.defaults.baseURL +
          'api/admin/' +
          payload.type +
          '/' +
          payload.pId +
          '/review/' +
          payload.rId +
          '/pdfExport' +
          '?token=' +
          token,
        '_blank'
      )
    } else if (payload.doctype === 'hsr-excel') {
      window.open(
        this.$axios.defaults.baseURL +
          'api/admin/' +
          payload.type +
          '/' +
          payload.pId +
          '/review/' +
          payload.rId +
          '/excelExport' +
          '?phase=hsr&token=' +
          token,
        '_blank'
      )
    } else if (payload.doctype === 'hsr-pdf') {
      window.open(
        this.$axios.defaults.baseURL +
          'api/admin/' +
          payload.type +
          '/' +
          payload.pId +
          '/review/' +
          payload.rId +
          '/pdfExport' +
          '?phase=hsr&token=' +
          token,
        '_blank'
      )
    } else if (payload.doctype === 'hsr-final-pdf') {
      if (payload.type) {
        window.open(
          this.$axios.defaults.baseURL +
            'api/admin/' +
            payload.type +
            '/' +
            payload.pId +
            '/review/' +
            payload.rId +
            '/pdfExport' +
            '?area_type=' +
            payload.area_type +
            '&phase=hsr-final&token=' +
            token,
          '_blank'
        )
      } else {
        window.open(
          this.$axios.defaults.baseURL +
            'api/admin/' +
            payload.type +
            '/' +
            payload.pId +
            '/review/' +
            payload.rId +
            '/pdfExport' +
            '?phase=hsr-final&token=' +
            token,
          '_blank'
        )
      }
    }
  },
  downloadReviewDocument({ rootState }, payload) {
    return this.$axios.get(
      'api/admin/' +
        payload.type +
        '/' +
        payload.pId +
        '/review/' +
        payload.rId +
        '/downloadAllDocument?phase=' +
        payload.phase
    )
  },
  getPortfolioReviewNextPhase({ state }, id) {
    return this.$axios.get('api/portfolio/' + id + '/nextReviewPhase')
  },
}
