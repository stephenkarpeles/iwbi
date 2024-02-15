<template>
  <div v-if="project">
    <ProjectTeamComponent />
    <ProjectUpgrade :project="project" />
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  layout: 'sidebar',
  data() {
    return {}
  },
  computed: {
    ...mapState({
      project: (state) => state.project.project,
    }),
  },
  async mounted() {
    if (this.$route.query.tab) {
      this.$store.commit('settings/setSidebarTab', this.$route.query.tab)
    } else {
      this.$store.commit('settings/setSidebarTab', 'Team')
    }

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
<style></style>
