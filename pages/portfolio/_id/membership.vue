<template>
  <div class="w-full">
    <div v-if="membership && portfolio">
      <PortfolioMembershipRegister v-if="!membership.id" />
      <PortfolioMembershipDashboard v-else />
    </div>
    <div v-else>
      <div class="mx-auto text-center m-8 p-8">
        <WLoadingSpinner class="mx-auto" />
        <div class="mt-3 text-primary-600">Loading Portfolio...</div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  layout: 'sidebar', // sidebar layout
  // get portfolio by id
  head() {
    return {
      title: `Portfolio Membership`,
    }
  },
  computed: {
    ...mapState({
      portfolio: (state) => state.portfolio.portfolio,
      membership: (state) => state.membership.membership,
    }),
  },
  async mounted() {
    if (this.$route.query.tab) {
      this.$store.commit('settings/setSidebarTab', this.$route.query.tab)
    } else {
      this.$store.commit('settings/setSidebarTab', 'Membership')
    }
    await this.$store.dispatch('portfolio/getPortfolio', {
      id: this.$route.params.id,
    })
    await this.$store.dispatch(
      'membership/getPortfolioMembership',
      this.portfolio.id
    )
  },
}
</script>
