<template>
  <div>
    <div v-if="mode !== 'checklist'" class="grid grid-cols-2 gap-4">
      <div>
        <div
          class="relative pt-12 pb-16 px-4 sm:pt-16 sm:px-6 lg:px-8 lg:max-w-7xl lg:mx-auto border rounded-md"
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
                        class="-ml-px absolute mt-0.5 top-4 left-4 w-0.5 h-full bg-gray-300"
                      ></div>
                      <div class="h-9 flex items-center">
                        <span
                          v-if="step.status === 'complete'"
                          class="relative z-10 w-8 h-8 flex items-center justify-center bg-primary-600 rounded-full group-hover:bg-primary-800 group-focus:bg-primary-800 transition ease-in-out duration-150"
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
                          class="relative z-10 w-8 h-8 flex items-center justify-center bg-white border-2 border-primary-600 rounded-full"
                        >
                          <span
                            class="h-2.5 w-2.5 bg-primary-600 rounded-full"
                          ></span>
                        </span>
                        <span
                          v-else
                          class="relative z-10 w-8 h-8 flex items-center justify-center bg-white border-2 border-gray-300 rounded-full group-hover:border-gray-400 group-focus:border-gray-400 transition ease-in-out duration-150"
                        >
                          <span
                            class="h-2.5 w-2.5 bg-transparent rounded-full group-hover:bg-gray-300 group-focus:bg-gray-300 transition ease-in-out duration-150"
                          ></span>
                        </span>
                      </div>
                      <div
                        class="min-w-0 my-auto lg:absolute lg:left-10 lg:top-3"
                      >
                        <h3
                          class="text-xs leading-4 font-semibold uppercase tracking-wide text-gray-500 cursor-pointer"
                        >
                          {{ step.name }}
                        </h3>
                        <p
                          v-if="step.description"
                          class="text-sm leading-5 text-gray-500"
                        >
                          <span v-if="project.hsr_payment === 'paid'">
                            <span v-if="hsrInvoice">
                              <WLinksBase @click.native="downloadInvoice">{{
                                step.description
                              }}</WLinksBase>
                            </span>
                          </span>
                        </p>
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
              <div class="mt-6 flex space-x-8 justify-center">
                <WLinksBase
                  link="https://resources.wellcertified.com/?type=faqs&tags=product%2FHealth-Safety&showFilters=true"
                  target="_blank"
                >
                  Review FAQs
                </WLinksBase>
                <WLinksBase
                  link="mailto:healthsafety@wellcertified.com"
                  target="_blank"
                >
                  Technical issues?
                </WLinksBase>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div
        class="max-w-7xl mx-auto bg-white py-5 xl:rounded-lg xl:shadow-md border rounded-md"
      >
        <div v-if="mode === 'register'" class="h-full">
          <img
            class="hidden lg:block h-56 w-full object-cover lg:h-full rounded-r-lg"
            src="/login/banner.jpg"
            alt=""
          />
        </div>
        <div v-if="mode === 'review'" class="h-full">
          <ProjectSubmitScreen />
        </div>

        <div v-if="mode === 'terms'" class="h-full">
          <ProjectTermsScreen :project="project" />
        </div>
        <div v-if="mode === 'invoice'" class="h-full">
          <ProjectInvoiceCartViewScreen
            v-if="hsrInvoice && hsrInvoice.status === 'unpaid'"
            :invoice-number="hsrInvoice.invoice_number"
            :project="project"
          />
          <ProjectConfirmationScreen v-else :project="project" />
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
        :id="project.hsr_scorecard_id"
        :module="project"
        module-type="hsrOpt"
      />
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
export default {
  data() {
    return {
      tabvalue: 'register',
    }
  },
  computed: {
    ...mapState({
      mode: (state) => state.shared.mode,
      currentStep: (state) => state.shared.currentStep,
      project: (state) => state.project.project,
      projectInvoices: (state) => state.project.projectInvoices,
      existingProjects: (state) => state.project.existingProjects,
      currentUser: (state) => state.user.currentUser,
      userRole() {
        return this.project &&
          this.project.members.find(
            (a) => a.pivot.user_id === this.currentUser.id
          )
          ? this.project.members.find(
              (a) => a.pivot.user_id === this.currentUser.id
            ).pivot.role
          : ''
      },
      continueVisible() {
        if (
          this.mode === 'review' ||
          this.mode === 'terms' ||
          this.mode === 'invoice'
        ) {
          return false
        }
        return true
      },
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
            name: 'Review terms and conditions',
            status: this.termsStatus,
            tabindex: 'terms',
          },
          {
            name: 'Pay the invoice',
            status: this.invoiceStatus,
            tabindex: 'invoice',
            description:
              this.hsrInvoice.status === 'unpaid'
                ? 'Download invoice'
                : 'Download receipt',
          },
          {
            name: 'Complete your checklist',
            status: this.checklistStatus,
            tabindex: 'checklist',
          },
          {
            name: 'Submit for review',
            status: this.hasHSRReview,
            tabindex: 'submit',
          },
          {
            name: 'Achieve and share',
            status: this.hasHSRReview,
            tabindex: 'share',
          },
        ]

        return steps
      },
    }),
    registeredStatus() {
      return 'complete'
    },
    reviewStatus() {
      if (this.project.hsr_opt === 0) {
        return 'current'
      }
      if (this.project.hsr_opt === 1) {
        return 'complete'
      }
      return ''
    },
    termsStatus() {
      if (
        this.project.hsr_opt === 0 &&
        Object.keys(this.existingProjects).length
      ) {
        return 'current'
      }
      if (this.project.hsr_opt === 1) {
        return 'complete'
      }
      return ''
    },
    invoiceStatus() {
      if (
        this.project.hsr_payment === 'waived' ||
        this.project.hsr_payment === 'paid'
      ) {
        return 'complete'
      }
      if (this.project.hsr_payment === 'unpaid') {
        return 'current'
      }
      return ''
    },
    checklistStatus() {
      if (
        this.project.hsr_payment === 'paid' ||
        this.project.hsr_payment === 'waived'
      ) {
        if (this.hasHSRReview === 'complete') {
          return 'complete'
        } else {
          return 'current'
        }
      } else {
        return ''
      }
    },
    hsrInvoice() {
      return this.projectInvoices.filter(
        (a) => a.invoicable_sub_part === 'v2-hsr'
      ).length
        ? this.projectInvoices.filter(
            (a) => a.invoicable_sub_part === 'v2-hsr'
          )[0]
        : {}
    },
    hasHSRReview() {
      const reviews = this.$store.state.review.allReviews
      if (!reviews.length) {
        return ''
      }
      const hsrReview = reviews.filter(
        (a) =>
          a.phase === 'Preliminary Health-Safety Review' ||
          a.phase === 'Final Health-Safety Review' ||
          a.is_hsr
      )
      if (hsrReview.length) {
        return 'complete'
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
  async mounted() {
    await this.$store.dispatch(
      'project/getProjectByNumber',
      this.$route.params.projectId
    )
    if (this.userRole !== 'project-member') {
      await this.$store.dispatch('project/projectPricing', {
        id: this.$store.state.project.project.id,
      })
    }

    this.$store.dispatch('review/getReviewList', this.project.id)
  },
  beforeDestroy() {
    this.$store.dispatch('review/reset')
  },
  methods: {
    ...mapMutations('shared', ['setMode', 'setCurrentStep']),
    downloadInvoice() {
      const token = this.$store.state.authentication.token
      const url =
        this.$axios.defaults.baseURL +
        'api/invoice/' +
        this.hsrInvoice.id +
        '/pdf?token=' +
        token
      window.open(url, '_blank')
    },
    showLandingPage() {
      this.setMode('register')
      this.setCurrentStep(1)
    },
    gotoNextStep() {
      if (this.hasHSRReview === 'complete') {
        this.$router.push({
          path: `/projects/${this.$route.params.projectType}/${this.$route.params.projectId}/reviews`,
          query: { ...this.$route.query },
        })
        this.$store.commit('settings/setSidebarTab', 'reviews')
        return true
      }
      if (this.checklistStatus === 'current') {
        this.setMode('checklist')
        return true
      }
      if (
        this.termsStatus === 'complete' &&
        this.invoiceStatus !== 'complete'
      ) {
        this.setMode('invoice')
        return true
      }
      if (this.reviewStatus === 'complete') {
        this.setMode('terms')
        return true
      }
      if (this.reviewStatus !== 'complete') {
        this.setMode('review')
      }
    },
    currentTab(index, indexnumber) {
      if (indexnumber === 0) {
        this.setMode(index)
        window.open('https://www.wellcertified.com/health-safety', '_blank')
      } else if (
        indexnumber <= 2 &&
        (this.project.hsr_payment === 'paid' ||
          this.project.hsr_payment === 'waived')
      ) {
        return false
      } else {
        // eslint-disable-next-line no-lonely-if
        if (
          this.steps[indexnumber].status === 'complete' ||
          this.steps[indexnumber].status === 'current'
        ) {
          if (index !== 'checklist' && this.userRole === 'project-member') {
            return false
          }
          this.setMode(index)
          this.setCurrentStep(indexnumber)
        }
      }
    },
  },
}
</script>
