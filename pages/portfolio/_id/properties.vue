<template>
  <div>
    <div class="flex items-center justify-between">
      <div class="flex space-x-2 items-center">
        <h3
          class="font-semibold text-primary-900"
          :class="$store.state.portfolio.analyzeMode ? 'text-2xl' : 'text-1xl'"
        >
          {{ $store.state.portfolio.analyzeMode ? 'Analyze' : 'Manage' }}
        </h3>

        <Flyout ref="conceptFlyout" y="bottom" x="right" class="h-full">
          <Toggle
            :value="$store.state.portfolio.analyzeMode"
            @click.native="
              () => {
                $store.commit('portfolio/setAnalyzeMode')
                $store.commit(
                  'settings/setNavState',
                  !$store.state.settings.navExpanded
                )
              }
            "
          />
          <template #content>
            <div class="p-3 w-56 text-primary-900 text-sm">
              Enable/Disable Analyze view
            </div>
          </template>
        </Flyout>
      </div>
    </div>

    <div
      v-if="portfolio && portfolio.id && !$store.state.portfolio.analyzeMode"
    >
      <PortfolioPropertiesScreen />
    </div>
    <PortfolioPropertiesAnalyzeScreen
      v-else-if="$store.state.portfolio.analyzeMode"
      :mode="{
        name: 'portfolio',
        module: portfolio,
      }"
    />

    <div v-else>
      <div class="mx-auto text-center py-5">
        <WLoadingSpinner class="mx-auto" />
        <div class="mt-3 text-primary-600">Loading WELL Locations List...</div>
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
      title: `Portfolio Locations`,
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
      this.$store.commit('settings/setSidebarTab', 'Locations')
    }
    await this.$store.dispatch('portfolio/getPortfolio', {
      id: this.$route.params.id,
    })
    await this.$store.dispatch('portfolio/getProjectLocations')
  },
  methods: {},
}
</script>
