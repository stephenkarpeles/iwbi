<template>
  <div v-if="formData" class="px-5">
    <FormulateForm
      class="space-y-6 max-w-4xl mx-auto border rounded-md p-5"
      @submit="submit"
    >
      <div class="mb-5">
        <ClientOnly>
          <FormulateInput
            v-model="formData.comment"
            :disabled="reviewStatus === 'reviewed'"
            type="richtext"
            name="user-comment"
            label="User Comment"
            validation="required"
          />
        </ClientOnly>
      </div>
      <div class="mb-5">
        <ClientOnly>
          <FormulateInput
            v-model="formData.general_observation"
            type="richtext"
            name="user-comment"
            label="General Observation"
            validation="required"
          />
        </ClientOnly>
      </div>
      <div v-if="reviewStatus === 'reviewed'" class="mb-5">
        <ClientOnly>
          <FormulateInput
            v-model="formData.review_comment"
            type="richtext"
            name="user-comment"
            label="Review Comment"
            validation="required"
          />
        </ClientOnly>
      </div>
      <div v-if="reviewStatus === 'reviewed'" class="mb-5">
        <FormulateInput
          v-model="documents"
          label="Attach Document(s):"
          :value="documents"
          type="fileupload"
          :upload-path="`project/${project.project_number}/review/`"
          mime-types=""
        />
      </div>
      <div
        v-if="reviewStatus !== 'reviewed' && reviewStatus !== 'payment-pending'"
        class="mb-5"
      >
        <FormulateInput
          v-model="reviewStatus"
          :options="statusList"
          type="radio"
          label="Review Status"
        />
      </div>
      <div v-if="reviewStatus !== 'reviewed'" class="mb-5">
        <FormulateInput
          v-model="formData.payment_status"
          :options="paymentList"
          type="radio"
          label="Payment Status"
        />
      </div>
      <div v-if="reviewStatus === 'mid-review'" class="mb-5">
        <ClientOnly>
          <FormulateInput
            v-model="formData.note"
            type="richtext"
            name="Mid-Review Clarification Note"
            label="Mid-Review Clarification Note *"
            validation="required"
          />
        </ClientOnly>
      </div>
      <div class="mb-5">
        <FormulateInput
          v-model="hsrStatus"
          :options="[
            { label: 'N/A', value: '' },
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
      <div v-if="reviewStatus !== 'reviewed'" class="pb-5">
        <label
          for="formulate--projects-v2-dashboard-19512-126"
          class="
            inline
            text-sm
            font-bold
            leading-5
            text-gray-700
            sm:mt-px sm:pt-2
          "
        >
          Estimated Date of Review Completion
        </label>
        <div class="md:flex space-x-0 md:space-x-2">
          <FormulateInput
            v-model="formData.est_date"
            type="datetimepicker"
            placeholder="Estimate Date"
            max="9999-01-01"
            class="w-full"
            validation="required"
          />
          <div v-if="formData.est_date">
            <WButtonsBase
              icon="refresh"
              @click.native=";(formData.est_date = null), forceReRender++"
            >
              Clear
            </WButtonsBase>
          </div>
        </div>
      </div>
      <div class="text-right">
        <FormulateInput type="submit" label="Update" />
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
      required: true,
      default: () => {
        return {}
      },
    },
  },
  data() {
    return {
      forceReRender: 0,
      reviewStatus: null,
      hsrStatus: null,
      formData: {
        hsr_achieved_date: null,
      },
      docSubmitPhase: '',
      documents: [],
      docSubmissionPhases: [
        {
          value: 'Preliminary Precertification Review',
          label: 'Preliminary Precertification Review',
        },
        {
          value: 'Final Precertification Review',
          label: 'Final Precertification Review',
        },
        { value: 'd&o', label: 'D&O documentation review' },
        { value: 'd&o-pre', label: 'Preliminary Design and operations review' },
        { value: 'd&o-final', label: 'Final Design and operations review' },
        {
          value: 'Preliminary Documentation Review',
          label: 'Preliminary Documentation Review',
        },
        {
          value: 'Final Documentation Review',
          label: 'Final Documentation Review',
        },
        { value: 'pv', label: 'Performance Verification' },
        {
          value: 'Preliminary Performance Review',
          label: 'Preliminary Performance Review',
        },
        {
          value: 'Final Performance Review',
          label: 'Final Performance Review',
        },
        {
          value: 'Performance Verification Appeal Review',
          label: 'Performance Verification Appeal Review',
        },
        {
          value: 'Documentation Appeal Application',
          label: 'Documentation Appeal Application',
        },
        {
          value: 'Documentation Appeal Review',
          label: 'Documentation Appeal Review',
        },
        {
          value: 'Curative Action Plan Review',
          label: 'Curative Action Plan Review',
        },
        {
          label: 'Preliminary Health-Safety Review',
          value: 'Preliminary Health-Safety Review',
        },
        {
          label: 'Final Health-Safety Review',
          value: 'Final Health-Safety Review',
        },
      ],
      documentData: '',
      attachedDocuments: [],
      statusList: [
        { value: 'pending', label: 'Pending' },
        { value: 'mid-review', label: 'Needs Clarification' },
      ],
      paymentList: [
        { label: 'Unpaid', value: 'unpaid' },
        { label: 'Paid', value: 'paid' },
        { label: 'Waived', value: 'waived' },
      ],
      tempReviewValues: [],
    }
  },
  computed: {
    ...mapState({
      project: (state) => state.shared.sharedWorkspace,
    }),
  },
  mounted() {
    this.formData = JSON.parse(JSON.stringify(this.review))

    if (
      this.formData.project_documents &&
      this.formData.project_documents.length > 0
    ) {
      this.documents = this.formData.project_documents.map((element) => {
        return { name: element.name, url: element.link_s3 }
      })
    }

    this.reviewStatus = this.formData.status
    this.formData.hsr_achieved_date = this.project.hsr_achieved_date
    this.hsrStatus = this.project.hsr_status
  },
  methods: {
    submit() {
      const thisObj = this

      const data = { ...this.formData }

      data.status = this.reviewStatus
      data.hsr_status = this.hsrStatus

      if (data.status === 'mid-review') {
        const noteObj = {
          description: data.note,
          communication_type: 'other',
        }
        data.notes = [noteObj]
      } else {
        data.notes = []
      }

      if (data.review_date) {
        data.status = 'reviewed'
      }

      data.portfolio_id = this.project.id

      if (this.documents.length > 0) {
        data.documents = this.documents.map((element) => {
          return { link_s3: element.url }
        })
      }

      this.$store.dispatch('review/updatePortfolioReview', data).then(
        (res) => (this.$parent.open = false),
        setTimeout(function () {
          thisObj.$parent.$parent.getReviewDetails()
          thisObj.$store.dispatch(
            'review/getSharedReviewList',
            thisObj.project.id
          )
          thisObj.$store.dispatch('shared/getSharedWorkspace', {
            id: thisObj.$route.params.id,
          })
        }, 1200)
      )
    },
  },
}
</script>
