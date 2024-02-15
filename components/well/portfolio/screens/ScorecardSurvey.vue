<template>
  <div>
    <div class="flex justify-between">
      <WHeadingsHTwo heading="Survey" class="text-primary-800 mb-5" />
      <div class="w-60">
        <WButtonsBase
          class="mb-5"
          type="primary"
          @click.native="
            updateSurveyStarted(true)
            $router.push(
              `/portfolio/${portfolio.portfolio_number}/scorecard/survey`
            )
          "
        >
          Help me build my scorecard
        </WButtonsBase>
      </div>
    </div>
    <div class="text-sm font-light leading-5">
      <p>
        The first step of your journey is to build a customized scorecard of the
        health and wellness features that you'd like your organization to pursue
        to obtain a WELL Portfolio Score™. WELL incorporates an array of
        evidence-based alternatives across 10 concepts that impact people's
        health and well-being. You can prioritize the alternatives that will
        best address your organization's key goals, health challenges and
        opportunities.
      </p>
      <p>
        The following survey experience guides you through three strategy types
        - design, operations and policy - and illustrates how your organization
        can benefit from implementing specific actions in these areas. Your
        selections on the survey will then populate your WELL Portfolio
        scorecard, giving you a head start on determining which you’d like to
        achieve.
      </p>
    </div>
    <div class="text-primary-900 mt-7 mb-4 text-lg leading-7 font-bold">
      Designations
    </div>
    <div class="grid grid-cols-4 gap-x-2">
      <div
        class="
          cursor-pointer
          col-span-1
          shadow-sm
          rounded-md
          border border-gray-200
          bg-white
          rounded-r-md
        "
      >
        <div class="text-sm font-medium rounded-l-md px-3 pt-2">
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
            icon="thumb-up"
          />
        </div>
        <div>
          <div class="px-4 py-2 text-sm">
            <span
              class="
                text-primary-900 text-sm
                font-semibold
                leading-5
                hover:text-gray-600
                mb-3
              "
            >
              Goals
            </span>
            <p
              class="
                text-xs
                tracking-tighter
                text-primary-900
                opacity-50
                leading-4
                font-normal
              "
            >
              Selections should reflect your best estimates about the
              organization's ambitions, and do not need to be achieved for every
              project in your portfolio.
            </p>
          </div>
        </div>
      </div>
      <div
        class="
          cursor-pointer
          col-span-1
          shadow-sm
          rounded-md
          border border-gray-200
          bg-white
          rounded-r-md
        "
      >
        <div class="text-sm font-medium rounded-l-md px-3 pt-2">
          <WIconsBase
            class="
              bg-secondary-700
              focus:outline-none
              h-10 h-5
              mx-1
              my-auto
              p-2
              rounded-lg
              text-white
              w-10
            "
            icon="color-swatch"
          />
        </div>
        <div>
          <div class="px-4 py-2 text-sm">
            <span
              class="
                text-primary-900 text-sm
                font-semibold
                leading-5
                hover:text-gray-600
                mb-3
              "
            >
              Effort
            </span>
            <p
              class="
                text-xs
                tracking-tighter
                text-primary-900
                opacity-50
                leading-4
                font-normal
              "
            >
              We expect the exercise may take you one to two hours to complete.
              You'll also have a chance to review and edit your responses prior
              to completion.
            </p>
          </div>
        </div>
      </div>
      <div
        class="
          cursor-pointer
          col-span-1
          shadow-sm
          rounded-md
          border border-gray-200
          bg-white
          rounded-r-md
        "
      >
        <div class="text-sm font-medium rounded-l-md px-3 pt-2">
          <WIconsBase
            class="
              bg-secondary-700
              focus:outline-none
              h-10 h-5
              mx-1
              my-auto
              p-2
              rounded-lg
              text-white
              w-10
            "
            icon="document"
          />
        </div>
        <div>
          <div class="px-4 py-2">
            <span
              class="
                text-primary-900 text-sm
                font-semibold
                leading-5
                hover:text-gray-600
                mb-3
              "
            >
              Support
            </span>
            <p
              class="
                text-xs
                tracking-tighter
                text-primary-900
                opacity-50
                leading-4
                font-normal
              "
            >
              You may wish to have policy manuals, maintenance protocols or
              design guidelines available to reference, but those are not
              necessary for estimation.
            </p>
          </div>
        </div>
      </div>
      <div
        class="
          cursor-pointer
          col-span-1
          shadow-sm
          rounded-md
          border border-gray-200
          bg-white
          rounded-r-md
        "
      >
        <div class="text-sm font-medium rounded-l-md px-3 pt-2">
          <WIconsBase
            class="
              bg-secondary-700
              focus:outline-none
              h-10 h-5
              mx-1
              my-auto
              p-2
              rounded-lg
              text-white
              w-10
            "
            icon="flag"
          />
        </div>
        <div>
          <div class="px-4 py-2">
            <span
              class="
                text-primary-900 text-sm
                font-semibold
                leading-5
                hover:text-gray-600
                mb-3
              "
            >
              Completion
            </span>
            <p
              class="
                text-xs
                tracking-tighter
                text-primary-900
                opacity-50
                leading-4
                font-normal
              "
            >
              You can save and return to the survey at any time prior to
              completion, but once you’ve finished, any edits you want to make
              will occur in your scorecard.
            </p>
          </div>
        </div>
      </div>
    </div>
    <div class="w-full mt-10">
      <div class="rounded-lg border border-primary-300 flex flex-col px-6">
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-16">
          <div>
            <img
              src="/portfolio/screen/scorecard/next-step.png"
              alt=""
              srcset=""
            />
          </div>
          <div class="pt-6">
            <p class="text-primary-500 text-xs font-semibold leading-5">
              TAKE ACTION
            </p>
            <WHeadingsHThree
              heading="Your unique path"
              class="text-primary-800 leading-9 mt-2"
            />
            <p class="mb-3 text-sm leading-5 font-normal">
              This tool and the summary of responses that will follow are
              intended to assist you in prioritizing strategies for your
              organization and to help you make informed choices to complete
              your customized scorecard, which is the first step of your
              journey.
            </p>
            <p class="text-sm leading-5 font-normal mb-5">
              Please note that this tool does not and cannot indicate the
              likelihood of meeting any feature requirements or of achieving
              WELL Certification of one or more projects or of achieving any
              WELL Portfolio Score for your portfolio.
            </p>

            <div class="text-sm italic m-auto w-68 text-center">
              <p>Already have a scorecard in mind?</p>
              <p class="-mt-2.5">
                Skip this step and go straight to building a scorecard without
                recommendations.
              </p>
            </div>
            <WButtonsBase
              class="mb-5"
              type="primary"
              @click.native="$refs.modal1.isHidden = false"
            >
              Begin with a zero-point scorecard
            </WButtonsBase>
          </div>
        </div>
      </div>
    </div>
    <WFeedbackModal ref="modal1" class="z-50">
      <div class="max-w-xl space-y-2 px-4">
        <div class="flex justify-between">
          <WHeadingsHThree
            heading="Are you sure you don't want to use the scorecard survey?"
          />
          <WIconsBase
            icon="x-circle"
            @click.native="$refs.modal1.isHidden = true"
          />
        </div>
        <p>
          The survey can be helpful to identify how the design, operations and
          policy-based strategies within the WELL Building Standard can add
          value to your buildings and your organization.
        </p>
        <div class="flex w-full">
          <div class="mx-auto w-full">
            <WButtonsBase
              :type="(totalPercent = 0 ? 'primaryInverted' : 'primary')"
              @click.native="
                updateSurveyCompleted(true),
                  ($refs.modal1.isHidden = false),
                  $router.push(
                    `/portfolio/${portfolio.portfolio_number}/scorecard`
                  )
              "
              >Yes, I'd like to start with a zero point scorecard</WButtonsBase
            >
          </div>
        </div>
      </div>
    </WFeedbackModal>
  </div>
</template>
<script>
import { mapState, mapActions } from 'vuex'
export default {
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
    if (this.$route.query.tab) {
      this.$store.commit('settings/setSidebarTab', this.$route.query.tab)
    } else {
      this.$store.commit('settings/setSidebarTab', 'Scorecard')
    }
    await this.$store.dispatch('portfolio/getPortfolio', {
      id: this.$route.params.id,
    })
    if (!this.hasCategories) {
      this.loadSurvey({ id: this.calcPortfolioId })
    }
  },
  methods: {
    ...mapActions('survey', [
      'loadSurvey',
      'updateSurveyCompleted',
      'updateSurveyStarted',
    ]),
  },
}
</script>
