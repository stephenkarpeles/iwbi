<template>
  <div>
    <div v-if="project && invoices">
      <WFeedbackAlert ref="alert" class="z-50" />
      <ProjectUpgrade :project="project" />
      <div class="relative bg-white rounded-lg">
        <P1OverviewScreen
          v-if="project.type === 'v1' || project.type === 'v1-upgraded'"
          :project="project"
          :countries="countries"
        />
        <ProjectDashboardScreen v-else />
      </div>
    </div>
    <div v-else>
      <div class="mx-auto text-center py-5">
        <WLoadingSpinner class="mx-auto" />
        <div class="mt-3 text-primary-600">Loading Project...</div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapState } from 'vuex'
export default {
  layout: 'sidebar',
  computed: {
    ...mapState({
      project: (state) => state.project.project,
      invoices: (state) => state.project.projectInvoices,
      countries: (state) => state.address.countries,
    }),
  },
  async mounted() {
    if (this.$route.query.tab) {
      this.$store.commit('settings/setSidebarTab', this.$route.query.tab)
    } else {
      this.$store.commit('settings/setSidebarTab', 'Dashboard')
    }

    await this.$store.dispatch(
      'project/getProjectByNumber',
      this.$route.params.projectId
    )
    await this.$store.dispatch('recertification/getrecertificationList')

    await this.$store.dispatch('project/getProjectInvoices', this.project.id)

    if (this.project && this.project.child) {
      this.$store.dispatch(
        'notifications/showBanner',
        `
        <div class="flex py-3 text-sm">
          <div class="mr-3 h-8 w-12 bg-secondary-900 rounded-lg flex">
            <svg class="text-white w-7 my-auto mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
            </svg>
          </div>
          <a href="/projects/v2/${
            this.project.child.project_number
          }/dashboard" class="my-auto">This project has been successfuly upgraded to WELL ${this.project.child.type.replace(
          '-',
          ' '
        )}! Please <span class="underline font-bold">click here</span> to go access the upgraded project.</a>
        </div>
        `
      )
      this.$store.dispatch('notifications/setBannerClose', false)

      const self = this
      window.addEventListener('beforeunload', function (event) {
        self.$store.commit('notifications/setBannerVisibility', false)
        this.$store.dispatch('notifications/setBannerClose', true)
      })
    }
  },
  beforeDestroy() {
    this.$store.dispatch('review/reset')
    this.$store.commit('notifications/setBannerVisibility', false)
    this.$store.dispatch('notifications/setBannerClose', true)
  },
}
</script>
