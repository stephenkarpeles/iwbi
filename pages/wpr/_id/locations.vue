<template>
  <div>
    <div v-if="sharedWorkspace && sharedWorkspace.id">
      <WFeedbackAlert ref="alert" class="z-50" />

      <div class="relative bg-white rounded-lg rounded-lg">
        <WPRLocationsScreen />
      </div>
    </div>
    <div v-else>
      <div class="mx-auto text-center py-5">
        <WLoadingSpinner class="mx-auto" />
        <div class="mt-3 text-primary-600">
          Loading WELL Performance Rating...
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapState } from 'vuex'
export default {
  layout: 'sidebar',
  head() {
    return {
      title: `Performance Rating Locations`,
    }
  },
  computed: {
    ...mapState({
      currentTab: (state) => state.settings.sidebarTab,
      sharedWorkspace: (state) => state.shared.sharedWorkspace,
      invoices: (state) => state.shared.allInvoices,
      currentUser: (state) => state.user.currentUser,
    }),
  },
  async mounted() {
    if (this.$route.query.tab) {
      this.$store.commit('settings/setSidebarTab', this.$route.query.tab)
    } else {
      this.$store.commit('settings/setSidebarTab', 'Locations')
    }

    await this.$store.dispatch('shared/getSharedWorkspace', {
      id: this.$route.params.id,
    })
  },
  beforeDestroy() {
    this.$store.dispatch('review/reset')
  },
}
</script>
