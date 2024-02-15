<template>
  <!-- eslint-disable vue/attribute-hyphenation  -->
  <div>
    <div class="w-64">
      <WButtonsBase icon="download" @click.native="downloadDashboard()">
        Download Dashboard
      </WButtonsBase>
    </div>
    <div v-if="dashboardData">
      <ClientOnly>
        <cumulio-dashboard
          id="dashboard"
          ref="dashboard"
          dashboardId="2403f3f1-560c-4df9-bc45-91559305b2c0"
          :authKey="dashboardData.id"
          :authToken="dashboardData.token"
          appServer="https://app.us.cumul.io/"
        >
        </cumulio-dashboard>
      </ClientOnly>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  data() {
    return {
      dashboardData: null,
    }
  },
  head: {
    script: [
      {
        src: 'https://cdn-a.cumul.io/js/cumulio-dashboard/0.0.4-beta/cumulio-dashboard.min.js',
      },
    ],
  },
  computed: {
    ...mapState({
      currentUser: (state) => state.user.currentUser,
    }),
  },
  mounted() {
    const self = this
    const instance = this.$axios.create()
    instance.defaults.headers.common = {}
    instance
      .post('https://api.us.cumul.io/0.1.0/authorization', {
        action: 'create',
        version: '0.1.0',
        key: 'ae7f4cfb-aaa2-4781-908a-c93122c905a5',
        token:
          'Tqi5uRXf9TYysOs4ggBXQTW8eNbq9lxLFxiLaRjZkliN0d0zovu864HyF9ZqwJdaRUEjJGRJk3wdDm93eAoIgjZTyk5rhhgUnEDaFlaLmo5qgV2fU1ImWPRhu1mrDBN4r2tx8kWryQVrD9iFrcxgXS',
        properties: {
          integration_id: '1e7f7660-16a1-4d9a-92e8-53247f01d5eb',
          type: 'sso',
          expiry: '24 hours',
          inactivity_interval: '10 minutes',
          username: this.currentUser.slug,
          name: this.currentUser.full_name,
          email: this.currentUser.email,
          suborganization: this.currentUser.organization,
          role: 'viewer',
          metadata: {
            portfolio_id: Number(this.$route.params.id),
          },
        },
      })
      .then((response) => {
        self.dashboardData = response.data
      })
  },
  methods: {
    downloadDashboard() {
      // Get the component reference, here we query the component that has an id 'dashboard'.
      const dashboardComponent = document.getElementById('dashboard')
      dashboardComponent.exportDashboard('pdf')
    },
  },
}
</script>
