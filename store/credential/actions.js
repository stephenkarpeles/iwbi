export default {
  // eslint-disable-next-line require-await
  async getAdminCredentialsList({ commit }, payload) {
    let str = ''
    for (const key in payload) {
      if (str !== '') {
        str += '&'
      }
      const val = payload[key] === null ? '' : payload[key]
      str += key + '=' + encodeURIComponent(val)
    }
    return this.$axios.get(`api/admin/user/well-ap?${str}`).then((res) => {
      commit('setAdminCredentialsList', res.data)
    })
  },

  renewCredentials({ state }, payload) {
    const data = { ...payload.address }
    data.discount_code = payload.discount_code
    return new Promise((resolve, reject) => {
      this.$axios
        .post('api/user/credential-renewal/' + payload.userID, data)
        .then((response) => {
          resolve(response.data)
        })
        .catch((err) => {
          reject(err.response.data)
        })
    })
  },

  updateCredDates({ state, commit }, payload) {
    return new Promise((resolve, reject) => {
      this.$axios
        .put('api/admin/user/update/' + payload.id + '/credential', payload)
        .then((response) => {
          resolve(response)
        })
        .catch((err) => {
          reject(err.response.payload)
        })
    })
  },
}
