/* eslint-disable no-undef */
import { onLoad } from './helpers/onLoad'

export default ({ app }) => {
  onLoad(() => {
    const gId = 'GTM-P38CPKJ'

    const loaderScript = document.createElement('script')
    loaderScript.async = true
    loaderScript.setAttribute(
      'src',
      `https://www.googletagmanager.com/gtag/js?id=${gId}`
    )

    const script = document.createElement('script')
    script.defer = true

    script.innerHTML = `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
    new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
    j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
    'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
    })(window,document,'script','dataLayer','${gId}');`

    document.head.appendChild(loaderScript)
    document.head.appendChild(script)
  }, 4500)
}
