export default {
  setFilters({ commit, state }, payload) {
    commit('setFilters', payload)
  },

  getCoachMessages({ commit, state }) {
    let url =
      'api/coach/coach-message/?page=' +
      state.filters.currentPage +
      '&type=' +
      state.filters.type
    if (state.messageTable.filter) {
      url += '&search=' + state.messageTable.filter
    }
    return this.$axios.get(url).then((res) => {
      commit('setCoachMessages', res.data.data)
      commit('setMessageTable', res.data)
    })
  },

  async getEmailLogs({ commit, state }, messageId) {
    return await this.$axios.get(`api/coach/coach-message/${messageId}/logs`)
  },

  getshowCoachProjects({ commit, state }, { projectFilters }) {
    let url = `api/coach/coach-message/projects?page=${projectFilters.currentPage}&limit=${projectFilters.limit}`
    if (projectFilters.project_id !== '') {
      url += '&project_number=' + projectFilters.project_id
    }
    if (projectFilters.name !== '') {
      url += '&name=' + projectFilters.name
    }
    if (projectFilters.space_types) {
      url += '&space_types[]=' + projectFilters.space_types
    }
    if (projectFilters.project_type) {
      url += '&project_type=' + projectFilters.project_type
    }
    if (projectFilters.project_public) {
      url += '&project_public=' + projectFilters.project_public
    }
    if (projectFilters.coaching_contact_id) {
      url += '&coaching_contact_id=' + projectFilters.coaching_contact_id
    }
    if (projectFilters.other_certification) {
      url += '&other_certification=' + projectFilters.other_certification
    }
    if (projectFilters.portfolio) {
      url += '&portfolio=' + projectFilters.portfolio
    }
    if (projectFilters.v1_project === '1') {
      url += '&v1_project=1'
    } else if (projectFilters.v1_project === '0') {
      url += '&v1_project=0'
    }
    if (projectFilters.city !== '') {
      url += '&city=' + projectFilters.city
    }
    if (projectFilters.state !== '') {
      url += '&state=' + projectFilters.state
    }
    if (projectFilters.country_code !== '') {
      url += '&country_code=' + projectFilters.country_code
    }
    if (projectFilters.registration_status !== '') {
      url += '&registration_status=' + projectFilters.registration_status
    }
    if (projectFilters.project_phase_internal !== '') {
      url += '&project_phase_internal=' + projectFilters.project_phase_internal
    }
    if (projectFilters.agreement_status !== null) {
      url += '&agreement_status=' + projectFilters.agreement_status
    }
    if (projectFilters.industry !== null) {
      url += '&industry=' + projectFilters.industry
    }
    if (projectFilters.admin_email !== '') {
      url += '&user_email=' + projectFilters.admin_email
    }
    if (projectFilters.admin_organization !== '') {
      url += '&admin_org=' + projectFilters.admin_organization
    }
    if (projectFilters.owner_organization !== '') {
      url += '&owner_org=' + projectFilters.owner_organization
    }
    if (projectFilters.sort_by !== null) {
      url += '&' + projectFilters.sort_by
    }
    return this.$axios.get(url).then((res) => {
      commit('setProjects', res.data.data)
      commit('setProjectCount', res.data.total)
      commit('setProjectsinfo', res.data)
    })
  },
  getselectedProjects({ commit, state }, payload) {
    commit('setSelectedProjects', payload)
  },
  getSaveAsTemplate({ commit, state }, payload) {
    return this.$axios.post('api/coach/coach-message', payload)
  },
  getSendMail({ commit, state }, { recipData, Id }) {
    return this.$axios.post(
      'api/coach/coach-message/' + Id + '/mail',
      recipData
    )
  },
  getUpdateTemplate({ commit, state }, { msgData, Id }) {
    return this.$axios.put('api/coach/coach-message/' + Id, msgData)
  },
  getDeleteTemplate({ commit, state }, payload) {
    return this.$axios.delete('api/coach/coach-message/' + payload)
  },
}
