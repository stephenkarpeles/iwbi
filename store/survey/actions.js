export default {
  loadSurvey({ state, commit, dispatch, rootState }, payload) {
    const id = rootState.portfolio.portfolio.id || payload.id
    if (id) {
      this.$axios
        .get('api/portfolio/survey/' + id, {
          token: rootState.authentication.token,
        })
        .then((response) => {
          commit('setSurvey', response.data.survey)
          commit('setQuestionCounts', response.data.survey)
          commit('setOptionCounts', response.data.survey)
          commit('setSurveyStarted', response.data.survey_started)
          commit('setSurveyCompleted', response.data.survey_completed)
          commit('setSurveyConceptScore', response.data.concept_score)
          commit('checkHasCategories')
        })
    }
  },
  publishOptionUpdate({ state, commit, rootState }, payload) {
    const id = rootState.portfolio.portfolio.id || null
    const scorecardId = rootState.portfolio.portfolio.scorecard_id

    if (id && scorecardId) {
      this.$axios
        .post(
          'api/portfolio/' +
            id +
            '/scorecard/' +
            scorecardId +
            '/' +
            payload.id,
          {
            token: rootState.authentication.token,
            response: payload.response,
          }
        )
        .then(function (response) {})
    }
  },
  publishSurveyStatus({ state, rootState }, payload) {
    const id = rootState.portfolio.portfolio.id || null

    if (id) {
      this.$axios
        .put('api/portfolio/survey/' + id + '/statusUpdate', {
          token: rootState.authentication.token,
          survey_started: payload.survey_started,
          survey_completed: payload.survey_completed,
        })
        .then(function (response) {})
    }
  },
  updateSurveyStarted({ state, commit, dispatch }, payload) {
    commit('setSurveyStarted', payload)
    dispatch('publishSurveyStatus', {
      survey_started: payload ? 1 : 0,
      survey_completed: state.survey_completed,
    })
  },

  updateSurveyCompleted({ state, commit, dispatch }, payload) {
    commit('setSurveyCompleted', payload)
    dispatch('publishSurveyStatus', {
      survey_started: state.survey_started,
      survey_completed: payload ? 1 : 0,
    })
  },
}
