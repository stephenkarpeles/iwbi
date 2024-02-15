export default function ({ store, redirect, app, context, $axios, $config }) {
  if (process.client) {
    if (app.$cookies.get('authentication.token')) {
      app.$axios.setToken(app.$cookies.get('authentication.token'), 'Bearer')
      store.dispatch('authentication/getUserInfo')
    }
  }
}
