<template>
  <div class="w-full">
    <WLinksBase
      class="mb-5"
      type="navPrimary"
      :link="`/portfolio/${$route.params.id}/profile`"
      icon="arrow-narrow-left"
    >
      Back to profile
    </WLinksBase>
    <PortfolioProfileEdit v-if="membership" />
  </div>
</template>
<script>
import { mapState } from 'vuex'
export default {
  layout: 'sidebar',
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
      this.$store.commit('settings/setSidebarTab', 'Profile')
    }
    await this.$store.dispatch('portfolio/getPortfolio', {
      id: this.$route.params.id,
    })
    await this.$store.dispatch(
      'membership/getPortfolioMembership',
      this.portfolio.id
    )
  },
  head() {
    return {
      title: `Edit Portfolio Profile`,
    }
  },
}
</script>
