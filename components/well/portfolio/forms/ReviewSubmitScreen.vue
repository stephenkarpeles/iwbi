<template>
  <div class="max-w-2xl">
    <div class="flex justify-between bg-primary-800 text-white">
      <div class="p-4">
        <p class="text-xl font-bold">
          Submit Documentation for {{ formData.docSubmitPhase }}
        </p>
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
        <FormulateForm
          class="space-y-6 max-w-4xl mx-auto my-10 border rounded-md p-5"
          @submit="applyForReview"
        >
          <div class="mb-5">
            <FormulateInput
              v-model="formData.docSubComments"
              type="textarea"
              label="Please provide your comments below to notify the IWBI team"
              validation="required"
            />
          </div>
          <div
            v-if="portfolio.hsr_opt && portfolio.hsr_payment === 'waived'"
            class="mb-5"
          >
            <FormulateInput
              v-model="formData.docSubmitIsHsr"
              type="checkbox"
              label="This review contains documentation for locations pursuing a WELL Health-Safety Rating."
            />
          </div>
          <div class="flex justify-between">
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
                Only portfolio administrators and team managers are allowed to
                submit documentation for review.
              </p>
              <p>
                Please reach out to any of the team managers or project
                administrators listed under the
                <WLinksBase
                  class="underline font-semibold"
                  :link="`/portfolio/${portfolio.portfolio_number}/team`"
                >
                  Portfolio Team tab.</WLinksBase
                >
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
        docSubmitPhase: null,
        docSubmitIsHsr: 0,
      },
    }
  },
  computed: {
    ...mapState({
      allReviews: (state) => state.review.allReviews,
      currentUser: (state) => state.user.currentUser,
      portfolio: (state) => state.portfolio.portfolio,
    }),
    ...mapGetters('review', ['pendingReview']),
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
    isHSRReview() {
      if (
        this.formData.docSubmitPhase === 'Preliminary Health-Safety Review' ||
        this.formData.docSubmitPhase === 'Final Health-Safety Review' ||
        this.formData.docSubmitIsHsr
      ) {
        return true
      } else {
        return false
      }
    },
    accessLevel() {
      let level = false

      if (this.portfolio && this.portfolio.members.length) {
        level = this.portfolio.members.find(
          (member) => member.id === this.currentUser.id
        )
      }

      if (level) {
        return level.pivot.role
      }
      return false
    },
  },
  async mounted() {
    await this.$store
      .dispatch('review/getPortfolioReviewNextPhase', this.portfolio.id)
      .then((response) => {
        this.formData.docSubmitPhase = response.data.phase
      })
  },
  methods: {
    applyForReview() {
      this.isSubmitting = true
      let docPhase = ''
      const data = {
        comment: this.formData.docSubComments,
        is_hsr: this.formData.docSubmitIsHsr,
      }
      if (
        this.portfolio.d_and_o !== 1 ||
        this.portfolio.d_and_o_submitted === 1
      ) {
        docPhase = this.formData.docSubmitPhase
      } else {
        docPhase = 'Preliminary Precertification Review'
      }
      data.phase = docPhase

      const payload = {
        id: this.portfolio.id,
        phase: docPhase,
        comment: this.formData.docSubComments,
        is_hsr: this.formData.docSubmitIsHsr,
      }

      this.$store
        .dispatch('review/submitPortfolioReview', payload)
        .then((res) => {
          this.formData.docSubComments = null
          this.formData.docSubmitPhase = null
          this.$parent.$parent.$refs.modal.isHidden = true
          this.isSubmitting = false
        })
    },
  },
}
</script>
