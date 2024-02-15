export default {
  examPassed: (state) => {
    if (state.allExams.length && state.allExams[0].exam_status === 'pass') {
      return true
    } else {
      return false
    }
  },
}
