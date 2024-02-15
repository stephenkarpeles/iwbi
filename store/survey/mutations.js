export default {
  setSurvey(state, payload) {
    state.categories = payload
  },
  setOptionCounts(state, payload) {
    const counts = {}
    if (payload) {
      for (const cat in payload) {
        counts[cat] = payload[cat].question_summary.question_count
      }
    }

    state.optionCounts = counts
  },
  setQuestionCounts(state, payload) {
    const counts = {}
    if (payload) {
      for (const cat in payload) {
        counts[cat] =
          payload[cat] && payload[cat].questions
            ? payload[cat].questions.length
            : null
      }
    }

    state.questionCounts = counts
  },
  updateSurveyOption(state, payload) {
    const question =
      state.categories[payload.category].questions[payload.questionIndex]
    const options = question.options
    const prevResponse = options[payload.optionIndex].response

    if (prevResponse === null) {
      question.option_summary[payload.response]++
    }

    options[payload.optionIndex].response = payload.response
  },
  setSurveyStarted(state, payload) {
    state.survey_started =
      typeof payload === 'boolean' ? payload : !!parseInt(payload)
  },
  setSurveyCompleted(state, payload) {
    state.survey_completed =
      typeof payload === 'boolean' ? payload : !!parseInt(payload)
  },
  setSurveyConceptScore(state, payload) {
    state.conceptScore = typeof payload !== 'undefined' ? payload : null
  },
  checkHasCategories(state) {
    if (state.categories) {
      state.hasCategories = Object.keys(state.categories).length > 0
    }
  },
}
