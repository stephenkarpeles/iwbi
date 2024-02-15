import Vue from 'vue'

Vue.filter('capitalize', function (value) {
  if (!value) return ''
  value = value.toString()
  return value.charAt(0).toUpperCase() + value.slice(1)
})

Vue.filter('getSubPartTitle', function (value) {
  let title = ''
  if (value.length !== 0) {
    if (value.length === 1) {
      title += value[0].name
    } else {
      title += value[0].name
      for (let i = 1; i < value.length; i++) {
        if (i === value.length - 1) {
          title += ' & ' + value[i].name
        } else {
          title += ', ' + value[i].name
        }
      }
    }
  }
  return title + ''
})
