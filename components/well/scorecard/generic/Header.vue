<template>
  <div>
    <div class="flex justify-between text-primary-800">
      <div class="-mb-2">
        <WHeadingsHFour heading="Scorecard" />
      </div>
      <div class="leading-7 font-semibold mt-auto">TARGETED POINTS</div>
    </div>
    <div class="flex justify-between -mt-3">
      <div v-if="addenda" class="flex-col">
        <div class="text-sm flex mt-2">
          <span class="font-semibold text-sm">Applicable version:</span>
          <WLinksBase
            class="ml-2"
            target="_blank"
            :link="`https://v2.wellcertified.com/${addenda.version}/en/overview`"
          >
            {{ addenda.name }}
          </WLinksBase>
        </div>
        <div
          v-if="project && project.reg_payment_status !== 'paid'"
          class="flex font-semibold text-sm my-1"
        >
          <span>Note: &nbsp;</span>
          <span class="w-3/4">
            the addenda version applied to your project is the version in effect
            on the date your enrollment fees are paid.</span
          >
        </div>
      </div>
      <div>
        <div
          class="cursor-pointer bg-primary-800 border border-primary-200 font-light mt-4 my-auto px-4 py-2 rounded-lg shadow text-sm text-white uppercase"
          @click="$parent.$refs.slideover.open = true"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            class="inline mb-auto ml-2 transform w-5"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
            ></path>
          </svg>
          {{ totalPoints }} Points
          <span v-if="guidancePoints"> + {{ guidancePoints }} Core Points</span>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapState } from 'vuex'

export default {
  props: {
    type: {
      type: String,
      required: false,
      default: 'TYPE NOT GIVEN',
    },
  },
  computed: {
    ...mapState({
      conceptSummary: (state) => state.scorecard.conceptSummary,
      scorecard: (state) => state.scorecard.scorecard,
      addenda: (state) => state.scorecard.addenda,
      project: (state) => state.project.project,
    }),
    assessmentScore() {
      return this.scorecard && this.scorecard.assessment_score
        ? parseFloat(this.scorecard.assessment_score.score)
        : 0
    },
    innovationScore() {
      if (
        this.scorecard &&
        this.scorecard.assessment_score &&
        this.scorecard.assessment_score.innovationScore &&
        this.scorecard.assessment_score.innovationScore.points
      ) {
        return parseFloat(
          this.scorecard.assessment_score.innovationScore.points
        )
      } else {
        return 0
      }
    },
    guidancePoints() {
      let guidancePoints = 0
      if (
        this.scorecard &&
        this.scorecard.assessment_score &&
        this.scorecard.assessment_score.guidance_points
      ) {
        guidancePoints = parseFloat(
          this.scorecard.assessment_score.guidance_points
        )

        return guidancePoints
      }
      return 0
    },
    totalPoints() {
      let totalPoints = 0
      if (this.scorecard && this.scorecard.assessment_score) {
        totalPoints = totalPoints + this.assessmentScore + this.innovationScore

        return totalPoints
      }
      return 0
    },
  },
}
</script>
