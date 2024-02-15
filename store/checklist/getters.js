export default {
  requiredStrategies: (state) => {
    const conceptName = state.activeFilters.concept
    return state.scorecard.scores.response_summary.concept_summary[conceptName]
      .pre_part_count
  },

  availableStrategies: (state) => {
    const conceptName = state.activeFilters.concept
    return state.scorecard.scores.response_summary.concept_summary[conceptName]
      .opt_part_count
  },
  filterPartGuidance: (state) => {
    if (state.partGuidance !== null) {
      const fieldText = JSON.parse(JSON.stringify(state.partGuidance))
      const originalText = JSON.parse(JSON.stringify(state.partGuidance))
      for (let i = 0; i < state.partGuidance.length; i++) {
        for (let j = 0; j < state.guidancePopover.length; j++) {
          const term = state.guidancePopover[j].value
          let pos = originalText[i].doc_guidance
            .toLowerCase()
            .indexOf(' ' + term.toLowerCase())
          if (pos !== -1) {
            pos = fieldText[i].doc_guidance
              .toLowerCase()
              .indexOf(' ' + term.toLowerCase())
            const currentText = fieldText[i].doc_guidance.substr(
              pos,
              term.length + 1,
              term
            )
            const replaceBy = `<span class='has-tooltip'><span class='tooltip rounded shadow-lg mb-10 p-2 bg-gray-100'>
              ${state.guidancePopover[j].text.replace(/(<([^>]+)>)/gi, '')}
              </span><span class='border-dotted border-b-2 border-primary-600 cursor-pointer'>
              ${currentText}
              </span></span>`
            fieldText[i].doc_guidance =
              fieldText[i].doc_guidance.substr(0, pos) +
              replaceBy +
              fieldText[i].doc_guidance.substr(pos + term.length + 1)
          }
        }
      }
      return fieldText
    } else {
      return ''
    }
  },
}
