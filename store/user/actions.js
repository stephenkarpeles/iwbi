export default {
  async syncUser({ commit, state }) {
    return await this.$axios
      .get(`api/user/getBySlug/${state.currentUser.slug}`)
      .then((res) => {
        commit('setUser', res.data)
      })
  },

  async fetchUser({ commit }, slug) {
    return await this.$axios.get(`api/user/getBySlug/${slug}`).then((res) => {
      commit('setUser', res.data)
    })
  },

  async fetchUserById({ commit }, id) {
    return await this.$axios.get(`api/user/get/${id}`).then((res) => {
      commit('setUser', res.data)
    })
  },

  async fetchUserBySlug({ commit }, slug) {
    return await this.$axios.get(`api/user/getBySlug/${slug}`).then((res) => {
      return res.data
    })
  },

  async getUserSlugById({ commit }, id) {
    return await this.$axios.get(`api/user/get/${id}`).then((res) => {
      return res.data.slug
    })
  },

  async getUserInfoBySlug({ commit }, slug) {
    return await this.$axios.get(`api/peoples/bySlug/${slug}`).then((res) => {
      return res
    })
  },

  async getUserSummaryById({ commit }, slug) {
    return await this.$axios
      .get(`api/admin/user/summary/${slug}`)
      .then((res) => {
        return res
      })
  },

  async mergeUsers({ commit }, payload) {
    return await this.$axios
      .post(
        `api/admin/user/merge/${payload.keepUserId}/${payload.removeUserId}`,
        payload
      )
      .then((res) => {
        return res
      })
  },

  async getAdminUsersList({ commit }, payload) {
    let str = ''
    for (const key in payload) {
      if (str !== '') {
        str += '&'
      }
      const val = payload[key] === null ? '' : payload[key]
      str += key + '=' + encodeURIComponent(val)
    }
    return await this.$axios.get(`api/admin/user?${str}`).then((res) => {
      commit('setAdminUsersList', res.data)
    })
  },

  async switchUser({ state, dispatch, commit }, payload) {
    await this.$axios.get(`api/super-admin/login-as/${payload}`).then((res) => {
      dispatch('authentication/setToken', res.data, { root: true })
      this.$router.push('/user/profile/')
    })
  },

  getPublicUsersList({ commit }, payload) {
    let str = ''
    for (const key in payload) {
      if (payload[key]) {
        if (str !== '') {
          str += '&'
        }
        const val = payload[key]
        str += key + '=' + encodeURIComponent(val)
      }
    }
    return this.$axios.get(`api/people-directory/get?${str}`).then((res) => {
      commit('setPublicUsersList', res.data)
    })
  },

  async getUserATP({ commit }, id) {
    return await this.$axios.get(`api/user/atp/${id}`).then((res) => {
      return res.data
    })
  },
}
