<template>
  <div>
    <div v-if="project && invoices">
      <ProjectHSRRenewalOptIn :project="project" />
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
      invoices: (state) => state.project.projectInvoices,
      recertificationList: (state) => state.recertification.recertificationList,
    }),
  },
  async mounted() {
    this.$store.commit('settings/setSidebarTab', 'HSR')
    await this.$store.dispatch(
      'project/getProjectByNumber',
      this.$route.params.projectId
    )
    await this.$store.dispatch('recertification/getrecertificationList')
    let recertifiction = ''
    if (this.recertificationList.length !== 0) {
      const lastRecertifiction = this.recertificationList.length - 1
      recertifiction = this.recertificationList[lastRecertifiction]
    }
    if (
      recertifiction &&
      !recertifiction.date_certified &&
      recertifiction.type === 'v2-hsr'
    ) {
      this.$router.push(
        `/projects/${this.project.type}/${this.project.project_number}/hsr`
      )
    }
    await this.$store.dispatch('project/getProjectInvoices', this.project.id)
  },
}
</script>
