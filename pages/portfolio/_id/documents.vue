<template>
  <div>
    <div v-if="portfolio && portfolio.id">
      <WFeedbackAlert ref="alert" class="z-50" />
      <PortfolioDocumentsLibrary
        v-if="$route.query.tab"
        :id="portfolio.scorecard_id"
      />
    </div>
    <div v-else>
      <div class="mx-auto text-center py-5">
        <WLoadingSpinner class="mx-auto" />
        <div class="mt-3 text-primary-600">Loading WELL Documents...</div>
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
      title: `Portfolio Documents`,
    }
  },
  computed: {
    ...mapState({
      portfolio: (state) => state.portfolio.portfolio,
    }),
  },
  async mounted() {
    this.$store.commit('settings/setSidebarTab', 'Documents')

    await this.$store.dispatch('portfolio/getPortfolio', {
      id: this.$route.params.id,
    })
    await this.$store.dispatch('portfolio/getPortfolioMembers')

    if (this.$route.query.tab === undefined) {
      this.$router.push({
        path: this.$route.path,
        query: { tab: 'Tasks', sub_tab: 'pending' },
      })
    }
  },
}
</script>
