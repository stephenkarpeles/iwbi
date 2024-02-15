export default {
  // eslint-disable-next-line require-await
  async getExams({ commit }, slug) {
    return this.$axios.get(`api/exam/get?paginate=no`).then((res) => {
      commit('setAllExams', res.data)
      if (res.data.length) {
        if (res.data.filter((a) => a.exam_status === 'pending').length) {
          commit(
            'setExam',
            res.data.filter((a) => a.exam_status === 'pending')[0]
          )
          if (
            res.data.filter((a) => a.exam_status === 'pending')[0]
              .bought_in_bundle
          ) {
            commit('setOption', 'bundle')
          } else {
            commit('setOption', 'exam')
          }
        }
      }
    })
  },
  getExamDetails({ state, commit }, payload) {
    this.$axios.get('api/exam/get/' + payload).then((response) => {
      commit('setMode', 'register')
    })
  },
  getPrice({ state, commit }) {
    return new Promise((resolve, reject) => {
      const newExam = { ...state.exam }
      newExam.city = state.exam.addresses[0].city
      newExam.postal_code = state.exam.addresses[0].postal_code
      newExam.street = state.exam.addresses[0].street
      newExam.state = state.exam.addresses[0].state
      newExam.country_code = state.exam.addresses[0].country_code

      this.$axios
        .post('api/exam/estimate', newExam)
        .then((response) => {
          if (!response.data.amount) {
            commit('setdiscountedPrice', response.data)
          } else {
            commit('setdiscountedPrice', {
              exam: response.data.amount,
              bundle: 600,
            })
          }
          resolve(response.data)
        })
        .catch((err) => {
          reject(err.response.data)
        })
    })
  },
  create({ state, commit, dispatch }) {
    return new Promise((resolve, reject) => {
      this.$axios
        .post('api/exam/create', state.exam)
        .then((response) => {
          dispatch('getExams')
          dispatch('getExamDetails', response.data.id)
          resolve(response.data.invoice_number)
        })
        .catch((err) => {
          reject(err)
        })
    })
  },

  updateById({ state, commit, dispatch }, id) {
    return new Promise((resolve, reject) => {
      this.$axios
        .put('api/exam/update/' + id, state.exam)
        .then((response) => {
          dispatch('getExams')
          resolve(response.data.invoice_number)
        })
        .catch((err) => {
          reject(err)
        })
    })
  },

  update({ state, commit, dispatch }) {
    return new Promise((resolve, reject) => {
      this.$axios
        .put('api/exam/update/' + state.exam.id, state.exam)
        .then((response) => {
          dispatch('getExams')
          resolve(response.data.invoice_number)
        })
        .catch((err) => {
          reject(err)
        })
    })
  },
  getAdminExamsList({ commit }, payload) {
    let str = ''
    for (const key in payload) {
      if (key !== '' && key !== null) {
        const val = payload[key] === null ? '' : payload[key]
        if (str !== '' && str !== null && val !== '') {
          str += '&'
        }
        if (key && key !== '' && val !== '') {
          str += key + '=' + encodeURIComponent(val)
        }
      }
    }
    return this.$axios.get(`api/admin/exam?${str}`).then((res) => {
      commit('setAdminExamsList', res.data)
    })
  },

  getHours({ state, commit }) {
    return new Promise((resolve, reject) => {
      this.$axios
        .get('api/ceHour/get')
        .then((response) => {
          resolve(response.data)
          commit('setCeHours', response.data)
        })
        .catch((err) => {
          reject(err)
        })
    })
  },

  downloadInvoice({ state, rootState }) {
    const token = rootState.authentication.token

    if (state.exam.legacy_id) {
      window.open(
        'https://legacy-wellonline.wellcertified.com/printPdf/' +
          state.exam.legacy_id,
        '_blank'
      )
    } else {
      const url =
        this.$axios.defaults.baseURL +
        'api/invoice/' +
        state.exam.invoices[0].id +
        '/pdf?token=' +
        token
      window.open(url, '_blank')
    }
  },

  addHours({ state, commit, dispatch }, payload) {
    return new Promise((resolve, reject) => {
      this.$axios
        .post('api/ceHour/create', payload)
        .then((response) => {
          dispatch('getHours')
          resolve(response.data)
        })
        .catch((err) => {
          reject(err)
        })
    })
  },

  removeHours({ state, dispatch }, payload) {
    return new Promise((resolve, reject) => {
      this.$axios.delete('api/ceHour/delete/' + payload).then((response) => {
        dispatch('getHours')
        resolve(response)
      })
    })
  },

  updateHours({ state, commit, dispatch }, payload) {
    return new Promise((resolve, reject) => {
      this.$axios
        .put('api/ceHour/update/' + payload.id, payload)
        .then((response) => {
          dispatch('getHours')
          resolve(response.data)
        })
        .catch((err) => {
          reject(err)
        })
    })
  },

  updateExamExpiration({ state, commit }, payload) {
    return new Promise((resolve, reject) => {
      this.$axios
        .post('api/admin/exam/update/' + payload.id + '/expiration', payload)
        .then((response) => {
          resolve(response)
        })
        .catch((err) => {
          reject(err.response.payload)
        })
    })
  },
  getverify({ state }, payload) {
    return new Promise((resolve, reject) => {
      this.$axios
        .post('api/exam/asid/' + payload)
        .then((response) => {
          state.asidResponse = true
          resolve()
        })
        .catch((err) => {
          state.asidResponse = false
          reject(err)
        })
    })
  },
  adminUpdateExam({ state, commit }, exam) {
    return new Promise((resolve, reject) => {
      this.$axios
        .post('api/admin/exam/update/' + exam.id + '/all', exam)
        .then((response) => {
          resolve(response)
        })
        .catch((err) => {
          reject(err.response)
        })
    })
  },
  cancelExam({ state, commit }, examId) {
    return new Promise((resolve, reject) => {
      this.$axios
        .post('api/admin/exam/cancel/' + examId)
        .then((response) => {
          resolve(response)
        })
        .catch((err) => {
          reject(err.response)
        })
    })
  },
  getCredentialInvoices({ commit }) {
    return new Promise((resolve, reject) => {
      this.$axios
        .get(`api/ceHour/invoices/all`)
        .then((response) => {
          commit('setCredentialInvoices', response.data)
          resolve(response.data)
        })
        .catch((err) => {
          reject(err)
        })
    })
  },
}
