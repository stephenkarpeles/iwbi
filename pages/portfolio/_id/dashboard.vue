<template>
  <div v-if="portfolio" class="w-full">
    <WFeedbackModal ref="modal">
      <PortfolioAnalyzeDataForm
        :mode="{
          name: 'portfolio',
          module: portfolio,
        }"
      />
    </WFeedbackModal>
    <div class="flex mt-4 items-center justify-between">
      <div class="flex space-x-2 items-center">
        <h3 class="text-2xl font-semibold text-primary-900">
          {{ enableAnalyze ? 'Analyze' : 'Dashboard' }}
        </h3>

        <Flyout
          v-if="
            portfolio.show_dashboard || currentUser.role.includes('well-admin')
          "
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
        >
          Edit
        </WButtonsBase>
      </div>
    </div>

    <!-- warning -->
    <div
      v-if="isTestNuxt && !portfolio.agreement_status"
      class="
        rounded-md
        bg-yellow-50
        p-4
        mb-5
        rounded-lg
        border border-yellow-300
      "
    >
      <div class="flex">
        <div class="flex-shrink-0">
          <svg
            class="mt-3 h-5 w-5 text-yellow-400"
            x-description="Heroicon name: exclamation"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fill-rule="evenodd"
              d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
              clip-rule="evenodd"
            ></path>
          </svg>
        </div>
        <div class="ml-3">
          <WHeadingsHFour
            class="text-yellow-600"
            heading="The WELL Building Standard Certification Agreement has not been
                signed."
          />
          <div class="mt-2 text-sm leading-5 text-yellow-700">
            <p>
              Portfolio documentation features are not available until the
              certification agreement has been signed by the portfolio owner.
            </p>
          </div>
          <WLinksBase
            class="text-warning-500 mt-3"
            icon="arrow-narrow-right"
            icon-position="right"
            type="warning"
            @click.native="
              $store.dispatch('portfolio/signPortfolio', portfolio)
            "
          >
            Sign Now!
          </WLinksBase>
        </div>
      </div>
    </div>

    <PortfolioDashboard
      v-if="
        surveyStarted !== null && surveyCompleted !== null && !enableAnalyze
      "
    />
    <PortfolioDashboardAnalyzeScreen
      v-else-if="enableAnalyze"
      :mode="{
        name: 'portfolio',
        module: portfolio,
      }"
    />
    <div v-else>
      <div class="mx-auto text-center">
        <WLoadingSpinner class="mx-auto" />
        <div class="mt-3 text-primary-600">Loading...</div>
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
      title: `Portfolio Dashboard`,
    }
  },
  computed: {
    ...mapState({
      portfolio: (state) => state.portfolio.portfolio,
      currentUser: (state) => state.user.currentUser,
      surveyStarted: (state) => state.portfolio.portfolio.survey_started,
      surveyCompleted: (state) => state.portfolio.portfolio.survey_completed,
    }),
    allowEdit() {
      if (this.currentUser.role.includes('well-admin')) {
        return true
      }
      return false
    },
    isTestNuxt() {
      if (window.location.href.search('test-nuxt') === -1) {
        return false
      }
      return true
    },
  },
  async mounted() {
    if (this.$route.query.tab) {
      this.$store.commit('settings/setSidebarTab', this.$route.query.tab)
    } else {
      this.$store.commit('settings/setSidebarTab', 'Dashboard')
    }
    await this.$store
      .dispatch('portfolio/getPortfolio', {
        id: this.$route.params.id,
      })
      .then((res) => {
        if (
          (res &&
            res.response &&
            res.response.status &&
            res.response.status === 404) ||
          (res &&
            res.response &&
            res.response.status &&
            res.response.status === 403)
        ) {
          this.$nuxt.error({
            statusCode: res.response.status,
            message: res.response.data.msg,
          })
        }
      })

    if (this.portfolio?.show_dashboard) {
      this.enableAnalyze = true
    }

    if (
      this.$route.query.view &&
      this.$route.query.view === 'analyze' &&
      this.currentUser.role.includes('well-admin')
    ) {
      this.enableAnalyze = true
    }
  },
}
</script>
