<template>
  <div>
    <WHeadingsHThree
      heading="Performance Verification"
      class="text-primary-900"
    />
    <div
      class="flex rounded-md border border-primary-200 shadow text-primary-900 mt-8"
    >
      <div class="w-1/2 p-10">
        <WHeadingsHFour heading="About" />
        <h1 class="mt-4 text-md font-bold">
          Performance verification encompasses two stages.
        </h1>
        <div class="opacity-60 space-y-5 mt-5">
          <p>
            First, a WELL Performance Testing Agent will visit the site and
            conducts onsite performance testing.
          </p>
          <p>
            These results are submitted to GBCI so that the GBCI WELL Reviewer
            can complete a third-party review of the onsite testing results
            along with any other documentation that has been submitted.
          </p>
          <p>
            GBCI’s review will determine whether a feature has been achieved.
            WELL Portfolio teams must undergo onsite performance testing and
            submit results for all individual projects for which
            performance-based features are being pursued.
          </p>
          <p class="font-bold">
            Want to find a local WELL Performance Testing Agent?
          </p>
        </div>
        <WButtonsBase type="primary" class="mt-4" @click.native="openNewTab"
          >Search now</WButtonsBase
        >
      </div>
      <div class="bg-primary-100 w-1/2 p-10">
        <WHeadingsHFour heading="Testing logistics" />
        <h1 class="mt-4 text-md font-bold">
          Portfolios can submit documents and testing results for review twice
          per year, providing multiple opportunities to improve your WELL
          Portfolio Score over time.
        </h1>
        <p class="opacity-60 space-y-5 mt-5">
          Performance test measurements span several environmental parameters in
          accordance with WELL including performance-based features within the
          Air, Water, Light, Thermal Comfort and Sound concepts. During
          performance testing, an individual with authorized access to all areas
          of the project requested by the WELL Performance Testing Agent (as
          specified in the feature language or Performance Verification
          Guidebook) will need to be present so that performance tests and
          inspections may be properly conducted. For more information on
          performance testing protocols and the full list of parameters measured
          in WELL, see the
          <a
            href="https://resources.wellcertified.com/tools/performance-verification-guidebook/"
            target="_blank"
            class="text-primary-500 cursor-pointer"
          >
            Performance Verification Guidebook </a
          >.
        </p>
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
      this.$store.commit('settings/setSidebarTab', 'Performance')
    }
    await this.$store.dispatch('portfolio/getPortfolio', {
      id: this.$route.params.id,
    })
    await this.$store.dispatch('portfolio/getPortfolioMembers')
  },
  methods: {
    openNewTab() {
      window.open('https://www.wellcertified.com/performance-testing', '_blank')
    },
  },
  head() {
    return {
      title: `Portfolio Performance`,
    }
  },
}
</script>
