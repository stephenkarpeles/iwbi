export default {
  async createScorecard({ dispatch }, payload) {
    return await this.$axios
      .post(`api/scorecard/store`, payload)
      .then((res) => {
        dispatch('getScorecard', res.data.id)
      })
  },

  async getDocuments({ commit }, id) {
    return await this.$axios.get(`api/scorecard/${id}/document`).then((res) => {
      commit('setDocuments', res.data)
    })
  },

  async getScorecard({ commit }, id) {
    if (id) {
      return await this.$axios.get(`api/scorecard/${id}`).then((res) => {
        commit('setScorecard', res.data)
      })
    }
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

  async getVerifications({ commit, state, rootState }, id) {
    if (rootState.project.project && rootState.project.project.type !== 'v2') {
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
          commit('setScoresSummary', res.data)
        })
    }
  },

  async getConceptAndFeatures({ commit }, id) {
    if (id) {
      return await this.$axios
        .post(`api/scorecard/filter/${id}`, {})
        .then((res) => {
          commit('setConcepts', res.data.concepts)
        })
    }
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

      await dispatch('getScoresSummary')

      await commit('setResponseSummary', response)
    }
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

    await this.$axios
      .get(`api/scorecard/score/${state.scorecard.id}/all`)
      .then((res) => {
        response = res.data
      })

    await commit('setScoresSummary', response)
    await dispatch('getAnticipatedScore')
  },

  async downloadReport({ commit, state }) {
    const fileLink = await this.$axios.get(
      `api/scorecard/${state.scorecard.id}/excelExport/v2`
    )
    return fileLink
  },
  async downloadScorecardReport({ commit, state }, payload) {
    const fileLink = await this.$axios.get(
      `api/scorecard/${state.scorecard.id}/excelExport?unit_filter=${payload}`
    )
    return fileLink
  },

  async updatePart({ commit, dispatch, state }, payload) {
    const isHSR = payload.isHSR
    delete payload.isHSR
    await this.$axios
      .post(
        `api/scorecard/attach/${state.scorecard.id}/${payload.partId}/${payload.sub_part_id}`,
        payload
      )
      .then((res) => {
        const updatePayload = {
          requestPayload: payload,
          responsePayload: res.data,
        }
        commit('setPartResponse', updatePayload)
      })

    await dispatch('getResponseSummary', state.scorecard.id)
    await dispatch('updatePartsList', isHSR)
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

      // name filter
      const search = state.activeFilters.name.toLowerCase().trim()

      if (search.length > 0 && !part.name.toLowerCase().includes(search)) {
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
              part.feature_prefix =
                state.concepts[i].feature_prefix +
                state.concepts[i].features[j].feature_order
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
    }
    await commit('setFilteredParts', parts)
    if (!isHSR) {
      await dispatch('getConceptScore', { type: 'opt', response: 'yes' })
      await dispatch('getConceptScore', { type: 'pre', response: 'yes' })
    }
  },

  async getPartNotes({ state }, payload) {
    let notes = []
    await this.$axios
      .get(`api/scorecard/${payload.id}/note/${payload.partId}`)
      .then((res) => {
        notes = res.data
      })

    return notes
  },

  async setPartDocStatus({ state }, payload) {
    return await this.$axios.post(
      `api/${payload.moduleType}/${payload.moduleId}/scorecard/documents`,
      payload
    )
  },
  async getPartDocs({ state, commit }, payload) {
    try {
      const res = await this.$axios.get(
        `api/scorecard/${payload.id}/document/${payload.part_id}`
      )
      commit('setPartDocuments', res.data)
      return res.data
    } catch (error) {
      //
    }
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

  async removeDocument({ state }, payload) {
    let response
    await this.$axios
      .delete(`api/scorecard/${payload.id}/document/${payload.docId}`)
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
        dispatch('getDocuments', payload.scorecard_id)
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

  async addPartNote({ state }, payload) {
    let response
    await this.$axios
      .post(`api/scorecard/${payload.id}/note`, payload.data)
      .then((res) => {
        response = res
      })

    return response
  },

  async addPartDoc({ state }, payload) {
    let response

    await this.$axios
      .post(`api/scorecard/${payload.id}/document-upload`, payload.data)
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
  async storePartGuidance({ state, commit, dispatch }, payload) {
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

    await dispatch('getResponseSummary', state.scorecard.id)
    await dispatch('updatePartsList', isHSR)
  },
  getGlossary({ commit }) {
    this.$axios
      .get('api/glossary')
      .then((response) => {
        commit('setGlossary', response.data)
      })
      .catch((erro) => {})
  },
}
