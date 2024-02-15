<template>
  <div v-if="sharedWorkspace && sharedWorkspace.id">
    <SharedTeamComponent />
  </div>
</template>
<script>
import { mapState } from 'vuex'
export default {
  layout: 'sidebar',
  head() {
    return {
      title: `Performance Rating Team`,
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
      this.$store.commit('settings/setSidebarTab', 'Team')
    }

    await this.$store.dispatch('shared/getSharedWorkspace', {
      id: this.$route.params.id,
    })
  },
  beforeDestroy() {
    this.$store.dispatch('review/reset')
  },
  methods: {
    regStatus(sharedWorkspace) {
      if (
        (sharedWorkspace.reg_status === 1 &&
          sharedWorkspace.reg_payment_status === 'paid') ||
        sharedWorkspace.reg_payment_status === 'waived'
      ) {
        return true
      } else {
        return false
      }
    },
  },
}
</script>
