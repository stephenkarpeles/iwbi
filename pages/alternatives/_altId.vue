<template>
  <div>
    <div>
      <div v-if="strategy" class="rounded mb-4">
        <div
          v-if="currentScreen === 'aap-form'"
          class="shadow-lg border rounded-lg p-5"
        >
          <ProjectAapForm
            v-if="strategy.type_internal !== 'v1'"
            ref="aap-form"
          />
          <ProjectV1AapForm v-else ref="aap-form" />
        </div>
        <div
          v-if="currentScreen === 'ep-form'"
          class="shadow-lg border rounded-lg p-5"
        >
          <ProjectEpForm v-if="strategy.type_internal !== 'v1'" ref="ep-form" />
          <ProjectV1EpForm v-else ref="ep-form" />
        </div>
        <div v-if="currentScreen === 'landing'">
          <ProjectStrategyViewScreen :strategy-data="strategy" />
        </div>
      </div>
      <div v-else>
        <div class="mx-auto text-center">
          <WLoadingSpinner class="mx-auto" />
          <div class="mt-3 text-primary-600">Loading Strategy...</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  asyncData({ store, redirect, $axios, params }) {
    if (params.altId === null) {
      redirect('/well-admin/alternatives')
    }
  },
  data() {
    return {
      currentScreen: 'landing',
    }
  },
  computed: {
    ...mapState({
      strategy: (state) => state.alternative.strategy,
    }),
  },
  watch: {
    currentScreen(newValue) {
      if (newValue === 'strategies') {
        this.$router.push('/alternatives')
      }
    },
  },
  async mounted() {
    await this.$store.dispatch(
      'alternative/getStrategy',
      this.$route.params.altId
    )
  },
  head() {
    return {
      title: `Alternative #${this.$route.params.altId}`,
    }
  },
}
</script>
