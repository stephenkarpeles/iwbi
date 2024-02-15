<template>
  <div class="w-full">
    <PortfolioAlternativesDashboard />
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  layout: 'sidebar', // sidebar layout
  // get portfolio by id
  computed: {
    ...mapState({
      portfolio: (state) => state.portfolio.portfolio,
    }),
  },
  async mounted() {
    if (this.$route.query.tab) {
      this.$store.commit('settings/setSidebarTab', this.$route.query.tab)
    } else {
      this.$store.commit('settings/setSidebarTab', 'Alternatives')
    }
    await this.$store.dispatch('portfolio/getPortfolio', {
      id: this.$route.params.id,
    })
  },
  head() {
    return {
      title: `Portfolio Alternatives`,
    }
  },
}
</script>
