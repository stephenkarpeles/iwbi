<template>
  <div>
    <div v-if="project && invoices">
      <WFeedbackAlert ref="alert" class="z-50" />
      <ProjectUpgrade :project="project" />

      <ProjectPricingScreen
        v-if="estimate"
        :project="project"
        :estimate="estimate"
      />
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
      estimate: (state) => state.project.estimate,
      invoices: (state) => state.project.projectInvoices,
    }),
  },
  async mounted() {
    this.$store.commit('settings/setSidebarTab', 'Pricing')

    await this.$store
      .dispatch('project/getProjectByNumber', this.$route.params.projectId)
      .then((res) =>
        this.$store.dispatch(
          'project/getProjectEstimate',
          this.project.estimates[0].id
        )
      )

    await this.$store.dispatch('project/getProjectInvoices', this.project.id)
  },
  beforeDestroy() {
    this.$store.dispatch('review/reset')
  },
}
</script>
