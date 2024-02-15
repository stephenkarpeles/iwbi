export default {
  // eslint-disable-next-line require-await
  async getFaculty({ commit }, id) {
    if (id) {
      return this.$axios.get(`api/faculty/get?faculty_id=${id}`).then((res) => {
        commit('setFaculty', res.data)
      })
    } else {
      return this.$axios.get(`api/faculty/get`).then((res) => {
        commit('setFaculty', res.data)
      })
    }
  },

  create({ state, commit, dispatch }, payload) {
    return new Promise((resolve, reject) => {
      this.$axios
        .post('api/faculty/store', payload)
        .then((res) => {
          resolve(res)
        })
        .catch((err) => {
          reject(err)
        })
    })
  },

  update({ state, commit, dispatch }, payload) {
    return new Promise((resolve, reject) => {
      this.$axios
        .put('api/faculty/update/' + payload.id, payload)
        .then((res) => {
          resolve(res)
        })
        .catch((err) => {
          reject(err)
        })
    })
  },

  downloadAgreement({ state, commit, dispatch }, payload) {
    const url =
      this.$axios.defaults.baseURL +
      'api/faculty/download-agreement/' +
      payload.id +
      '?token=' +
      payload.token
    window.open(url, '_blank')
  },

  // eslint-disable-next-line require-await
  async getAdminFacultyList({ commit }, payload) {
    let str = ''
    for (const key in payload) {
      if (str !== '' && payload[key]) {
        str += '&'
      }
      const val = payload[key] === null ? '' : payload[key]
      str += (payload[key] ? key + '=' : '') + encodeURIComponent(val)
    }
    return this.$axios.get(`api/admin/faculty?${str}`).then((res) => {
      commit('setAdminFacultyList', res.data)
    })
  },

  renewFaculty({ state }, payload) {
    return new Promise((resolve, reject) => {
      this.$axios
        .post('api/faculty/renewal/' + payload.id, payload.data)
        .then((response) => {
          resolve(response.data)
        })
        .catch((err) => {
          reject(err.response.data)
        })
    })
  },
}
