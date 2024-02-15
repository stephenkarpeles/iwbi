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
      <div v-if="reviewStatus !== 'reviewed'" class="mb-5">
        <FormulateInput
          v-model="reviewStatus"
          :options="statusList"
          type="radio"
          label="Review Status"
        />
      </div>
      <div class="mb-5">
        <div class="flex items-end space-x-2">
          <span
            class="text-sm font-bold leading-5 text-gray-700 sm:mt-px sm:pt-2"
            >Portfolio Subscription Payment Status</span
          >
          <span
            v-if="portfolio.subscription_status"
            :class="`
              inline-flex
              items-center
              px-3
              py-0.5
              my-2
              md:my-0
              rounded-full
              text-sm
              font-medium
              ${subscriptionStatus.style}
            `"
          >
            {{ subscriptionStatus.text }}
          </span>
        </div>
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
      <div
        v-if="review.pre_status === 'reviewed'"
        class="overflow-hidden sm:rounded-lg sm:shadow mb-4"
      >
        <div class="bg-gray-100 px-4 py-5 border-b border-gray-200 sm:px-6">
          <h3 class="text-lg leading-6 font-medium text-gray-900">
            Preliminary Review
          </h3>
        </div>
        <div class="bg-white px-4 py-5 border-b border-gray-200 sm:px-6">
          <FormulateInput v-model="formData.review_comment" type="richtext" />
          <FormulateInput
            v-model="preliminaryDocumentsOutput"
            label="Documents"
            :value="preliminaryDocuments"
            type="fileupload"
            :upload-path="`portfolio/${portfolio.portfolio_number}/review/`"
            mime-types=""
          />
        </div>
      </div>
      <div
        v-if="review.status === 'reviewed'"
        class="overflow-hidden sm:rounded-lg sm:shadow mb-4"
      >
        <div class="bg-gray-100 px-4 py-5 border-b border-gray-200 sm:px-6">
          <h3 class="text-lg leading-6 font-medium text-gray-900">
            Final Review
          </h3>
        </div>
        <div class="bg-white px-4 py-5 border-b border-gray-200 sm:px-6">
          <FormulateInput
            v-model="formData.final_review_comment"
            type="richtext"
          />
          <FormulateInput
            v-model="finalRevDocumentsOutput"
            label="Documents"
            :value="finalRevDocuments"
            type="fileupload"
            :upload-path="`portfolio/${portfolio.portfolio_number}/review/`"
            mime-types=""
          />
        </div>
      </div>
      <div v-if="review.is_hsr === 1" class="mx-auto my-auto">
        <FormulateInput
          v-model="formData.hsr_phase"
          type="select"
          label="Please select HSR review phase"
          :options="[
            {
              value: 'Preliminary Health-Safety Review',
              label: 'Preliminary Health-Safety Review',
            },
            {
              value: 'Final Health-Safety Review',
              label: 'Final Health-Safety Review',
            },
            {
              value: 'Curative Action Plan Review',
              label: 'Curative Action Plan Review',
            },
          ]"
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
          Estimated Date of Review Completion *
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
      preliminaryDocuments: [],
      finalRevDocuments: [],
      preliminaryDocumentsOutput: [],
      finalRevDocumentsOutput: [],
      forceReRender: 0,
      reviewStatus: null,
      formData: null,
      documents: [],
      docSubmissionPhases: [
        {
          value: 'Preliminary Precertification Review',
          label: 'Precertification Preliminary Documentation Review',
        },
        {
          value: 'Final Precertification Review',
          label: 'Precertification Final Documentation Review',
        },
        { value: 'd&o', label: 'D&O documentation review' },
        { value: 'd&o-pre', label: 'Preliminary Design and operations review' },
        { value: 'd&o-final', label: 'Final Design and operations review' },
        {
          value: 'Preliminary documentation review',
          label: 'Preliminary documentation review',
        },
        {
          value: 'Final documentation review',
          label: 'Final documentation review',
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
        { value: 'Appeal review', label: 'Appeal review' },
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
      portfolio: (state) => state.portfolio.portfolio,
    }),
    subscriptionStatus() {
      switch (this.portfolio.subscription_status) {
        case 'active':
          return {
            text: 'Active',
            style: 'bg-green-100 text-green-800',
          }
        case 'expired':
          return {
            text: 'Expired',
            style: 'bg-red-100 text-red-800',
          }
        default:
          return {
            text: 'Not subscribed',
            style: 'bg-yellow-100 text-yellow-800',
          }
      }
    },
  },
  mounted() {
    this.formData = { ...this.review }

    // Filter documents
    this.preliminaryDocuments = this.formData.documents.filter(
      (a) => a.type === 'pre'
    )
    this.finalRevDocuments = this.formData.documents.filter(
      (a) => a.type === 'final'
    )

    this.reviewStatus = this.formData.status

    this.formData.hsr_achieved_date = this.portfolio.hsr_achieved_date
    this.formData.hsr_status = this.portfolio.hsr_status
    this.formData.hsr_phase = this.review.hsr_phase
  },
  methods: {
    submit() {
      const thisObj = this

      const data = { ...this.formData }

      data.status = this.reviewStatus

      data.portfolio_id = this.portfolio.id

      if (data.status === 'mid-review') {
        const noteObj = {
          description: data.note,
          communication_type: 'other',
        }
        data.notes = [noteObj]
      } else {
        data.notes = []
      }

      data.documents = []

      // format preliminary documents
      if (this.preliminaryDocumentsOutput.length) {
        if (this.preliminaryDocuments.length) {
          // compare two docs url
          this.preliminaryDocuments.forEach((doc) => {
            this.preliminaryDocumentsOutput.forEach((doc1) => {
              if (doc.link_s3 === doc1.url) {
                data.documents.push({
                  link_s3: doc.link_s3,
                  type: doc.type,
                  id: doc.id,
                })
              } else if (doc1.name) {
                data.documents.push({
                  link_s3: doc1.url,
                  type: 'pre',
                })
              }
            })
          })
        } else {
          this.preliminaryDocumentsOutput.forEach((doc) => {
            data.documents.push({
              link_s3: doc.url,
              type: 'pre',
            })
          })
        }
      }

      // format final documents
      if (this.finalRevDocumentsOutput.length) {
        if (this.finalRevDocuments.length) {
          // compare two docs url
          this.finalRevDocuments.forEach((doc) => {
            this.finalRevDocumentsOutput.forEach((doc1) => {
              if (doc.link_s3 === doc1.url) {
                data.documents.push({
                  link_s3: doc.link_s3,
                  type: doc.type,
                  id: doc.id,
                })
              } else if (doc1.name) {
                data.documents.push({
                  link_s3: doc1.url,
                  type: 'final',
                })
              }
            })
          })
        } else {
          this.finalRevDocumentsOutput.forEach((doc) => {
            data.documents.push({
              link_s3: doc.url,
              type: 'final',
            })
          })
        }
      }

      const unique = Array.from(
        new Set(data.documents.map((a) => a.link_s3))
      ).map((link) => {
        return data.documents.find((a) => a.link_s3 === link)
      })

      data.documents = unique

      this.$store.dispatch('review/updatePortfolioReview', data).then(
        (res) => (this.$parent.open = false),
        setTimeout(function () {
          thisObj.$parent.$parent.getReviewDetails()
          thisObj.$store.dispatch('review/getReviewList', thisObj.project.id)
          this.$store.dispatch('portfolio/getPortfolio', {
            id: this.$route.params.id,
          })
        }, 1200)
      )
    },
  },
}
</script>
