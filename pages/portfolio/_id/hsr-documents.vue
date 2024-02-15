<template>
  <div>
    <div v-if="portfolio && portfolio.id">
      <WFeedbackAlert ref="alert" class="z-50" />

      <div class="relative bg-white rounded-lg rounded-lg">
        <PortfolioHsrDocuments />
      </div>
    </div>
    <div v-else>
      <div class="mx-auto text-center py-5">
        <WLoadingSpinner class="mx-auto" />
        <div class="mt-3 text-primary-600">Loading WELL Portfolio...</div>
      </div>
    </div>
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
      this.$store.commit('settings/setSidebarTab', 'HSR Documentation')
    }
    await this.$store.dispatch('portfolio/getPortfolio', {
      id: this.$route.params.id,
    })
    await this.$store.dispatch('portfolio/getPortfolioMembers')
  },
  head() {
    return {
      title: `Portfolio HSR Documents`,
    }
  },
}
</script>
