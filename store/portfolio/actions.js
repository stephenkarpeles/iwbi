export default {
  async fetchSpaceTypes({ state, commit }) {
    return await this.$axios.get('api/spaceTypes').then((res) => {
      commit('setSpaceTypes', res.data)
    })
  },

  async getAnalyzeDummyData({ state, commit }, payload) {
    try {
      const res = await this.$axios.get(
        `api/${payload.mode}/${payload.id}/dashboard/get`
      )
      commit('setAnalyzeDummyData', res.data)
    } catch (error) {
      throw new Error(error)
    }
  },

  async bulkUploadProperties({ state, commit }, payload) {
    const formData = new FormData()
    formData.append('file', payload.file)
    formData.append('action', payload.action)
    formData.append('model_id', payload.model_id)
    formData.append('model_type', payload.model_type)

    let mappings = null

    await this.$axios
      .post('api/bulkImport/upload', formData, {
        'Content-Type': 'multipart/form-data', // The essential
      })
      .then((res) => {
        mappings = res.data
      })

    return mappings
  },

  async bulkImportInfo({ state, commit }, payload) {
    return await this.$axios.get(`api/bulkImport/get/${payload.import_id}`)
  },

  async createInvoice({ state, commit }, payload) {
    return await this.$axios.post(
      `api/admin/portfolio/${payload.portfolio_id}/invoice/create`,
      { type: payload.type }
    )
  },

  async bulkImportStore({ state, commit }, payload) {
    return await this.$axios.post('api/bulkImport/store', {
      import_id: payload.id,
    })
  },

  async bulkUploadValidate({ state, commit }, payload) {
    let data = null
    await this.$axios.post('api/bulkImport/validate', payload).then((res) => {
      data = res.data
    })
    return data
  },

  async getPortfolioList({ commit }, payload) {
    let str = ''
    for (const key in payload) {
      if (payload[key] !== null && payload[key] !== '') {
        if (str !== '') str += '&'
        str += key + '=' + encodeURIComponent(payload[key])
      }
    }

    return await this.$axios.get(`api/user/portfolios?${str}`).then((res) => {
      commit('setPortfolioList', res.data)
    })
  },

  createNewProperty({ commit }, payload) {
    return new Promise((resolve, reject) => {
      this.$axios
        .post('api/portfolio/projects/' + payload.id, payload.data)
        .then((response) => {
          resolve(response)
        })
        .catch((error) => {
          reject(error)
        })
    })
  },

  async setSubsetFilters({ commit, dispatch }, payload) {
    await commit('setSubsetFilters', payload)
  },

  createSubset({ commit }, payload) {
    const url = `api/portfolio/${payload.id}/subset`
    return new Promise((resolve, reject) => {
      this.$axios
        .post(url, payload.data)
        .then((response) => {
          resolve(response.data)
        })
        .catch((error) => {
          reject(error.response.data)
        })
    })
  },

  async sendviaEmail({ state, commit }, payload) {
    await this.$axios
      .get(`api/portfolio/agreement/${payload.id}`, {
        params: { type: payload.type },
      })
      .then((response) => {
        const portfolio = state.portfolio
        portfolio.agreement_status = 1
        commit('storePortfolioDetails', portfolio)
      })
  },

  async updatePortfolio({ commit }, payload) {
    return await this.$axios
      .put(`api/portfolio/update/${payload.id}`, payload.data)
      .then((res) => {
        commit('portfolio', res.data)
      })
  },

  async updateExternalReviewers({ state, dispatch }, payload) {
    await this.$axios
      .post(
        `api/admin/portfolio/external/attach/${state.portfolio.id}`,
        payload
      )
      .then((res) => {
        dispatch(
          'notifications/toastMessage',
          {
            message: 'External reviewers updated successfully!',
          },
          { root: true }
        )
      })
  },

  async registerPortfolio({ commit }, payload) {
    return await this.$axios
      .post(`api/portfolio/register/${payload.id}`, payload.data)
      .then((res) => {
        commit('portfolio', res.data)
      })
  },
  storePortfolioDetails({ state, commit }, payload) {
    commit('storePortfolioDetails', payload)
  },
  createPortfolio({ state, commit }, payload) {
    this.$axios.post(`api/portfolio/store`, payload).then((response) => {
      this.$router.push(
        '/portfolio/' + response.data.portfolio_number + '/dashboard'
      )
    })
  },

  async getCoachPortfolio({ commit }, payload) {
    let str = ''
    for (const key in payload) {
      if (payload[key] !== null && payload[key] !== '') {
        if (str !== '') str += '&'
        str += key + '=' + encodeURIComponent(payload[key])
      }
    }
    return await this.$axios.get(`/api/coach/portfolio?${str}`).then((res) => {
      commit('setPortfolioList', res.data)
    })
  },

  async getPortfolio({ commit, dispatch, nuxt }, payload) {
    let type = ''
    if (payload.type) {
      type = payload.type
    } else {
      type = 'v2-pilot'
    }
    const id = parseInt(payload.id.toString().substring(5, 10))

    return await this.$axios
      .get(`api/portfolio/${id}?type=${type}`)
      .then((res) => {
        commit('setPortfolio', res.data)
        dispatch('getInvoiceList', payload)
        if (res.data.estimates.length) {
          dispatch('getPortfolioEstimate', res.data.estimates[0].id)
        }
        return 'success'
      })
      .catch(function (err) {
        return err
      })
  },

  async getPendingInvites({ commit }, id) {
    return await this.$axios
      .get(`api/portfolio/${id}/inviteList`)
      .then((res) => {
        return res
      })
  },

  async getPortfolioById({ commit, dispatch, nuxt }, payload) {
    let type = ''
    if (payload.type) {
      type = payload.type
    } else {
      type = 'v2-pilot'
    }
    const id = payload.id

    return await this.$axios
      .get(`api/portfolio/${id}?type=${type}`)
      .then((res) => {
        commit('setPortfolio', res.data)
        dispatch('getInvoiceList', payload)
        if (res.data.estimates.length) {
          dispatch('getPortfolioEstimate', res.data.estimates[0].id)
        }
        return 'success'
      })
      .catch(function (err) {
        return err
      })
  },

  async getFilterProjects({ commit, state }, data) {
    let payload = { ...state.projectFilter }
    let area = ''
    switch (state.projectFilter.filter_area) {
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
      state.portfolio.id +
      `/getWizardProjects?sort=desc${
        state.projectFilter.deleted_at
          ? '&deleted_at=' + state.projectFilter.deleted_at
          : '&deleted_at=all'
      }`
    if (data.type !== undefined) {
      url += '&type=' + data.type
    }
    if (data.paginate === 'no') {
      url += '&paginate=no'
      payload = { ...payload, fields: ['project_number', 'id', 'name', 'type'] }
    } else {
      url += '&paginate=yes&page=' + data.page
    }

    if (data.sortBy && data.sortBy !== undefined && data.sortBy !== 'null') {
      url += `&orderBy=${data.sortBy}`
    }
    if (data.name) {
      url += `&name=${data.name}`
    }

    await this.$axios.post(url, payload).then((response) => {
      if (data.paginate !== 'no') {
        commit('setPaginatedLocations', response.data)
        commit('setAllLocations', response.data)
      } else {
        commit('setAllLocations', response.data)
      }
    })
  },
  updateAnalyzeMode({ commit }, payload) {
    commit('setAnalyzeMode', payload)
  },
  setPortfolioPagination({ commit }, payload) {
    commit('setPortfolioPagination', payload)
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

  uploadLocations({ state }, payload) {
    state.bulkApiLoading = true
    const fd = new FormData()
    fd.append('file', payload.file)
    fd.append('type', payload.type)
    fd.append('unit', payload.unit)
    fd.append('project_type', payload.project_type)
    return new Promise((resolve, reject) => {
      this.$axios
        .post(`api/portfolio/${state.portfolio.id}/project/excel-parse`, fd)
        .then((response) => {
          resolve(response.data)
        })
        .catch((err) => {
          reject(err)
        })
    })
  },
  getPortfolioMembers({ state, rootState, commit }) {
    return new Promise((resolve, reject) => {
      this.$axios
        .get(`api/portfolio/${state.portfolio.id}/members`)
        .then((response) => {
          commit('setPortfolioMembers', response.data)
          if (
            rootState.user.currentUser &&
            Object.keys(rootState.user.currentUser).length
          ) {
            if (
              state.portfolioMembers.filter(
                (a) => a.email === rootState.user.currentUser.email
              ).length
            ) {
              const checkInviteAccess = state.portfolioMembers.filter(
                (a) => a.email === rootState.user.currentUser.email
              )[0].pivot.role
              commit('setCheckInviteAccess', checkInviteAccess)
            }
          }
          resolve()
        })
        .catch((err) => {
          reject(err.response.data)
        })
    })
  },
  getInvoiceList({ state, commit }, payload) {
    return new Promise((resolve, reject) => {
      this.$axios
        .get(`api/portfolio/${state.portfolio.id}/invoices`)
        .then((response) => {
          commit('setInvoiceDetails', response.data)

          resolve()
        })
        .catch((err) => {
          reject(err.response.data)
        })
    })
  },
  getProjectLocations({ commit, rootState, state }, payload) {
    const id = state.portfolio.id || payload.id

    if (id) {
      this.$axios
        .get('api/portfolio/' + id + '/project/locations', {
          token: rootState.authentication.token,
        })
        .then((response) => {
          commit('setProjectLocations', response.data)
        })
    }
  },
  getPortfolioEstimate({ state, commit }, id) {
    const url = 'api/portfolio/estimate/' + id
    this.$axios.get(url).then((response) => {
      commit('setEstimateValue', response.data)
    })
  },
  getSubscription({ state, commit, dispatch }, payload) {
    this.$axios
      .post('api/admin/portfolio/' + payload.type + '/' + payload.id)
      .then((response) => {
        dispatch('getPortfolio', { id: payload.id })
        dispatch('getInvoiceList')
      })
  },

  updateOccupancy({ state, commit, dispatch }, payload) {
    return this.$axios.post(
      `api/portfolio/${payload.portfolio_id}/projects/noOfOccupants/update`,
      payload
    )
  },

  signPortfolio({ state, dispatch }, portfolio) {
    this.$axios
      .post('api/portfolio/' + portfolio.id + '/aggrementSign')
      .then((res) => {
        dispatch('getPortfolioById', portfolio)
      })
  },

  getSubsetList({ commit, state, rootState }, payload) {
    let url
    if (payload && payload.type && payload.type === 'wpr') {
      url = `api/portfolio/${rootState.shared.sharedWorkspace.id}/subsets`
    } else {
      url = `api/portfolio/${state.portfolio.id}/subsets`
    }
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

  resetSubsetFilters({ commit }) {
    commit('resetSubsetFilters')
  },
  async deletePortfolioById({ state }, id) {
    return await this.$axios.delete(`api/portfolio/delete/${id}`)
  },

  async restorePortfolioById({ state }, id) {
    return await this.$axios.put(`api/portfolio/restore/${id}`)
  },

  updateProperty({ state }, payload) {
    return new Promise((resolve, reject) => {
      const url = 'api/project/update/' + payload.id
      this.$axios
        .put(url, payload.data)
        .then((response) => {
          resolve(response)
        })
        .catch((error) => {
          reject(error)
        })
    })
  },
  updatePropertiesArea({ state, dispatch, commit }, payload) {
    const url = `api/admin/portfolio/${payload.id}/updatePropertiesDetails`
    this.$axios
      .post(url)
      .then((response) => {
        dispatch(
          'notifications/toastMessage',
          {
            message: response.data.msg,
          },
          { root: true }
        )
      })
      .catch((err) => {
        dispatch(
          'notifications/toastMessage',
          {
            message: err.data.msg,
          },
          { root: true }
        )
      })
  },
  async getPricingDetails({ commit }, payload) {
    await this.$axios
      .get('api/portfolio/hsr-pricing', {
        params: { ...payload },
      })
      .then((response) => {
        commit('storePricingDetails', response.data)
      })
      .catch((response) => {})
  },
  detailsForExistingPortfolio({ commit }, payload) {
    commit('detailsForExistingPortfolio', payload)
  },
  optInHsr({ state }, payload) {
    return new Promise((resolve, reject) => {
      const url = 'api/portfolio/' + payload.id + '/hsrOptIn'
      this.$axios
        .post(url, state.existingPortfolio)
        .then((response) => {
          resolve(response)
        })
        .catch((err) => {
          reject(new Error(err))
        })
    })
  },
  optInWpr({ state }, payload) {
    return new Promise((resolve, reject) => {
      const url = 'api/portfolio/' + payload.id + '/wprOptIn'
      this.$axios
        .post(url, state.existingPortfolio)
        .then((response) => {
          resolve(response)
        })
        .catch((err) => {
          reject(new Error(err))
        })
    })
  },
  createAAP({ state, dispatch }, payload) {
    this.$axios.post('api/aap/create', payload).then((res) => {
      dispatch('getStrategies', { portfolio_id: state.portfolio.id })
    })
  },
  updateAAP({ state, dispatch }, payload) {
    this.$axios.put(`api/admin/aap/${payload.id}`, payload).then((res) => {
      if (state.portfolio !== null) {
        dispatch('getStrategies', { portfolio_id: state.portfolio.id })
      }
    })
  },
  getPortfolioProjects({ state, commit }, data) {
    return new Promise((resolve, reject) => {
      let url = 'api/portfolio/' + state.portfolio.id + '/projects?sort=desc'
      if (data.paginate === 'no') {
        url +=
          '&paginate=no&fields[]=project_number&fields[]=name&fields[]=id&fields[]=type'
      } else {
        url += '&paginate=yes&page=' + data.page
      }
      if (data.type !== undefined) {
        url += '&type=' + data.type
      }
      this.$axios
        .get(url)
        .then((response) => {
          if (data.paginate !== 'no') {
            commit('setPortfolioProjects', response.data)
          } else {
            commit('setSubsetProjects', response.data)
          }
          resolve(response.data)
        })
        .catch((err) => {
          reject(err.response.data)
        })
    })
  },

  getSharedSubset({ state, commit }, payload) {
    return new Promise((resolve, reject) => {
      this.$axios
        .get(
          `api/scorecard/${
            payload.hsrId ? payload.hsrId : state.portfolio.scorecard_id
          }/document/${payload.docId}/portfolioSubsets?paginate=no`
        )
        .then((response) => {
          commit('setSubsetList', response.data)
          resolve(response)
        })
    })
  },
  async getSharedProject({ state, commit }, payload) {
    return await this.$axios
      .get(
        `api/scorecard/${
          payload.hsrId ? payload.hsrId : state.portfolio.scorecard_id
        }/document/${payload.id}/projects?page=${payload.page}`
      )
      .then((response) => {
        if (!payload.all) {
          commit('setSubsetProjects', response.data.data)
        }
        return response.data
      })
  },

  async deleteScorecardDocuments({ state, rootState, dispatch }, data) {
    await this.$axios
      .delete('api/scorecard/' + data.scorecardId + '/document/' + data.id)
      .then((response) => {})
  },
  async getDocumentList({ commit }, id) {
    return await this.$axios
      .get(`api/project-document/${id}/all`)
      .then((res) => {
        commit('setDocuments', res.data)
      })
  },
  async getDocumentsList({ state, commit }, data) {
    let url = 'api/portfolio/' + data.id + '/documents?page=' + data.page

    if (data.name) {
      url += '&name=' + data.name
    }
    await this.$axios.get(url).then((response) => {
      commit('setList', response.data)
    })
  },
  async getSharedDocumentList({ commit }, payload) {
    if (payload.part_id) {
      return await new Promise((resolve, reject) => {
        this.$axios
          .get(
            `api/project-document/${payload.id}/shared-document/get?part_id=${payload.part_id}`,
            {
              page: payload.page,
            }
          )
          .then((res) => {
            commit('setSharedDocument', res.data)
            resolve(res.data.data)
          })
      })
    } else {
      return await new Promise((resolve, reject) => {
        this.$axios
          .get(`api/project-document/${payload.id}/shared-document/get`, {
            page: payload.page,
          })
          .then((res) => {
            commit('setSharedDocument', res.data)
            resolve(res.data.data)
          })
      })
    }
  },

  downloadCoA({ state }, payload) {
    return new Promise((resolve) => {
      this.$axios
        .get(
          `api/portfolio/${payload.id}/confirmationOfAgreement?pre_cert_fees=${payload.pre_cert_fees}`
        )
        .then((response) => {
          resolve(response)
        })
    })
  },

  downloadAllDocuments({ state, rootState }, payload) {
    return new Promise((resolve, reject) => {
      this.$axios
        .post(
          'api/documentAllDownload-portfolio/' + state.portfolio.id,
          payload
        )
        .then((result) => {
          resolve(result)
        })
        .catch((err) => {
          reject(err)
        })
    })
  },
  downloadScorecardDocuments({ state, rootState }) {
    return new Promise((resolve, reject) => {
      this.$axios
        .get('api/portfolio/' + state.portfolio.id + '/project/scorecardZip')
        .then((result) => {
          resolve(result)
        })
        .catch((err) => {
          reject(err)
        })
    })
  },
  async deleteDocument({ state, rootState, dispatch }, data) {
    await this.$axios
      .delete('api/portfolio/' + state.portfolio.id + '/document/' + data.id)
      .then((response) => {
        dispatch('getDocumentsList', {
          id: state.portfolio.id,
          page: data.page,
        })
      })
  },

  // Properties section
  setfilters({ commit }, payload) {
    commit('setfilters', payload)
  },

  resetFilters({ commit }) {
    commit('resetFilters')
  },

  syncSubset({ state, dispatch }, payload) {
    return new Promise((resolve, reject) => {
      this.$axios
        .post(
          `api/portfolio/${state.portfolio.id}/project/${payload.project_id}/subsetSync`,
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

  exportProjects({ state, rootState }) {
    window.open(
      this.$axios.defaults.baseURL +
        'api/portfolio/' +
        state.portfolio.id +
        '/project/excelExport?token=' +
        rootState.authentication.token,
      '_blank'
    )
  },
  downloadReview({ state, rootState }, payload) {
    return new Promise((resolve, reject) => {
      this.$axios
        .get('api/admin/portfolio/' + payload + '/reviewers/export')
        .then((res) => {
          resolve(res)
        })
        .catch((err) => {
          reject(err)
        })
    })
  },

  getPortfolioFilterList({ commit }, payload) {
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

  async getPortfolioSubsetProjects({ state, commit }, data) {
    const subsetFilters = {
      ...state.subsetFilters,
      fields: ['project_number', 'id', 'name'],
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

    if (state.portfolio.id) {
      url = 'api/portfolio/' + state.portfolio.id + '/allProjects?sort=desc'
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
  async getNotesList({ state, commit }, payload) {
    const id = parseInt(payload.id.toString().substring(5, 10))
    return await this.$axios.get(`api/portfolio/${id}/notes`).then((res) => {
      commit('setNotesList', res.data)
    })
  },
  async upgardePortfolio({ state, commit }, payload) {
    return await this.$axios
      .get(
        `api/admin/portfolio/${payload.id}/upgrade/${payload.versionSelected}?update_project=${payload.upgradeProjects}`
      )
      .then((res) => {})
  },

  // Portfolio/Team
  inviteMember({ state, dispatch }, payload) {
    return new Promise((resolve, reject) => {
      const newMemberData = { ...payload }
      newMemberData['redirect-url'] = 'none'

      this.$axios
        .post('api/portfolio/invite/' + state.portfolio.id + '/', newMemberData)
        .then((res) => {
          dispatch('getPortfolioMembers', state.portfolio.id)
          resolve(res)
        })
        .catch((err) => {
          reject(err)
        })
    })
  },

  removeMember({ state, dispatch }, userId) {
    this.$axios
      .post('api/portfolio/member/detach/' + state.portfolio.id + '/' + userId)
      .then((res) => {
        dispatch('getPortfolioMembers', state.portfolio.id)
      })
  },

  // HSR Documents
  getScorecardDocuments({ state, commit }, data) {
    commit('setScorecardDocuments', [])
    let url =
      'api/scorecard/' +
      data.scorecardId +
      '/document?paginate=yes&limit=20&page=' +
      data.page +
      '&name='
    if (data.name) {
      url += '&name=' + data.name
    }
    if (data.type !== undefined) {
      for (let i = 0; i < data.type.length; ++i) {
        if (!url.includes('?')) {
          url = url + '?type[]=' + data.type[i]
        } else {
          url = url + '&type[]=' + data.type[i]
        }
      }
    }
    if (data.filterShared !== undefined && data.filterShared) {
      url += '&projects=yes&portfolio_subsets=yes'
    }
    this.$axios.get(url).then((response) => {
      if (
        JSON.stringify(data.type) ===
        JSON.stringify(['Guideline', 'Portfolio-Scale'])
      ) {
        commit('setLibraryScorecardDocuments', response.data)
      }
      commit('setScorecardDocuments', response.data)
    })
  },
  async bulkUpdateProperties({ state, commit }, payload) {
    return await this.$axios.post(
      `api/portfolio/projects/${state.portfolio.id}/bulkUpdate`,
      payload
    )
  },

  getScorecardAuditDocuments({ state, commit }, data) {
    // pass paginate, scorecardId, page, type, filterShared
    commit('setScorecardDocuments', [])
    const paginate = data.paginate !== undefined ? data.paginate : 'yes'
    let url = 'api/scorecard/' + data.scorecardId + '/auditDocument'
    if (paginate === 'yes') {
      url += '?page=' + data.page + '&limit=20&paginate=' + paginate

      if (data.name) {
        url += '&name=' + data.name
      }
    }

    if (data.type !== undefined) {
      for (let i = 0; i < data.type.length; ++i) {
        if (!url.includes('?')) {
          url = url + '?type[]=' + data.type[i]
        } else {
          url = url + '&type[]=' + data.type[i]
        }
      }
    }

    if (data.filterShared !== undefined && data.filterShared) {
      if (!url.includes('?')) {
        url += '?projects=yes&portfolio_subsets=yes'
      } else {
        url += '&projects=yes&portfolio_subsets=yes'
      }
    }

    this.$axios.get(url).then((res) => {
      commit('setScorecardAuditDocuments', res.data)
    })
  },
  getAdminUsersByRole({ commit }) {
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
            paginate: 'no',
            min_fields: 'yes',
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

  async updateHsrDocument({ commit }, data) {
    return await this.$axios.put(
      `api/scorecard/${data.scorecard_id}/document/${data.id}`,
      data
    )
  },
  async getPropertiesFilteredFields({ state, commit }, id) {
    const subsetFilters = {
      fields: ['project_number', 'id', 'name'],
    }

    await this.$axios
      .post(
        'api/portfolio/' + id + '/allProjects?sort=desc&paginate=no',
        subsetFilters
      )
      .then((response) => {
        commit('setFilteredFieldsProperties', response.data)
      })
  },
}
