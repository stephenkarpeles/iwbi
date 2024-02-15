import { Metrics } from '@layer0/rum'

export default function ({ store }) {
  if (process.client) {
    new Metrics({
      token: '13610fe8-d729-4999-bbcf-8364afe449fe',
    }).collect()

    store.commit('settings/initialise')
    store.commit('notifications/initialise')
  }
}
