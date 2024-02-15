export default ({ app }) => {
  app.router.afterEach((to, from) => {
    if (process.client) {
      if (window.Appcues) {
        setTimeout(function () {
          window.Appcues.anonymous()
        }, 2500)
      }
    }

    if (window.Appcues) {
      window.Appcues.anonymous()
      window.Appcues.page()
    }
  })
}
