export default {
  async loadBasicInformationData({ state, commit }) {
    const res = await this.$axios.get('api/hsr-assessment/data')
    commit('setBasicInformationData', res.data)
  },
  async getForm({ state, commit }, id) {
    const res = await this.$axios.get(`api/hsr-assessment/${id}`)

    if (res.data.questions) {
      commit('setQuestions', res.data.questions)
    }
    if (res.data.report) {
      commit('setReport', res.data.report)
    }

    if (res.data.portfolio_number) {
      commit('setPortfolioNumber', res.data.portfolio_number)
    }

    commit('setCompleted', res.data.completed)
    commit('setAssessmentKey', res.data.assessment.code)
    commit('setProjectName', res.data.assessment.name)
    commit('setApproximateSize', res.data.assessment.footage)
    commit('setSpaceType', res.data.assessment.primary_space_type)
    commit('setAssessmentType', res.data.assessment.project_type)
  },
  async getPdf({ state, commit }, id) {
    const res = await this.$axios.get(`api/hsr-assessment/${id}/pdf`)
    commit('setPdfLink', res.data.url)
  },
  async saveBasicInformation({ state, commit }, payload) {
    const res = await this.$axios.post(
      'api/hsr-assessment/basic-information',
      payload
    )
    commit('setAssessmentKey', res.data.assessment.code)
  },
  async finishSurvey({ state, commit }, payload) {
    await this.$axios.put(
      `api/hsr-assessment/${state.assessmentKey}/finish`,
      payload
    )

    commit('setCompleted', true)
  },
  async sendAnswer({ state, commit }, payload) {
    const res = await this.$axios.put(
      `api/hsr-assessment/${state.assessmentKey}/answer`,
      payload
    )

    commit('setQuestions', res.data.questions)
  },
}
