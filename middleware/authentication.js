export default async function ({ store, redirect, app, $axios, route, req }) {
  const authExceptionRoutes = [
    '/estimates',
    '/estimates/',
    '/estimates/create',
    '/estimates/create/',
    '/estimates/create/' + route.params.version,
    '/estimates/version/' + route.params.id,
    '/estimates/' + route.params.version + '/' + route.params.id,
    '/estimates/' + route.params.version + '/' + route.params.id + '/',
    '/estimates/pricing',
    '/estimates/pricing/',
    '/support',
    '/demo/cumul',
    '/demo/cumul/',
    '/support/',
    '/health-safety-explore',
    '/health-safety-explore/',
    '/directories/users',
    '/directories/users/' + route.params.slug,
    '/directories/projects',
    '/directories/projects/' + route.params.slug,
    '/directories/organizations',
    '/directories/organizations/' + route.params.organizationSlug,
    '/group-purchase',
    '/shared-workspaces/estimator',
    '/shared-workspaces/estimator/create',
    '/estimates/tools/timeline-estimator',
    '/invoice/' + route.params.invoiceNumber,
    '/pricing-calculator',
    '/pricing-calculator/create',
    '/shared-workspaces/roadmap',
    '/shared-workspaces/roadmap/',
    '/shared-workspaces/roadmap/' + route.params.assessmentCode,
    '/shared-workspaces/roadmap/report/' + route.params.assessmentCode,
  ]

  // Remove trailing slashes from the route path var for matching exception routes.
  const routePath = route.path.replace(/\/$/, '')

  const authRoutes = [
    '/user/login',
    '/user/forgot-password',
    '/user/reset/' + route.params.token,
    '/user/directory',
    '/user/register',
    '/user/sso/' + route.params.subscriber,
  ]

  if (
    app.$cookies.get('authentication.token') &&
    [...authRoutes].includes(routePath)
  ) {
    if (
      route.path !== '/user/sso/' + route.params.subscriber &&
      ![...authExceptionRoutes].includes(routePath)
    ) {
      if (route.path === '/user/login' && route.query.redirect_to) {
        app.$cookies.set(
          process.env.cbaPrefix + '.cba.token',
          app.$cookies.get('authentication.token'),
          {
            path: '/',
            domain: '.wellcertified.com',
            maxAge: 60 * 60 * 24 * 7,
          }
        )
        redirect(route.query.redirect_to)
      } else {
        redirect('/')
      }
    }
  }
  const strategies = ['google', 'facebook', 'linkedin']
  const provider = app.$cookies.get('auth.strategy')
  if (
    route.path === '/user/login' &&
    strategies.includes(provider) &&
    (route.query.code || app.$cookies.get(`auth._token.${provider}`)) &&
    process.server
  ) {
    app.$cookies.set('authentication.code', route.query.code)
  }
  if (app.$cookies.get('authentication.token')) {
    await app.$axios.setToken(
      app.$cookies.get('authentication.token'),
      'Bearer'
    )
    await store.commit(
      'authentication/setToken',
      app.$cookies.get('authentication.token')
    )
    await store.dispatch('authentication/getUserInfo')
  } else if (![...authRoutes, ...authExceptionRoutes].includes(routePath)) {
    let to = '/user/login'
    if (route.path !== '/logout') {
      to += '?redirect_to=' + route.fullPath
    }
    redirect(to)
  }
}
