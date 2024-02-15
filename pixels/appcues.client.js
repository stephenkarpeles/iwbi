/* eslint-disable no-undef */
import { onLoad } from './helpers/onLoad'

export default ({ app }) => {
  onLoad(() => {
    const script = document.createElement('script')
    script.defer = true

    script.setAttribute('src', '//fast.appcues.com/75434.js')

    document.head.appendChild(script)

    window.Appcues = window.Appcues || []

    setTimeout(function () {
      Appcues.page()

      Appcues.anonymous()
    }, 1000)
  })
}
