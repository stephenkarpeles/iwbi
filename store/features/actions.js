export default {
  async getFeatureById({ commit }, id) {
    return await this.$axios.get(`api/features/${id}`).then((res) => {
      commit('setFeature', res.data)
    })
  },

  async getAllFeaturesByVersion({ commit }, version) {
    return await this.$axios
      .get(`api/version/features/?type=${version}`)
      .then((res) => {
        commit('setFeatures', res.data)
      })
  },

  async getAllFeaturesByVersionId({ commit }, versionId) {
    return await this.$axios.get(`api/version/${versionId}`).then((res) => {
      if (res.data.length) {
        let features = []
        res.data.forEach((c) => {
          features = features.concat(c.features)
        })
        commit('setFeatures', features)
      }
    })
  },

  async getAllFeaturesByVersionIdFilter({ commit }, payload) {
    return await this.$axios
      .post(`api/version/${payload.version_id}`, payload)
      .then((res) => {
        if (Object.values(res.data).length) {
          let features = []
          Object.values(res.data).forEach((c) => {
            features = features.concat(c.features)
          })
          commit('setFeatures', null)
          commit('setFeatures', features)
        }
      })
  },

  async getAllV1Features({ commit }, isCommunity) {
    return await this.$axios
      .get(`api/well-v1/features?is_community=${isCommunity}`)
      .then((res) => {
        commit('setFeatures', res.data)
      })
  },

  getStaticV1Features({ commit, state }, isCommunity) {
    if (isCommunity) {
      commit('setFeatures', state.staticWcsFeatures)
    } else {
      commit('setFeatures', state.staticV1Features)
    }
  },
  // portfolio
  async getAllPortfolioFeatures({ commit }) {
    return await this.$axios.get('api/version/features').then((res) => {
      commit('setFeatures', res.data)
    })
  },
}
