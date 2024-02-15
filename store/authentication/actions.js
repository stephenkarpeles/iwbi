export default {
  async getUserInfo({ commit }) {
    const self = this
    return await this.$axios
      .get(`api/getLoggedMemberInfo`)
      .then((res) => {
        this.$auth.setUser(res.data)
        commit('user/setUser', res.data, { root: true })
      })
      .catch(function () {
        self.$cookies.remove('authentication.token')
        self.$cookies.remove('auth._token.linkedin')
        self.$cookies.remove('auth._token.facebook')
        self.$cookies.remove('auth._token.google')
        self.$cookies.remove('auth._token.local')
        self.$cookies.remove('auth.strategy')
        self.$cookies.remove('authentication.code')
        self.$cookies.remove(process.env.cbaPrefix + '.cba.token', {
          path: '/',
          domain: '.wellcertified.com',
        })
        self.$router.push({
          path: '/user/login',
          query: {
            error: 'Your session has expired. Please try logging in again.',
          },
        })
      })
  },

  async login({ commit, dispatch, redirect }, payload) {
    return await this.$auth
      .loginWith('local', { data: payload })
      .then(async (res) => {
        if (res.data.token) {
          commit('setToken', res.data.token)
          this.$axios.setToken(res.data.token, 'Bearer')
          this.$auth.setToken('local', res.data.token)
          this.$cookies.set('authentication.token', res.data.token, {
            path: '/',
            maxAge: 60 * 60 * 24 * 7,
          })
          this.$cookies.set(
            process.env.cbaPrefix + '.cba.token',
            res.data.token,
            {
              path: '/',
              domain: '.wellcertified.com',
              maxAge: 60 * 60 * 24 * 7,
            }
          )

          await dispatch('getUserInfo')

          if (payload.sso_redirect !== undefined) {
            return payload.sso_redirect + '?token=' + res.data.token
          } else if (payload.return_to !== undefined) {
            let url = payload.return_to
            let queryPayload = '?jwt=' + res.data.sso_token
            if (payload.sso_subscriber === 'zendesk') {
              url = process.env.SsoRedirectZendesk
            } else if (payload.sso_subscriber === 'insided') {
              queryPayload = '?token=' + res.data.sso_token
            }
            return url + queryPayload
          }
        }
      })
    // await this.$axios.post(`api/authenticate`, payload).then((res) => {
    //   if (res.data.token) {
    //     commit('setToken', res.data.token)
    //     this.$axios.setToken(res.data.token, 'Bearer')

    //     this.$cookies.set('authentication.token', res.data.token, {
    //       path: '/',
    //       maxAge: 60 * 60 * 24 * 7,
    //     })
    //   }
    // })
  },

  async setToken({ commit }, payload) {
    this.$axios.setToken(payload.token, 'Bearer')

    this.$cookies.set('authentication.token', payload.token, {
      path: '/',
      maxAge: 60 * 60 * 24 * 7,
    })
    await commit('setToken', payload.token)
  },

  logout({ commit }) {
    this.$cookies.remove('authentication.token')
    this.$cookies.remove('auth._token.linkedin')
    this.$cookies.remove('auth._token.facebook')
    this.$cookies.remove('auth._token.google')
    this.$cookies.remove('auth._token.local')
    this.$cookies.remove('auth.strategy')
    this.$cookies.remove('authentication.code')
    this.$cookies.remove(process.env.cbaPrefix + '.cba.token', {
      path: '/',
      domain: '.wellcertified.com',
    })
    // await commit('user/setUser', null, { root: true })
    // await commit('setToken', null)
    this.$router.go('/user/login')
  },

  async restoreSession({ commit, dispatch }, token) {
    await commit('setToken', token)
    await this.$axios.setToken(token, 'Bearer')
    await dispatch('getUserInfo')
  },

  async socialLogin({ commit, dispatch, redirect }, payload) {
    await this.$axios
      .post(`api/authenticate/social`, payload)
      .then((res) => {
        if (res.data.token) {
          commit('setToken', res.data.token)
          this.$auth.setToken(payload.provider, res.data.token)
          this.$axios.setToken(res.data.token, 'Bearer')

          this.$cookies.set('authentication.token', res.data.token, {
            path: '/',
            maxAge: 60 * 60 * 24 * 7,
          })
          this.$cookies.set(
            process.env.cbaPrefix + '.cba.token',
            res.data.token,
            {
              domain: '.wellcertified.com',
              path: '/',
            }
          )
        }
      })
      .catch(() => {
        const self = this
        self.$cookies.remove('authentication.token')
        self.$cookies.remove('auth._token.linkedin')
        self.$cookies.remove('auth._token.facebook')
        self.$cookies.remove('auth._token.google')
        self.$cookies.remove('auth._token.local')
        self.$cookies.remove('auth.strategy')
        self.$cookies.remove('authentication.code')
        self.$cookies.remove(process.env.cbaPrefix + '.cba.token', {
          path: '/',
          domain: '.wellcertified.com',
        })
        self.$router.push({
          path: '/user/login',
          query: {
            error: 'Your session has expired. Please try logging in again.',
          },
        })
      })
  },
  resetPassword({ commit, dispatch }, payload) {
    return new Promise((resolve, reject) => {
      this.$axios
        .post(`api/password/set`, payload)
        .then((res) => {
          if (res.data.token) {
            commit('setToken', res.data.token)
            this.$auth.setToken('local', res.data.token)
            this.$axios.setToken(res.data.token, 'Bearer')
            this.$cookies.set('authentication.token', res.data.token, {
              path: '/',
              maxAge: 60 * 60 * 24 * 7,
            })
          }
          resolve()
        })
        .catch((err) => {
          reject(err)
        })
    })
  },
  getJwtSsoToken({ state, redirect }, payload) {
    return new Promise((resolve, reject) => {
      this.$axios
        .get(
          'api/auth/sso/jwt?sso_subscriber=' + payload.route.params.subscriber
        )
        .then((response) => {
          let url = payload.route.query.return_to
          let queryPayload = '?jwt=' + response.data.sso_token

          if (payload.route.params.subscriber === 'zendesk') {
            url = process.env.SsoRedirectZendesk
          } else if (payload.route.params.subscriber === 'insided') {
            queryPayload = '?token=' + response.data.sso_token
          }
          resolve(url + queryPayload)
        })
        .catch((err) => {
          reject(err)
        })
    })
  },
}
