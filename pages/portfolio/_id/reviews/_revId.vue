<template>
  <div>
    <WLinksBase
      class="text-primary-500 mt-3"
      icon="arrow-narrow-left"
      icon-position="left"
      type="primary"
      @click.native="
        $router.push(`/portfolio/${portfolio.portfolio_number}/reviews`)
      "
    >
      Back to all reviews
    </WLinksBase>
    <div v-if="portfolio && allReviews && allReviews.length">
      <PortfolioReviewDetailsScreen
        v-if="
          allReviews.find((a) => a.id.toString() === $route.params.revId)
            .type !== 'v2-hsr'
        "
        :id="parseInt($route.params.revId)"
        :all-reviews="allReviews"
      />
      <PortfolioReviewHSRDetailsScreen
        v-else
        :id="parseInt($route.params.revId)"
        :all-reviews="allReviews"
      />
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  layout: 'sidebar',
  head() {
    return {
      title: `Portfolio Review: ${this.$route.params.revId}`,
    }
  },
  computed: {
    ...mapState({
      portfolio: (state) => state.portfolio.portfolio,
      allReviews: (state) => state.review.allReviews,
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
    await this.$store.dispatch('review/getSharedReviewList', this.portfolio.id)
  },
}
</script>
