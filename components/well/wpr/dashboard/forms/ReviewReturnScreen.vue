<template>
  <div class="px-5">
    <FormulateForm
      class="space-y-6 max-w-4xl mx-auto border rounded-md p-5"
      @submit="submitResponse"
    >
      <div class="mb-5">
        <FormulateInput
          v-model="commentSuggestions"
          :options="[
            { label: 'Achieved', value: 'achieved' },
            { label: 'Not Achieved', value: 'not_achieved' },
          ]"
          placeholder="select comment Suggestions"
          type="select"
          label="Comment Suggestions"
        />
      </div>
      <div class="mb-5">
        <ClientOnly>
          <FormulateInput
            :key="forceReMount"
            v-model="formData.review_comment"
            type="richtext"
            name="Review Comment"
            label="Review Comment*"
            validation="required"
          />
        </ClientOnly>
      </div>
      <div class="pb-5">
        <FormulateInput
          v-model="formData.review_date"
          type="datetimepicker"
          placeholder=""
          label="Review Date*"
          max="9999-01-01"
          validation="required"
        />
      </div>
      <div class="mb-5">
        <FormulateInput
          v-model="formData.hsr_status"
          :options="[
            { label: 'N/A', value: null },
            { label: 'Achieved', value: 'achieved' },
            { label: 'Not Achieved', value: 'not_achieved' },
          ]"
          type="radio"
          label="WELL Health Safety"
        />
      </div>
      <div class="mb-5">
        <FormulateInput
          v-model="formData.hsr_achieved_date"
          type="datetimepicker"
          label="WELL Health Safety Awarded Date"
        />
      </div>
      <div class="mb-5">
        <ClientOnly>
          <FormulateInput
            v-model="formData.general_observation"
            type="richtext"
            name="generalObservation"
            label="General Observation"
          />
        </ClientOnly>
      </div>
      <div class="mb-5">
        <FormulateInput
          v-model="formData.documents"
          :value="formData.documents"
          label="Attach Document(s):"
          type="fileupload"
          :upload-path="`portfolio/${project.portfolio_number}/review/`"
          mime-types=""
        />
      </div>
      <div class="flex justify-end">
        <FormulateInput type="submit" label="Submit Response" />
      </div>
    </FormulateForm>
  </div>
</template>
<script>
import { mapState } from 'vuex'

export default {
  props: {
    review: {
      type: Object,
      required: false,
      default: () => {
        return {}
      },
    },
  },
  data() {
    return {
      formData: {
        documents: [],
        general_observation: this.review.general_observation,
        hsr_achieved_date: null,
        hsr_status: null,
        payment_status: 'paid',
        phase: null,
        review_comment: null,
        review_date: null,
      },
      commentSuggestions: null,
      forceReMount: 0,
    }
  },
  computed: {
    ...mapState({
      project: (state) => state.shared.sharedWorkspace,
      invoices: (state) => state.shared.allInvoices,
    }),
  },
  watch: {
    commentSuggestions(newValue) {
      if (this.review.phase.includes('Preliminary Health-Safety Review')) {
        if (newValue === 'achieved') {
          this.formData.review_comment =
            "<p>The WELL Health-Safety Preliminary review for your project has been completed and the results are available in the review report. A copy of the report has been uploaded to WELL Online. All attempted Features have been reviewed. In addition, a general observation regarding the application has been listed at the top of the first page with review comments.</p><p>Please review the comments contained in the report and note the requested clarifications. We recommend submitting for the Final Health-Safety Review within 25 business days.</p><p>The project has achieved at least 15 Features and if satisfied with the number of Features marked as Achieved, the Final WELL Health-Safety Review phase may be skipped. Please email <a class='text-primary-600'  href='mailto:WELL@gbci.org'>WELL@gbci.org</a> if you would like to accept the results as Final, and include the project name and number in the subject line.</p>"
        } else if (newValue === 'not_achieved') {
          this.formData.review_comment =
            '<p>The WELL Health-Safety Preliminary review for your project has been completed and the results are available in the review report. A copy of the report has been uploaded to WELL Online. All attempted Features have been reviewed. In addition, a general observation regarding the application has been listed at the top of the first page with review comments.</p><p>Please review the comments contained in the report and note the requested clarifications. We recommend submitting for the Final Health-Safety Review within 25 business days.</p>'
        }
      } else if (this.review.phase.includes('Final Health-Safety Review')) {
        if (newValue === 'achieved') {
          this.formData.review_comment =
            '<p>The Final Health-Safety Review has been completed. This report is available in WELL Online. I would like to extend our congratulations on your achievement of the WELL Health-Safety Rating!</p>'
        } else if (newValue === 'not_achieved') {
          this.formData.review_comment =
            '<p>The WELL Health-Safety Final Review for your project has been completed and the results are available in the review report. A copy of the report has been uploaded to WELL Online. All attempted Features have been reviewed. In addition, a general observation regarding the application has been listed at the top of the first page with review comments.</p><p>The project has one or more Features where the requirements have not been met. Please see the technical advice for those Features, and submit for Appeal Review with the required revisions.</p>'
        }
      } else if (this.review.phase.includes('Curative Action Plan Review')) {
        if (newValue === 'achieved') {
          this.formData.review_comment =
            '<p>The Curative Action Health-Safety Review has been completed. This report is available in WELL Online. I would like to extend our congratulations on your achievement of the WELL Health-Safety Rating!</p>'
        } else if (newValue === 'not_achieved') {
          this.formData.review_comment =
            '<p>The WELL Health-Safety Curative Action Review for your project has been completed and the results are available in the review report. A copy of the report has been uploaded to WELL Online. All appealed features have been reviewed. In addition, a general observation regarding the application has been listed at the top of the first page with review comments.</p><p>The project has one or more Features where the requirements have not been met. Please see the technical advice for those features and submit for Appeal Review with the required revisions.</p>'
        }
      }
      this.forceReMount++
    },
  },
  async mounted() {
    await this.$store.dispatch('shared/getSharedWorkspaceInvoiceList', {
      id: this.project.id,
    })
    this.formData.hsr_achieved_date = this.project.hsr_achieved_date
    this.formData.hsr_status = this.project.hsr_status
  },
  methods: {
    submitResponse() {
      const data = { ...this.review }
      data.documents = this.formData.documents
        ? this.formData.documents.map((e) => {
            return { link_s3: e.url }
          })
        : []
      data.general_observation = this.formData.general_observation
      data.hsr_achieved_date = this.formData.hsr_achieved_date
      data.hsr_status = this.formData.hsr_status
      data.payment_status = this.formData.payment_status
      data.phase = this.review.phase
      data.review_comment = this.formData.review_comment
      data.review_date = this.formData.review_date
      data.status = 'reviewed'
      data.notes = []
      data.id = this.review.id
      data.portfolio_id = this.project.id
      this.$store
        .dispatch('review/updatePortfolioReview', data)
        .then((response) => {
          this.$parent.$parent.getReviewDetails()
          this.$store.dispatch('shared/getSharedWorkspace', {
            id: this.$route.params.id,
          })
          this.$parent.toggleOpen()
        })
    },
  },
}
</script>
