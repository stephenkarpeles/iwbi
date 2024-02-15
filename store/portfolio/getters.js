export default {
  subscriptionStatus: (state) => {
    let enrolled
    let subscribed

    if (state.portfolio && state.portfolio.reg_payment_status) {
      enrolled = state.portfolio.reg_payment_status === 'paid'
    }

    if (state.portfolio && state.portfolio.reg_payment_status) {
      subscribed = state.portfolio.sub_payment_status === 'paid'
    }

    if (subscribed && enrolled) {
      return 'subscribed'
    } else if (!subscribed && enrolled) {
      return 'enrolled'
    }

    return 'preenrolled'
  },
  hsrSubscriptionStatus: (state) => {
    const enrolled =
      state.portfolio.hsr_payment === 'paid' ||
      state.portfolio.hsr_payment === 'waived' ||
      (state.portfolio.type === 'v2-hsr' &&
        (state.portfolio.reg_payment_status === 'paid' ||
          state.portfolio.reg_payment_status === 'waived'))
    if (enrolled) {
      return 'enrolled'
    } else {
      return 'preenrolled'
    }
  },
  portfolioId: (state) => {
    return state.portfolio.id
  },
  totalPropertyCount: (state) => {
    return state.portfolio.total_property_count
  },
  totalAreaCount: (state) => {
    return state.portfolio.total_property_area
  },
  project: (state) => {
    return state.portfolioProjects.data
  },

  // properties
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
            label:
              element.name === 1
                ? `Yes (${element.count})`
                : `No (${element.count})`,
            value: element.name,
          }
        })
      : []
  },
  coordinateList: (state) => {
    const list = []
    state.locations.forEach((location) => {
      if (location.lng !== null && location.lat !== null) {
        list.push([location.lng, location.lat])
      }
    })
    return list
  },
}
