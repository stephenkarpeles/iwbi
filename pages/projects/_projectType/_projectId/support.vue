<template>
  <div>
    <div v-if="project && invoices">
      <ProjectUpgrade :project="project" />
      <WFeedbackAlert ref="alert" class="z-50" />
      <div class="relative bg-white rounded-lg rounded-lg">
        <ProjectSupportScreen :project="project" />
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
    }),
  },
  async mounted() {
    this.$store.commit('settings/setSidebarTab', 'Support')

    await this.$store.dispatch(
      'project/getProjectByNumber',
      this.$route.params.projectId
    )

    await this.$store.dispatch('project/getProjectInvoices', this.project.id)
  },
  beforeDestroy() {
    this.$store.dispatch('review/reset')
    this.$store.dispatch('support/resetSupportTab')
  },
}
</script>
