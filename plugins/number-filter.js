import Vue from 'vue'

Vue.filter('formatNumber', function (value) {
  return Number(value).toLocaleString().replace('-', '')
})

Vue.filter('currency', function (value, decimalPlaces) {
  if (typeof decimalPlaces === 'undefined') decimalPlaces = 2
  const num = Number(value.toFixed(decimalPlaces)).toLocaleString()
  if (num.includes('-') === -1) {
    return '$' + num
  } else {
    return num.replace('-', '- $')
  }
})

Vue.filter('currencyUSA', function (value, decimalPlaces) {
  if (typeof decimalPlaces === 'undefined') decimalPlaces = 2
  const num = Number(value.toFixed(decimalPlaces)).toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
  if (!num.includes('-')) {
    return '$' + num
  } else {
    return num.replace('-', '- $')
  }
})

Vue.filter('formatCurrency', function (value) {
  const num = Number(value).toLocaleString()
  if (!num.includes('-')) {
    return '$' + num
  } else {
    return num.replace('-', '- $')
  }
})
