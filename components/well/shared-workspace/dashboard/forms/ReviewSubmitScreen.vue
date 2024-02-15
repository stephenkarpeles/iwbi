<template>
  <div class="max-w-2xl">
    <div class="flex justify-between bg-primary-800 text-white">
      <div class="p-4">
        <p class="text-xl font-bold">Submit Documentation for Review</p>
      </div>
      <div class="p-4">
        <WButtonsBase
          icon="x-circle"
          type="blank"
          @click.native="$parent.$parent.$refs.modal.isHidden = true"
        />
      </div>
    </div>
    <div v-if="hasAccess">
      <div>
        <div
          v-if="totalPoints > 111"
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
                  You are targeting more than the maximum 110 points allowed per
                  submission. Please review the YES status in your scorecard to
                  adjust your selections to lower the total number of points
                  pursuing.
                </p>
              </div>
            </div>
          </div>
        </div>
        <FormulateForm
          v-else
          class="space-y-6 max-w-4xl mx-auto my-10 border rounded-md p-5"
          @submit="applyForReview"
        >
          <div v-if="invalidChecklist || invalidDocumentCount" class="mb-5">
            <div
              class="mt-5 rounded-md bg-yellow-50 p-4 mb-5 rounded-lg border border-yellow-300"
            >
              <div class="flex">
                <div class="ml-3">
                  <div class="mt-2 text-sm leading-5 text-yellow-700">
                    <p v-if="invalidChecklist || invalidDocumentCount">
                      Oops! It looks like your scorecard is incomplete.
                    </p>
                    <p v-if="invalidChecklist">
                      Please ensure all features are marked as either a YES or
                      NO and then resubmit.
                    </p>
                    <p v-if="!recertification && invalidDocumentCount">
                      Please ensure you have provided the documentation for all
                      the features marked as a YES and then resubmit.
                    </p>
                    <p v-if="recertification && invalidDocumentCount">
                      Please ensure you have answered the confirmation questions
                      for all the features marked as a YES.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="mb-5">
            <FormulateInput
              v-model="formData.docSubmitPhase"
              type="select"
              name="doc-submit-phase"
              label="Please select the project phase you want to submit documentation for"
              placeholder="Select option"
              :options="reviewOptions"
              validation="required"
            />
          </div>
          <div class="mb-5">
            <FormulateInput
              v-model="formData.docSubComments"
              type="textarea"
              label="Please provide your comments below to notify the IWBI team"
              validation="required"
            />
          </div>
          <div
            v-if="!invalidChecklist && !invalidDocumentCount"
            class="flex justify-between"
          >
            <div>
              <FormulateInput
                v-if="!isSubmitting"
                type="submit"
                label="Submit"
              />
              <WButtonsBase v-else :type="'primaryInverted'">
                <span>
                  <WLoadingSpinner type="button" class="mx-auto" />
                </span>
              </WButtonsBase>
            </div>
          </div>
        </FormulateForm>
      </div>
    </div>
    <div v-else>
      <div class="rounded-md bg-yellow-50 p-4">
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
              <p class="mb-2">
                You don't have sufficient privileges to submit documentation.
                Only project administrators and team managers are allowed to
                submit documentation for review.
              </p>
              <p>
                Please reach out to any of the team managers or project
                administrators listed under the
                <a
                  href="#"
                  class="underline font-semibold"
                  @click="$store.commit('settings/setSidebarTab', 'Team')"
                  >Project Team</a
                >
                tab.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapState } from 'vuex'
export default {
  data() {
    return {
      isSubmitting: false,
      formData: {
        docSubComments: null,
        docSubmitPhase: null,
        docSubmitIsHsr: false,
      },
    }
  },
  computed: {
    ...mapState({
      allReviews: (state) => state.review.allReviews,
      reviewSelectOptions: (state) => state.review.hsrReviewForSelect,
      reviewRenewalSelectOptions: (state) =>
        state.review.hsrRenewalReviewForSelect,
      currentUser: (state) => state.user.currentUser,
      project: (state) => state.shared.sharedWorkspace,
      scorecard: (state) => state.scorecard.scorecard,
      hsrScorecard: (state) => state.scorecard.hsrScorecard,
      recertificationList: (state) => state.recertification.recertificationList,
    }),
    recertification() {
      if (!this.recertificationList.length) {
        return ''
      } else {
        const recert = JSON.parse(JSON.stringify(this.recertificationList))

        return recert.pop()
      }
    },
    hsrScores() {
      return this.hsrScorecard ? this.hsrScorecard.scores : null
    },
    hasAccess() {
      if (this.currentUser.role.includes('well-admin')) {
        return true
      } else if (
        this.accessLevel === 'portfolio-admin' ||
        this.accessLevel === 'portfolio-manager'
      ) {
        return true
      }
      return false
    },
    totalPoints() {
      let totalPoints = 0
      if (this.scorecard && 'response_summary' in this.scorecard) {
        if (this.scorecard.response_summary.concept_summary != null) {
          for (const concept in this.scorecard.response_summary
            .concept_summary) {
            totalPoints += parseFloat(
              this.scorecard.response_summary.concept_summary[concept].response
                .yes_score
            )
          }
          if (this.scorecard) {
            if (
              this.scorecard.assessment_score &&
              this.scorecard.assessment_score.guidance_points
            ) {
              totalPoints =
                totalPoints +
                parseFloat(this.scorecard.assessment_score.guidance_points)
            }
          }
          return totalPoints
        }
      }
      return 0
    },
    activeReviewPhases() {
      return this.allReviews.map((review) => {
        return this.recertification
          ? review.phase + '-' + this.recertification.id
          : review.phase
      })
    },
    hasHSRReview() {
      return this.allReviews.filter((review) => review.is_hsr === 1).length > 0
    },
    reviewOptions() {
      let options = null
      if (this.recertification) options = this.reviewRenewalSelectOptions
      else options = this.reviewSelectOptions
      const self = this
      options = options.filter(function (option) {
        if (
          option.value.includes('Action Plan') ||
          option.value.includes('Appeal')
        ) {
          return option
        }
        if (self.recertification)
          return !self.activeReviewPhases.includes(
            option.value + '-' + self.recertification.id
          )
        else return !self.activeReviewPhases.includes(option.value)
      })

      return options
    },
    accessLevel() {
      let level = false

      if (this.project.members) {
        level = this.project.members.find(
          (member) => member.id === this.currentUser.id
        )
      }

      if (level) {
        return level.pivot.role
      }
      return false
    },
    yesCount() {
      if (this.hsrScores) {
        const yes = this.hsrScores.summary.response.yes
          ? parseInt(this.hsrScores.summary.response.yes)
          : 0

        return yes
      } else {
        return 0
      }
    },
    yesDocumentCount() {
      if (this.hsrScores) {
        const yes = this.hsrScores.summary.response.yes_document_count
          ? this.hsrScores.summary.response.yes_document_count
          : 0

        return yes
      } else {
        return 0
      }
    },
    noCount() {
      if (this.hsrScores) {
        const no = this.hsrScores.summary.response.no
          ? parseInt(this.hsrScores.summary.response.no)
          : 0

        return no
      } else {
        return 0
      }
    },
    maybeCount() {
      if (this.hsrScores) {
        const maybe = this.hsrScores.summary.response.maybe
          ? parseInt(this.hsrScores.summary.response.maybe)
          : 0

        return maybe
      } else {
        return 0
      }
    },
    totalCount() {
      if (this.hsrScores) {
        const total = this.hsrScores.summary.part_count
          ? parseInt(this.hsrScores.summary.part_count)
          : 0

        return total
      } else {
        return 0
      }
    },
    invalidDocumentCount() {
      return this.yesCount !== this.yesDocumentCount
    },
    invalidChecklist() {
      const isAllSelected = this.yesCount + this.noCount === this.totalCount
      if (this.yesCount >= 15 && this.maybeCount === 0 && isAllSelected) {
        return false
      }
      return true
    },
  },
  methods: {
    applyForReview() {
      this.isSubmitting = true
      const data = {
        comment: this.formData.docSubComments,
        phase: this.formData.docSubmitPhase,
        recert_id: this.recertification ? this.recertification.id : '',
        status: 'pending',
        id: this.project.id,
        type: 'hsr',
      }
      this.$store.dispatch('review/submitPortfolioReview', data).then((res) => {
        this.formData.docSubComments = null
        this.formData.docSubmitPhase = null
        this.$parent.$parent.$refs.modal.isHidden = true
        this.isSubmitting = false
      })
    },
  },
}
</script>
