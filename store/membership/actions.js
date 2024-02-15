export default {
  getMembershipList({ commit }) {
    return this.$axios.get(`api/membership/list`).then((res) => {
      commit('setMembershipList', res.data)
    })
  },

  async getMembership({ commit }, id) {
    if (id) {
      await this.$axios
        .get('api/membership/subscribe?org_id=' + id)
        .then((response) => {
          commit('setMembership', response.data)
        })
    } else {
      await this.$axios.get('api/membership/subscribe').then((response) => {
        commit('setMembership', response.data)
      })
    }
  },

  async getPortfolioMembership({ commit }, id) {
    await this.$axios.get(`api/portfolio/${id}/membership`).then((response) => {
      commit('setMembership', response.data)
    })
  },

  async create({ state, commit, dispatch }, payload) {
    try {
      const res = await this.$axios.post('api/membership/subscribe', payload)
      dispatch('getMembership', res.data.id)
      return res.data
    } catch (error) {
      throw new Error(error.response.data.msg)
    }
  },

  async update({ state, commit, dispatch }, payload) {
    return await this.$axios.put(
      'api/membership/subscribe/' + payload.id,
      payload
    )
  },

  getOragnizationsList({ commit }, payload) {
    let str = ''
    for (const key in payload) {
      if (str !== '') {
        str += '&'
      }
      const val = payload[key] === null ? '' : payload[key]
      str += key + '=' + encodeURIComponent(val)
    }
    return this.$axios
      .get(`api/organization-directory/get?${str}`)
      .then((res) => {
        commit('setOrganizationsList', res.data)
      })
  },

  inviteMember({ state, dispatch }, payload) {
    return new Promise((resolve, reject) => {
      this.$axios
        .post(
          'api/membership/member-attach/' +
            state.membership.id +
            '/' +
            payload.email,
          {
            role: payload.role,
            'redirect-url': 'none',
          }
        )
        .then((res) => {
          dispatch('getMembership', state.membership.id)
          resolve(res)
        })
        .catch((err) => {
          reject(err)
        })
    })
  },

  removeMember({ state, dispatch }, userId) {
    this.$axios
      .post(
        'api/membership/member-detach/' + state.membership.id + '/' + userId
      )
      .then((res) => {
        dispatch('getMembership', state.membership.id)
      })
  },

  updateMember({ state, dispatch }, payload) {
    this.$axios
      .post(
        'api/membership/member-role-change/' +
          state.membership.id +
          '/' +
          payload.userId,
        {
          role: payload.role,
          'redirect-url': 'none',
        }
      )
      .then((res) => {
        dispatch('getMembership', state.membership.id)
      })
  },

  renewMembership({ state, commit }, payload) {
    return new Promise((resolve, reject) => {
      this.$axios
        .post('api/membership/renewal/' + payload.id, payload)
        .then((response) => {
          resolve(response)
        })
        .catch((err) => {
          reject(err.response.payload)
        })
    })
  },

  respondToInvite({ state, commit }, payload) {
    return new Promise((resolve, reject) => {
      this.$axios
        .post(
          `api/membership/member-approve/${payload.membershipId}/${payload.userId}`,
          { action: payload.action }
        )
        .then((response) => {
          resolve(response)
        })
        .catch((err) => {
          reject(err.response.payload)
        })
    })
  },

  // eslint-disable-next-line require-await
  async getAdminOrganizationsList({ commit }, payload) {
    let str = ''
    for (const key in payload) {
      if (payload[key] !== null && payload[key] !== '') {
        if (str !== '') str += '&'
        str += key + '=' + encodeURIComponent(payload[key])
      }
    }
    return this.$axios.get(`api/admin/organization?${str}`).then((res) => {
      commit('setAdminOrganizationsList', res.data)
    })
  },

  downloadExcelExport({ rootState }) {
    const token = rootState.authentication.token

    window.open(
      this.$axios.defaults.baseURL +
        'api/admin/organization/excel?token=' +
        token,
      '_blank'
    )
  },

  updateOrgSubscription({ state, commit }, payload) {
    return new Promise((resolve, reject) => {
      this.$axios
        .post(
          'api/admin/organization/' +
            payload.org_id +
            '/subscriptions/' +
            payload.sub_id +
            '/update',
          payload
        )
        .then((response) => {
          resolve(response)
        })
        .catch((err) => {
          reject(err.response.payload)
        })
    })
  },

  downloadAgreement({ state }, payload) {
    this.$axios
      .get(`api/membership/subscribe/${state.membership.id}/aggrement`)
      .then(function (res) {
        window.open(res.data.url, '_blank')
      })
  },
}
