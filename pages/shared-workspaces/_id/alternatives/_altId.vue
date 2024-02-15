<template>
  <div>
    <div v-if="strategy" class="rounded mb-4">
      <div
        :class="{ hidden: currentScreen !== 'aap-form' }"
        class="shadow-lg border rounded-lg p-5"
      >
        <SharedAapForm ref="aap-form" />
      </div>
      <div
        :class="{ hidden: currentScreen !== 'ep-form' }"
        class="shadow-lg border rounded-lg p-5"
      >
        <SharedEpForm ref="ep-form" />
      </div>
      <div v-if="currentScreen === 'landing'">
        <SharedStrategyViewScreen :strategy-data="strategy" />
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
  head() {
    return {
      title: `Health Safety Alternative #${this.$route.params.id}`,
    }
  },
  computed: {
    ...mapState({
      strategy: (state) => state.alternative.strategy,
      project: (state) => state.shared.sharedWorkspace,
      currentUser: (state) => state.user.currentUser,
    }),
  },
  watch: {
    currentScreen(newValue) {
      if (newValue === 'strategies') {
        this.$router.push(
          `/projects/${this.project.type}/${this.project.project_number}/alternatives`
        )
      } else {
        this.$parent.currentScreen = newValue
      }
    },
  },
  async mounted() {
    this.$store.commit('settings/setSidebarTab', 'Alternatives')

    await this.$store.dispatch('shared/getSharedWorkspace', {
      id: this.$route.params.id,
    })

    await this.$store.dispatch(
      'alternative/getStrategy',
      this.$route.params.altId
    )
  },
}
</script>
