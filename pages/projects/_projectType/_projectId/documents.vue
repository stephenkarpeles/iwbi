<template>
  <div>
    <div v-if="project && invoices">
      <WFeedbackAlert ref="alert" class="z-50" />
      <ProjectUpgrade :project="project" />
      <div class="relative bg-white rounded-lg">
        <ProjectDocumentsScreen v-if="project.type !== 'v1'" />
        <P1DocumentsScreen v-else />
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
      currentTab: (state) => state.settings.sidebarTab,
      project: (state) => state.project.project,
      estimate: (state) => state.project.estimate,
      invoices: (state) => state.project.projectInvoices,
      countries: (state) => state.address.countries,
      currentUser: (state) => state.user.currentUser,
    }),
  },
  async mounted() {
    this.$store.commit('settings/setSidebarTab', 'Documents')

    await this.$store.dispatch(
      'project/getProjectByNumber',
      this.$route.params.projectId
    )

    await this.$store.dispatch('project/getProjectInvoices', this.project.id)
  },
  beforeDestroy() {
    this.$store.dispatch('review/reset')
  },
}
</script>
