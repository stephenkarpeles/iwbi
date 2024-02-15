<template>
  <div>
    <div v-if="mode !== 'checklist'" class="md:grid grid-cols-2 gap-4">
      <div>
        <div
          class="
            relative
            pt-12
            pb-16
            px-4
            sm:pt-16 sm:px-6
            lg:px-8 lg:max-w-7xl lg:mx-auto
            border
            rounded-md
          "
        >
          <div class="lg:pr-8">
            <div class="max-w-md mx-auto sm:max-w-lg lg:mx-0">
              <ClientOnly>
                <WHeadingsHTwo heading="Re-open with confidence">
                  <div class="mt-3 text-base leading-6 text-gray-500">
                    Earn the WELL Health-Safety Rating for your buildings.
                  </div>
                </WHeadingsHTwo>
                <nav class="mt-5 xl:mt-10">
                  <ul class="overflow-hidden">
                    <li
                      v-for="(step, index) in steps"
                      :key="index"
                      class="relative pb-10"
                      @click="currentTab(step.tabindex, index)"
                    >
                      <div
                        v-if="index !== steps.length - 1"
                        class="
                          -ml-px
                          absolute
                          mt-0.5
                          top-4
                          left-4
                          w-0.5
                          h-full
                          bg-gray-300
                        "
                      ></div>
                      <div class="h-9 flex items-center">
                        <span
                          v-if="step.status === 'complete'"
                          class="
                            relative
                            z-10
                            w-8
                            h-8
                            flex
                            items-center
                            justify-center
                            bg-primary-600
                            rounded-full
                            group-hover:bg-primary-800
                            group-focus:bg-primary-800
                            transition
                            ease-in-out
                            duration-150
                          "
                        >
                          <svg
                            class="w-5 h-5 text-white"
                            x-description="Heroicon name: check"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fill-rule="evenodd"
                              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                              clip-rule="evenodd"
                            ></path>
                          </svg>
                        </span>
                        <span
                          v-else-if="step.status === 'current'"
                          class="
                            relative
                            z-10
                            w-8
                            h-8
                            flex
                            items-center
                            justify-center
                            bg-white
                            border-2 border-primary-600
                            rounded-full
                          "
                        >
                          <span
                            class="h-2.5 w-2.5 bg-primary-600 rounded-full"
                          ></span>
                        </span>
                        <span
                          v-else
                          class="
                            relative
                            z-10
                            w-8
                            h-8
                            flex
                            items-center
                            justify-center
                            bg-white
                            border-2 border-gray-300
                            rounded-full
                            group-hover:border-gray-400
                            group-focus:border-gray-400
                            transition
                            ease-in-out
                            duration-150
                          "
                        >
                          <span
                            class="
                              h-2.5
                              w-2.5
                              bg-transparent
                              rounded-full
                              group-hover:bg-gray-300
                              group-focus:bg-gray-300
                              transition
                              ease-in-out
                              duration-150
                            "
                          ></span>
                        </span>
                      </div>
                      <div
                        class="min-w-0 my-auto lg:absolute lg:left-10 lg:top-3"
                      >
                        <h3
                          class="
                            text-xs
                            leading-4
                            font-semibold
                            uppercase
                            tracking-wide
                            text-gray-500
                            cursor-pointer
                            ml-10
                            md:ml-0
                            -mt-7
                            md:-mt-0
                          "
                        >
                          {{ step.name }}
                        </h3>
                      </div>
                    </li>
                  </ul>
                </nav>

                <WButtonsBase
                  v-if="continueVisible"
                  @click.native="gotoNextStep"
                >
                  Continue
                </WButtonsBase>
              </ClientOnly>
            </div>
          </div>
        </div>
      </div>
      <div
        class="
          max-w-7xl
          bg-white
          py-5
          xl:rounded-lg xl:shadow-md
          border
          rounded-md
        "
      >
        <div v-if="mode === 'register'" class="h-full">
          <img
            class="
              hidden
              lg:block
              h-56
              w-full
              object-cover
              lg:h-full
              rounded-r-lg
            "
            src="/login/banner.jpg"
            alt=""
          />
        </div>
        <div v-if="mode === 'review'" class="h-full">
          <PortfolioSubmitScreen />
        </div>
        <div v-if="mode === 'enrollment'" class="h-full">
          <PortfolioEnrollmentFees />
        </div>

        <div v-if="mode === 'terms'" class="h-full">
          <ProjectTermsScreen :project="portfolio" />
        </div>
      </div>
    </div>
    <div v-if="mode === 'checklist'">
      <WLinksBase
        link="#"
        icon="arrow-narrow-left"
        @click.native="showLandingPage()"
      >
        Back
      </WLinksBase>
      <ChecklistMain
        :id="portfolio.hsr_scorecard_id"
        :module="portfolio"
        module-type="portfolio"
      />
    </div>
  </div>
</template>
<script>
import { mapState, mapMutations, mapActions } from 'vuex'
export default {
  data() {
    return {
      tabvalue: 'register',
    }
  },
  computed: {
    ...mapState({
      mode: (state) => state.portfolio.mode,
      currentStep: (state) => state.portfolio.currentStep,
      portfolio: (state) => state.portfolio.portfolio,
      existingPortfolio: (state) => state.portfolio.existingPortfolio,
      currentUser: (state) => state.user.currentUser,
      steps() {
        const steps = [
          {
            name: 'Explore the WELL Health-Safety Rating',
            status: this.registeredStatus,
            tabindex: 'register',
          },
          {
            name: 'Confirm review cycle',
            status: this.reviewStatus,
            tabindex: 'review',
          },
          {
            name: 'Confirm enrollment fees',
            status: this.enrollmentStatus,
            tabindex: 'enrollment',
          },
          {
            name: 'Review terms and conditions',
            status: this.termsStatus,
            tabindex: 'terms',
          },
          {
            name: 'Complete your checklist',
            status: this.checklistStatus,
            tabindex: 'checklist',
          },
          {
            name: 'Submit for review',
            status: this.submitStatus,
            tabindex: 'submit',
          },
          {
            name: 'Achieve and share',
            status: this.shareStatus,
            tabindex: 'share',
          },
        ]

        return steps
      },
    }),
    registeredStatus() {
      return 'complete'
    },
    continueVisible() {
      if (
        this.portfolio.hsr_opt &&
        !this.portfolio.hsr_review &&
        !this.checklistStatus
      ) {
        return false
      }

      if (
        this.mode === 'review' ||
        this.mode === 'terms' ||
        this.mode === 'invoice'
      ) {
        return false
      }
      return true
    },
    reviewStatus() {
      if (this.portfolio && this.portfolio.hsr_opt === 0) {
        return 'current'
      }
      if (this.portfolio && this.portfolio.hsr_opt === 1) {
        return 'complete'
      }
      return ''
    },
    termsStatus() {
      if (this.portfolio.hsr_opt === 0 && this.mode === 'terms') {
        return 'current'
      }
      if (this.portfolio.hsr_aggrement) {
        return 'complete'
      }
      return ''
    },
    enrollmentStatus() {
      if (this.portfolio && !this.portfolio.hsr_opt) {
        return 'current'
      }
      if (this.portfolio && this.portfolio.hsr_opt) {
        return 'complete'
      }
      return ''
    },
    checklistStatus() {
      if (
        this.portfolio.hsr_payment === 'paid' ||
        this.portfolio.hsr_payment === 'waived'
      ) {
        return 'current'
      } else {
        return ''
      }
    },
    submitStatus() {
      return ''
    },
    shareStatus() {
      return ''
    },
  },
  mounted() {
    this.getPortfolioMembers()
    if (this.$route.params.id) {
      this.getInvoiceList({
        id: this.portfolio.id,
        type: 'v2-hsr',
      })
      this.$store.dispatch(
        'review/getSharedReviewList',
        this.$route.params.id.toString().substring(5, 10)
      )
    }
    this.$store.commit(
      'portfolio/setHsrScorecardId',
      this.portfolio.hsr_scorecard_id
    )
  },
  beforeDestroy() {
    this.setMode('register')
  },
  methods: {
    ...mapActions('portfolio', ['getInvoiceList', 'getPortfolioMembers']),
    ...mapMutations('portfolio', ['setMode', 'setCurrentStep']),
    showLandingPage() {
      this.setMode('register')
      this.setCurrentStep(1)
    },
    gotoNextStep() {
      if (this.hasHSRReview === 'complete') {
        this.$router.push(
          `/portfolio/${this.$route.params.projectType}/${this.$route.params.projectId}/reviews`
        )
        this.$store.commit('settings/setSidebarTab', 'reviews')
        return true
      }
      if (this.checklistStatus === 'current') {
        this.setMode('checklist')
        return true
      }
      if (this.reviewStatus !== 'complete') {
        this.setMode('review')
      }
    },
    currentTab(index, indexnumber) {
      if (
        (this.steps[indexnumber].status === 'complete' ||
          this.steps[indexnumber].status === 'current') &&
        indexnumber !== 1 &&
        indexnumber !== 4
      ) {
        return false
      }

      if (indexnumber === 0) {
        this.setMode(index)
        window.open('https://www.wellcertified.com/health-safety', '_blank')
        return false
      }

      if (
        indexnumber === 1 &&
        this.portfolio.hsr_payment &&
        (this.portfolio.hsr_payment === 'paid' ||
          this.portfolio.hsr_payment === 'waived')
      ) {
        return false
      }

      if (
        (indexnumber === 2 || indexnumber === 3) &&
        this.portfolio.hsr_aggrement
      ) {
        return false
      }

      if (
        indexnumber >= 4 &&
        this.steps[indexnumber].status !== 'complete' &&
        this.steps[indexnumber].status !== 'current'
      ) {
        return false
      }
      this.setMode(index)
      this.setCurrentStep(indexnumber)
    },
  },
}
</script>
