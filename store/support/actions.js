export default {
  async getTickets({ state, commit, rootState }, isGuidance) {
    return await this.$axios
      .post(
        process.env.supportApi + '/support/getTickets',
        {
          is_guidance: isGuidance,
          org_name:
            rootState.project.project.type === 'v1'
              ? process.env.v1ZendeskOrgPrefix +
                '-' +
                rootState.project.project.project_number +
                '-' +
                rootState.project.project.name
              : process.env.zendeskOrgPrefix +
                '-' +
                rootState.project.project.project_number +
                '-' +
                rootState.project.project.name,
          user_email: rootState.user.currentUser.email,
          user_name: rootState.user.currentUser.full_name,
        },
        {
          headers: {
            Authorization: state.supportToken,
          },
        }
      )
      .then((res) => {
        commit('setTickets', res.data)
      })
  },
  async getPortfolioTickets({ state, commit, rootState }, isGuidance) {
    return await this.$axios
      .post(
        process.env.supportApi + '/support/getTickets',
        {
          is_guidance: isGuidance,
          org_name:
            process.env.zendeskPortfolioOrgPrefix +
            '-' +
            rootState.portfolio.portfolio.portfolio_number +
            '-' +
            rootState.portfolio.portfolio.name,
          user_email: rootState.user.currentUser.email,
          user_name: rootState.user.currentUser.full_name,
        },
        {
          headers: {
            Authorization: state.supportToken,
          },
        }
      )
      .then((res) => {
        commit('setTickets', res.data)
      })
  },

  async getTicketInfo({ state, commit }, payload) {
    return await this.$axios
      .post(process.env.supportApi + '/support/getTicketInfo', payload, {
        headers: {
          Authorization: state.supportToken,
        },
      })
      .then((res) => {
        return res.data
      })
  },
  async createTicket({ state, commit, rootState }, payload) {
    const data = { ...payload }
    data.project_name = rootState.project.project.name
    data.project_number = rootState.project.project.project_number
    data.tags = ['projectid:' + rootState.project.project.id, 'server:v2-test']
    data.user_email = rootState.user.currentUser.email
    data.is_guidance = false

    const newTicket = await this.$axios
      .post(process.env.supportApi + '/support/createTicket', data, {
        headers: {
          Authorization: state.supportToken,
        },
      })
      .then((res) => {
        return res.data
      })
    commit('setTickets', [...state.tickets, newTicket])
    return newTicket
  },
  async createGuidance({ state, commit, rootState }, payload) {
    const data = { ...payload }
    const newTicket = await this.$axios
      .post(process.env.supportApi + '/support/createTicket', data, {
        headers: {
          Authorization: state.supportToken,
        },
      })
      .then((res) => {
        return res.data
      })
    commit('setTickets', [...state.tickets, newTicket])
    return newTicket
  },
  async addComment({ state, commit }, payload) {
    return await this.$axios
      .put(process.env.supportApi + '/support/addComment', payload, {
        headers: {
          Authorization: state.supportToken,
        },
      })
      .then((res) => {
        return res.data
      })
  },
  async getToken({ commit, rootState }) {
    const spaceTypes = []
    rootState.project.project.space_types.map((space) =>
      spaceTypes.push(space.name)
    )

    let projectAdmin

    if (
      rootState.project.project.members &&
      rootState.project.project.members.find(
        (member) => member.pivot.role === 'project-admin'
      )
    ) {
      projectAdmin = rootState.project.project.members.find(
        (member) => member.pivot.role === 'project-admin'
      ).full_name
    } else {
      projectAdmin = rootState.project.project.owner_name
    }

    let projectAdminEmail

    if (
      rootState.project.project.members &&
      rootState.project.project.members.find(
        (member) => member.pivot.role === 'project-admin'
      )
    ) {
      projectAdminEmail = rootState.project.project.members.find(
        (member) => member.pivot.role === 'project-admin'
      ).email
    } else {
      projectAdminEmail = rootState.project.project.owner_email
    }

    const response = await this.$axios.post(
      process.env.supportApi + '/support/getToken',
      {
        org_data: JSON.stringify({
          project_org_name: rootState.project.project.name,
          project_org_id: rootState.project.project.project_number,
          space_types: spaceTypes,
          primary_space_type: rootState.project.project.primary_space
            ? rootState.project.project.primary_space.name
            : '',
          project_admin: projectAdmin,
          project_admin_email: projectAdminEmail,
          registration_status:
            rootState.project.project.reg_status === 1
              ? 'Registered'
              : 'Not Registered',
        }),
        org_name:
          rootState.project.project.type === 'v1'
            ? process.env.v1ZendeskOrgPrefix +
              '-' +
              rootState.project.project.project_number +
              '-' +
              rootState.project.project.name
            : process.env.zendeskOrgPrefix +
              '-' +
              rootState.project.project.project_number +
              '-' +
              rootState.project.project.name,
        user_email: rootState.user.currentUser.email,
        user_name: rootState.user.currentUser.full_name,
      }
    )

    commit('setSupportToken', `Bearer ${response.data.token}`)
  },
  async getPortfolioToken({ commit, rootState }) {
    const adminData = {}
    adminData.name = rootState.portfolio.portfolio.user_name
    adminData.email = rootState.portfolio.portfolio.user_email
    const data = {
      user_email: rootState.user.currentUser.email,
      user_name: rootState.user.currentUser.full_name,
      org_name:
        process.env.zendeskPortfolioOrgPrefix +
        '-' +
        rootState.portfolio.portfolio.portfolio_number +
        '-' +
        rootState.portfolio.portfolio.name,
      org_data: JSON.stringify({
        project_org_name: rootState.portfolio.portfolio.name,
        project_org_id: rootState.portfolio.portfolio.portfolio_number,
        area_in_sq_ft: rootState.portfolio.portfolio.area,
        space_types: [],
        project_type: '',
        primary_space_type: '',
        project_admin: adminData.name,
        project_admin_email: adminData.email,
        registration_status:
          rootState.portfolio.portfolio.reg_payment_status === 1
            ? 'Registered'
            : 'Not Registered',
      }),
    }
    // if (rootState.portfolio.portfolio.coach) {
    //   data['agent_email'] = rootState.portfolio.portfolio.coach.email
    //   data['agent_name'] = `${rootState.portfolio.portfolio.coach.name} ${
    //     rootState.portfolio.portfolio.coach.last_name
    //       ? rootState.portfolio.portfolio.coach.last_name
    //       : ''
    //   }`
    // }
    try {
      const response = await this.$axios.post(
        process.env.supportApi + '/support/getToken',
        data
      )

      commit('setSupportToken', `Bearer ${response.data.token}`)
    } catch (e) {
      // handle errors
    }
  },
  async createPortfolioTicket({ state, commit, rootState }, payload) {
    const data = { ...payload }
    data.project_name = rootState.portfolio.portfolio.name
    data.project_number = rootState.portfolio.portfolio.portfolio_number
    data.tags = [
      'projectid:' + rootState.portfolio.portfolio.id,
      'server:' + process.env.zendeskPortfolioOrgPrefix,
    ]
    data.user_email = rootState.user.currentUser.email
    data.is_guidance = false

    const newTicket = await this.$axios
      .post(process.env.supportApi + '/support/createTicket', data, {
        headers: {
          Authorization: state.supportToken,
        },
      })
      .then((res) => {
        return res.data
      })
    commit('setTickets', [...state.tickets, newTicket])
    return newTicket
  },

  verifyUserMembership({ state, rootState }) {
    return new Promise((resolve, reject) => {
      this.$axios
        .post(
          process.env.supportApi + '/support/user/membership',
          {
            user_email: rootState.user.currentUser.email,
            user_name: rootState.user.currentUser.full_name,
          },
          {
            headers: {
              Authorization: state.supportToken,
            },
          }
        )
        .then(() => resolve())
        .catch((err) => {
          reject(err.response.data)
        })
    })
  },

  addNote({ state, rootState }, data) {
    return new Promise((resolve, reject) => {
      this.$axios
        .post(`api/portfolio/${rootState.portfolio.portfolio.id}/note`, data)
        .then((response) => {
          resolve(response.data)
        })
        .catch((err) => {
          reject(err)
        })
    })
  },
  updateNotes({ state, rootState }, data) {
    return new Promise((resolve, reject) => {
      this.$axios
        .put(
          `api/portfolio/${rootState.portfolio.portfolio.id}/note/${data.id}`,
          data
        )
        .then((response) => {
          resolve(response.data)
        })
        .catch((err) => {
          reject(err)
        })
    })
  },
  resetSupportTab({ commit }) {
    commit('setSupportToken', null)
    commit('setTickets', null)
  },
  async reopenTicket({ state, rootState }, ticketId) {
    return await this.$axios
      .post(
        process.env.supportApi + '/support/ticket/reopen',
        {
          user_email: rootState.user.currentUser.email,
          ticket_id: ticketId,
        },
        {
          headers: {
            Authorization: state.supportToken,
          },
        }
      )
      .then((res) => {
        return res.data
      })
      .catch((err) => {
        return err.response.data
      })
  },
}
