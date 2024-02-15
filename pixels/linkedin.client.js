/* eslint-disable no-undef */
import { onLoad } from './helpers/onLoad'

export default ({ app }) => {
  onLoad(() => {
    const script = document.createElement('script')
    script.defer = true

    script.innerHTML = `

    (function(){var s = document.getElementsByTagName("script")[0];
      var b = document.createElement("script");
      b.type = "text/javascript";b.async = true;
      b.src = "https://snap.licdn.com/li.lms-analytics/insight.min.js";
      s.parentNode.insertBefore(b, s);})();
    
    `

    document.head.appendChild(script)

    // eslint-disable-next-line camelcase
    const _linkedin_partner_id = '64694'

    window._linkedin_data_partner_ids = window._linkedin_data_partner_ids || []
    window._linkedin_data_partner_ids.push(_linkedin_partner_id)
  }, 4500)
}
