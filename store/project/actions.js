export default {
  setIsLoading({ commit }) {
    commit('setIsLoading')
  },
  async fetchSpaceTypes({ state, commit }) {
    return await this.$axios.get('api/spaceTypes').then((res) => {
      commit('setSpaceTypes', res.data)
    })
  },
  async getProjects({ commit }, payload) {
    let str = ''
    for (const key in payload) {
      if (payload[key] !== null && payload[key] !== '') {
        if (str !== '') str += '&'
        str += key + '=' + encodeURIComponent(payload[key])
      }
    }

    return await this.$axios.get('api/user/projects?' + str).then((res) => {
      commit('setProjects', res.data)
    })
  },
  async getAllUserProjects({ commit }, payload) {
    let str = ''
    for (const key in payload) {
      if (payload[key] !== null && payload[key] !== '') {
        if (str !== '') str += '&'
        str += key + '=' + encodeURIComponent(payload[key])
      }
    }

    if (payload.user_type === 'user') {
      return await this.$axios.get('api/user/projects?' + str).then((res) => {
        commit('setV2Projects', res.data)
      })
    } else {
      return await this.$axios
        .get('api/' + payload.user_type + '/project?' + str)
        .then((res) => {
          commit('setV2Projects', res.data)
          return res
        })
    }
  },
  async getV2Projects({ commit }, payload) {
    let str = ''
    for (const key in payload) {
      if (payload[key] !== null && payload[key] !== '') {
        if (str !== '') str += '&'
        str += key + '=' + encodeURIComponent(payload[key])
      }
    }

    if (payload.user_type === 'user') {
      return await this.$axios
        .get('api/user/projects?v1_project=0&type=v2&' + str)
        .then((res) => {
          commit('setV2Projects', res.data)
        })
    } else {
      return await this.$axios
        .get(
          'api/' + payload.user_type + '/project?v1_project=0&type=v2&' + str
        )
        .then((res) => {
          commit('setV2Projects', res.data)
          return res
        })
    }
  },
  async getV1Projects({ commit }, payload) {
    return await this.$axios
      .get(
        `api/user/projects?v1_project=1&page=${payload.currentPage}&name=${payload.name}&project_number=${payload.project_number}`
      )
      .then((res) => {
        commit('setV2Projects', res.data)
      })
  },
  async getShowProjects({ commit }, payload) {
    return await this.$axios
      .get(
        `api/${payload.user_type}/project?v1_project=1&page=${payload.currentPage}&name=${payload.name}&project_number=${payload.project_number}`
      )
      .then((res) => {
        commit('setV2Projects', res.data)
      })
  },
  async getProjectsForAdminRole({ commit, rootState }, payload) {
    let str = ''
    for (const key in payload) {
      if (payload[key] !== null && payload[key] !== '') {
        if (str !== '') str += '&'
        str += key + '=' + encodeURIComponent(payload[key])
      }
    }

    return await this.$axios
      .get(`/api/${payload.role}/project?${str}`)
      .then((res) => {
        commit('setV2Projects', res.data)
      })
  },
  async getProject({ commit, dispatch }, id) {
    return await this.$axios.get(`api/project/${id}`).then((res) => {
      commit('setProject', res.data)
      dispatch('setUserAccessLevel')
    })
  },
  async getProjectByNumber({ commit, dispatch }, projectNumber) {
    return await this.$axios
      .get(`api/project/byNumber/${projectNumber}`)
      .then((res) => {
        commit('setProject', res.data)
        dispatch('setUserAccessLevel')
      })
  },
  async getV1Project({ commit, dispatch }, projectId) {
    return await this.$axios
      .get(`api/well-v1/project/${projectId}`)
      .then((res) => {
        commit('setProject', res.data)
        dispatch('setUserAccessLevel')
      })
  },
  setUserAccessLevel({ commit, state, rootState }) {
    let level = false
    if (state.project) {
      level = state.project.members.find(
        (member) => member.id === rootState.user.currentUser.id
      )
    }
    if (level) {
      commit('setAccessLevel', level.pivot.role)
    } else {
      commit('setAccessLevel', false)
    }
  },
  async getAdminProjectsList({ commit }, payload) {
    let str = ''
    for (const key in payload) {
      if (payload[key] !== null && payload[key] !== '') {
        if (str !== '') str += '&'
        str += key + '=' + encodeURIComponent(payload[key])
      }
    }
    return await this.$axios.get(`api/admin/project?${str}`).then((res) => {
      commit('setAdminProjectsList', res.data)
    })
  },
  async projectPricing({ commit }, projectId) {
    return await this.$axios
      .get(`api/project/${projectId.id}/hsr-pricing`)
      .then((res) => {
        commit('setProjectPricing', res.data)
      })
  },
  sendviaEmailForProject({ state }, payload) {
    return new Promise((resolve, reject) => {
      const url = 'api/project/agreement/' + payload.id
      this.$axios
        .get(url, { params: { type: payload.type } })
        .then((response) => {
          resolve(response)
        })
        .catch((err) => {
          reject(new Error(err))
        })
    })
  },
  detailsForExistingProject({ commit }, payload) {
    commit('detailsForExistingProject', payload)
  },
  optInHsr({ state, commit }, payload) {
    return new Promise((resolve, reject) => {
      const url = 'api/project/' + payload.id + '/hsrOptIn'
      this.$axios
        .post(url, state.existingProjects)
        .then((response) => {
          resolve(response)
        })
        .catch((err) => {
          reject(new Error(err))
        })
    })
  },
  optInWpr({ state, commit }, payload) {
    return new Promise((resolve, reject) => {
      const url = 'api/project/' + payload.id + '/wprOptIn'
      this.$axios
        .post(url, { wpr_review: payload.wpr_review })
        .then((response) => {
          resolve(response)
        })
        .catch((err) => {
          reject(new Error(err))
        })
    })
  },
  async updateProfile({ dispatch }, payload) {
    return await this.$axios
      .post(`api/project/profile/${payload.projectId}`, payload)
      .then((res) => {
        dispatch('getProject', payload.projectId)
      })
  },

  async getProjectInvoices({ commit }, projectId) {
    return await this.$axios
      .get(`api/project/invoices/${projectId}`)
      .then((res) => {
        commit('setProjectInvoices', res.data)
      })
  },

  async create({ state, commit, dispatch }, payload) {
    await this.$axios
      .post('api/project/store', payload)
      .then((response) => {
        if (payload.type === 'v2-pilot') {
          this.$router.push(
            `/projects/v2-pilot/${response.data.project_number}/dashboard`
          )
        } else {
          this.$router.push(
            `/projects/v2/${response.data.project_number}/dashboard`
          )
        }
      })
      .catch((err) => {
        return err
      })
  },

  signProject({ state, dispatch }, projectId) {
    this.$axios
      .post('api/project/' + projectId + '/aggrementSign')
      .then((res) => {
        dispatch('getProject', projectId)
      })
  },

  sendAgreement({ state, dispatch }, payload) {
    this.$axios
      .get(`api/project/agreement/${payload.projectId}`, {
        params: { type: payload.type },
      })
      .then((res) => {
        dispatch(
          'notifications/toastMessage',
          {
            message:
              'We have sent the Certification agreement to the project owner via email.',
          },
          { root: true }
        )
      })
  },

  downloadAgreement({ rootState }, projectId) {
    const url =
      this.$axios.defaults.baseURL +
      `api/project/agreement/` +
      projectId +
      `/download?token=` +
      rootState.authentication.token
    window.open(url, '_blank')
  },

  inviteMember({ state, dispatch }, payload) {
    const newMemberData = { ...payload }
    newMemberData['redirect-url'] = 'none'

    this.$axios
      .post('api/project/invite/' + state.project.id + '/', newMemberData)
      .then((res) => {
        dispatch('getProject', state.project.id)
      })
  },

  removeMember({ state, dispatch }, userId) {
    this.$axios
      .post('api/project/member/detach/' + state.project.id + '/' + userId)
      .then((res) => {
        dispatch('getProject', state.project.id)
      })
  },

  async updatePricingOption({ dispatch, state }, option) {
    const data = {
      pricing_option: option,
    }
    // this api currently causes a 500 error on return and that's why the error is being handled here
    return await this.$axios
      .put(`api/admin/project/${state.project.id}/updatePricingOption`, data)
      .catch(function (error) {
        if (error.response) {
          // Request made and server responded
          dispatch('getProject', state.project.id)
        }
      })
      .then((res) => {
        dispatch('getProject', state.project.id)
        dispatch('getProjectInvoices', state.project.id)
      })
  },

  createDocReviewInvoice({ state, dispatch }, payload = 'no') {
    this.$axios
      .post('api/admin/project/docReviewInvoice/' + state.project.id, {
        use_precert_credit: payload,
      })
      .then((res) => {
        dispatch('getProjectInvoices', state.project.id)
      })
  },

  createPreCertInvoice({ state, dispatch }) {
    this.$axios
      .post('api/admin/project/dAndOInvoice/' + state.project.id)
      .then((res) => {
        dispatch('getProjectInvoices', state.project.id)
      })
  },

  createPerformanceInvoice({ state, dispatch }) {
    this.$axios
      .post('api/admin/project/pvInvoice/' + state.project.id)
      .then((res) => {
        dispatch('getProjectInvoices', state.project.id)
      })
  },

  createReviewInvoice({ state, dispatch }, payload) {
    this.$axios
      .post('api/admin/project/reviewInvoice/' + state.project.id, {
        type: payload,
      })
      .then((res) => {
        dispatch('getProjectInvoices', state.project.id)
        dispatch(
          'notifications/toastMessage',
          {
            message: 'We have generated project invoice successfully!',
          },
          { root: true }
        )
      })
  },

  createAnnualSubscriptionInvoice({ state, dispatch }) {
    this.$axios
      .post('api/admin/project/subscriptionInvoice/' + state.project.id)
      .then((res) => {
        dispatch('getProjectInvoices', state.project.id)
        dispatch(
          'notifications/toastMessage',
          {
            message: 'We have generated project invoice successfully!',
          },
          { root: true }
        )
      })
  },

  createV1Invoice({ state, dispatch }, payload) {
    this.$axios
      .post(`api/well-v1/admin/invoice/${state.project.id}/${payload}`)
      .then((res) => {
        dispatch('getProjectInvoices', state.project.id)
        dispatch(
          'notifications/toastMessage',
          {
            message: 'We have generated project invoice successfully!',
          },
          { root: true }
        )
      })
  },

  async getProjectEstimate({ commit }, estimateId) {
    return await this.$axios.get(`api/estimate/${estimateId}`).then((res) => {
      commit('setProjectEstimate', res.data)
    })
  },

  async getV1ProjectEstimate({ commit }, estimateId) {
    return await this.$axios
      .get(`api/well-v1/estimate/${estimateId}`)
      .then((res) => {
        commit('setProjectEstimate', res.data)
      })
  },

  async updateProjectVersion({ state }, versionId) {
    return await this.$axios.get(
      `api/admin/project/${state.project.id}/upgrade/${versionId}`
    )
  },

  async updateProjectInfo({ state, dispatch }, payload) {
    let url = `api/project/update/${payload.id}`
    if (payload.v1_project === 1) {
      url = `api/well-v1/project/${payload.id}`
    }
    return await this.$axios.put(url, payload).then((res) => {
      dispatch('getProject', state.project.id)
    })
  },

  async updateProjectDocSubDate({ state, dispatch }, payload) {
    state.project.doc_sub_date_est = payload
    state.project.country_code = state.project.addresses[0].country_code
    state.project.state = state.project.addresses[0].state
    state.project.city = state.project.addresses[0].city
    state.project.street = state.project.addresses[0].street
    await dispatch('updateProjectInfo', state.project)
  },

  async registerProject({ state, dispatch }, payload) {
    return await this.$axios
      .post(`api/project/register/${state.project.id}`, payload)
      .then((res) => {
        dispatch('getProject', state.project.id)
        dispatch('getProjectInvoices', state.project.id)
      })
  },

  async deleteProject({ state }, payload) {
    return await this.$axios.delete(`api/project/delete/${state.project.id}`)
  },

  async deleteProjectById({ state }, id) {
    return await this.$axios.delete(`api/project/delete/${id}`)
  },

  createAAP({ state, dispatch }, payload) {
    this.$axios.post('api/aap/create', payload).then((res) => {
      dispatch('getStrategies', { project_id: state.project.id })
    })
  },

  updateAAP({ state, dispatch }, payload) {
    this.$axios.put(`api/admin/aap/${payload.id}`, payload).then((res) => {
      if (state.project !== null) {
        dispatch('getStrategies', { project_id: state.project.id })
      }
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

  getProjectDocuments({ state, commit }, payload) {
    let url = 'api/project-document/' + state.project.id + '/all'
    if (payload) {
      url += '?name=' + payload
    }
    this.$axios.get(url).then((res) => {
      commit('setProjectDocuments', res.data)
    })
  },

  removeProjectDocument({ state, dispatch }, payload) {
    this.$axios
      .delete('api/project-document/' + state.project.id + '/' + payload)
      .then((res) => {
        dispatch('getProjectDocuments')
      })
  },

  uploadProjectDocument({ state, dispatch }, payload) {
    this.$axios
      .post('api/project-document/' + state.project.id, payload)
      .then((res) => {
        dispatch('getProjectDocuments')
      })
  },
  downloadAllDocuments({ state }, payload) {
    return new Promise((resolve, reject) => {
      this.$axios
        .post('api/documentAllDownload-project/' + state.project.id, payload)
        .then((res) => {
          resolve(res)
        })
        .catch((err) => {
          reject(err.response)
        })
    })
  },
  downloadAllProjectLogos() {
    this.$axios
      .get('api/admin/profileImage/downloadAll?for=logo')
      .then((res) => {
        return res
      })
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

  getV1ChecklistAuthToken({ state }) {
    return new Promise((resolve, reject) => {
      this.$axios
        .get(`api/well-v1/project/${state.project.id}/checklistToken`)
        .then((res) => {
          resolve(res.data)
        })
    })
  },
  getProjectBenchMark({ state, dispatch }, payload) {
    this.$axios
      .put(`api/project/update/${payload.Id}`, payload.data)
      .then((res) => {
        dispatch('getProject', payload.Id)
      })
  },

  async updateExternalReviewers({ state, dispatch }, payload) {
    await this.$axios
      .post(`api/admin/project/external/attach/${state.project.id}`, payload)
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
  downloadHsrCertificate({ state }, payload) {
    return new Promise((resolve) => {
      this.$axios
        .get(`api/project/${payload.project_id}/hsr-certificate/pdfExport`)
        .then((response) => {
          resolve(response)
        })
    })
  },
  downloadLoa({ state }, payload) {
    return new Promise((resolve) => {
      this.$axios
        .get(`api/project/${payload.project_id}/loa-certificate/pdfExport`)
        .then((response) => {
          resolve(response)
        })
    })
  },
  downloadHsrLoa({ state }, payload) {
    return new Promise((resolve) => {
      this.$axios
        .get(`api/project/${payload.project_id}/hsr-loa-certificate/pdfExport`)
        .then((response) => {
          resolve(response)
        })
    })
  },
  downloadCoA({ state }, payload) {
    return new Promise((resolve) => {
      this.$axios
        .get(
          `api/project/${payload.project_id}/confirmationOfAgreement?pre_cert_fees=${payload.pre_cert_fees}`
        )
        .then((response) => {
          resolve(response)
        })
    })
  },

  getStandards({ state, commit }) {
    this.$axios.get('api/versionsAndLanguage/').then((res) => {
      commit('setStandards', Object.values(res.data))
    })
  },

  async getDirectoryProjectsList({ commit }, payload) {
    let str = ''

    for (const key in payload) {
      if (payload[key] !== null && payload[key] !== '') {
        if (str !== '') str += '&'
        str += key + '=' + encodeURIComponent(payload[key])
      }
    }
    await this.$axios.get(`api/project-directory/get?${str}`).then((res) => {
      commit('setDirectoryProjects', res.data)
    })
  },

  async getDirectoryFilters({ commit }) {
    return await this.$axios.get(`api/project-directory/filter`).then((res) => {
      return res
    })
  },

  async getPendingInvites({ commit }, id) {
    return await this.$axios.get(`api/project/${id}/inviteList`).then((res) => {
      return res
    })
  },

  async getProjectProfileInfoBySlug({ commit }, slug) {
    return await this.$axios.get(`api/projects/bySlug/${slug}`).then((res) => {
      return res
    })
  },
  upgradeProject({ commit }, id) {
    return new Promise((resolve, reject) => {
      this.$axios
        .get(`api/project/${id}/v2upgrade`)
        .then((res) => {
          resolve(res)
        })
        .catch((err) => {
          reject(err)
        })
    })
  },
  getPrecertification({ state }, payload) {
    return new Promise((resolve, reject) => {
      this.$axios
        .get(`api/dAndOPrice/` + state.project.area + '?type=' + payload)
        .then((res) => {
          resolve(res)
        })
        .catch((err) => {
          reject(err)
        })
    })
  },
  async setPrecertification({ state, dispatch }, payload) {
    const data = {
      name: state.project.name,
      area: state.project.area,
      d_and_o: payload,
      project_type: state.project.project_type,
      country_id: state.project.country_id,
    }

    await this.$axios.put(`api/project/update/${state.project.id}`, data)
    await dispatch('getProject', state.project.id)
    if (payload) {
      localStorage.setItem('showPrecertModal', true)
    } else {
      localStorage.removeItem('showPrecertModal', false)
    }
  },
  async recertProject({ state }, payload) {
    return await this.$axios.get(`api/admin/project/${payload}/recertification`)
  },
  async getProfileInformation({ state }, payload) {
    return await this.$axios.get(`api/project/profile/${payload}`)
  },
  async createProjectRecertification({ state }, payload) {
    return await this.$axios.post(
      `api/project/${payload.project_id}/recertification`,
      payload
    )
  },
}
