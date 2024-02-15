<template>
  <div>
    <div v-if="project">
      <WFeedbackAlert ref="alert" class="z-50" />
      <ProjectUpgrade :project="project" />
      <div class="relative bg-white rounded-lg rounded-lg">
        <P1ChecklistScreen :project="project" />
      </div>
    </div>
    <div v-else>
      <div class="mx-auto text-center py-5">
        <WLoadingSpinner class="mx-auto" />
        <div class="mt-3 text-primary-600">Loading Project Checklist...</div>
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
    }),
  },
  async mounted() {
    this.$store.commit('settings/setSidebarTab', 'Checklist')
    await this.$store.dispatch(
      'project/getProjectByNumber',
      this.$route.params.projectId
    )
  },
}
</script>
