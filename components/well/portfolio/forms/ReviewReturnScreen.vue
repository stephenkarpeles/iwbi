<template>
  <div class="px-5">
    <FormulateForm
      class="space-y-6 max-w-4xl mx-auto border rounded-md p-5"
      @submit="submitResponse"
    >
      <div class="mb-5">
        <ClientOnly>
          <FormulateInput
            v-if="!review.pre_status"
            :key="forceReMount"
            v-model="formData.review_comment"
            type="richtext"
            name="Review Comment"
            label="Preliminary Review Comment *"
            validation="required"
          />
          <FormulateInput
            v-else
            :key="forceReMount"
            v-model="formData.final_review_comment"
            type="richtext"
            name="Review Comment"
            label="Final Review Comment *"
            validation="required"
          />
        </ClientOnly>
      </div>
      <div class="pb-5">
        <FormulateInput
          v-if="!review.pre_status"
          v-model="formData.review_date"
          type="datetimepicker"
          placeholder=""
          label="Preliminary Review Date *"
          max="9999-01-01"
          validation="required"
        />
        <FormulateInput
          v-else
          v-model="formData.final_review_date"
          type="datetimepicker"
          placeholder=""
          label="Final Review Date *"
          max="9999-01-01"
          validation="required"
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
          :upload-path="`portfolio/${portfolio.portfolio_number}/review/`"
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
        phase: null,
        review_comment: null,
        review_date: new Date(),
        final_review_date: new Date(),
      },
      commentSuggestions: null,
      forceReMount: 0,
    }
  },
  computed: {
    ...mapState({
      portfolio: (state) => state.portfolio.portfolio,
      invoices: (state) => state.shared.allInvoices,
    }),
  },
  methods: {
    submitResponse() {
      const data = { ...this.review }

      data.general_observation = this.formData.general_observation
      data.hsr_achieved_date = this.formData.hsr_achieved_date
      data.hsr_status = this.formData.hsr_status
      data.phase = this.review.phase

      if (this.review.pre_status) {
        data.status = 'reviewed'
        data.final_review_comment = this.formData.final_review_comment
        data.final_review_date = this.formData.final_review_date
      } else {
        data.status = 'pre-reviewed'
        data.review_comment = this.formData.review_comment
        data.review_date = this.formData.review_date
      }
      data.documents = this.formData.documents
        ? this.formData.documents.map((e) => {
            return {
              link_s3: e.url,
              type: data.status === 'pre-reviewed' ? 'pre' : 'final',
            }
          })
        : []
      const documents = this.review.documents
        ? this.review.documents.map((e) => {
            return { link_s3: e.link_s3, type: e.type }
          })
        : []
      data.documents = data.documents.concat(documents)
      data.notes = []
      data.id = this.review.id
      data.portfolio_id = this.portfolio.id

      this.$store
        .dispatch('review/updatePortfolioReview', data)
        .then((response) => {
          this.$store.dispatch('portfolio/getPortfolio', {
            id: this.$route.params.id,
          })
          this.$parent.$parent.getReviewDetails()
          this.$parent.toggleOpen()
        })
    },
  },
}
</script>
