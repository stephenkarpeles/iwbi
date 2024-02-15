<template>
  <div>
    <div v-if="project && project.id && invoices">
      <WFeedbackAlert ref="alert" class="z-50" />
      <ProjectUpgrade :project="project" />
      <div class="relative bg-white rounded-lg rounded-lg">
        <P1BillingScreen
          v-if="project.type === 'v1' && estimate"
          :project="project"
          :invoices="invoices"
          :estimate="estimate"
        />
        <ProjectBillingScreen v-else :project="project" :invoices="invoices" />
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
      estimate: (state) => state.project.estimate,
      invoices: (state) => state.project.projectInvoices,
    }),
  },
  async mounted() {
    this.$store.commit('settings/setSidebarTab', 'Billing')

    await this.$store.dispatch(
      'project/getProjectByNumber',
      this.$route.params.projectId
    )

    if (this.project.type === 'v1') {
      await this.$store
        .dispatch('project/getV1Project', this.project.id)
        .then((res) => {
          this.getEstimate()
        })
    }

    await this.$store.dispatch('project/getProjectInvoices', this.project.id)
  },
  beforeDestroy() {
    this.$store.dispatch('review/reset')
  },
  methods: {
    async getEstimate() {
      if (this.project.estimate_id) {
        await this.$store.dispatch(
          'project/getV1ProjectEstimate',
          this.project.estimate_id
        )
      }
    },
  },
}
</script>
