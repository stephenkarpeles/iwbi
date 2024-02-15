export default {
  surveyStatus: (state) => {
    const started = state.survey_started
    const completed = state.survey_completed
    const status = {
      started:
        started === null
          ? started
          : typeof started === 'boolean'
          ? started
          : !!parseInt(started),
      completed:
        completed === null
          ? completed
          : typeof completed === 'boolean'
          ? completed
          : !!parseInt(completed),
    }

    return status
  },
}
