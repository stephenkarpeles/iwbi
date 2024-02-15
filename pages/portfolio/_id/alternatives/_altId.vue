<template>
  <div>
    <div v-if="strategy" class="rounded mb-4">
      <div
        :class="{ hidden: currentScreen !== 'aap-form' }"
        class="shadow-lg border rounded-lg p-5"
      >
        <PortfolioAapForm ref="aap-form" />
      </div>
      <div
        :class="{ hidden: currentScreen !== 'ep-form' }"
        class="shadow-lg border rounded-lg p-5"
      >
        <PortfolioEpForm ref="ep-form" />
      </div>
      <div v-if="currentScreen === 'landing'">
        <PortfolioStrategyViewScreen
          :strategy-data="strategy"
          project-type="portfolio"
        />
      </div>
    </div>
    <div v-else>
      <div class="mx-auto text-center">
        <WLoadingSpinner class="mx-auto" />
        <div class="mt-3 text-primary-600">Loading Alternative...</div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  layout: 'sidebar',
  data() {
    return {
      currentScreen: 'landing',
    }
  },
  computed: {
    ...mapState({
      strategy: (state) => state.alternative.strategy,
      // project: (state) => state.shared.sharedWorkspace,
      // currentUser: (state) => state.user.currentUser,
    }),
  },
  async mounted() {
    this.$store.commit('settings/setSidebarTab', 'Alternatives')

    // await this.$store.dispatch('shared/getSharedWorkspace', {
    //   id: this.$route.params.id,
    // })

    await this.$store.dispatch(
      'alternative/getStrategy',
      this.$route.params.altId
    )
  },
}
</script>
