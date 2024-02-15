<template>
  <div>
    <div v-if="sharedWorkspace && sharedWorkspace.id">
      <WFeedbackAlert ref="alert" class="z-50" />
      <WFeedbackModal ref="modal">
        <PortfolioAnalyzeDataForm
          :mode="{
            name: 'shared',
            module: sharedWorkspace,
          }"
        />
      </WFeedbackModal>
      <div class="relative bg-white rounded-lg">
        <div class="flex mt-4 mb-2 items-center justify-between">
          <div class="flex space-x-2 items-center">
            <h3 class="text-2xl font-semibold text-primary-900">
              {{ enableAnalyze ? 'Analyze' : 'Dashboard' }}
            </h3>

            <Flyout
              v-if="sharedWorkspace.show_dashboard"
              ref="conceptFlyout"
              y="bottom"
              x="right"
              class="h-full"
            >
              <Toggle v-model="enableAnalyze" />
              <template #content>
                <div class="p-3 w-56 text-primary-900 text-sm">
                  Enable/Disable Analyze view
                </div>
              </template>
            </Flyout>
          </div>
          <div v-if="enableAnalyze && allowEdit">
            <WButtonsBase
              type="primaryInverted"
              icon="pencil"
              @click.native="$refs.modal.isHidden = false"
              >Edit</WButtonsBase
            >
          </div>
        </div>
        <SharedAchievedDashboard
          v-if="sharedWorkspace.hsr_status === 'achieved' && !enableAnalyze"
        />
        <SharedDashboard
          v-else-if="
            sharedWorkspace.hsr_status !== 'achieved' && !enableAnalyze
          "
        />
        <PortfolioDashboardAnalyzeScreen
          v-if="enableAnalyze"
          :mode="{
            name: 'shared',
            module: sharedWorkspace,
          }"
        />
      </div>
    </div>
    <div v-else>
      <div class="mx-auto text-center py-5">
        <WLoadingSpinner class="mx-auto" />
        <div class="mt-3 text-primary-600">
          Loading WELL Health-Safety Rating...
        </div>
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
      enableAnalyze: false,
    }
  },
  head() {
    return {
      title: `Health Safety Dashboard`,
    }
  },
  computed: {
    ...mapState({
      currentTab: (state) => state.settings.sidebarTab,
      sharedWorkspace: (state) => state.shared.sharedWorkspace,
      invoices: (state) => state.shared.allInvoices,
      currentUser: (state) => state.user.currentUser,
    }),
    allowEdit() {
      if (this.currentUser.role.includes('well-admin')) {
        return true
      }
      return false
    },
  },
  async mounted() {
    if (this.$route.query.tab) {
      this.$store.commit('settings/setSidebarTab', this.$route.query.tab)
    } else {
      this.$store.commit('settings/setSidebarTab', 'Dashboard')
    }

    await this.$store.dispatch('shared/getSharedWorkspace', {
      id: this.$route.params.id,
    })
    await this.$store.dispatch('recertification/getHSRRecertification')

    if (this.sharedWorkspace?.show_dashboard) {
      this.enableAnalyze = true
    }
  },
  beforeDestroy() {
    this.$store.dispatch('review/reset')
  },
  methods: {
    regStatus(sharedWorkspace) {
      if (
        (sharedWorkspace.reg_status === 1 &&
          sharedWorkspace.reg_payment_status === 'paid') ||
        sharedWorkspace.reg_payment_status === 'waived'
      ) {
        return true
      } else {
        return false
      }
    },
  },
}
</script>
