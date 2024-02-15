<template>
  <div v-if="formData" class="px-5">
    <FormulateForm
      class="space-y-6 max-w-4xl mx-auto border rounded-md p-5"
      @submit="submit"
    >
      <div v-if="currentUser.role.includes('well-admin')" class="mb-5">
        <FormulateInput
          v-model="formData.phase"
          type="select"
          name="doc-submit-phase"
          label="Please select the project phase you want to submit documentation for"
          placeholder="Select option"
          :options="reviewOptions"
          validation="required"
        />
      </div>
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
      <div class="bg-white sm:rounded-lg sm:shadow mb-4">
        <div
          class="bg-white px-0 md:px-4 py-5 border-b border-gray-200 sm:px-6"
        >
          <h3 class="text-lg leading-6 font-medium text-gray-900">
            Concepts Observations
          </h3>
        </div>
        <div
          class="bg-white px-0 md:px-4 py-5 border-b border-gray-200 sm:px-6"
        >
          <div class="mb-5">
            <FormulateInput
              v-model="conceptSelected"
              type="multi"
              label="Concepts"
              name="conceptList"
              :options="conceptList"
              :multiple="true"
            />
          </div>
          <div v-for="concept in conceptObservations" :key="concept.concept">
            <div v-if="concept.show" class="mb-5">
              <FormulateInput
                v-model="concept.general_observation"
                type="textarea"
                :label="concept.concept + ' Observation'"
                :name="concept.concept + '-observation'"
              />
            </div>
          </div>
        </div>
      </div>
      <div
        v-if="review.is_hsr"
        class="overflow-hidden sm:rounded-lg sm:shadow mb-4"
      >
        <div class="bg-gray-100 px-4 py-5 border-b border-gray-200 sm:px-6">
          <h3 class="text-lg leading-6 font-medium text-gray-900">
            HSR Review
          </h3>
        </div>
        <div
          class="bg-white px-0 md:px-4 py-5 border-b border-gray-200 sm:px-6 flex space-y-5 flex-col"
        >
          <ClientOnly>
            <FormulateInput
              v-model="formData.hsr_review_comment"
              type="richtext"
              name="HSR Review Comment"
              label="HSR Review Comment"
            />
          </ClientOnly>
          <FormulateInput
            v-model="hsr_docs_output"
            label="Attach Document(s):"
            :value="hsrDocs"
            type="fileupload"
            :upload-path="`project/${project.project_number}/review/`"
            mime-types=""
          />
        </div>
      </div>
      <div class="overflow-hidden sm:rounded-lg sm:shadow mb-4">
        <div class="bg-gray-100 px-4 py-5 border-b border-gray-200 sm:px-6">
          <h3 class="text-lg leading-6 font-medium text-gray-900">Review</h3>
        </div>
        <div
          class="bg-white px-0 md:px-4 py-5 border-b border-gray-200 sm:px-6 flex space-y-5 flex-col"
        >
          <ClientOnly>
            <FormulateInput
              v-model="formData.review_comment"
              type="richtext"
              name="user-comment"
              label="Review Comment"
              validation="required"
            />
          </ClientOnly>
          <FormulateInput
            v-model="documents_output"
            label="Attach Document(s):"
            :value="documents"
            type="fileupload"
            :upload-path="`project/${project.project_number}/review/`"
            mime-types=""
          />
        </div>
      </div>
      <div class="mb-5">
        <FormulateInput
          v-model="formData.project_phase"
          type="select"
          name="doc-submit-phase"
          label="Please select the project phase"
          placeholder="Select option"
          :options="docSubmissionPhases"
        />
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
      <div
        v-if="
          !review.phase.includes('Performance Review') &&
          reviewStatus !== 'reviewed'
        "
        class="mb-5"
      >
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
      <div v-if="formData.phase === 'Final Health-Safety Review'" class="mb-5">
        <FormulateInput
          v-model="formData.hsr_status"
          :options="[
            { label: 'N/A', value: '' },
            { label: 'Achieved', value: 'achieved' },
            { label: 'Not Achieved', value: 'not_achieved' },
          ]"
          type="radio"
          label="WELL Health Safety"
        />
      </div>

      <div v-if="formData.phase === 'Final Health-Safety Review'" class="mb-5">
        <FormulateInput
          v-model="formData.hsr_achieved_date"
          type="datetimepicker"
          label="WELL Health Safety Awarded Date"
        />
      </div>
      <div v-if="reviewStatus !== 'reviewed'" class="pb-5">
        <label
          for="formulate--projects-v2-dashboard-19512-126"
          class="inline text-sm font-bold leading-5 text-gray-700 sm:mt-px sm:pt-2"
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
      formData: { project_phase: null },
      docSubmitPhase: '',
      hsrDocs: [],
      hsr_docs_output: [],
      documents: [],
      documents_output: [],

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
      statusList: [
        { value: 'pending', label: 'Pending' },
        { value: 'mid-review', label: 'Needs Clarification' },
      ],
      paymentList: [
        { label: 'Unpaid', value: 'unpaid' },
        { label: 'Paid', value: 'paid' },
        { label: 'Waived', value: 'waived' },
      ],
      conceptSelected: [],
      conceptObservations: [
        {
          concept: 'Air',
          general_observation: '',
          show: false,
        },
        {
          concept: 'Water',
          general_observation: '',
          show: false,
        },
        {
          concept: 'Nourishment',
          show: false,
          general_observation: '',
        },
        {
          concept: 'Light',
          general_observation: '',
          show: false,
        },
        {
          concept: 'Movement',
          general_observation: '',
          show: false,
        },
        {
          concept: 'Thermal Comfort',
          general_observation: '',
          show: false,
        },
        {
          concept: 'Sound',
          general_observation: '',
          show: false,
        },
        {
          concept: 'Materials',
          general_observation: '',
          show: false,
        },
        {
          concept: 'Mind',
          general_observation: '',
          show: false,
        },
        {
          concept: 'Community',
          general_observation: '',
          show: false,
        },
        {
          concept: 'Innovation',
          general_observation: '',
          show: false,
        },
      ],
      conceptList: [
        'Air',
        'Water',
        'Nourishment',
        'Light',
        'Movement',
        'Thermal Comfort',
        'Sound',
        'Materials',
        'Mind',
        'Community',
        'Innovation',
      ],
    }
  },
  computed: {
    ...mapState({
      project: (state) => state.project.project,
      currentUser: (state) => state.user.currentUser,
      reviewSelectOptions: (state) => state.review.reviewSelectOptions,
      recertificationList: (state) => state.recertification.recertificationList,
    }),
    recertification() {
      let recertification = ''
      if (this.recertificationList.length !== 0) {
        const lastrecertification = this.recertificationList.length - 1
        recertification = this.recertificationList[lastrecertification]
      }
      return recertification
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

      return options
    },
  },
  watch: {
    conceptSelected(value) {
      this.conceptList.forEach((e) => {
        const index = this.conceptObservations.findIndex((a) => a.concept === e)
        if (
          value &&
          value.length &&
          value.filter((a) => a.value === e).length
        ) {
          this.conceptObservations[index].show = true
        } else {
          this.conceptObservations[index].show = false
          this.conceptObservations[index].general_observation = ''
        }
      })
    },
  },
  mounted() {
    this.formData = { ...this.formData, ...this.review }
    this.formData.project_phase = this.project.project_phase
    if (
      this.formData.project_documents &&
      this.formData.project_documents.length > 0
    ) {
      this.formData.project_documents.forEach((doc) => {
        if (doc.type === 'hsr') {
          this.hsrDocs.push(doc)
        } else {
          this.documents.push(doc)
        }
      })
    }
    if (
      this.formData.general_observation_concepts &&
      this.formData.general_observation_concepts.length > 0
    ) {
      this.formData.general_observation_concepts.forEach((e) => {
        this.conceptSelected.push({
          label: e.concept,
          value: e.concept,
        })
        const index = this.conceptObservations.findIndex(
          (a) => a.concept === e.concept
        )
        this.conceptObservations[index].general_observation =
          e.general_observation
      })
    }
    this.reviewStatus = this.formData.status
    this.formData.hsr_achieved_date = this.project.hsr_achieved_date
    this.formData.hsr_status = this.project.hsr_status
    this.formData.hsr_phase = this.review.hsr_phase
  },
  methods: {
    submit() {
      const thisObj = this

      const data = { ...this.formData }

      data.status = this.reviewStatus

      if (data.review_date) {
        data.status = 'reviewed'
      }

      data.documents = []

      if (this.documents_output.length) {
        if (this.documents.length) {
          // compare two docs url
          this.documents.forEach((doc) => {
            this.documents_output.forEach((doc1) => {
              if (doc.link_s3 === doc1.url) {
                data.documents.push({
                  link_s3: doc.link_s3,
                  type: doc.type,
                  id: doc.id,
                })
              } else if (doc1.name) {
                data.documents.push({
                  link_s3: doc1.url,
                  type: 'general',
                })
              }
            })
          })
        } else {
          this.documents_output.forEach((doc) => {
            data.documents.push({
              link_s3: doc.url,
              type: 'general',
            })
          })
        }
      }

      if (this.hsr_docs_output.length) {
        if (this.hsrDocs.length) {
          // compare two docs url
          this.hsrDocs.forEach((doc) => {
            this.hsr_docs_output.forEach((doc1) => {
              if (doc.link_s3 === doc1.url) {
                data.documents.push({
                  link_s3: doc.link_s3,
                  type: doc.type,
                  id: doc.id,
                })
              } else if (doc1.name) {
                data.documents.push({
                  link_s3: doc1.url,
                  type: 'hsr',
                })
              }
            })
          })
        } else {
          this.hsr_docs_output.forEach((doc) => {
            data.documents.push({
              link_s3: doc.url,
              type: 'hsr',
            })
          })
        }
      }

      // if (this.documents.length > 0) {
      //   data.documents = this.documents.map((element) => {
      //     return { link_s3: element.url }
      //   })
      // }

      const unique = Array.from(
        new Set(data.documents.map((a) => a.link_s3))
      ).map((link) => {
        return data.documents.find((a) => a.link_s3 === link)
      })

      data.documents = unique

      let conceptObservations = this.conceptObservations.filter((a) => a.show)

      conceptObservations = conceptObservations.map((e) => {
        return {
          concept: e.concept,
          general_observation: e.general_observation,
        }
      })
      if (this.formData.phase.includes('Performance Review')) {
        data.payment_status = 'paid'
      }

      data.general_observation_concepts = conceptObservations
      this.$store.dispatch('review/updateReview', data).then(
        (res) => (this.$parent.open = false),
        setTimeout(function () {
          thisObj.$parent.$parent.getReviewDetails()
          thisObj.$store.dispatch('review/getReviewList', thisObj.project.id)
          thisObj.$store.dispatch(
            'project/getProjectByNumber',
            thisObj.project.project_number
          )
        }, 1200)
      )
    },
  },
}
</script>
