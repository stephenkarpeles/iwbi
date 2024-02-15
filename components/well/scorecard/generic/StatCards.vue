<template>
  <div>
    <div
      v-observe-visibility="visibilityChanged"
      class="grid grid-cols-3 gap-4 my-6"
    >
      <ScorecardStatCard
        v-if="requiredStrategies > 0"
        :progress="conceptPrePrec"
        :header="concept + ' PRECONDITIONS'"
        :sub-header="requiredStrategies + ' Required Strategies'"
        :total-strategies="requiredStrategies"
        :concept="concept"
        :yes="conceptResponses.yes_pre"
        :maybe="conceptResponses.maybe_pre"
        :no="conceptResponses.no_pre"
      />
      <div
        v-else
        class="
          bg-white
          border border-primary-300
          p-4
          rounded-lg
          shadow-lg
          flex
          space-x-3
        "
      >
        <div class="my-auto mx-auto text-primary-500 text-center">
          There no preconditions for this concept
        </div>
      </div>
      <ScorecardStatCard
        :progress="conceptOptPrec"
        :header="concept + ' OPTIMIZATIONS'"
        :sub-header="availableStrategies + ' Available Strategies'"
        :total-strategies="availableStrategies"
        :concept="concept"
        :yes="conceptResponses.yes_opt"
        :maybe="conceptResponses.maybe_opt"
        :no="conceptResponses.no_opt"
      />

      <div
        v-if="totalConceptPoints > 0"
        class="
          bg-white
          border border-primary-300
          p-4
          rounded-lg
          shadow-lg
          flex
          space-x-3
        "
      >
        <div>
          <ScorecardRadialIndicator
            :radius="45"
            :progress="
              ((conceptPoints + conceptGuidancePoints) / totalConceptPoints) *
              100
            "
            :stroke="9"
            :color="'#5EABC4'"
            :fill="'#F4F9FB'"
          />
        </div>
        <div class="my-auto w-full pr-10">
          <div
            class="
              uppercase
              font-bold
              tracking-tight
              text-primary-800
              leading-none
            "
          >
            {{ conceptPoints }}
            <span v-if="conceptGuidancePoints">
              &nbsp;+&nbsp; {{ conceptGuidancePoints }} Core</span
            >&nbsp;Points
          </div>
          <div class="text-gray-400 text-sm mb-1">
            {{ conceptPoints + conceptGuidancePoints }}/{{ totalConceptPoints }}
            Points
          </div>
          <ScorecardHorizontalIndicator
            :yes="conceptPoints + conceptGuidancePoints"
            :total="totalConceptPoints"
          />
          <div class="flex space-x-3 text-sm text-primary-400 mt-2">
            <div class="flex">
              <div
                class="my-auto w-2 h-2 bg-primary-700 rounded-full mr-2"
              ></div>
              <div class="my-auto">
                {{ conceptPoints + conceptGuidancePoints }} Pursued
              </div>
            </div>
            <div class="flex">
              <div class="my-auto w-2 h-2 bg-gray-300 rounded-full mr-2"></div>
              <div class="my-auto">{{ totalConceptPoints }} Total</div>
            </div>
          </div>
        </div>
      </div>
      <div
        v-else
        class="
          bg-white
          border border-primary-300
          p-4
          rounded-lg
          shadow-lg
          flex
          space-x-3
        "
      >
        <div class="my-auto mx-auto text-primary-500 text-center">
          <div class="mx-auto text-center">
            <WLoadingSpinner class="mx-auto" />
          </div>
        </div>
      </div>
    </div>
    <div
      v-if="conceptScore > 12"
      class="bg-yellow-50 border-l-4 border-yellow-400 p-4"
    >
      <div class="flex">
        <div class="flex-shrink-0">
          <svg
            class="h-5 w-5 text-yellow-400"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
          >
            <path
              fill-rule="evenodd"
              d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
              clip-rule="evenodd"
            />
          </svg>
        </div>
        <div class="ml-3">
          <div class="text-sm text-yellow-700">
            <p>
              You are targeting more than the maximum 12 points allowed per
              concept. You may apply these excess points towards your 10
              available innovation points, or should adjust to target only 12
              points.
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapState } from 'vuex'

export default {
  props: {
    concept: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      isVisible: false,
    }
  },
  computed: {
    ...mapState({
      concepts: (state) => state.scorecard.concepts,
      scores: (state) => state.scorecard.scorecard.scores,
      assessmentScore: (state) => state.scorecard.scorecard.assessment_score,
      conceptPrePrec: (state) => state.scorecard.conceptPrePrec,
      conceptOptPrec: (state) => state.scorecard.conceptOptPrec,
      conceptSummary: (state) => state.scorecard.conceptSummary,
    }),
    totalConceptPoints() {
      if (
        this.concept.toLowerCase() === 'innovation' ||
        this.concept.toLowerCase() === 'innovations'
      ) {
        return 10
      } else {
        return 12
      }
    },
    conceptResponses() {
      if (this.conceptSummary) {
        return this.conceptSummary[this.concept].response
      }
      return null
    },
    conceptPoints() {
      let points = 0
      if (this.assessmentScore && this.assessmentScore.conceptScore) {
        const concent = this.assessmentScore.conceptScore
        const conceptScore = concent.find(
          (a) => a.concept_name === this.concept
        )
        if (conceptScore) {
          points = parseFloat(conceptScore.points)
        }
      }
      return points
    },
    conceptGuidancePoints() {
      let points = 0
      if (this.assessmentScore && this.assessmentScore.conceptScore) {
        const concept = this.assessmentScore.conceptScore
        const guidanceScore = concept.find(
          (a) => a.concept_name === this.concept
        )
        if (guidanceScore) {
          points = parseFloat(guidanceScore.guidance_points)
        }
      }
      return points
    },

    conceptScore() {
      if (this.assessmentScore) {
        const concept = this.assessmentScore.conceptScore.filter(
          (a) => a.concept_name === this.concept
        )
        if (concept.length) {
          return parseFloat(concept[0].points)
        }
      }
      return 0
    },
    requiredStrategies() {
      return this.$store.getters['scorecard/requiredStrategies']
    },
    availableStrategies() {
      return this.$store.getters['scorecard/availableStrategies']
    },
    expanded() {
      if (this.$store.state.settings.navExpanded == null) {
        return false
      }

      if (this.$store.state.settings.navExpanded === 'false') {
        return false
      }

      if (this.$store.state.settings.navExpanded === 'true') {
        return true
      }

      return this.$store.state.settings.navExpanded
    },
  },
  methods: {
    visibilityChanged(isVisible, entry) {
      this.isVisible = isVisible
    },
  },
}
</script>
