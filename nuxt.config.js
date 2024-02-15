export default {
  /*
   ** Nuxt target
   ** See https://nuxtjs.org/api/configuration-target
   */
  target: 'server',
  ssr: true,

  generate: {
    fallback: true,
  },

  /*
   ** Headers of the page
   ** See https://nuxtjs.org/api/configuration-head
   */
  head: {
    titleTemplate: '%s | WELL',
    title: 'WELL Online',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      {
        hid: 'description',
        name: 'description',
        content: process.env.npm_package_description || '',
      },
    ],
    link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }],
  },

  env: {
    checklistUrl: process.env.CHECKLIST_URL,
    supportApi: process.env.ZENDESK_API_ROOT,
    SsoRedirectZendesk: process.env.SSO_REDIRECT_ZENDESK,
    zendeskOrgPrefix: process.env.ZENDESK_ORG_PREFIX,
    v1ZendeskOrgPrefix: process.env.V1_ZENDESK_ORG_PREFIX,
    zendeskPortfolioOrgPrefix: process.env.ZENDESK_PORTFOLIO_ORG_PREFIX,
    cbaPrefix: process.env.CBA_PREFIX,
  },
  /*
   ** Global CSS
   */
  css: ['@/assets/scss/main.scss'],
  /*
   ** Plugins to load before mounting the App
   ** https://nuxtjs.org/guide/plugins
   */
  plugins: [
    { src: '~/plugins/sentry', mode: 'client' },
    { src: '~/plugins/filters.js' },
    // { src: '~/plugins/cumul.js', mode: 'client' },
    { src: '~/plugins/authentication', mode: 'client' },
    { src: '~/plugins/mapbox', mode: 'client' },
    { src: '~/plugins/appcues', mode: 'client' },
    { src: '~/plugins/hotjar', mode: 'client' },
    '~/plugins/settings',
    '~/plugins/wind-componets',
    '~/plugins/number-filter',
    '~/plugins/vue-formulate',
    '~/plugins/charts',
    '~/plugins/hover-directive',
    { src: '~/plugins/v-observe-visibility.client.js', mode: 'client' },
    { src: '~/plugins/datepicker', mode: 'client', ssr: false },
    { src: '~/plugins/multiselect', mode: 'client', ssr: false },
  ],

  loading: {
    color: '#ac7358',
    height: '5px',
  },

  /*
   ** Auto import components
   ** See https://nuxtjs.org/api/configuration-components
   */
  components: {
    dirs: [
      { path: '~/components', pathPrefix: false },
      {
        path: '~/components/well/legal',
        prefix: 'Legal',
        pathPrefix: false,
      },
      {
        path: '~/components/well/support',
        prefix: 'Support',
        pathPrefix: false,
      },
      {
        path: '~/components/forms',
        prefix: 'Forms',
        pathPrefix: false,
      },
      {
        path: '~/components/well/explore',
        prefix: 'Explore',
        pathPrefix: false,
      },
      {
        path: '~/components/forms/input-groups',
        prefix: 'FormInputs',
        pathPrefix: false,
      },
      {
        path: '~/components/well/membership/',
        prefix: 'Membership',
        pathPrefix: false,
      },
      {
        path: '~/components/navigation',
        prefix: 'Nav',
        pathPrefix: false,
      },
      {
        path: '~/components/well/projects/v1',
        prefix: 'P1',
        pathPrefix: false,
      },
      {
        path: '~/components/well/projects/',
        prefix: 'Project',
        pathPrefix: false,
      },
      {
        path: '~/components/well/projects/shared-components/screens/hsr/renewal',
        prefix: 'ProjectHSRRenewal',
        pathPrefix: false,
      },
      {
        path: '~/components/well/projects/shared-components/screens/wpr/',
        prefix: 'ProjectWPR',
        pathPrefix: false,
      },
      {
        path: '~/components/well/portfolio/',
        prefix: 'Portfolio',
        pathPrefix: false,
      },
      {
        path: '~/components/well/well-admin/',
        prefix: 'WellAdmin',
        pathPrefix: false,
      },
      {
        path: '~/components/well/scorecard/generic',
        prefix: 'Scorecard',
        pathPrefix: false,
      },
      {
        path: '~/components/well/scorecard/portfolio',
        prefix: 'PortfolioScorecard',
        pathPrefix: false,
      },
      {
        path: '~/components/well/scorecard/legacy',
        prefix: 'PortLegacy',
        pathPrefix: false,
      },
      {
        path: '~/components/well/checklist',
        prefix: 'Checklist',
        pathPrefix: false,
      },
      {
        path: '~/components/well/estimate',
        prefix: 'Estimate',
        pathPrefix: false,
      },
      {
        path: '~/components/well/profile',
        prefix: 'Profile',
        pathPrefix: false,
      },
      {
        path: '~/components/well/well-faculty',
        prefix: 'Faculty',
        pathPrefix: false,
      },
      {
        path: '~/components/well/explore',
        prefix: 'Explore',
      },
      {
        path: '~/components/elements/accordians',
        prefix: 'Accordians',
        pathPrefix: false,
      },
      {
        path: '~/components/elements/modals',
        prefix: 'Modals',
      },
      {
        path: '~/components/well/alternatives',
        prefix: 'A2',
        pathPrefix: false,
      },
      {
        path: '~/components/well/message',
        prefix: 'Message',
        pathPrefix: false,
      },
      {
        path: '~/components/well/shared-workspace',
        prefix: 'Shared',
        pathPrefix: false,
      },
      {
        path: '~/components/well/wpr',
        prefix: 'WPR',
        pathPrefix: false,
      },
      {
        path: '~/components/elements/loading',
        prefix: 'Loading',
        pathPrefix: false,
      },
      {
        path: '~/components/well/user',
        prefix: 'User',
        pathPrefix: false,
      },
      {
        path: '~/components/well/exams',
        prefix: 'Exam',
        pathPrefix: false,
      },
      {
        path: '~/components/well/assessment',
        prefix: 'WellAssessment',
        pathPrefix: false,
      },
      {
        path: '~/components/elements/cards',
        prefix: 'Card',
        pathPrefix: false,
      },
      {
        path: '~/components/elements/steps',
        prefix: 'Step',
        pathPrefix: false,
      },
    ],
  },
  /*
   ** Nuxt.js dev-modules
   */
  buildModules: [
    '@layer0/nuxt/module',
    // Doc: https://github.com/nuxt-community/eslint-module
    '@nuxtjs/eslint-module',
    // Doc: https://github.com/nuxt-community/nuxt-tailwindcss
    '@nuxtjs/tailwindcss',
    // Doc: https://github.com/nuxt-community/svg-module
    '@nuxtjs/svg',
    // Doc: https://github.com/nuxt-community/router-extras-module
    '@nuxtjs/router-extras',
    // Doc: https://github.com/GroupTen/Wind-Components
    '~/Wind-Components',
    // Doc: https://github.com/StephenMarkToms/nuxt-pixel-loader
    '@sutura/nuxt-pixel-loader',
    // Doc: https://axios.nuxtjs.org/usage
    '@nuxtjs/axios',
    '@nuxtjs/auth',
    'cookie-universal-nuxt',
    '@nuxtjs/dayjs',
    'nuxt-algolia',
    [
      'nuxt-stripe-module',
      {
        publishableKey: process.env.STRIPE_PK_US,
      },
    ],
    [
      '@dansmaculotte/nuxt-zendesk',
      {
        key:
          !process.env.BASE_URL.includes('qas-v2') &&
          !process.env.BASE_URL.includes('test-v2') &&
          !process.env.BASE_URL.includes('dev-v2')
            ? 'ecbf3d89-7636-4e30-aa3a-f723c7b48201'
            : 'a9a31d63-4a8c-41e8-b55b-1d2ec9797bf0',
        disabled: false,
        hideOnLoad: true,
      },
    ],
  ],
  /*
   ** Nuxt.js modules
   */
  modules: [],

  router: {
    middleware: ['authentication', 'auth'],
  },

  auth: {
    cookie: {
      options: {
        path: '/',
        maxAge: 60 * 60 * 24 * 90,
      },
    },
    localStorage: false,
    plugins: [
      { src: '~/plugins/axios', ssr: true },
      '~/plugins/authentication.js',
    ],
    watchedLoggedIn: true,
    redirect: {
      login: '/user/login',
      logout: '/user/login',
      home: '/',
      callback: '/user/login',
    },
    strategies: {
      local: {
        user: {
          property: false,
          autoFetch: false,
        },
        token: {
          property: 'token',
          required: true,
          type: 'Bearer',
        },
        endpoints: {
          home: {
            url: '/',
          },
          login: {
            url: 'api/authenticate',
            method: 'post',
          },
          logout: {
            url: 'api/logout',
            method: 'post',
          },
          user: {
            url: 'api/getLoggedMemberInfo',
            method: 'get',
          },
        },
      },

      facebook: {
        endpoints: {
          authorization: 'https://www.facebook.com/v6.0/dialog/oauth',
          userInfo: 'https://graph.facebook.com/v2.12/me?fields=email',
        },
        response_type: 'code',
        client_id: process.env.FACEBOOK_CLIENT_ID,
        scope: ['public_profile', 'email'],
        state: 'UNIQUE_AND_NON_GUESSABLE',
      },
      google: {
        client_id: process.env.GOOGLE_CLIENT_ID,
        response_type: 'code',
      },
      linkedin: {
        _scheme: 'oauth2',
        authorization_endpoint:
          'https://www.linkedin.com/oauth/v2/authorization',
        userinfo_endpoint: 'https://api.linkedin.com/v2/me',
        token_endpoint: 'https://www.linkedin.com/oauth/v2/accessToken',
        scope: ['r_liteprofile', 'r_emailaddress'],
        response_type: 'code',
        client_id: process.env.LINKEDIN_CLIENT_ID,
        state: 'UNIQUE_AND_NON_GUESSABLE',
      },
      test: {
        scheme: 'oauth2',
        endpoints: {
          authorization: 'https://www.linkedin.com/oauth/v2/authorization',
          token: undefined,
          userInfo: 'https://api.linkedin.com/v2/me',
          logout: 'https://example.com/logout',
        },
        token: {
          property: 'access_token',
          type: 'Bearer',
          maxAge: 1800,
        },
        refreshToken: {
          property: 'refresh_token',
          maxAge: 60 * 60 * 24 * 30,
        },
        responseType: 'code',
        grantType: 'authorization_code',
        accessType: undefined,
        redirectUri: '/user/login',
        logoutRedirectUri: undefined,
        client_id: process.env.LINKEDIN_CLIENT_ID,
        scope: ['r_liteprofile', 'r_emailaddress'],
        state: 'UNIQUE_AND_NON_GUESSABLE',
        codeChallengeMethod: '',
        responseMode: '',
        acrValues: '',
      },
    },
  },

  publicRuntimeConfig: {
    supportMessage: process.env.SUPPORT_MESSAGE,
    supportLink: process.env.SUPPORT_LINK,
    sentryURL: process.env.SENTRY_URL,
    assetsURL: process.env.ASSETS_URL,
    legacyURL: process.env.LEGACY_URL,
    StripeUS: process.env.STRIPE_PK_US,
    StripeCN: process.env.STRIPE_PK_CN,
    algolia: {
      applicationId: process.env.ALGOLIA_ID,
      apiKey: process.env.ALGOLIA_KEY,
    },
  },

  /*
   ** Axios module configuration
   ** See https://axios.nuxtjs.org/options
   */
  axios: {
    baseURL: process.env.BASE_URL,
  },
  /*
   ** Build configuration
   ** See https://nuxtjs.org/api/configuration-build/
   */
  build: {
    options: {
      fix: true,
    },
  },
}
