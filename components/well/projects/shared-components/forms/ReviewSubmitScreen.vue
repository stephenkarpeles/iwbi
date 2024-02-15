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
      <div
        v-if="
          (project.agreement_status === 1 &&
            !pendingReview &&
            project.d_and_o === 1 &&
            project.d_and_o_submitted !== 1) ||
          project.d_and_o !== 1 ||
          (project.d_and_o == 1 && project.d_and_o_submitted == 1)
        "
      >
        <div
          v-if="totalPoints > 110"
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
          <div
            v-if="invalidChecklist && project.hsr_opt === 1 && isHSRReview"
            class="mb-5"
          >
            <div
              class="mt-5 rounded-md bg-yellow-50 p-4 mb-5 rounded-lg border border-yellow-300"
            >
              <div class="flex">
                <div class="ml-3">
                  <div class="mt-2 text-sm leading-5 text-yellow-700">
                    Oops! It looks like your checklist is incomplete. Please
                    ensure all features are marked as either a YES or NO and
                    then resubmit.
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div
            v-if="invalidDocumentCount && project.hsr_opt === 1 && isHSRReview"
            class="mb-5"
          >
            <div
              class="mt-5 rounded-md bg-yellow-50 p-4 mb-5 rounded-lg border border-yellow-300"
            >
              <div class="flex">
                <div class="ml-3">
                  <div class="mt-2 text-sm leading-5 text-yellow-700">
                    Oops! It looks like your scorecard is incomplete. Please
                    ensure you have provided the documentation for all the
                    features marked as a YES and then resubmit.
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div
            v-if="
              formData.docSubmitPhase !== 'Preliminary Health-Safety Review' &&
              formData.docSubmitPhase !== 'Final Health-Safety Review'
            "
          >
            <div v-if="invalidScorecard && !project.v1_project" class="mb-5">
              <div
                class="mt-5 rounded-md bg-yellow-50 p-4 mb-5 rounded-lg border border-yellow-300"
              >
                <div class="flex">
                  <div class="ml-3">
                    <div class="mt-2 text-sm leading-5 text-yellow-700">
                      Oops! It looks like your scorecard is incomplete. Please
                      ensure all features are marked as either a YES or NO and
                      then resubmit.
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div
              v-if="!preconditionCounts"
              class="mt-5 rounded-md bg-yellow-50 p-4 mb-5 rounded-lg border border-yellow-300"
            >
              <div class="flex">
                <div class="ml-3">
                  <div class="mt-2 text-sm leading-5 text-yellow-700">
                    Oops! It looks like your scorecard is incomplete. Please
                    ensure all preconditions are marked as a YES and then
                    resubmit.
                  </div>
                </div>
              </div>
            </div>
            <div
              v-if="allReviews && allReviews.length === 0"
              class="mt-5 rounded-md bg-yellow-50 p-4 mb-5 rounded-lg border border-yellow-300"
            >
              <div class="flex">
                <div class="ml-3">
                  <div class="mt-2 text-sm leading-5 text-yellow-700">
                    Don’t forget! Provide your
                    <a
                      class="font-extrabold inline underline"
                      href="https://resources.wellcertified.com/tools/well-project-information-form/"
                      target="_blank"
                      >Project Information Form</a
                    >
                    along with all other relevant general documents before
                    submitting to avoid delays to your review timeline.
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="mb-5">
            <FormulateInput
              v-if="project.d_and_o !== 1 || project.d_and_o_submitted === 1"
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
            v-if="
              formData.docSubmitPhase === 'Preliminary Documentation Review'
            "
          >
            <FormulateInput type="checkbox" validation="required">
              <template slot="label">
                <div class="relative pl-2 text-sm">
                  By checking this box, I am confirming that this project has
                  reached substantial completion and that all designs and
                  operations that contribute to WELL Features are fully in
                  place. Projects which submit when construction is not complete
                  will have their review paused until construction is complete
                  and may be required to resubmit documentation.
                  <Flyout ref="conceptFlyout" y="bottom" x="right">
                    <WButtonsBase type="tooltip" icon="question-mark-circle" />
                    <template #content>
                      <div class="p-3 md:w-72">
                        Substantial completion is defined as the point in the
                        construction or renovation process (as applicable) where
                        the project is sufficiently finished so that the owner
                        can occupy or utilize the space for its intended use.
                      </div>
                    </template>
                  </Flyout>
                </div>
              </template>
            </FormulateInput>
          </div>
          <div v-if="project.hsr_opt" class="mb-5">
            <FormulateInput
              v-if="
                !project.hsr_achieved_date &&
                project.hsr_review &&
                project.hsr_payment === 'waived'
              "
              v-model="formData.docSubmitIsHsr"
              type="checkbox"
              label="By checking this box, I am confirming that we are submitting Health-safety rating for review along with this review."
            />
            <FormulateInput
              v-if="
                project.hsr_achieve_date &&
                recertification &&
                recertification.payment_status !== 'unpaid' &&
                recertification.hsr_review
              "
              v-model="formData.docSubmitIsHsr"
              type="checkbox"
              label="By checking this box, I am confirming that we are submitting Health-safety rating for review along with this review."
            />
          </div>
          <div
            v-if="isSepHSRReview || preconditionCounts"
            class="flex justify-end"
          >
            <div>
              <FormulateInput
                v-if="!isSubmitting && isSepHSRReview"
                :disabled="invalidChecklist || invalidDocumentCount"
                type="submit"
                label="Submit"
              />
              <FormulateInput
                v-if="
                  !isSubmitting && !isSepHSRReview && formData.docSubmitIsHsr
                "
                :disabled="
                  invalidScorecard || invalidChecklist || invalidDocumentCount
                "
                type="submit"
                label="Submit"
              />
              <FormulateInput
                v-if="!isSubmitting && !isHSRReview"
                :disabled="invalidScorecard"
                type="submit"
                label="Submit"
              />
              <WButtonsBase v-if="isSubmitting" :type="'primaryInverted'">
                <span>
                  <WLoadingSpinner type="button" class="mx-auto" />
                </span>
              </WButtonsBase>
            </div>
          </div>
        </FormulateForm>
      </div>
      <div v-else>
        <p class="pb-5 text-base">
          Thank you for your submission! Your documents have been received. GBCI
          will return your review within 20-25 business days.
        </p>
        <p class="pb-5 text-base">
          The project team will be notified if the WELL Reviewer finds any
          submissions to be inaccurate or unsatisfactory, or if further
          documentation is required. The project will have an opportunity to
          amend existing documents or submit additional materials for a second
          review if necessary. The WELL Reviewer will respond with the results
          of the second review within 20-25 business days.
        </p>
        <p class="pb-5 text-base">
          If any additional reviews are required, additional fees will apply.
          Any additional rounds of review will also be completed within 20-25
          business days.
        </p>
        <p class="pb-5 text-base">
          The next step is to ensure the invoice is paid to ensure the review
          can be returned when it is complete.
        </p>
        <div class="flex justify-between">
          <div></div>
          <div>
            <FormulateInput type="submit" label="Submit" />
          </div>
        </div>
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
import { mapState, mapGetters } from 'vuex'
export default {
  data() {
    return {
      isSubmitting: false,
      formData: {
        docSubComments: null,
        docSubmitPhase: '',
        docSubmitIsHsr: false,
      },
    }
  },
  computed: {
    ...mapState({
      allReviews: (state) => state.review.allReviews,
      reviewSelectOptions: (state) => state.review.reviewSelectOptions,
      currentUser: (state) => state.user.currentUser,
      project: (state) => state.project.project,
      reviewScores: (state) => state.scorecard.reviewScores,
      hsrScorecard: (state) => state.scorecard.hsrScorecard,
      recertificationList: (state) => state.recertification.recertificationList,
      certifiedHSRRenewal: (state) => state.review.certifiedHSRRenewal,
      notCertifiedHSRRenewal: (state) => state.review.notCertifiedHSRRenewal,
    }),
    ...mapGetters('review', ['pendingReview']),
    hasAccess() {
      if (this.currentUser.role.includes('well-admin')) {
        return true
      } else if (
        this.accessLevel === 'project-admin' ||
        this.accessLevel === 'project-manager' ||
        this.accessLevel === 'project-pta'
      ) {
        return true
      }
      return false
    },
    recertification() {
      let recertification = ''
      if (this.recertificationList.length !== 0) {
        const lastrecertification = this.recertificationList.length - 1
        recertification = this.recertificationList[lastrecertification]
      }
      return recertification
    },
    isHSRReview() {
      if (
        this.formData.docSubmitPhase.includes(
          'Preliminary Health-Safety Review'
        ) ||
        this.formData.docSubmitPhase.includes('Final Health-Safety Review') ||
        this.formData.docSubmitIsHsr
      ) {
        return true
      } else {
        return false
      }
    },
    scores() {
      return this.reviewScores ? this.reviewScores.response_summary : null
    },
    isSepHSRReview() {
      if (
        this.formData.docSubmitPhase.includes(
          'Preliminary Health-Safety Review'
        ) ||
        this.formData.docSubmitPhase.includes(
          'Renewal Curative Action Plan Review'
        ) ||
        this.formData.docSubmitPhase.includes('Final Health-Safety Review')
      ) {
        return true
      } else {
        return false
      }
    },
    hsrScores() {
      return this.hsrScorecard ? this.hsrScorecard.scores : null
    },
    scorecardScore() {
      return this.reviewScores ? this.reviewScores.response_summary : null
    },
    preconditionCounts() {
      if (this.project.type === 'v1') {
        return true
      }
      if (this.scorecardScore) {
        const yesPreCount = this.scorecardScore.summary.pre_part_count
        const yes = this.scorecardScore.summary.response.yes_pre
          ? parseInt(this.scorecardScore.summary.response.yes_pre)
          : 0

        if (yesPreCount === yes) {
          return true
        } else {
          return false
        }
      } else {
        return false
      }
    },
    totalPoints() {
      let totalPoints = 0
      if (this.reviewScores && 'assessment_score' in this.reviewScores) {
        totalPoints = this.reviewScores.assessment_score.score
        if (this.reviewScores.assessment_score.innovationScore) {
          totalPoints +=
            this.reviewScores.assessment_score.innovationScore.points
        }
      }
      return totalPoints
    },
    activeReviewPhases() {
      return this.allReviews.map(function (review) {
        return review.phase
      })
    },
    hasHSRReview() {
      return this.allReviews.filter((review) => review.is_hsr === 1).length > 0
    },
    reviewOptions() {
      let options = []
      if (
        this.recertification &&
        this.recertification.payment_status !== 'unpaid'
      ) {
        if (this.project.date_certified) {
          options = this.certifiedHSRRenewal
        } else {
          options = this.notCertifiedHSRRenewal
        }
        if (
          this.recertification.type === 'v2-hsr' &&
          (this.recertification.hsr_review ||
            this.project.v1_project_standard === 'community')
        ) {
          options = options.filter(function (option) {
            return (
              option.label !== 'Renewal Preliminary Health-Safety Review' &&
              option.label !== 'Renewal Curative Action Plan Review' &&
              option.label !== 'Renewal Final Health-Safety Review'
            )
          })
        }
      } else {
        options = this.reviewSelectOptions
        if (
          !this.project.hsr_opt ||
          (this.project.hsr_opt && this.project.hsr_review) ||
          this.project.v1_project_standard === 'community'
        ) {
          options = options.filter(function (option) {
            return (
              option.label !== 'Preliminary Health-Safety Review' &&
              option.label !== 'Final Health-Safety Review'
            )
          })
        }
      }

      const self = this
      options = options.filter(function (option) {
        if (
          option.value.includes('Action Plan') ||
          option.value.includes('Appeal')
        ) {
          return option
        } else return !self.activeReviewPhases.includes(option.value) && !self.activeReviewPhases.includes(option.value + '-' + self.recertification.id)
      })

      return options
    },
    accessLevel() {
      let level = false

      if (this.project) {
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
    invalidDocumentCount() {
      if (!this.yesCount || !this.yesDocumentCount) {
        return true
      } else {
        return this.yesCount !== this.yesDocumentCount
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
    yesScorecardCount() {
      if (this.scores) {
        const yes = this.scores.summary.response.yes
          ? parseInt(this.scores.summary.response.yes)
          : 0

        return yes
      } else {
        return 0
      }
    },
    noScorecardCount() {
      if (this.scores) {
        const no = this.scores.summary.response.no
          ? parseInt(this.scores.summary.response.no)
          : 0

        return no
      } else {
        return 0
      }
    },
    maybeScorecardCount() {
      if (this.scores) {
        const maybe = this.scores.summary.response.maybe
          ? parseInt(this.scores.summary.response.maybe)
          : 0

        return maybe
      } else {
        return 0
      }
    },
    totalScorecardCount() {
      if (this.scores) {
        const total = this.scores.summary.part_count
          ? parseInt(this.scores.summary.part_count)
          : 0

        return total
      } else {
        return 0
      }
    },
    invalidScorecard() {
      if (this.project.type === 'v1') {
        return false
      }
      const isAllSelected =
        this.yesScorecardCount +
          this.noScorecardCount +
          this.maybeScorecardCount ===
        this.totalScorecardCount
      if (isAllSelected) {
        return false
      } else {
        return true
      }
    },
    invalidChecklist() {
      if (
        (this.docSubmitPhase &&
          this.docSubmitPhase.includes('Health-Safety Review')) ||
        this.formData.docSubmitIsHsr === 1 ||
        this.formData.docSubmitIsHsr === '1'
      ) {
        const isAllSelected = this.yesCount + this.noCount === this.totalCount
        if (this.yesCount >= 15 && this.maybeCount === 0 && isAllSelected) {
          return false
        }
        return true
      }
      return false
    },
  },
  async mounted() {
    if (this.project.type !== 'v1' && this.project.scorecard_id) {
      await this.$store.dispatch(
        'scorecard/getScoreForReviews',
        this.project.scorecard_id
      )
    }
    if (this.project.hsr_opt) {
      await this.$store.dispatch(
        'scorecard/getHSRResponseSummary',
        this.project.hsr_scorecard_id
      )
    }
  },
  methods: {
    applyForReview() {
      this.isSubmitting = true
      let docPhase = ''
      const data = {
        comment: this.formData.docSubComments,
        is_hsr: this.formData.docSubmitIsHsr,
      }
      if (this.project.d_and_o !== 1 || this.project.d_and_o_submitted === 1) {
        docPhase = this.formData.docSubmitPhase
      } else {
        docPhase = 'Preliminary Precertification Review'
      }
      data.phase = docPhase
      const payload = {
        type: 'project',
        reviewData: data,
        id: this.project.id,
      }
      this.$store.dispatch('review/submitReview', payload).then((res) => {
        this.formData.docSubComments = ''
        this.formData.docSubmitPhase = ''
        this.$parent.$parent.$refs.modal.isHidden = true
        this.isSubmitting = false
      })
    },
  },
}
</script>
