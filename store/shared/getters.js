export default {
  subscriptionStatus: (state) => {
    const enrolled = state.sharedWorkspace.reg_payment_status === 'paid'
    const subscribed = state.sharedWorkspace.sub_payment_status === 'paid'

    if (subscribed && enrolled) {
      return 'subscribed'
    } else if (!subscribed && enrolled) {
      return 'enrolled'
    }

    return 'preenrolled'
  },
  spaceTypes: (state) => {
    return state.sharedFilters.space_types
      ? state.sharedFilters.space_types.map((element) => {
          return {
            label: element.name + ' (' + element.count + ')',
            value: element.id,
          }
        })
      : []
  },

  deleted_at: (state) => {
    return state.sharedFilters.deleted_at
      ? [
          {
            label: `Active (${state.sharedFilters.deleted_at.active})`,
            value: 'active',
          },
          {
            label: `Archived (${state.sharedFilters.deleted_at.archived})`,
            value: 'only',
          },
        ]
      : null
  },

  ownershipTypes: (state) => {
    return state.sharedFilters.project_type
      ? state.sharedFilters.project_type.map((element) => {
          return {
            label: element.name + ' (' + element.count + ')',
            value: element.project_type,
          }
        })
      : []
  },
  locations: (state) => {
    return state.sharedFilters.country_code
      ? state.sharedFilters.country_code.map((element) => {
          return {
            label: element.name + ' (' + element.count + ')',
            value: element.country_code,
          }
        })
      : []
  },
  industries: (state) => {
    return state.sharedFilters.industry
      ? state.sharedFilters.industry.map((element) => {
          return {
            label: element.name + ' (' + element.count + ')',
            value: element.name,
          }
        })
      : []
  },
  area: (state) => {
    const temp = []
    if (state.sharedFilters.area) {
      temp[0] = {
        label: 'None',
        value: '',
      }
      temp[1] = {
        label:
          '<10,000' + ' (' + state.sharedFilters.area.less_than_10000 + ')',
        value: '<10,000',
      }
      temp[2] = {
        label:
          '10,000+' + ' (' + state.sharedFilters.area.less_than_50000 + ')',
        value: '10,000+',
      }
      temp[3] = {
        label:
          '50,000+' + ' (' + state.sharedFilters.area.less_than_200000 + ')',
        value: '50,000+',
      }
      temp[4] = {
        label:
          '200,000+' + ' (' + state.sharedFilters.area.less_than_500000 + ')',
        value: '200,000+',
      }
      temp[5] = {
        label:
          '500,000+' + ' (' + state.sharedFilters.area.less_than_1000000 + ')',
        value: '500,000+',
      }
      temp[6] = {
        label:
          '1,000,000+' +
          ' (' +
          state.sharedFilters.area.greater_than_1000000 +
          ')',
        value: '1,000,000+',
      }
    }
    return temp
  },
  constructionTypes: (state) => {
    return state.sharedFilters.construction_type
      ? state.sharedFilters.construction_type.map((element, index) => {
          return {
            label: element.name + ' (' + element.count + ')',
            value: element.name,
          }
        })
      : []
  },
  constructionStatus: (state) => {
    return state.sharedFilters.construction_status
      ? state.sharedFilters.construction_status.map((element) => {
          return {
            label: element.name + ' (' + element.count + ')',
            value: element.id,
          }
        })
      : []
  },
}
