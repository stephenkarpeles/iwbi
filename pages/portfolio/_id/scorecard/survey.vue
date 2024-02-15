<template>
  <div>
    <div
      v-if="
        surveyStatus &&
        surveyStatus.started !== null &&
        surveyStatus.completed !== null
      "
    >
      <div v-if="surveyStatus.started" class="w-full">
        <WHeadingsHTwo
          heading="Scorecard Survey"
          class="text-primary-800 mb-5"
        />
        <div
          class="h-70 bg-cover bg-center rounded-lg shadow-lg p-12"
          :style="{
            backgroundImage: `url('/portfolio/screen/scorecard/bg-scorecard.png')`,
          }"
        >
          <div class="mt-2 leading-5 font-semibold text-xs text-primary-200">
            LET'S GET STARTED!
          </div>
          <WHeadingsHFour
            heading="Build your scorecard with our survey"
            class="text-primary-50"
          />
          <div class="text-white text-sm max-w-md">
            In the categories below, you will see a total of 24 questions. To
            respond to each question, you should provide an estimate of which
            alternatives you believe your organization would support, using the
            designations listed below:
          </div>
        </div>

        <!-- Select a category section -->
        <WHeadingsHThree
          heading="Select a category"
          class="text-primary-800 mt-8 mb-4"
        />
        <div
          v-if="
            (loadedData && designPercent === 0) || (loadedData && designPercent)
          "
          class="grid grid-cols-3 gap-x-2"
        >
          <div
            class="
              bg-primary-100
              border border-primary-300
              cursor-pointer
              h-60
              hover:bg-white
              rounded-md
            "
            @click="
              $router.push(`/portfolio/${$route.params.id}/scorecard/design`)
            "
          >
            <div class="relative h-full">
              <div class="px-4 pt-4">
                <span class="text-lg text-primary-900">
                  <span class="font-bold">Design</span>
                  <span class="opacity-70">|</span>
                  <span
                    v-if="designPercent !== null"
                    class="opacity-70 font-normal"
                    >{{ questionCounts['design'] + '&#160;Questions' }}</span
                  >
                </span>
                <p class="my-1">
                  <span
                    v-if="designPercent !== null"
                    class="text-sm text-secondary-800"
                    >{{ designPercent + ' / 100' + '% complete' }}</span
                  >
                </p>
                <PortfolioHorizontalIndicator :category="designPercent" />
                <WButtonsBase class="mt-4"> Select </WButtonsBase>
              </div>
              <div class="self-end w-40 absolute bottom-0 right-0">
                <img
                  src="/portfolio/screen/scorecard/design.png"
                  alt=""
                  srcset=""
                />
              </div>
            </div>
          </div>
          <div
            class="
              bg-primary-100
              border border-primary-300
              cursor-pointer
              h-60
              hover:bg-white
              rounded-md
            "
            @click="
              $router.push(
                `/portfolio/${$route.params.id}/scorecard/operations`
              )
            "
          >
            <div class="h-full relative">
              <div class="px-4 pt-4">
                <span class="text-lg text-primary-900">
                  <span class="font-bold">Operations</span>
                  <span class="opacity-70">|</span>
                  <span
                    v-if="operationsPercent !== null"
                    class="opacity-70 font-normal"
                    >{{
                      questionCounts['operations'] + '&#160;Questions'
                    }}</span
                  >
                </span>

                <p class="my-1">
                  <span
                    v-if="operationsPercent !== null"
                    class="text-sm text-secondary-800"
                    >{{ operationsPercent + ' / 100' + '% complete' }}</span
                  >
                </p>
                <PortfolioHorizontalIndicator :category="operationsPercent" />
                <WButtonsBase class="mt-4"> Select </WButtonsBase>
              </div>
              <div class="absolute bottom-0 right-0">
                <img
                  src="/portfolio/screen/scorecard/operations.png"
                  alt=""
                  srcset=""
                />
              </div>
            </div>
          </div>
          <div
            class="
              bg-primary-100
              border border-primary-300
              cursor-pointer
              h-60
              hover:bg-white
              rounded-md
            "
            @click="
              $router.push(`/portfolio/${$route.params.id}/scorecard/policy`)
            "
          >
            <div class="relative h-full">
              <div class="px-4 pt-4">
                <span class="text-lg text-primary-900">
                  <span class="font-bold">Policy</span>
                  <span class="opacity-70">|</span>
                  <span
                    v-if="policyPercent !== null"
                    class="opacity-70 font-normal"
                    >{{ questionCounts['policy'] + '&#160;Questions' }}</span
                  >
                </span>

                <p class="my-1">
                  <span
                    v-if="policyPercent !== null"
                    class="text-sm text-secondary-800"
                    >{{ policyPercent + ' / 100' + '% Complete' }}</span
                  >
                </p>
                <PortfolioHorizontalIndicator :category="policyPercent" />
                <WButtonsBase class="mt-4"> Select </WButtonsBase>
              </div>
              <div class="absolute bottom-0 right-0">
                <img
                  src="/portfolio/screen/scorecard/policy.png"
                  alt=""
                  srcset=""
                />
              </div>
            </div>
          </div>
        </div>
        <div v-else>
          <div class="mx-auto text-center">
            <WLoadingSpinner class="mx-auto" />
            <div class="mt-3 text-primary-600">Loading ....</div>
          </div>
        </div>

        <!-- Designations section -->
        <WHeadingsHThree
          heading="Designations"
          class="text-primary-800 mt-10 mb-4"
        />
        <div class="flex flex-col space-y-4">
          <div class="flex items-center space-x-4">
            <WIconsBase
              class="
                bg-primary-600
                focus:outline-none
                h-10
                p-2
                rounded-lg
                text-white
                w-10
              "
              icon="thumb-up"
            />
            <div class="text-primary-900 flex flex-col">
              <span class="font-semibold"> Supportive </span>
              <span class="opacity-80">
                Your organization either already supports the strategy or would
                be very likely to achieve the feature's intent
              </span>
            </div>
          </div>
          <div class="flex items-center space-x-4">
            <WIconsBase
              class="
                bg-secondary-700
                focus:outline-none
                h-10
                mx-1
                my-auto
                p-2
                rounded-lg
                text-white
                w-10
              "
              icon="document-search"
            />
            <div class="text-primary-900 flex flex-col">
              <span class="font-semibold"> Explore further </span>
              <span class="opacity-80">
                Your organization may be supportive depending on the amount of
                effort or resources needed
              </span>
            </div>
          </div>
          <div class="flex items-center space-x-4">
            <WIconsBase
              class="
                bg-gray-500
                focus:outline-none
                h-10
                mx-1
                my-auto
                p-2
                rounded-lg
                text-white
                w-10
              "
              icon="ban"
            />
            <div class="text-primary-900 flex flex-col">
              <span class="font-semibold"> Not interested </span>
              <span class="opacity-80">
                Your organization does not typically support spending effort or
                resources on these types of alternatives
              </span>
            </div>
          </div>
        </div>

        <div class="w-full mt-10">
          <div class="rounded-lg border border-primary-300 flex flex-col px-6">
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-16">
              <div class="flex items-end">
                <img
                  src="/portfolio/screen/scorecard/next-step.png"
                  alt=""
                  srcset=""
                />
              </div>
              <div class="p-6">
                <p class="text-primary-500 text-xs font-semibold leading-5">
                  TAKE ACTION
                </p>
                <WHeadingsHThree
                  heading="Ready for your next steps?"
                  class="text-primary-800 leading-9 mt-2"
                />
                <p class="mb-3 text-sm leading-5 font-normal text-primary-900">
                  Once you've completed the questions in each of the categories,
                  indicating that you are finished will close the survey and
                  provide you with a summary of your responses.
                </p>
                <p class="text-sm leading-5 font-normal mb-5 text-primary-900">
                  Clicking below will also alert your coaching contact who will
                  then coordinate a time to review the results, provide insights
                  and outline next steps.
                </p>
                <button
                  class="
                    bg-secondary-700
                    rounded-md
                    text-white
                    w-full
                    py-2
                    hover:bg-secondary-600
                  "
                  @click="$refs.modal.isHidden = false"
                >
                  I'm finished. Let's chat!
                </button>
              </div>
            </div>
          </div>
        </div>
        <WFeedbackModal ref="modal" class="z-50">
          <div class="max-w-xl space-y-2 px-4">
            <div class="flex justify-between">
              <WHeadingsHThree
                heading="Are you sure you're ready to mark your survey complete?"
              />
              <WIconsBase
                icon="x-circle"
                @click.native="$refs.modal.isHidden = true"
              />
            </div>
            <p>
              Clicking below will also alert your coaching contact who will then
              coordinate a time to review the results, provide insights and
              outline next steps.
            </p>
            <div class="flex w-full">
              <div class="mx-auto w-60">
                <WButtonsBase
                  :type="totalPercent < 100 ? 'primaryInverted' : 'primary'"
                  @click.native="
                    updateAnalyzeMode(true),
                      updateSurveyCompleted(true),
                      ($refs.modal.isHidden = false),
                      $router.push(
                        `/portfolio/${portfolio.portfolio_number}/scorecard`
                      )
                  "
                  >I'm finished. Let's chat!</WButtonsBase
                >
              </div>
            </div>
          </div>
        </WFeedbackModal>
      </div>
      <div v-else-if="!surveyStatus.started && !surveyStatus.completed">
        <PortfolioScorecardSurvey />
      </div>
    </div>
    <div v-else>
      <div class="mx-auto text-center m-8 p-8">
        <WLoadingSpinner class="mx-auto" />
        <div class="mt-3 text-primary-600">Please Wait...</div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapState, mapActions } from 'vuex'
export default {
  layout: 'sidebar',
  data() {
    return {
      loadedData: false,
    }
  },
  computed: {
    ...mapState({
      portfolio: (state) => state.portfolio.portfolio,
    }),

    ...mapState('survey', ['categories', 'hasCategories', 'questionCounts']),
    surveyStatus() {
      return this.$store.getters['survey/surveyStatus']
    },
    calcPortfolioId() {
      const id = this.$route.params.id.toString().substring(5, 10)
      return parseInt(id)
    },
    designPercent(category) {
      return this.percentComplete('design')
    },
    operationsPercent() {
      return this.percentComplete('operations')
    },
    policyPercent() {
      return this.percentComplete('policy')
    },
    totalPercent() {
      if (this.categories) {
        let total = 0
        let count = 0
        Object.keys(this.categories).map((concept) => {
          const cat = this.categories[concept].question_summary
          count += cat.yes + cat.maybe + cat.no
          total += cat.question_count
          return concept
        })
        return 100 * (count / total)
      }
      return 0
    },
  },
  async mounted() {
    this.loadedData = false
    if (this.$route.query.tab) {
      this.$store.commit('settings/setSidebarTab', this.$route.query.tab)
    } else {
      this.$store.commit('settings/setSidebarTab', 'Scorecard')
    }
    await this.$store.dispatch('portfolio/getPortfolio', {
      id: this.$route.params.id,
    })

    await this.loadSurvey({ id: this.calcPortfolioId }).then(
      (this.loadedData = true)
    )
  },
  methods: {
    ...mapActions('survey', ['loadSurvey', 'updateSurveyCompleted']),
    ...mapActions('portfolio', ['updateAnalyzeMode']),
    percentComplete(category) {
      if (this.categories && category && this.categories[category]) {
        const cat = this.categories[category]
        const complete =
          cat.question_summary.yes +
          cat.question_summary.maybe +
          cat.question_summary.no
        return Math.floor(
          (complete / cat.question_summary.question_count) * 100
        )
      } else if (!this.hasCategories) {
        // this.loadSurvey()
      }
      return null
    },
  },
  head() {
    return {
      title: `Scorecard Survey`,
    }
  },
}
</script>
