export default {
  setBasicInformationData(state, value) {
    state.basicInformationData = value
  },
  setQuestions(state, value) {
    state.questions = value
  },
  setAssessmentKey(state, value) {
    state.assessmentKey = value
  },
  setPortfolioNumber(state, value) {
    state.portfolioNumber = value
  },
  setReport(state, value) {
    state.report = value

    const ORDER = ['Guaranteed', 'Green', 'Yellow', 'Red', 'Black']

    let points = 0
    let setRibbon = false
    for (const e of ORDER) {
      for (const q of value.r[e].q) {
        points += q.points

        if (points >= 15) {
          state.reportRibbon = {
            step: e,
            feature: q.feature,
          }

          setRibbon = true
          break
        }
      }

      if (setRibbon) {
        break
      }
    }
  },
  setProjectName(state, value) {
    state.projectName = value
  },
  setCompleted(state, value) {
    state.completed = value
  },
  setPdfLink(state, value) {
    state.pdfLink = value
  },
  setApproximateSize(state, value) {
    state.approximateSize = value
  },
  setSpaceType(state, value) {
    state.spaceType = value
  },
  setAssessmentType(state, value) {
    state.assessmentType = value
  },
}
