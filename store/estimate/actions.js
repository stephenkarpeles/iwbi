export default {
  async getAdminV2EstimatesList({ commit }, payload) {
    let str = ''
    for (const key in payload) {
      if (str !== '' && payload[key]) {
        str += '&'
      }
      const val = payload[key] === null ? '' : payload[key]
      str += (payload[key] ? key + '=' : '') + encodeURIComponent(val)
    }
    return await this.$axios.get(`api/admin/estimate?${str}`).then((res) => {
      commit('setAdminV2EstimatesList', res.data)
    })
  },

  async getAdminV1EstimatesList({ commit }, payload) {
    let str = ''
    for (const key in payload) {
      if (str !== '' && payload[key]) {
        str += '&'
      }
      const val = payload[key] === null ? '' : payload[key]
      str += (payload[key] ? key + '=' : '') + encodeURIComponent(val)
    }
    return await this.$axios.get(`api/admin/v1-estimate?${str}`).then((res) => {
      commit('setAdminV1EstimatesList', res.data)
    })
  },

  async getV2EstimatesList({ commit }, payload) {
    let str = ''
    for (const key in payload) {
      if (str !== '' && payload[key]) {
        str += '&'
      }
      const val = payload[key] === null ? '' : payload[key]
      str += (payload[key] ? key + '=' : '') + encodeURIComponent(val)
    }
    return await this.$axios.get(`api/estimate?${str}`).then((res) => {
      commit('setV2EstimatesList', res.data)
    })
  },

  async getV1EstimatesList({ commit }, payload) {
    let str = ''
    for (const key in payload) {
      if (str !== '' && payload[key]) {
        str += '&'
      }
      const val = payload[key] === null ? '' : payload[key]
      str += (payload[key] ? key + '=' : '') + encodeURIComponent(val)
    }
    return await this.$axios.get(`api/v1-estimate?${str}`).then((res) => {
      commit('setV1EstimatesList', res.data)
    })
  },

  async getEstimate({ commit }, estimateId) {
    let estimate = null
    await this.$axios.get(`api/estimate/${estimateId}`).then((res) => {
      estimate = res.data
    })
    return estimate
  },

  async getV1Estimate({ commit }, estimateId) {
    let estimate = null
    await this.$axios.get(`api/well-v1/estimate/${estimateId}`).then((res) => {
      estimate = res.data
    })
    return estimate
  },

  updateEstimate({ state, commit, dispatch }, payload) {
    return new Promise((resolve, reject) => {
      this.$axios
        .put('api/estimate/update/' + payload.id, payload)
        .then((response) => {
          resolve(response.data)
        })
        .catch((err) => {
          reject(err)
        })
    })
  },

  createV1Estimate({ state, commit, dispatch }, payload) {
    return new Promise((resolve, reject) => {
      this.$axios
        .post('api/well-v1/estimate', payload)
        .then((response) => {
          resolve(response.data)
        })
        .catch((err) => {
          let errorMessage = 'Something went wrong...please try again later'

          if (err.response.data.errors) {
            errorMessage = ''
            for (const errorGroup in err.response.data.errors) {
              if (typeof err.response.data.errors[errorGroup][0] === 'object') {
                for (const error in err.response.data.errors[errorGroup][0]) {
                  errorMessage +=
                    err.response.data.errors[errorGroup][0][error] + '   '
                }
              } else {
                errorMessage += err.response.data.errors[errorGroup][0]
              }
            }
          }

          reject(errorMessage)
        })
    })
  },

  createV2Estimate({ state, commit, dispatch }, payload) {
    return new Promise((resolve, reject) => {
      this.$axios
        .post('api/estimate/create', payload)
        .then((response) => {
          resolve(response.data)
        })
        .catch((err) => {
          let errorMessage = 'Something went wrong...please try again later'

          if (err.response.data.errors) {
            errorMessage = ''
            for (const errorGroup in err.response.data.errors) {
              if (typeof err.response.data.errors[errorGroup][0] === 'object') {
                for (const error in err.response.data.errors[errorGroup][0]) {
                  errorMessage +=
                    err.response.data.errors[errorGroup][0][error] + '   '
                }
              } else {
                errorMessage += err.response.data.errors[errorGroup][0]
              }
            }
          }

          reject(errorMessage)
        })
    })
  },

  updateV1Estimate({ state, commit, dispatch }, payload) {
    return new Promise((resolve, reject) => {
      this.$axios
        .put('api/well-v1/estimate/' + payload.id, payload)
        .then((response) => {
          resolve(response.data)
        })
        .catch((err) => {
          reject(err)
        })
    })
  },

  downloadV1Estimate({ commit }, estimateId) {
    const url =
      this.$axios.defaults.baseURL + 'api/well-v1/estimate/pdf/' + estimateId
    window.open(url, '_blank')
  },

  downloadEstimate({ commit }, estimateId) {
    const url =
      this.$axios.defaults.baseURL + 'api/estimate/' + estimateId + '/pdfExport'
    window.open(url, '_blank')
  },
}
