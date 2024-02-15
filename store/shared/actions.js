export default {
  setShowFeatures({ commit }, payload) {
    commit('setShowFeatures', payload)
  },
  async fetchSpaceTypes({ state, commit }) {
    return await this.$axios.get('api/spaceTypes').then((res) => {
      commit('setSpaceTypes', res.data)
    })
  },
  async getDocuments({ commit }, payload) {
    return await this.$axios
      .get(
        `api/scorecard/${payload.id}/document?name=${
          payload.name ? payload.name : ''
        }`
      )
      .then((res) => {
        commit('setDocuments', res.data)
      })
  },
  async getWprDocuments({ commit }, payload) {
    return await this.$axios
      .get(
        `api/scorecard/${payload.id}/document?name=${
          payload.name ? payload.name : ''
        }`
      )
      .then((res) => {
        commit('setWprDocuments', res.data)
      })
  },
  resetAllVariables({ commit }) {
    commit('resetAllVariables')
  },
  setfilters({ commit }, payload) {
    commit('setfilters', payload)
  },
  resetFilters({ commit }) {
    commit('resetFilters')
  },
  async setSubsetFilters({ commit, dispatch }, payload) {
    await commit('setSubsetFilters', payload)
  },
  resetSubsetFilters({ commit }) {
    commit('resetSubsetFilters')
  },
  async getAdminPortfolioList({ commit }, payload) {
    let str = ''
    for (const key in payload) {
      if (payload[key] !== null && payload[key] !== '') {
        if (str !== '') str += '&'
        str += key + '=' + encodeURIComponent(payload[key])
      }
    }
    return await this.$axios.get(`api/admin/portfolio?${str}`).then((res) => {
      commit('setAdminPortfolioList', res.data)
    })
  },

  setActiveTab({ commit }, payload) {
    commit('setActiveTab', payload)
  },
  storeSharedDetails({ commit }, payload) {
    commit('storeSharedDetails', payload)
  },
  getSharedWorkspace({ commit, dispatch }, payload) {
    return new Promise((resolve, reject) => {
      this.$axios
        .get('api/portfolio/byNumber/' + payload.id)
        .then((response) => {
          const resp = response.data
          commit('storeSharedDetails', resp)
          dispatch('getSharedWorkspaceInvoiceList', {
            id: response.data.id,
          })
          if (resp.addresses && resp.addresses.length) {
            // set owner address
            const owner = resp.addresses.filter((a) => a.is_shipping)[0]
            resp.owner_country_code = owner.country_code
            resp.owner_city = owner.city
            resp.owner_street = owner.street
            resp.owner_state = owner.state
            resp.owner_postal_code = owner.postal_code
            const billing = resp.addresses.find((a) => a.is_billing)
            if (billing) {
              resp.billing_country_code = billing.country_code
              resp.billing_city = billing.city
              resp.billing_street = billing.street
              resp.billing_state = billing.state
              resp.billing_postal_code = billing.postal_code
            }
          }
          dispatch('getSharedWorkspaceMembers')
          resolve(response.data)
        })
    })
  },
  async updateSharedWorkspaceInfo({ state, dispatch }, payload) {
    return await this.$axios
      .put(`api/portfolio/update/${payload.id}`, payload)
      .then((res) => {
        dispatch('getSharedWorkspace', { id: payload.portfolio_number })
      })
  },

  async updateExternalReviewers({ state }, payload) {
    await this.$axios.post(
      `api/admin/portfolio/external/attach/${state.sharedWorkspace.id}`,
      payload
    )
  },

  getAdminUsersByRole({ commit }, role) {
    return new Promise((resolve, reject) => {
      const roleTypeActions = {
        'project-coach': 'setCoachingContacts',
        'well-assessor': 'setWellReviewers',
        'external-reviewer': 'setExternalReviewers',
        'well-pta': 'setPtAgents',
      }
      const modelAction = roleTypeActions[role]

      this.$axios.get(`api/admin/user?role=${role}`).then((res) => {
        const response = res.data.data.map((users) => {
          const optionText = users.name + ' (' + users.email + ')'
          return { label: optionText, value: users.id }
        })
        commit(`${modelAction}`, response)
        resolve(response)
      })
    })
  },

  getAdminUsersByRoleWithLimitedFields({ commit }) {
    return new Promise((resolve, reject) => {
      const roleTypeActions = {
        'project-coach': 'setCoachingContacts',
        'well-assessor': 'setWellReviewers',
        'external-reviewer': 'setExternalReviewers',
        'well-pta': 'setPtAgents',
      }
      const role = [
        'project-coach',
        'well-assessor',
        'external-reviewer',
        'well-pta',
      ]

      this.$axios
        .get(`api/admin/user`, {
          params: {
            role,
            min_fields: 'yes',
            paginate: 'no',
          },
        })
        .then((res) => {
          role.forEach((el) => {
            let response = []
            res.data.forEach((user) => {
              if (user.roles.find((a) => a.name === el)) response.push(user)
            })
            response = response.map((users) => {
              const optionText = users.name + ' (' + users.email + ')'
              return { label: optionText, value: users.id }
            })
            commit(`${roleTypeActions[el]}`, response)
          })

          resolve()
        })
    })
  },

  saveSharedProfile({ state }, data) {
    return new Promise((resolve, reject) => {
      this.$axios
        .post('api/portfolio/' + state.sharedWorkspace.id + '/profile', data)
        .then((res) => {
          resolve(res.data)
        })
        .catch((res) => {
          reject(res.data)
        })
    })
  },
  updateSharedProfile({ state }, data) {
    return new Promise((resolve, reject) => {
      this.$axios
        .put('api/portfolio/' + state.sharedWorkspace.id + '/profile', data)
        .then((res) => {
          resolve(res.data)
        })
        .catch((res) => {
          reject(res.data)
        })
    })
  },
  async createSharedWorkspace({ state, commit }) {
    await this.$axios
      .post('api/portfolio/store', state.sharedWorkspace)
      .then((response) => {
        const res = {
          ...state.sharedWorkspace,
          id: response.data.id,
          portfolio_number: response.data.portfolio_number,
        }
        commit('storeSharedDetails', res)
      })
  },
  async getSharedWorkspaceInvoiceList({ commit }, payload) {
    await this.$axios
      .get('api/portfolio/' + payload.id + '/invoices')
      .then((response) => {
        commit('storeInvoiceDetails', response.data)
      })
  },

  async sendAgreement({ state, commit }, payload) {
    await this.$axios
      .get(`api/portfolio/agreement/${payload}`, { params: { type: 'wpr' } })
      .then((response) => {
        const sharedWorkspace = state.sharedWorkspace
        sharedWorkspace.agreement_status = 1
        commit('storeSharedDetails', sharedWorkspace)
      })
  },

  async sendviaEmail({ state, commit }, payload) {
    await this.$axios
      .get(`api/portfolio/agreement/${payload}`, { params: { type: 'v2-hsr' } })
      .then((response) => {
        const sharedWorkspace = state.sharedWorkspace
        sharedWorkspace.agreement_status = 1
        commit('storeSharedDetails', sharedWorkspace)
      })
  },
  async updateSharedWorkspace({ state, dispatch }, payload) {
    await this.$axios
      .put('api/portfolio/update/' + payload.id, payload)
      .then((response) => {
        dispatch('getSharedWorkspace', { id: payload.portfolio_number })
      })
  },
  async getPricingDetails({ state, commit }, payload) {
    const url = `api/portfolio/${state.sharedWorkspace.id}/hsr-pricing/estimate`

    await this.$axios
      .get(url, {
        params: {
          ...payload,
        },
      })
      .then((response) => {
        commit('storePricingDetails', response.data)
      })
      .catch((response) => {})
  },
  getSharedWorkspaceMembers({ state, commit }) {
    this.$axios
      .get(`api/portfolio/${state.sharedWorkspace.id}/members`)
      .then((response) => {
        const shared = { ...state.sharedWorkspace, members: response.data }
        commit('storeSharedDetails', shared)
      })
  },
  inviteMember({ state, dispatch }, payload) {
    const newMemberData = { ...payload }
    newMemberData['redirect-url'] = 'none'

    this.$axios
      .post(
        'api/portfolio/invite/' + state.sharedWorkspace.id + '/',
        newMemberData
      )
      .then((res) => {
        dispatch('getSharedWorkspaceMembers', state.sharedWorkspace.id)
      })
  },
  removeMember({ state, dispatch }, userId) {
    this.$axios
      .post(
        'api/portfolio/member/detach/' + state.sharedWorkspace.id + '/' + userId
      )
      .then((res) => {
        dispatch('getSharedWorkspaceMembers', state.sharedWorkspace.id)
      })
  },
  async getSharedProjects({ state, commit }, data) {
    let payload = { ...state.filters }
    let area = ''
    switch (state.filters.filter_area) {
      case '<10,000':
        area = { max: 9999 }
        break

      case '10,000+':
        area = { min: 10000, max: 49999 }
        break

      case '50,000+':
        area = { min: 50000, max: 199999 }
        break

      case '200,000+':
        area = { min: 200000, max: 499999 }
        break

      case '500,000+':
        area = { min: 500000, max: 999999 }
        break

      case '1,000,000+':
        area = { min: 1000000 }
        break
    }
    if (area) {
      payload.filter_area = [area]
    } else {
      payload.filter_area = []
    }
    let url =
      'api/portfolio/' +
      state.sharedWorkspace.id +
      `/getWizardProjects?sort=desc${
        state.filters.deleted_at
          ? '&deleted_at=' + state.filters.deleted_at
          : '&deleted_at=all'
      }`
    if (data.type !== undefined) {
      url += '&type=' + data.type
    }
    if (data.paginate === 'no') {
      url += '&paginate=no'
      payload = { ...payload, fields: ['project_number', 'id', 'name'] }
    } else {
      url += '&paginate=yes&page=' + data.page
    }

    await this.$axios.post(url, payload).then((response) => {
      if (data.paginate !== 'no') {
        commit('setPaginatedLocations', response.data)
      } else {
        commit('setAllLocations', response.data)
      }
    })
  },
  async getScorecardDocuments({ state, commit, rootState }, data) {
    commit('setScorecardDocuments', [])
    let url =
      'api/portfolio/' +
      rootState.shared.sharedWorkspace.id +
      '/scorecard/documents?paginate=yes&limit=20&page=' +
      data.page +
      '&name=' +
      data.name
    if (data.type !== undefined) {
      for (let i = 0; i < data.type.length; ++i) {
        if (url.includes('?') === -1) {
          url = url + '?type[]=' + data.type[i]
        } else {
          url = url + '&type[]=' + data.type[i]
        }
      }
    }
    if (data.filterShared !== undefined && data.filterShared) {
      url += '&projects=yes&portfolio_subsets=yes'
    }
    await this.$axios.get(url).then((response) => {
      commit('setScorecardDocuments', response.data)
    })
  },
  async getScorecardAuditDocuments({ state, commit, rootState }, data) {
    commit('setScorecardDocuments', [])
    const paginate = data.paginate !== undefined ? data.paginate : 'yes'
    // let url = `api/portfolio/${data.scorecardId}/scorecard/documents`
    let url =
      'api/portfolio/' + rootState.shared.sharedWorkspace.id + '/auditDocument'
    if (paginate === 'yes') {
      url +=
        '?page=' +
        data.page +
        '&limit=20&paginate=' +
        paginate +
        '&name=' +
        data.name
    }
    if (data.type !== undefined) {
      for (let i = 0; i < data.type.length; ++i) {
        if (url.includes('?') === -1) {
          url = url + '?type[]=' + data.type[i]
        } else {
          url = url + '&type[]=' + data.type[i]
        }
      }
    }
    if (data.filterShared !== undefined && data.filterShared) {
      if (url.includes('?') === -1) {
        url += '&projects=yes&portfolio_subsets=yes'
      } else {
        url += '?projects=yes&portfolio_subsets=yes'
      }
    }
    await this.$axios.get(url).then((response) => {
      const result = paginate === 'yes' ? response.data.data : response.data
      const projects = []
      if (result.length) {
        result.map((element) => {
          if (
            projects.filter((a) => a.id === element.project_id).length === 0
          ) {
            projects.push({ id: element.project_id })
          }
          return projects
        })
        projects.map((element, index) => {
          projects[index] = {
            id: element.id,
            documents: result.filter((a) => a.project_id === element.id),
          }
          return projects[index]
        })
      }
      if (paginate === 'yes') {
        response.data.data = projects
      } else {
        response.data = projects
      }
      commit('setScorecardAuditDocuments', response.data)
    })
  },
  async getProjectSummary({ state, commit }) {
    await this.$axios
      .get(`api/portfolio/${state.sharedWorkspace.id}/auditDocumentNew`)
      .then((response) => {
        commit('setProjectSummary', response.data.parts)
      })
  },
  async getuploadDocument({ state, commit }, payload) {
    await this.$axios
      .post('api/portfolio/' + payload.scorecardId + '/document', payload.data)
      .then((response) => {})
  },
  async downloadAllDocuments({ state, commit }, payload) {
    let data = {}
    if (
      payload !== undefined &&
      Object.prototype.hasOwnProperty.call(payload, 'hsr')
    ) {
      data = {
        hsr: 'yes',
      }
    }

    await this.$axios
      .post(
        'api/documentAllDownload-portfolio/' + state.sharedWorkspace.id,
        data
      )
      .then((response) => {})
  },

  uploadScorecardDocument({ state, commit }, payload) {
    return new Promise((resolve, reject) => {
      this.$axios
        .post(
          'api/scorecard/' + payload.scorecardId + '/document-upload',
          payload.data
        )
        .then((response) => {
          resolve(response)
        })
        .catch((err) => {
          reject(err.response)
        })
    })
  },
  updateScorecardDocument({ state, commit }, payload) {
    return new Promise((resolve, reject) => {
      this.$axios
        .post(
          'api/scorecard/' +
            payload.scorecardId +
            '/document/' +
            payload.doc_id +
            '?_method=PUT',
          payload.data
        )
        .then((response) => {
          resolve(response)
        })
        .catch((err) => {
          reject(err.response)
        })
    })
  },
  async getFeaturesandPartswithFilters({ commit }, data) {
    const id = data.id
    const url = 'api/version/' + id
    await this.$axios.post(url, data.filters).then((response) => {
      commit('setFeatureandParts', {
        response: Object.values(response.data),
      })
    })
  },
  async deleteScorecardDocuments({ state, rootState, dispatch }, data) {
    await this.$axios
      .delete('api/scorecard/' + data.scorecardId + '/document/' + data.id)
      .then((response) => {})
  },
  async deleteDocument({ state, rootState, dispatch }, data) {
    await this.$axios
      .delete(
        'api/portfolio/' + state.sharedWorkspace.id + '/document/' + data.id
      )
      .then((response) => {
        dispatch('getDocumentList', {
          id: state.sharedWorkspace.id,
          page: data.page,
          name: '',
        })
      })
  },

  async getDocumentList({ state, commit }, data) {
    const url =
      'api/portfolio/' +
      data.id +
      '/documents?page=' +
      data.page +
      '&name=' +
      data.name
    await this.$axios.get(url).then((response) => {
      commit('setList', response.data)
    })
  },
  async getSharedSubsetProjects({ state, commit }, data) {
    const subsetFilters = {
      ...state.subsetFilters,
      fields: ['project_number', 'id', 'name', 'type'],
    }
    let area = ''
    switch (state.subsetFilters.filter_area) {
      case '<10,000':
        area = { max: 9999 }
        break

      case '10,000+':
        area = { min: 10000, max: 49999 }
        break

      case '50,000+':
        area = { min: 50000, max: 199999 }
        break

      case '200,000+':
        area = { min: 200000, max: 499999 }
        break

      case '500,000+':
        area = { min: 500000, max: 999999 }
        break

      case '1,000,000+':
        area = { min: 1000000 }
        break
    }

    if (area) {
      subsetFilters.filter_area = [area]
    } else {
      subsetFilters.filter_area = []
    }
    let url = null

    if (state.sharedWorkspace.id) {
      url =
        'api/portfolio/' + state.sharedWorkspace.id + '/allProjects?sort=desc'
    } else {
      url = 'api/portfolio/' + data.id + '/allProjects?sort=desc'
    }
    if (data.type !== undefined) {
      url += '&type=' + data.type
    }
    url += '&paginate=no'
    await this.$axios.post(url, subsetFilters).then((response) => {
      commit('setSubsetProjects', response.data)
    })
  },
  exportProjects({ state, rootState }) {
    window.open(
      this.$axios.defaults.baseURL +
        'api/portfolio/' +
        state.sharedWorkspace.id +
        '/project/excelExport?token=' +
        rootState.authentication.token,
      '_blank'
    )
  },
  submitParseProject({ state }, payload) {
    return new Promise((resolve, reject) => {
      this.$axios
        .post('api/portfolio/projects/' + state.sharedWorkspace.id, payload)
        .then((response) => {
          resolve(response)
        })
        .catch((error) => {
          reject(error)
        })
    })
  },
  uploadLocations({ state }, payload) {
    state.bulkApiLoading = true
    const fd = new FormData()
    fd.append('file', payload.file)
    fd.append('type', payload.type)
    fd.append('unit', payload.unit)
    return new Promise((resolve, reject) => {
      this.$axios
        .post(
          `api/portfolio/${state.sharedWorkspace.id}/project/excel-parse`,
          fd
        )
        .then((response) => {
          resolve(response.data)
        })
        .catch((err) => {
          reject(err)
        })
    })
  },
  updateLocation({ state }, payload) {
    return new Promise((resolve, reject) => {
      const url = 'api/project/update/' + payload.id
      this.$axios
        .put(url, payload)
        .then((response) => {
          resolve(response)
        })
        .catch((error) => {
          reject(error)
        })
    })
  },
  getSubsetList({ commit, state }) {
    const url = `api/portfolio/${state.sharedWorkspace.id}/subsets`
    return new Promise((resolve, reject) => {
      this.$axios
        .get(url)
        .then((response) => {
          commit('setSubsetList', response.data)
          resolve(response.data)
        })
        .catch((error) => {
          reject(error.response.data)
        })
    })
  },
  createSubset({ state }, data) {
    const url = `api/portfolio/${state.sharedWorkspace.id}/subset`
    return new Promise((resolve, reject) => {
      this.$axios
        .post(url, data)
        .then((response) => {
          resolve(response.data)
        })
        .catch((error) => {
          reject(error.response.data)
        })
    })
  },
  getSharedFilterList({ commit }, payload) {
    const data = {
      field_array: [
        'country_code',
        'space_types',
        'area',
        'industry',
        'construction_status',
        'construction_type',
        'project_type',
      ],
    }
    return new Promise((resolve, reject) => {
      this.$axios
        .post(`api/portfolio/${payload.id}/portfolioSummary`, data)
        .then((response) => {
          commit('setSharedFilters', response.data)
          resolve(response.data)
        })
        .catch((err) => {
          reject(err.response.data)
        })
    })
  },
  downloadLocationCertificate({ state }, payload) {
    return new Promise((resolve) => {
      this.$axios
        .get(
          `api/portfolio/${payload.portfolio_id}/hsr-certificate/pdfExport?project_id=` +
            payload.location_id
        )
        .then((response) => {
          resolve(response)
        })
    })
  },
  downloadHsrCertificate({ state }, payload) {
    return new Promise((resolve) => {
      this.$axios
        .get(`api/portfolio/${payload.portfolio_id}/hsr-certificate/pdfExport`)
        .then((response) => {
          resolve(response)
        })
    })
  },
  downloadHsrLoa({ state }, payload) {
    return new Promise((resolve) => {
      this.$axios
        .get(
          `api/portfolio/${payload.portfolio_id}/hsr-loa-certificate/pdfExport`
        )
        .then((response) => {
          resolve(response)
        })
    })
  },
  downloadHsrAllCertificate({ state }, payload) {
    return new Promise((resolve) => {
      this.$axios
        .get(
          `api/portfolio/${payload.portfolio_id}/hsr-certificate/downloadAll`
        )
        .then((response) => {
          resolve(response)
        })
    })
  },
  syncSubset({ state, dispatch }, payload) {
    return new Promise((resolve, reject) => {
      this.$axios
        .post(
          `api/portfolio/${state.sharedWorkspace.id}/project/${payload.project_id}/subsetSync`,
          { subset_ids: payload.subset_ids }
        )
        .then((response) => {
          dispatch('getSubsetList')
          resolve(response)
        })
        .catch((response) => {
          reject(response.data.errors)
        })
    })
  },
  createAAP({ state, dispatch }, payload) {
    this.$axios.post('api/aap/create', payload).then((res) => {
      dispatch('getStrategies', { portfolio_id: state.sharedWorkspace.id })
    })
  },

  updateAAP({ state, dispatch }, payload) {
    this.$axios.put(`api/admin/aap/${payload.id}`, payload).then((res) => {
      dispatch('getStrategies', { portfolio_id: state.sharedWorkspace.id })
    })
  },
  async getStrategies({ commit }, payload) {
    let str = ''
    for (const key in payload) {
      if (str !== '') {
        str += '&'
      }
      const val = payload[key] === null ? '' : payload[key]
      str += key + '=' + encodeURIComponent(val)
    }

    return await this.$axios.get(`api/aap/all?${str}`).then((res) => {
      commit('setStrategies', res.data)
    })
  },
  getSubsets({ state }, payload) {
    return new Promise((resolve, reject) => {
      this.$axios
        .get(
          `api/scorecard/${state.sharedWorkspace.hsr_scorecard_id}/document/${payload}/portfolioSubsets?paginate=no`
        )
        .then((response) => {
          resolve(response)
        })
    })
  },
  getProjects({ state }, payload) {
    return new Promise((resolve, reject) => {
      this.$axios
        .get(
          `api/scorecard/${state.sharedWorkspace.hsr_scorecard_id}/document/${payload.id}/projects?page=${payload.page}`
        )
        .then((response) => {
          resolve(response)
        })
    })
  },
  downloadCoA({ state }, payload) {
    return new Promise((resolve) => {
      this.$axios
        .get(`api/portfolio/${payload.portfolio_id}/confirmationOfAgreement`)
        .then((response) => {
          resolve(response)
        })
    })
  },
  getCompanies({ state }) {
    return new Promise((resolve) => {
      this.$axios.get(`api/organizations`).then((response) => {
        resolve(response)
      })
    })
  },
  togglesharedDiscounts({ state }, payload) {
    return new Promise((resolve) => {
      this.$axios
        .put(
          `api/portfolio/discount/${state.sharedWorkspace.id}/${payload}/toggle`
        )
        .then((response) => {
          resolve(response)
        })
    })
  },
  getQuote({ state }, payload) {
    return new Promise((resolve) => {
      this.$axios
        .put(`/api/portfolio/${state.sharedWorkspace.id}/quote/export`)
        .then((response) => {
          resolve(response)
        })
    })
  },
  activateLocation({ state }, payload) {
    return new Promise((resolve, reject) => {
      this.$axios
        .post(
          `/api/portfolio/${state.sharedWorkspace.id}/project/${payload}/restore`
        )
        .then((response) => {
          resolve(response)
        })
        .catch((err) => {
          reject(err)
        })
    })
  },
}
