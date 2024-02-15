export default {
  setScorecard(state, newValue) {
    state.scorecard = newValue
  },

  setConcepts(state, payload) {
    state.concepts = payload
  },

  setDocuments(state, payload) {
    state.documents = payload
  },

  setConceptFeatures(state, payload) {
    // attach features to the concept that is already exsisting
    state.concepts.filter(
      (concept) => concept.name === payload.name
    )[0].features = payload.features
  },

  setAllConceptFeatures(state, payload) {
    state.concepts.forEach((concept, index) => {
      payload.concepts.forEach((resConcept) => {
        if (concept.name === resConcept.name) {
          state.concepts[index].features = resConcept.features
        }
      })
    })
  },

  setScores(state, payload) {
    // attach scores to the concept that is already existing
    if (state.scorecard) {
      state.scorecard.scores = payload
      state.scorecard.scores = payload
    }
  },

  setResponseSummary(state, payload) {
    // attach scores to the concept that is already existing
    if (!state.scorecard) {
      state.scorecard = {
        response_summary: payload,
        scores: {},
      }
    } else if (state.scorecard?.scores?.response_summary) {
      state.scorecard.scores.response_summary = payload
    }
  },

  setHSRResponseSummary(state, payload) {
    if (!state.hsrScorecard) {
      state.hsrScorecard = {
        response_summary: payload,
        scores: {},
      }
    } else {
      state.hsrScorecard.scores.response_summary = payload
    }
  },

  setConceptSummary(state, payload) {
    // attach conceptSummary
    state.conceptSummary = payload
  },

  setScoresSummary(state, payload) {
    // attach conceptSummary
    state.scoresSummary = JSON.parse(JSON.stringify(payload))
  },

  setVerifications(state, payload) {
    state.verifications = payload
  },

  setAnnotatedDocuments(state, payload) {
    state.annotatedDocuments = payload
  },

  setLetterofAssurances(state, payload) {
    state.letterOfAssurances = payload
  },

  setOnSites(state, payload) {
    state.onSites = payload
  },

  setFilteredParts(state, payload) {
    state.filteredParts = payload
  },

  setFilters(state, payload) {
    state.activeFilters = payload
  },

  setConceptOptPrec(state, payload) {
    state.conceptOptPrec = payload
  },

  setConceptPrePrec(state, payload) {
    state.conceptPrePrec = payload
  },

  setAnticipatedScore(state, payload) {
    state.anticipatedScore = payload
  },

  setConceptPoints(state, payload) {
    state.conceptPoints = payload
  },

  setPartResponse(state, payload) {
    const parts = []
    let featureParts = state.concepts.filter(
      (concept) => concept.name === payload.requestPayload.concept
    )[0]

    if (featureParts.features) {
      featureParts = featureParts.features
      for (let k = 0; k < featureParts.length; k++) {
        // parts.push(featureParts[k].parts)

        for (let j = 0; j < featureParts[k].parts.length; j++) {
          parts.push(featureParts[k].parts[j])
        }
      }
    }

    const selectedPart = parts.find(
      (part) => part.id === payload.requestPayload.partId
    )

    if (selectedPart.scorecard_part[0]) {
      selectedPart.scorecard_part[0].response = payload.requestPayload.response
      selectedPart.scorecard_part[0].assessment =
        payload.responsePayload.scorecard_part.assessment
      selectedPart.scorecard_part[0].implementation =
        payload.responsePayload.scorecard_part.implementation
      selectedPart.scorecard_part[0].guidance_points =
        payload.responsePayload.scorecard_part.guidance_points
      selectedPart.scorecard_part[0].points =
        payload.responsePayload.scorecard_part.points
    } else {
      selectedPart.scorecard_part.push({
        ...payload.responsePayload.scorecard_part,
      })
    }
  },
  setAdminReviewResponses(state, payload) {
    state.adminReviewResponses = payload
  },
  updatedAdminReviewResponses(state, payload) {
    const reviewIndex = state.adminReviewResponses.findIndex(
      (a) => a.id === payload.payload.id
    )
    if (reviewIndex !== -1) {
      const partIndex = state.adminReviewResponses[
        reviewIndex
      ].responses.findIndex((a) => a.part_id === payload.response.part_id)
      if (partIndex !== -1) {
        state.adminReviewResponses[reviewIndex].responses[partIndex].response =
          payload.response.response
      } else {
        state.adminReviewResponses[reviewIndex].responses.push({
          ...payload.response,
          notes: [],
        })
      }
    } else {
      state.adminReviewResponses.push({
        id: payload.payload.id,
        phase: payload.payload.phase,
        responses: [
          {
            id: payload.response.id,
            part_id: payload.response.part_id,
            response: payload.response.response,
            notes: [],
          },
        ],
      })
    }
  },
  storeResponseNote(state, payload) {
    const reviewIndex = state.adminReviewResponses.findIndex(
      (a) => a.id === payload.data.id
    )
    const partIndex = state.adminReviewResponses[
      reviewIndex
    ].responses.findIndex((a) => a.part_id === payload.data.part_id)
    state.adminReviewResponses[reviewIndex].responses[partIndex].notes.push(
      payload.response
    )
  },
  updateResponseNote(state, payload) {
    const adminReviewResponses = JSON.parse(
      JSON.stringify(state.adminReviewResponses)
    )
    const reviewIndex = state.adminReviewResponses.findIndex(
      (a) => a.id === payload.data.id
    )
    const partIndex = state.adminReviewResponses[
      reviewIndex
    ].responses.findIndex((a) => a.part_id === payload.data.part_id)
    const commentIndex = state.adminReviewResponses[reviewIndex].responses[
      partIndex
    ].notes.findIndex((a) => a.id === payload.commentId)
    adminReviewResponses[reviewIndex].responses[partIndex].notes[commentIndex] =
      payload.response
    state.adminReviewResponses = JSON.parse(
      JSON.stringify(adminReviewResponses)
    )
  },
  removeResponseNote(state, payload) {
    const reviewIndex = state.adminReviewResponses.findIndex(
      (a) => a.id === payload.id
    )
    const partIndex = state.adminReviewResponses[
      reviewIndex
    ].responses.findIndex((a) => a.part_id === payload.part_id)
    const noteIndex = state.adminReviewResponses[reviewIndex].responses[
      partIndex
    ].notes.findIndex((a) => a.id === payload.noteId)
    state.adminReviewResponses[reviewIndex].responses[partIndex].notes.splice(
      noteIndex,
      1
    )
  },
  setScorecardVersion(state, payload) {
    state.scorecardVersion = payload
  },
  setPartGuidance(state, payload) {
    state.partGuidance = payload
  },
  hsrActiveChecklist(state, payload) {
    state.isActiveChecklist = payload
  },
  setGlossary(state, payload) {
    state.glossaryTerm = payload
  },
}
