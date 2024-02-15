export default {
  reSubmitStrategy({ dispatch, rootState, state }, strategyId) {
    this.$axios.post(`api/aap/resubmit/` + strategyId).then((res) => {
      dispatch('getStrategy', res.data.id)
    })
  },

  async getAdminAltList({ commit }, payload) {
    let str = ''
    if (payload.type_internal === 'all') {
      payload.type_internal = ''
    }

    if (
      payload.project_number &&
      (payload.project_number.startsWith('WEL') ||
        payload.project_number.startsWith('HSR'))
    ) {
      payload.portfolio_number = payload.project_number
      delete payload.project_number
    }

    for (const key in payload) {
      const val = payload[key] === null ? '' : payload[key]
      if (val) {
        if (str !== '') {
          str += '&'
        }
        str += key + '=' + encodeURIComponent(val)
      }
    }
    return await this.$axios.get(`api/admin/aap?${str}`).then((res) => {
      commit('setAdminAltList', res.data)
    })
  },
  async getAlternatives({ commit }, payload) {
    let str = ''
    if (payload.type_internal !== 'all') {
      for (const key in payload) {
        if (str !== '') {
          str += '&'
        }

        const val = payload[key] === null ? '' : payload[key]
        str += key + '=' + encodeURIComponent(val)
      }
    } else {
      str = 'orderBy=id&order=desc&page=' + encodeURIComponent(payload.page)
    }

    return await this.$axios.get(`api/aap/all?${str}`).then((res) => {
      commit('concepts', res.data)
    })
  },
  getStrategy({ commit }, strategyId) {
    this.$axios.get(`api/aap/` + strategyId).then((res) => {
      commit('setStrategy', res.data)
    })
  },

  addComment({ commit }, payload) {
    return new Promise((resolve, reject) => {
      this.$axios
        .post(`api/aap/${payload.id}/comment`, payload)
        .then((response) => {
          resolve(response)
        })
        .catch((err) => {
          reject(err.response)
        })
    })
  },
}
