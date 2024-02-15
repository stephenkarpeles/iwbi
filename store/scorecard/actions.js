export default {
  async createScorecard({ dispatch }, payload) {
    return await this.$axios
      .post(`api/scorecard/store`, payload)
      .then((res) => {
        dispatch('getScorecard', res.data.id)
      })
  },

  async getDocuments({ commit }, payload) {
    let url = `api/scorecard/${payload.id}/document`
    if (payload.name) {
      url += '?name=' + payload.name
    }
    return await this.$axios.get(url).then((res) => {
      commit('setDocuments', res.data)
    })
  },
  async getPerformanceDocuments({ commit }, payload) {
    let url = `api/scorecard/${payload.id}/document?part_doc_type=Performance Test`
    if (payload.name) {
      url += '&name=' + payload.name
    }
    return await this.$axios.get(url).then((res) => {
      commit('setPerformanceDocuments', res.data)
    })
  },

  async getScorecard({ commit }, id) {
    return await this.$axios.get(`api/scorecard/${id}`).then((res) => {
      commit('setScorecard', res.data)
    })
  },

  async getConcepts({ commit }, versionId) {
    return await this.$axios
      .get(`api/version/${versionId}/conceptList`)
      .then((res) => {
        commit('setConcepts', res.data)
      })
  },

  async getFeatures({ commit, state }, conceptId) {
    return await this.$axios
      .post(`api/scorecard/filter/${state.scorecard.id}/${conceptId}`)
      .then((res) => {
        commit('setConceptFeatures', res.data)
      })
  },

  async getAllFeatures({ commit, state }) {
    return await this.$axios
      .post(`api/scorecard/filter/${state.scorecard.id}`)
      .then((res) => {
        commit('setAllConceptFeatures', res.data)
      })
  },

  async getAllFilteredFeatures({ commit, state, dispatch }, payload) {
    if (state.scorecard?.id) {
      return await this.$axios
        .post(`api/scorecard/filter/${state.scorecard.id}`, payload)
        .then((res) => {
          commit('setAllConceptFeatures', res.data)
          dispatch('updatePartsList')
        })
    }
  },

  async getVerifications({ commit, state, rootState }, id) {
    if (
      rootState.scorecard.scorecard &&
      rootState.scorecard.scorecard.type !== 'v2'
    ) {
      await this.$axios.get(`api/annotatedDocuments`).then((res) => {
        commit('setAnnotatedDocuments', res.data)
      })
      await this.$axios.get(`api/letterOfAssurances`).then((res) => {
        commit('setLetterofAssurances', res.data)
      })
      await this.$axios.get(`api/onSites`).then((res) => {
        commit('setOnSites', res.data)
      })
    } else {
      return await this.$axios.get(`api/verifications`).then((res) => {
        commit('setVerifications', res.data)
      })
    }
  },
  async getVerificationsByType({ commit, state, rootState }, type) {
    if (type && type !== 'v2') {
      await this.$axios.get(`api/annotatedDocuments`).then((res) => {
        commit('setAnnotatedDocuments', res.data)
      })
      await this.$axios.get(`api/letterOfAssurances`).then((res) => {
        commit('setLetterofAssurances', res.data)
      })
      await this.$axios.get(`api/onSites`).then((res) => {
        commit('setOnSites', res.data)
      })
    } else {
      return await this.$axios.get(`api/verifications`).then((res) => {
        commit('setVerifications', res.data)
      })
    }
  },
  async getHSRVerifications({ commit }) {
    return await this.$axios.get(`api/verifications`).then((res) => {
      commit('setVerifications', res.data)
    })
  },

  async getScores({ commit, state }, id) {
    if (state.scorecard?.id) {
      return await this.$axios
        .get(`api/scorecard/score/${state.scorecard.id}/all`)
        .then((res) => {
          commit('setScores', res.data)
        })
    }
  },
  async getScoreForReviews({ commit, state }, id) {
    return await this.$axios
      .get(`api/scorecard/score/${id}/all`)
      .then((res) => {
        commit('setReviewScores', res.data)
      })
  },
  async getTimeline({ commit, state }, payload) {
    let timeline = null
    await this.$axios.post(`api/v2ProjectTimeline`, payload).then((res) => {
      timeline = res.data
    })
    return timeline
  },

  async getConceptAndFeatures({ commit }, id) {
    return await this.$axios
      .post(`api/scorecard/filter/${id}`, {})
      .then((res) => {
        commit('setConcepts', res.data.concepts)
      })
  },
  async getAnticipatedScore({ commit, state }) {
    let points = 0
    if (state.scoresSummary.assessment_score.guidance_points) {
      points =
        state.scoresSummary.assessment_score.score +
        parseFloat(state.scoresSummary.assessment_score.guidance_points)
    } else {
      points = state.scoresSummary.assessment_score.score
    }
    if (
      state.scoresSummary.assessment_score.innovationScore &&
      state.scoresSummary.assessment_score.innovationScore.points
    ) {
      points += parseFloat(
        state.scoresSummary.assessment_score.innovationScore.points
      )
    }
    if (
      state.scoresSummary.assessment_score.innovationScore &&
      state.scoresSummary.assessment_score.innovationScore.guidance_points
    ) {
      points += parseFloat(
        state.scoresSummary.assessment_score.innovationScore.guidance_points
      )
    }

    await commit('setAnticipatedScore', points)
  },

  async getResponseSummary({ commit, state, dispatch }, id) {
    let response = null

    if (id) {
      await this.$axios
        .get(`api/scorecard/${id}/responseSummary`)
        .then((res) => {
          response = res.data
        })
    } else if (state.scorecard?.id) {
      await this.$axios
        .get(`api/scorecard/${state.scorecard.id}/responseSummary`)
        .then((res) => {
          response = res.data
        })
    }
    if (!id) {
      await dispatch('getScoresSummary')
      await commit('setConceptSummary', response?.concept_summary)
    }
    await commit('setResponseSummary', response)
  },

  async getHSRResponseSummary({ commit, state, dispatch }, id) {
    let response = null

    if (id) {
      await this.$axios
        .get(`api/scorecard/${id}/responseSummary`)
        .then((res) => {
          response = res.data
        })
    } else {
      await this.$axios
        .get(`api/scorecard/${state.scorecard.id}/responseSummary`)
        .then((res) => {
          response = res.data
        })
    }
    await commit('setHSRResponseSummary', response)
  },

  async getScoresSummary({ commit, state, dispatch }) {
    let response = null
    if (state.scorecard?.id) {
      await this.$axios
        .get(`api/scorecard/score/${state.scorecard.id}/all`)
        .then((res) => {
          response = res.data
        })

      await commit('setScoresSummary', response)
      await dispatch('getAnticipatedScore')
    }
  },

  async downloadReport({ commit, state }, payload) {
    const fileLink = await this.$axios.get(
      `api/scorecard/${state.scorecard.id}/excelExport/v2?unit_filter=${payload}`
    )
    return fileLink
  },
  async downloadScorecardReport({ commit, state }, payload) {
    const fileLink = await this.$axios.get(
      `api/scorecard/${state.scorecard.id}/excelExport?unit_filter=${payload}`
    )
    return fileLink
  },

  updatePart({ commit, dispatch, state }, payload) {
    return new Promise((resolve, reject) => {
      const isHSR = payload.isHSR
      const isPortfolio = payload.isPortfolio
      delete payload.isPortfolio
      delete payload.isHSR
      this.$axios
        .post(
          `api/scorecard/attach/${state.scorecard.id}/${payload.partId}/${payload.sub_part_id}`,
          payload
        )
        .then((res) => {
          const updatePayload = {
            requestPayload: payload,
            responsePayload: res.data,
          }
          resolve(res)
          if (isPortfolio) {
            commit('setPartResponsePortfolio', updatePayload)
          } else {
            commit('setPartResponse', updatePayload)
          }
        })

      dispatch('getResponseSummary')
      dispatch('updatePartsList', isHSR)
    })
  },

  async partResponseChange({ state, dispatch }, payload) {
    try {
      const res = await this.$axios.post(
        `api/scorecard/${state.scorecard.id}/part/${payload.part_id}/attach/response`,
        payload.data
      )
      if (res.status === 200) {
        dispatch('updatePartAttribute', {
          part_id: payload.part_id,
          attribute: 'scorecard_part',
          data: res.data.optionSelectionList.length
            ? res.data.optionSelectionList
            : [res.data.scorecard_part],
        })
        dispatch('getResponseSummary')
        dispatch('getScores')
        dispatch(
          'notifications/toastMessage',
          {
            message: 'Pursue status changed!',
          },
          { root: true }
        )
      }
    } catch (error) {
      dispatch(
        'notifications/toastMessage',
        {
          message: error.response.data.msg,
        },
        { root: true }
      )
    }
  },

  async sendPartResponse({ state, commit, dispatch }, payload) {
    try {
      const isHSR = payload.isHSR
      const isPortfolio = payload.isPortfolio
      delete payload.isPortfolio
      delete payload.isHSR
      await this.$axios
        .post(
          `api/scorecard/${state.scorecard.id}/part/${payload.partId}/attach/response`,
          payload
        )
        .then((res) => {
          const updatePayload = {
            requestPayload: payload,
            responsePayload: res.data,
          }
          if (isPortfolio) {
            commit('setPartResponsePortfolio', updatePayload)
          } else {
            commit('setPartResponse', updatePayload)
          }
        })
      dispatch('getResponseSummary')
      dispatch('updatePartsList', isHSR)
    } catch (error) {
      // console.log(error)
    }
  },

  async updateFilters({ commit, dispatch, state }, payload) {
    await commit('setFilters', payload)
    await dispatch('updatePartsList', payload.isHSR)
  },

  async getConceptScore({ commit, dispatch, state }, payload) {
    let calc = 0
    const conceptName = state.activeFilters.concept
    const reqType = payload.response + '_' + payload.type
    if (conceptName === 'All') {
      calc = 0
    } else if (
      state.scorecard.scores.response_summary.concept_summary[conceptName]
        .response[reqType] === 0
    ) {
      calc = 0
      commit('setConceptPoints', 0)
    } else {
      commit(
        'setConceptPoints',
        state.scorecard.scores.response_summary.concept_summary[conceptName]
          .response.yes_score
      )
      calc =
        (state.scorecard.scores.response_summary.concept_summary[conceptName]
          .response[reqType] /
          state.scorecard.scores.response_summary.concept_summary[conceptName][
            payload.type + '_part_count'
          ]) *
        100
    }

    if (payload.type === 'opt') {
      await commit('setConceptOptPrec', calc)
    }

    if (payload.type === 'pre') {
      await commit('setConceptPrePrec', calc)
    }
  },

  async updatePartsList({ commit, dispatch, state, rootState }, isHSR) {
    const parts = []
    const features = []

    // helper filter method
    function checkPartAgainstFilter(part) {
      // concept filter
      if (
        part.concept_name !== state.activeFilters.concept &&
        state.activeFilters.concept !== 'All'
      ) {
        return false
      }

      // precondition filter
      if (!state.activeFilters.show_preconditions && part.points === 0) {
        return false
      }

      // optimizations filter
      if (!state.activeFilters.show_optimizations && part.points !== 0) {
        return false
      }

      // point weight filter
      if (
        state.activeFilters.point_weight &&
        part.points !== 0 &&
        part.points < state.activeFilters.point_weight
      ) {
        return false
      }

      // verification method filter
      if (state.activeFilters.verification) {
        let matchFound = false
        for (let index = 0; index < part.subParts.length; index++) {
          for (
            let optIndex = 0;
            optIndex < part.subParts[index].options.length;
            optIndex++
          ) {
            const optionsMatched = part.subParts[index].options[
              optIndex
            ].verifications.filter(
              (a) => a.id === parseInt(state.activeFilters.verification)
            )
            if (optionsMatched.length) {
              matchFound = true
            }
          }
        }
        return matchFound
      }

      if (state.activeFilters.loa) {
        return part.letter_of_assurances.filter(
          (a) => a.id === parseInt(state.activeFilters.loa)
        ).length
      }

      if (state.activeFilters.on_site) {
        return part.on_sites.filter(
          (a) => a.id === parseInt(state.activeFilters.on_site)
        ).length
      }

      if (state.activeFilters.annotated_doc) {
        return part.annotated_documents.filter(
          (a) => a.id === parseInt(state.activeFilters.annotated_doc)
        ).length
      }

      if (
        state.activeFilters.doc_count !== '0' &&
        state.activeFilters.doc_count
      ) {
        // document count filter
        if (part.document_count === 0) {
          return false
        }
        if (part.document_count < parseInt(state.activeFilters.doc_count)) {
          return false
        }
      }

      if (state.activeFilters.response.length > 0 && !part.scorecard_part[0]) {
        return false
      }

      // note count filter
      if (
        state.activeFilters.note_count !== '0' &&
        state.activeFilters.note_count
      ) {
        if (part.note_count === 0) {
          return false
        }
        if (part.note_count < parseInt(state.activeFilters.note_count)) {
          return false
        }
      }
      if (state.activeFilters.response.length > 0 && !part.scorecard_part[0]) {
        return false
      }

      // assessment filter
      if (state.activeFilters.assessment && !part.scorecard_part[0]) {
        return false
      }
      if (
        state.activeFilters.assessment &&
        part.scorecard_part[0] &&
        state.activeFilters.assessment !== part.scorecard_part[0].assessment
      ) {
        return false
      }

      // implementation filter
      if (state.activeFilters.implementation && !part.scorecard_part[0]) {
        return false
      }
      if (
        state.activeFilters.implementation &&
        part.scorecard_part[0] &&
        state.activeFilters.implementation !==
          part.scorecard_part[0].implementation
      ) {
        return false
      }

      // name filter
      const search = state.activeFilters.name.toLowerCase().trim()

      if (
        search.length > 0 &&
        !part.name.toLowerCase().includes(search) &&
        !rootState.shared.sharedWorkspace.type &&
        !rootState.shared.sharedWorkspace.type !== 'wpr'
      ) {
        return false
      }

      if (
        search.length > 0 &&
        !part.feature_name.toLowerCase().includes(search) &&
        rootState.shared.sharedWorkspace.type &&
        rootState.shared.sharedWorkspace.type === 'wpr'
      ) {
        return false
      }

      if (state.activeFilters.response.length > 0 && !part.scorecard_part[0]) {
        return false
      }

      if (
        state.activeFilters.response.length > 0 &&
        part.scorecard_part[0] &&
        !state.activeFilters.response.includes(part.scorecard_part[0].response)
      ) {
        return false
      }

      return true
    }
    if (state.concepts) {
      for (let i = 0; i < state.concepts.length; i++) {
        if (state.concepts[i].features) {
          for (let j = 0; j < state.concepts[i].features.length; j++) {
            const featureParts = state.concepts[i].features[j].parts
            // attach concept name to part for icon image
            featureParts.map((part) => {
              part.concept_name = state.concepts[i].name
              return part
            })

            for (let k = 0; k < featureParts.length; k++) {
              if (checkPartAgainstFilter(featureParts[k])) {
                parts.push(featureParts[k])
              }
            }
          }
        }
      }

      for (let i = 0; i < state.concepts.length; i++) {
        if (
          state.activeFilters.concept === 'All' ||
          state.activeFilters.concept === state.concepts[i].name
        ) {
          if (state.concepts[i].features) {
            for (let j = 0; j < state.concepts[i].features.length; j++) {
              // below logic is to seperate the featue and parts
              let tempFeature = state.concepts[i].features[j]

              const tempPart = []
              tempFeature.parts.forEach((part) => {
                if (checkPartAgainstFilter(part)) {
                  tempPart.push({
                    ...part,
                    concept_name: state.concepts[i].name,
                  })
                }
              })
              tempFeature = { ...tempFeature, parts: tempPart }

              if (tempFeature.parts.length) {
                features.push(tempFeature)
              }
            }
          }
        }
      }
    }
    await commit('setFilteredParts', parts)
    await commit('setFilteredFeatures', features)
    if (!isHSR) {
      await dispatch('getConceptScore', { type: 'opt', response: 'yes' })
      await dispatch('getConceptScore', { type: 'pre', response: 'yes' })
    }
  },

  async getPartNotes({ state, commit }, partId) {
    let notes = []
    await this.$axios
      .get(`api/scorecard/${state.scorecard.id}/note/${partId}`)
      .then((res) => {
        commit('setPartNotes', res.data)
        notes = res.data
      })

    return notes
  },
  async getProjectPartDocs({ state }, partId) {
    let docs = []
    await this.$axios
      .get(`api/scorecard/${state.scorecard.id}/document/${partId}`)
      .then((res) => {
        docs = res.data
      })

    return docs
  },

  async getPartDocs({ state, commit }, payload) {
    try {
      const res = await this.$axios.get(
        `api/scorecard/${state.scorecard.id}/document/${payload.part_id}?paginate=yes&page=${payload.page}`
      )
      commit('setPartDocuments', res.data)
      return res.data
    } catch (error) {
      //
    }
  },
  // async getProjectPartDocs({ state, commit }, payload) {
  //   try {
  //     const res = await this.$axios.get(
  //       `api/scorecard/${state.scorecard.id}/document/${payload}`
  //     )
  //     commit('setPartDocuments', res.data)
  //     return res.data
  //   } catch (error) {
  //     //
  //   }
  // },
  async getPartSharedDocs({ state, rootState }, partId) {
    let docs = []
    await this.$axios
      .get(
        `api/project-document/${rootState.project.project.id}/shared-document/get?paginate=no&part_id=${partId}`
      )
      .then((res) => {
        docs = res.data
      })

    return docs
  },

  async updatePartGuidance({ state }, payload) {
    let response
    await this.$axios
      .put(`api/admin/scorecard/summary/${payload.scorecardId}`, payload)
      .then((res) => {
        response = res
      })

    return response
  },

  async removeDocument({ state }, docId) {
    let response
    await this.$axios
      .delete(`api/scorecard/${state.scorecard.id}/document/${docId}`)
      .then((res) => {
        response = res
      })

    return response
  },

  async removeScorecardDocument({ state, dispatch }, payload) {
    let response
    await this.$axios
      .delete(
        `api/scorecard/${payload.scorecard_id}/document/${payload.doc_id}`
      )
      .then((res) => {
        dispatch('getDocuments', { id: payload.scorecard_id })
        response = res
      })

    return response
  },

  async removeNote({ state }, noteId) {
    let response
    await this.$axios
      .delete(`api/scorecard/${state.scorecard.id}/note/${noteId}`)
      .then((res) => {
        response = res
      })

    return response
  },

  async addPartNote({ state, dispatch }, payload) {
    let response
    await this.$axios
      .post(`api/scorecard/${state.scorecard.id}/note`, payload)
      .then((res) => {
        response = res
      })

    return response
  },

  async updatePartNote({ state }, payload) {
    let response
    await this.$axios
      .put(`api/scorecard/${state.scorecard.id}/note/${payload.id}`, payload)
      .then((res) => {
        response = res
      })

    return response
  },

  async addPartDoc({ state }, payload) {
    let response

    await this.$axios
      .post(`api/scorecard/${state.scorecard.id}/document-upload`, payload)
      .then((res) => {
        response = res
      })

    return response
  },

  async addPartDocByProject({ state, rootState }, payload) {
    let response

    await this.$axios
      .post(
        `api/scorecard/${rootState.project.project.scorecard_id}/document-upload`,
        payload
      )
      .then((res) => {
        response = res
      })

    return response
  },
  getReviewResponses({ state, commit }, payload) {
    this.$axios
      .get(
        `api/admin/${payload.module}/${payload.module_id}/review-response/notes`
      )
      .then((response) => {
        commit('setAdminReviewResponses', response.data)
      })
  },
  setReviewResponses({ state, commit }, data) {
    this.$axios
      .post(`api/admin/review/${data.id}/response`, data.data)
      .then((response) => {
        commit('updatedAdminReviewResponses', {
          payload: data,
          response: response.data,
        })
      })
  },
  updateReviewResponses({ state, commit }, data) {
    this.$axios
      .put(`api/admin/review/${data.id}/response/${data.responseId}`, data.data)
      .then((response) => {
        commit('updatedAdminReviewResponses', {
          payload: data,
          response: response.data,
        })
      })
  },
  submitReviewComment({ state, commit }, payload) {
    return new Promise((resolve, reject) => {
      this.$axios
        .post(
          'api/admin/review/response/' + payload.responseId + '/note',
          payload.data
        )
        .then((response) => {
          commit('storeResponseNote', {
            data: payload,
            response: response.data,
          })
          resolve(response)
        })
        .catch((err) => {
          reject(err.response)
        })
    })
  },
  updateReviewComment({ state, commit }, payload) {
    return new Promise((resolve, reject) => {
      this.$axios
        .put(
          'api/admin/review/response/' +
            payload.responseId +
            '/note/' +
            payload.commentId,
          payload.data
        )
        .then((response) => {
          commit('updateResponseNote', {
            data: payload,
            response: response.data,
            commentId: payload.commentId,
          })
          resolve(response)
        })
        .catch((err) => {
          reject(err.response)
        })
    })
  },
  deleteReviewComment({ state, commit }, payload) {
    return new Promise((resolve, reject) => {
      this.$axios
        .delete(
          'api/admin/review/response/' +
            payload.responseId +
            '/note/' +
            payload.noteId
        )
        .then((response) => {
          commit('removeResponseNote', payload)
          resolve(response)
        })
        .catch((err) => {
          reject(err.response)
        })
    })
  },
  getStandardVersionName({ commit }, payload) {
    this.$axios
      .get('api/versions?version_id=' + payload)
      .then(function (response) {
        commit('setScorecardVersion', response.data[0])
      })
  },
  getPartGuidance({ commit }, payload) {
    return new Promise((resolve, reject) => {
      this.$axios
        .get('api/parts/' + payload + '/guidance?category=WELL%20Core')
        .then((response) => {
          commit('setPartGuidance', response.data)
          resolve(response.data)
        })
        .catch((error) => {
          reject(error.response.data)
        })
    })
  },
  async storePartGuidance({ commit, dispatch }, payload) {
    const isHSR = payload.isHSR
    delete payload.isHSR
    this.$axios
      .post(
        `api/scorecard/guidancePoints/${payload.scorecardId}/${payload.scorecardPartId}`,
        payload.guidancePoints
      )
      .then((res) => {
        const updatePayload = {
          requestPayload: payload,
          responsePayload: res.data,
        }
        commit('setPartResponse', updatePayload)
      })

    await dispatch('getResponseSummary')
    await dispatch('updatePartsList', isHSR)
  },

  // v2

  async getVerificationList({ state, commit }, payload) {
    try {
      await this.$axios
        .get(
          `api/scorecard/${state.scorecard.id}/scorecard_part/${payload.scorecardPartID}/verifications`
        )
        .then((res) => {
          res.data.forEach((el) => (el.expand = false))
          commit('setActiveVerificationsList', res.data)
        })
    } catch (error) {}
  },

  async getPartVerifications({ state, commit }, payload) {
    try {
      const res = await this.$axios.get(
        `api/scorecard/${payload.id ? payload.id : state.scorecard.id}/part/${
          payload.part_id
        }/verifications`
      )
      if (res.status === 200) commit('setActiveVerificationsList', res.data)
    } catch (error) {}
  },

  async getOptionComments({ state, commit }, payload) {
    try {
      const res = await this.$axios.get(
        `api/scorecard/${state.scorecard.id}/note/${payload.part_id}?sub_part_id=${payload.sub_part_id}`
      )
      commit('setOptionComments', res.data)
    } catch (error) {
      throw new Error(error)
    }
  },

  updatePartAttribute({ commit }, payload) {
    commit('updatePartValue', payload)
  },

  async getSelectedOptions({ commit, state }, payload) {
    try {
      const { data } = await this.$axios.get(
        `api/scorecard/${state.scorecard.id}/part/${payload.part_id}/optionSelectionLists`
      )
      commit('setSelectedOptions', data)
    } catch (error) {}
  },
  async updatePartFromMigration({ commit, dispatch, state }, payload) {
    try {
      const { data } = await this.$axios.put(
        `api/admin/scorecard/${state.scorecard.id}/scorecard_part/${payload.scorecard_part_id}/updateFromMigration`
      )

      commit('setSelectedOptions', data)
      dispatch(
        'notifications/toastMessage',
        {
          message: 'We have updated the option successfully.',
        },
        { root: true }
      )
    } catch (error) {
      dispatch(
        'notifications/toastMessage',
        {
          message: error.response.data.msg,
        },
        { root: true }
      )
    }
  },
}
