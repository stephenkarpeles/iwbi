/* eslint-disable no-undef */
import { onLoad } from './helpers/onLoad'

export default ({ app, store }) => {
  app.router.afterEach((to, from) => {
    if (process.client) {
      const devKey = 'zQPHSiBoylgzeahKkIhMdeys01Cpmj8t'
      const prodKey = 'ClEOCVLdXDrRsAtyXjT4HL2jn8PfQiFl'

      let activeKey

      if (
        window.location.href.includes('localhost') ||
        window.location.href.includes('test-nuxt.wellcertified')
      ) {
        activeKey = devKey
      } else {
        activeKey = prodKey
      }

      if (store.state.user.currentUser) {
        setTimeout(function () {
          window.analytics.identify(activeKey, store.state.user.currentUser)
        }, 5000)
      }
    }
  })
  onLoad(() => {
    const devKey = 'zQPHSiBoylgzeahKkIhMdeys01Cpmj8t'
    const prodKey = 'ClEOCVLdXDrRsAtyXjT4HL2jn8PfQiFl'

    let activeKey

    if (
      window.location.href.includes('localhost') ||
      window.location.href.includes('test-nuxt.wellcertified')
    ) {
      activeKey = devKey
    } else {
      activeKey = prodKey
    }

    const script = document.createElement('script')
    script.defer = true

    script.innerHTML = `!function(){var analytics=window.analytics=window.analytics||[];if(!analytics.initialize)if(analytics.invoked)window.console&&console.error&&console.error("Segment snippet included twice.");else{analytics.invoked=!0;analytics.methods=["trackSubmit","trackClick","trackLink","trackForm","pageview","identify","reset","group","track","ready","alias","debug","page","once","off","on","addSourceMiddleware","addIntegrationMiddleware","setAnonymousId","addDestinationMiddleware"];analytics.factory=function(e){return function(){var t=Array.prototype.slice.call(arguments);t.unshift(e);analytics.push(t);return analytics}};for(var e=0;e<analytics.methods.length;e++){var key=analytics.methods[e];analytics[key]=analytics.factory(key)}analytics.load=function(key,e){var t=document.createElement("script");t.type="text/javascript";t.async=!0;t.src="https://cdn.segment.com/analytics.js/v1/" + key + "/analytics.min.js";var n=document.getElementsByTagName("script")[0];n.parentNode.insertBefore(t,n);analytics._loadOptions=e};analytics._writeKey="ClEOCVLdXDrRsAtyXjT4HL2jn8PfQiFl";analytics.SNIPPET_VERSION="4.13.2";
      analytics.load("${activeKey}");
      analytics.page();
      }}();`

    document.head.appendChild(script)
  }, 2500)
}
