<template>
  <div class="w-full">
    <PortfolioReviewScreen :portfolio="portfolio" />
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  layout: 'sidebar', // sidebar layout
  // get portfolio by id
  head() {
    return {
      title: `Portfolio Reviews`,
    }
  },
  computed: {
    ...mapState({
      portfolio: (state) => state.portfolio.portfolio,
    }),
  },
  async mounted() {
    if (this.$route.query.tab) {
      this.$store.commit('settings/setSidebarTab', this.$route.query.tab)
    } else {
      this.$store.commit('settings/setSidebarTab', 'Reviews')
    }
    await this.$store.dispatch('portfolio/getPortfolio', {
      id: this.$route.params.id,
    })
  },
}
</script>
