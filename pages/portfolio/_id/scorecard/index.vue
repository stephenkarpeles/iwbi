<template>
  <div>
    <div
      v-if="portfolio && portfolio.id && !$store.state.portfolio.analyzeMode"
    >
      <!-- <ProjectUpgrade :project="project" /> -->
      <WFeedbackAlert ref="alert" class="z-50" />

      <div class="relative bg-white rounded-lg">
        <div class="mt-20">
          <PortfolioScorecardMain
            :id="portfolio.scorecard_id"
            :module="portfolio"
            module-type="portfolio"
          />
        </div>
      </div>
    </div>
    <PortfolioScorecardAnalyzeScreen
      v-else-if="$store.state.portfolio.analyzeMode"
      :mode="{
        name: 'portfolio',
        module: portfolio,
      }"
    />
    <div v-else>
      <div class="mx-auto text-center py-5">
        <WLoadingSpinner class="mx-auto" />
        <div class="mt-3 text-primary-600">Loading Project...</div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  layout: 'sidebar', // sidebar layout
  // get portfolio by id
  data() {
    return {
      enableAnalyze: false,
    }
  },
  head() {
    return {
      title: `Scorecard`,
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
      this.$store.commit('settings/setSidebarTab', 'Scorecard')
    }
    await this.$store.dispatch('portfolio/getPortfolio', {
      id: this.$route.params.id,
    })
    await this.$store.dispatch('portfolio/getPortfolioMembers')
  },
  beforeDestroy() {
    this.$store.dispatch('review/reset')
  },
}
</script>
