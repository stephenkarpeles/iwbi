// This file was added by xdn init.
// You should commit this file to source control.

const { Router } = require('@layer0/core/router')
const { nuxtRoutes } = require('@layer0/nuxt')

module.exports = new Router()
  .match('/:path*', ({ setResponseHeader }) => {
    setResponseHeader(
      'Content-Security-Policy',
      "frame-ancestors 'self' https://*.wellcertified.com http://*.wellcertified.com http://localhost:3000 https://*.storyblok.com http://*.storyblok.com"
    )
  })
  .match('/service-worker.js', ({ serviceWorker }) => {
    serviceWorker('.nuxt/dist/client/service-worker.js')
  })
  .get('/projects/v2/dashboard/', ({ redirect }) => {
    return redirect('/projects/v2/', { statusCode: 301 })
  })
  .get('/mock-portfolio', ({ redirect }) => {
    return redirect('/demo/mock-portfolio', { statusCode: 301 })
  })
  .get('/well-admin/v1/strategies/', ({ redirect }) => {
    return redirect('/well-admin/alternatives/', { statusCode: 301 })
  })
  .get('/well-admin/v2/strategies/', ({ redirect }) => {
    return redirect('/well-admin/alternatives/', { statusCode: 301 })
  })
  .get('/well-admin/hsr/strategies', ({ redirect }) => {
    return redirect('/well-admin/alternatives/', { statusCode: 301 })
  })
  .get('/well-admin/strategies/:id', ({ redirect }) => {
    return redirect(
      '/alternatives/:id?redirect=%2Fwell-admin%2Falternatives%2F',
      { statusCode: 301 }
    )
  })
  .get('/well-admin/well/faculty', ({ redirect }) => {
    return redirect('/well-admin/faculty/', { statusCode: 301 })
  })
  .get('/well-admin/well/faculty/:faculty_id', ({ redirect }) => {
    return redirect('/well-faculty/register/:faculty_id/', { statusCode: 301 })
  })
  .get('/well-admin/portfolio/list', ({ redirect }) => {
    return redirect('/well-admin/portfolios/', { statusCode: 301 })
  })
  .get('/well-admin/shared-workspaces/list', ({ redirect }) => {
    return redirect('/well-admin/shared-workspaces/', { statusCode: 301 })
  })
  .get('/well-admin/exam/list', ({ redirect }) => {
    return redirect('/well-admin/exams/', { statusCode: 301 })
  })
  .get('/well-admin/credential/list', ({ redirect }) => {
    return redirect('/well-admin/credentials/', { statusCode: 301 })
  })
  .get('/content/invoice-:invoiceId', ({ redirect }) => {
    return redirect('/invoice/:invoiceId', { statusCode: 301 })
  })
  .get('/landing/', ({ redirect }) => {
    return redirect('/', { statusCode: 301 })
  })
  .get('/user/', ({ redirect }) => {
    return redirect('/user/profile', { statusCode: 301 })
  })
  .get('/user/subscribed/membership', ({ redirect }) => {
    return redirect('/membership', { statusCode: 301 })
  })
  .get('/membership/subscribe/signup/:id', ({ redirect }) => {
    return redirect('/membership/register/:id', { statusCode: 301 })
  })
  .get('/pricing-estimate', ({ redirect }) => {
    return redirect('/estimates/pricing', { statusCode: 301 })
  })
  .get('/v1-pricing-estimate', ({ redirect }) => {
    return redirect('/estimates/create/v1', { statusCode: 301 })
  })
  .get('/v1-pricing-estimate/:id', ({ redirect }) => {
    return redirect('/estimates/v1/:id', { statusCode: 301 })
  })
  .get('/v1-pricing-estimate/:estimateId/edit', ({ redirect }) => {
    return redirect('/estimates/v1/:id', { statusCode: 301 })
  })
  .get('/v2/pricing-estimate', ({ redirect }) => {
    return redirect('/estimates/create/v2', { statusCode: 301 })
  })
  .get('/v2/pricing-estimate', ({ redirect }) => {
    return redirect('/estimates/create/v2', { statusCode: 301 })
  })
  .get('/project', ({ redirect }) => {
    return redirect('/projects/v1/list/', { statusCode: 301 })
  })
  .get('/project/add', ({ redirect }) => {
    return redirect('/projects/v1/create', { statusCode: 301 })
  })
  .get('/v2/project', ({ redirect }) => {
    return redirect('/projects/list/', { statusCode: 301 })
  })
  .get('/v2/project/add', ({ redirect }) => {
    return redirect('/projects/v2/landing', { statusCode: 301 })
  })
  .get('/portfolio', ({ redirect }) => {
    return redirect('/portfolio/list', { statusCode: 301 })
  })
  .get('/portfolio/:portfolioId/health-safety', ({ redirect }) => {
    return redirect('/portfolio/:portfolioId/hsr', { statusCode: 301 })
  })
  .get('/portfolio/:portfolioId/membership/subscribed', ({ redirect }) => {
    return redirect('/portfolio/:portfolioId/membership', { statusCode: 301 })
  })
  .get('/portfolio/:portfolioId/membership/profile/edit', ({ redirect }) => {
    return redirect('/portfolio/:portfolioId/membership', { statusCode: 301 })
  })
  .get('/portfolio/:portfolioId/documents/list', ({ redirect }) => {
    return redirect('/portfolio/:portfolioId/documents/', {
      statusCode: 301,
    })
  })
  .get('/portfolio/:portfolioId/strategies', ({ redirect }) => {
    return redirect('/portfolio/:portfolioId/alternatives', { statusCode: 301 })
  })
  .get('/portfolio/:portfolioId/strategies/', ({ redirect }) => {
    return redirect('/portfolio/:portfolioId/alternatives/', {
      statusCode: 301,
    })
  })
  .get('/portfolio/:portfolioId/support/notes/list', ({ redirect }) => {
    return redirect('/portfolio/:portfolioId/support', { statusCode: 301 })
  })
  .get('/v1/project', ({ redirect }) => {
    return redirect('/projects/v1/list/', { statusCode: 301 })
  })
  .get('/v1/project/add', ({ redirect }) => {
    return redirect('/projects/v1/create', { statusCode: 301 })
  })
  .get('/node/add/project', ({ redirect }) => {
    return redirect('/projects/v2/create', { statusCode: 301 })
  })
  .get('/projects/', ({ redirect }) => {
    return redirect('/projects/list/', { statusCode: 301 })
  })
  .get('/v2/projects/', ({ redirect }) => {
    return redirect('/projects/list/', { statusCode: 301 })
  })
  .get('/admin/v2/project/:projectId', ({ redirect }) => {
    return redirect('/projects/v2/:projectId/dashboard', { statusCode: 301 })
  })
  .get('/admin/project/:projectId', ({ redirect }) => {
    return redirect('/projects/v1/:projectId/dashboard', { statusCode: 301 })
  })
  .get('/project/:projectId', ({ redirect }) => {
    return redirect('/projects/v1/:projectId/dashboard', { statusCode: 301 })
  })
  .get('/project/:projectId/dashboard', ({ redirect }) => {
    return redirect('/projects/v2-pilot/:projectId/dashboard', {
      statusCode: 301,
    })
  })
  .get('/projects/:projectType/:projectId/notes', ({ redirect }) => {
    return redirect('/projects/:projectType/:projectId/support', {
      statusCode: 301,
    })
  })
  .get('/v2/project/:projectId', ({ redirect }) => {
    return redirect('/projects/v2/:projectId/dashboard', { statusCode: 301 })
  })
  .get('/admin/v2/project/:projectId/', ({ redirect }) => {
    return redirect('/projects/v2/:projectId/dashboard', { statusCode: 301 })
  })
  // .get('/estimates/:id', ({ redirect }) => {
  //   return redirect('/estimates/v1/:id', { statusCode: 301 })
  // })
  .get('/message', ({ redirect }) => {
    return redirect('/message/center', { statusCode: 301 })
  })
  .get('/pt-agents/training-courses', ({ redirect }) => {
    return redirect('/education-courses/', { statusCode: 301 })
  })
  .get('/dashboard/', ({ redirect }) => {
    return redirect('/', { statusCode: 301 })
  })
  .get('/dashboard/project/v2', ({ redirect }) => {
    return redirect('/projects/list/', { statusCode: 301 })
  })
  .get('/dashboard/project/v2-pilot', ({ redirect }) => {
    return redirect('/projects/list/', { statusCode: 301 })
  })
  .get('/dashboard/project/v1', ({ redirect }) => {
    return redirect('/projects/list/', { statusCode: 301 })
  })
  .get('/dashboard/membership', ({ redirect }) => {
    return redirect('/membership/', { statusCode: 301 })
  })
  .get('/myprojects', ({ redirect }) => {
    return redirect('/projects/list/', { statusCode: 301 })
  })
  .get('/shared-workspaces/list', ({ redirect }) => {
    return redirect('/shared-workspaces', { statusCode: 301 })
  })
  .get('/shared-workspaces/create', ({ redirect }) => {
    return redirect('/shared-workspaces/create/landing', { statusCode: 301 })
  })
  .get('/shared-workspaces/:portfolioId/', ({ redirect }) => {
    return redirect('/portfolio/:portfolioId/dashboard', { statusCode: 301 })
  })
  .get('/shared-workspaces/:portfolioId/locations/add', ({ redirect }) => {
    return redirect('/shared-workspaces/:portfolioId/locations/', {
      statusCode: 301,
    })
  })
  .get('/shared-workspaces/:portfolioId/documents/list', ({ redirect }) => {
    return redirect('/shared-workspaces/:portfolioId/documents', {
      statusCode: 301,
    })
  })
  .get('/shared-workspaces/:portfolioId/documents/add', ({ redirect }) => {
    return redirect('/shared-workspaces/:portfolioId/documents/', {
      statusCode: 301,
    })
  })
  .get('/shared-workspaces/:portfolioId/strategies/', ({ redirect }) => {
    return redirect('/shared-workspaces/:portfolioId/alternatives/', {
      statusCode: 301,
    })
  })
  .get('/shared-workspaces/:portfolioId/strategies/add/aap', ({ redirect }) => {
    return redirect('/shared-workspaces/:portfolioId/alternatives/', {
      statusCode: 301,
    })
  })
  .get('/shared-workspaces/:portfolioId/strategies/add/ep', ({ redirect }) => {
    return redirect('/shared-workspaces/:portfolioId/alternatives/', {
      statusCode: 301,
    })
  })
  .get('/shared-workspaces/:portfolioId/strategies/:id', ({ redirect }) => {
    return redirect('/shared-workspaces/:portfolioId/alternatives/', {
      statusCode: 301,
    })
  })
  .get(
    '/shared-workspaces/:portfolioId/strategies/:id/edit',
    ({ redirect }) => {
      return redirect('/shared-workspaces/:portfolioId/alternatives/', {
        statusCode: 301,
      })
    }
  )
  .get('/membership/view', ({ redirect }) => {
    return redirect('/membership/', { statusCode: 301 })
  })
  .get('/strategies', ({ redirect }) => {
    return redirect('/alternatives', { statusCode: 301 })
  })
  .get('/strategies/:id', ({ redirect }) => {
    return redirect('/alternatives/:id?redirect=%2Falternatives', {
      statusCode: 301,
    })
  })
  .get('/hsr/strategies', ({ redirect }) => {
    return redirect('/alternatives', { statusCode: 301 })
  })
  .get('/v1/strategies', ({ redirect }) => {
    return redirect('/alternatives', { statusCode: 301 })
  })
  .get('/cm', ({ redirect }) => {
    return redirect('/well-ap/credentials', { statusCode: 301 })
  })
  .get('/myexams', ({ redirect }) => {
    return redirect('/well-ap/', { statusCode: 301 })
  })
  .get('/education-courses/:slug', ({ redirect }) => {
    return redirect('/education-courses/', { statusCode: 301 })
  })
  .get('/well/faculty', ({ redirect }) => {
    return redirect('/well-faculty/', { statusCode: 301 })
  })
  .get('/node/add/faculty-application', ({ redirect }) => {
    return redirect('/well-faculty/', { statusCode: 301 })
  })
  .get('/node/add/performance-testing-organization', ({ redirect }) => {
    return redirect('/pt-organizations/create', { statusCode: 301 })
  })
  .get('/faculty-dashboard', ({ redirect }) => {
    return redirect('/well-faculty/', { statusCode: 301 })
  })
  .get('/people', ({ redirect }) => {
    return redirect('/directories/users', { statusCode: 301 })
  })
  .get('/mock-portfolio', ({ redirect }) => {
    return redirect('/well-admin/demo/mock-portfolio', { statusCode: 301 })
  })
  .get('/member-profiles/:slug', ({ redirect }) => {
    return redirect('/membership/profile/:slug', { statusCode: 301 })
  })
  .get('/v2-timeline-estimator', ({ redirect }) => {
    return redirect('/estimates/tools/timeline-estimator', { statusCode: 301 })
  })
  .use(nuxtRoutes)
  .fallback(({ renderWithApp }) => renderWithApp())
