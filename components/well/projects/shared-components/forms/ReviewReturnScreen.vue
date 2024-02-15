<template>
  <div class="px-5">
    <WFeedbackModal ref="modal" class="ml-0 md:ml-10">
      <div class="overflow-x-scroll">
        <table
          class="w-full divide-y divide-gray-200 ring-1 rounded-lg shadow-lg ring-gray-200"
        >
          <thead>
            <tr>
              <th
                class="px-6 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider"
              >
                Invoice ID
              </th>
              <th
                class="px-6 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider"
              >
                Description
              </th>
              <th
                class="px-6 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider"
              >
                Amount
              </th>
              <th
                class="px-6 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider"
              >
                Created
              </th>
              <th
                class="px-6 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider"
              >
                Status
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="(invoice, index) in invoices" :key="index">
              <td class="px-6 py-4 whitespace-nowrap">
                <div
                  class="cursor-pointer text-primary-500 text-bold text-sm leading-5 uppercase"
                  @click="
                    $router.push({
                      path: `/invoice/${invoice.invoice_number}/?redirect=/projects/${project.type}/${project.project_number}/reviews`,
                      query: { ...$route.query },
                    })
                  "
                >
                  {{ invoice.invoice_number }}
                </div>
              </td>
              <td class="px-6 py-4">
                <div class="text-sm leading-5 text-gray-900 uppercase">
                  {{ invoice.description }}
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm leading-5 text-gray-900">
                  ${{ invoice.amount_sum | formatNumber }}
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm leading-5 text-gray-900">
                  {{ $dayjs(invoice.created_date).format('MMM DD, YYYY') }}
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                {{ invoice.status }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </WFeedbackModal>
    <FormulateForm
      class="space-y-6 max-w-4xl mx-auto border rounded-md p-5"
      name="returnReview"
      @submit="submitResponse"
    >
      <div
        v-if="
          review.phase === 'Preliminary Health-Safety Review' ||
          review.phase === 'Final Health-Safety Review'
        "
        class="mb-5"
      >
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
      <div class="overflow-hidden sm:rounded-lg sm:shadow mb-4">
        <div class="bg-gray-100 px-4 py-5 border-b border-gray-200 sm:px-6">
          <h3 class="text-md leading-6 font-bold text-gray-900">Review</h3>
        </div>
        <div
          class="bg-white px-4 py-5 border-b border-gray-200 sm:px-6 flex space-y-5 flex-col"
        >
          <FormulateInput
            v-if="showReviewCommentSuggestionDropdown"
            v-model="reviewCommentSuggestion"
            :options="reviewCommentSuggestionList"
            placeholder="select review comment Suggestions"
            type="select"
            label="Review Comment Suggestions"
          />
          <ClientOnly>
            <FormulateInput
              :key="forceReMount"
              ref="reviewComment"
              v-model="reviewComment"
              type="richtext"
              label="Review Comment*"
            />
          </ClientOnly>

          <FormulateInput
            v-model="formData.review_date"
            type="datetimepicker"
            placeholder=""
            label="Review Date*"
            max="9999-01-01"
            validation="required"
          />

          <FormulateInput
            :key="forceReMount + 1"
            v-model="documentsOutput"
            :value="documents"
            label="Attach Document(s):"
            type="fileupload"
            :upload-path="`project/${project.project_number}/review/`"
            mime-types=""
          />
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
          class="bg-white px-4 py-5 border-b border-gray-200 sm:px-6 flex space-y-5 flex-col"
        >
          <ClientOnly>
            <FormulateInput
              :key="forceReMount + 2"
              v-model="formData.hsr_review_comment"
              type="richtext"
              name="HSR Review Comment"
              label="HSR Review Comment"
            />
          </ClientOnly>
          <FormulateInput
            :key="forceReMount + 3"
            v-model="formData.hsr_review_date"
            type="datetimepicker"
            placeholder=""
            label="HSR Review Date"
            max="9999-01-01"
          />
          <FormulateInput
            :key="forceReMount + 4"
            v-model="hsrDocsOutput"
            :value="hsrDocs"
            label="Attach Document(s):"
            type="fileupload"
            :upload-path="`project/${project.project_number}/review/`"
            mime-types=""
          />
        </div>
      </div>
      <div v-if="review.phase === 'Final Health-Safety Review'" class="mb-5">
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
      <div v-if="review.phase === 'Final Health-Safety Review'" class="mb-5">
        <FormulateInput
          v-model="formData.hsr_achieved_date"
          type="datetimepicker"
          label="WELL Health Safety Awarded Date"
        />
      </div>
      <div class="mb-5">
        <FormulateInput
          v-model="formData.project_phase"
          type="select"
          name="doc-submit-phase"
          label="Please select the next project phase"
          placeholder="Select option"
          :options="docSubmissionPhases"
        />
      </div>
      <div
        v-if="
          formData.project_phase === 'Certification Decision' ||
          formData.project_phase === 'D&O Decision' ||
          formData.project_phase === 'Precertification Decision'
        "
        class="w-full"
      >
        <div class="bg-white overflow-hidden sm:rounded-lg sm:shadow mb-4">
          <div class="bg-white px-4 py-5 border-b border-gray-200 sm:px-6">
            <h3 class="text-lg leading-6 font-medium text-gray-900">
              What would the achievement level be if the project team accepted
              the result?
            </h3>
          </div>
          <div class="bg-white px-4 py-5 border-b border-gray-200 sm:px-6">
            <div v-if="project.type === 'v1'">
              <FormulateInput
                v-if="
                  project.v1_project_standard === 'community' &&
                  formData.project_phase !== 'Certification Decision'
                "
                v-model="formData.pre_cert_status"
                type="select"
                label="Project Precertification status"
                name="pre_cert_status"
                :options="[
                  { value: 'na', label: 'N/A' },
                  { value: 'Compliance', label: 'Achieved' },
                ]"
              />
              <FormulateInput
                v-else-if="
                  project.v1_project_standard !== 'community' &&
                  formData.project_phase !== 'Certification Decision'
                "
                v-model="formData.pre_cert_status"
                type="select"
                label="Project Precertification status"
                name="pre_cert_status"
                :options="[
                  { value: 'na', label: 'N/A' },
                  { value: 'Compliance', label: 'Compliance' },
                  { value: 'Silver', label: 'Silver' },
                  { value: 'Gold', label: 'Gold' },
                  { value: 'Platinum', label: 'Platinum' },
                  { value: 'Pilot', label: 'Pilot' },
                ]"
              />
              <FormulateInput
                v-if="formData.project_phase === 'Certification Decision'"
                v-model="formData.cert_status"
                type="select"
                label="Project certification status"
                name="cert_status"
                :options="[
                  { value: 'na', label: 'N/A' },
                  { value: 'Compliance', label: 'Compliance' },
                  { value: 'Silver', label: 'Silver' },
                  { value: 'Gold', label: 'Gold' },
                  { value: 'Platinum', label: 'Platinum' },
                  { value: 'Pilot', label: 'Pilot' },
                ]"
              />
            </div>
            <div v-else>
              <FormulateInput
                v-if="formData.project_phase !== 'Certification Decision'"
                v-model="formData.pre_cert_status"
                type="select"
                label="Project Precertification status"
                name="pre_cert_status"
                :options="projectPreCertStatus"
              />
              <FormulateInput
                v-else
                v-model="formData.cert_status"
                type="select"
                label="Project certification status"
                name="cert_status"
                :options="projectCertStatus"
              />
            </div>
          </div>
        </div>
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
      <div class="bg-white sm:rounded-lg sm:shadow mb-4">
        <div class="bg-white px-4 py-5 border-b border-gray-200 sm:px-6">
          <h3 class="text-lg leading-6 font-medium text-gray-900">
            Concepts Observations
          </h3>
        </div>
        <div class="bg-white px-4 py-5 border-b border-gray-200 sm:px-6">
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
      <div v-if="!review.phase.includes('Performance Review')" class="mb-5">
        <div class="flex">
          <label
            for="formulate--projects-v2-2202120380-reviews-7"
            class="text-sm font-bold leading-5 text-gray-700 sm:mt-px sm:pt-2"
          >
            Payment Status
          </label>
          <WLinksBase
            class="mt-0 md:mt-1.5 ml-2"
            @click.native="$refs.modal.isHidden = false"
          >
            View invoices
          </WLinksBase>
        </div>
        <FormulateInput
          v-model="formData.payment_status"
          :options="paymentList"
          type="radio"
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
      hsrDocs: [],
      hsrDocsOutput: [],
      documents: [],
      documentsOutput: [],
      conceptSelected: [],
      reviewCommentSuggestion: '',
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
      formData: {
        comment: null,
        general_observation: this.review.general_observation,
        hsr_achieved_date: null,
        hsr_status: null,
        payment_status: 'unpaid',
        phase: null,
        review_comment: null,
        review_date: null,
        project_phase: null,
      },
      reviewComment: '',
      paymentList: [
        { label: 'Unpaid', value: 'unpaid' },
        { label: 'Paid', value: 'paid' },
        { label: 'Waived', value: 'waived' },
      ],
      docSubmissionPhases: [
        { value: 'na', label: 'N/A' },
        {
          value: 'D&O Preliminary Documentation Review',
          label: 'D&O Preliminary Documentation Review',
        },
        { value: 'D&O Final Application', label: 'D&O Final Application' },
        {
          value: 'D&O Final Documentation Review',
          label: 'D&O Final Documentation Review',
        },
        { value: 'D&O Decision', label: 'D&O Decision' },
        {
          value: 'Preliminary Precertification Application',
          label: 'Preliminary Precertification Application',
        },
        {
          value: 'Preliminary Precertification Review',
          label: 'Preliminary Precertification Review',
        },
        {
          value: 'Final Precertification Application',
          label: 'Final Precertification Application',
        },
        {
          value: 'Final Precertification Review',
          label: 'Final Precertification Review',
        },
        {
          value: 'Precertification Decision',
          label: 'Precertification Decision',
        },
        {
          value: 'Preliminary Documentation Application',
          label: 'Preliminary Documentation Application',
        },
        {
          value: 'Preliminary Documentation Review',
          label: 'Preliminary Documentation Review',
        },
        {
          value: 'Final Documentation Application',
          label: 'Final Documentation Application',
        },
        {
          value: 'Final Documentation Review',
          label: 'Final Documentation Review',
        },
        {
          value: 'Documentation Review Complete',
          label: 'Documentation Review Complete',
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
          value: 'Performance Verification Scheduling on Hold',
          label: 'Performance Verification Scheduling on Hold',
        },
        {
          value: 'Performance Verification Scheduling In Progress',
          label: 'Performance Verification Scheduling In Progress',
        },
        {
          value: 'Performance Verification Scheduled',
          label: 'Performance Verification Scheduled',
        },
        {
          value:
            'Performance Testing in progress with independent Performance Testing Agent',
          label:
            'Performance Testing in progress with independent Performance Testing Agent',
        },
        {
          value: 'Preliminary Performance Review',
          label: 'Preliminary Performance Review',
        },
        {
          value: 'Final Performance Review Application',
          label: 'Final Performance Review Application',
        },
        {
          value: 'Final Performance Review',
          label: 'Final Performance Review',
        },
        {
          value: 'Performance Verification',
          label: 'Performance Verification',
        },
        {
          value: 'Performance Verification Appeal Application',
          label: 'Performance Verification Appeal Application',
        },
        {
          value: 'Performance Verification Appeal Review',
          label: 'Performance Verification Appeal Review',
        },
        {
          value: 'Curative Action Plan Application',
          label: 'Curative Action Plan Application',
        },
        {
          value: 'Curative Action Plan Review',
          label: 'Curative Action Plan Review',
        },
        { value: 'Certification Decision', label: 'Certification Decision' },
        {
          value: 'Final WELL Report',
          label: 'Final WELL Report',
        },
        {
          value: 'Preliminary Health-Safety Review',
          label: 'Preliminary Health-Safety Review',
        },
        {
          value: 'Final Health-Safety Application',
          label: 'Final Health-Safety Application',
        },
        {
          value: 'Final Health-Safety Review',
          label: 'Final Health-Safety Review',
        },
        {
          value: 'Final Health-Safety Rating Achieved',
          label: 'Final Health-Safety Rating Achieved',
        },
        {
          value: 'Final Health-Safety Rating Appeal',
          label: 'Final Health-Safety Rating Appeal',
        },
      ],
      docSubmitPhase: '',
      commentSuggestions: null,
      forceReMount: 0,
      projectPreCertStatus: [
        { value: 'na', label: 'N/A' },
        { value: 'Compliance', label: 'Achieved' },
      ],
      projectCertStatus: [
        { value: 'na', label: 'N/A' },
        { value: 'Compliance', label: 'Compliance' },
        { value: 'Bronze', label: 'Bronze' },
        { value: 'Silver', label: 'Silver' },
        { value: 'Gold', label: 'Gold' },
        { value: 'Platinum', label: 'Platinum' },
        { value: 'Pilot', label: 'Pilot' },
      ],
    }
  },
  computed: {
    ...mapState({
      project: (state) => state.project.project,
      invoices: (state) => state.project.projectInvoices,
    }),
    reviewCommentSuggestionList() {
      let comments = []
      if (this.review.phase.includes('Preliminary Precertification')) {
        comments = [
          {
            label: 'Preconditions Pending',
            value:
              '<p>This review phase has been completed and the report is available in WELL Online. All attempted Preconditions and Optimizations have been reviewed. In addition, a general observation regarding the application have been listed at the top of the first page with review comments. <br/> Please review the comments contained in the report and note the requested clarifications. We recommend submitting for the Final Precertification Review within 25 business days.</p>',
          },
          {
            label: 'All Preconditions Anticipated',
            value: `
              <p>
              This review phase has been completed and the results are available in WELL Online. On behalf of the Green Business Certification Inc., I would like to extend our congratulations on your achievement of the Precertification designation under the WELL Building Standard.
              <br/>
              If the project would like to appeal to pursue additional features or parts or challenge any findings in the report, please select “Appeal” from the “Initiate Action” button that is located on the review page within 180 days.
              </p>`,
          },
        ]
      } else if (this.review.phase.includes('Final Precertification')) {
        comments = [
          {
            label: 'All Preconditions Anticipated',
            value:
              '<p>This review phase has been completed and the results are available in WELL Online. On behalf of the Green Business Certification Inc., I would like to extend our congratulations on your achievement of the Precertification designation under the WELL Building Standard. <br/> If the project would like to appeal to pursue additional features or parts or challenge any findings in the report, please select “Appeal” from the “Initiate Action” button that is located on the review page within 180 days.</p>',
          },
          {
            label: 'Preconditions Not Anticipated',
            value:
              '<p>This review phase has been completed and the report is available in WELL Online. All attempted Preconditions and Optimizations have been reviewed. In addition, a general observation regarding the application have been listed at the top of the first page with review comments. <br> The project has one or more Preconditions where the requirements have not been met. Please see the technical advice for those features and submit for Appeal Review with the required revisions.</p>',
          },
        ]
      } else if (this.review.phase.includes('Preliminary Documentation')) {
        comments = [
          {
            label: 'Preconditions Pending Documentation',
            value: ` <p>
        This review phase has been completed and the report is available in WELL Online. All attempted Preconditions and Optimizations have been reviewed. In addition, a general observation regarding the application has been listed at the top of the first page with review comments.
        <br>
        Please review the comments contained in the report and note the requested clarifications. We recommend submitting for the Final Documentation Review within 25 business days.
    </p>`,
          },
          {
            label: 'No Preconditions Pending Documentation ',
            value: `
              <p>
                This review phase has been completed and the report is available in WELL Online. All attempted Preconditions and Optimizations have been reviewed. In addition, a general observation regarding the application has been listed at the top of the first page with review comments.
                <br>
                Please review the comments contained in the report and note the requested clarifications. We recommend submitting for the Final Documentation Review within 25 business days.
                <br>
                If the project is satisfied with the number of Optimizations marked as anticipated, the Final Documentation Review phase may be skipped, and the project may submit a request for Performance Verification by completing the request form and checking GBCI's availability at <a href="https://fs11.formsite.com/qOUDrr/WELLPerformanceTesting/index.html">https://fs11.formsite.com/qOUDrr/WELLPerformanceTesting/index.html</a> 
                Note that additional changes to the Documentation will result in the Performance Verification planning process to be put on hold.
              </p>
              `,
          },
        ]
      } else if (this.review.phase.includes('Final Documentation')) {
        comments = [
          {
            label: 'No Preconditions Pending Documentation',
            value:
              this.project.type === 'v1'
                ? `
              <p>
        This review phase has been completed and the report is available in WELL Online. All attempted Preconditions and Optimizations have been reviewed. In addition, a general observation regarding the application has been listed at the top of the first page with review comments.
        <br>
        If the project has achieved all Preconditions and is satisfied with the number of Optimizations marked as anticipated, the next step is to schedule Performance Verification with GBCI or an approved performance testing agent. To request performance testing by GBCI, complete the request form and check GBCI's availability at <a href="https://fs11.formsite.com/qOUDrr/WELLPerformanceTesting/index.html">https://fs11.formsite.com/qOUDrr/WELLPerformanceTesting/index.html</a>
        The fees listed on the Pricing tab of WELL Online for your project are for GBCI to conduct onsite performance testing and data collection. 
    </p>`
                : `
              <p>
        This review phase has been completed and the report is available in WELL Online. All attempted Preconditions and Optimizations have been reviewed. In addition, a general observation regarding the application has been listed at the top of the first page with review comments.
        <br>
        If the project has achieved all Preconditions and is satisfied with the number of Optimizations marked as anticipated, the next step is to schedule Performance Verification with GBCI or an approved performance testing agent. To request performance testing by GBCI, complete the request form and check GBCI's availability at <a href="https://fs11.formsite.com/qOUDrr/WELLPerformanceTesting/index.html">https://fs11.formsite.com/qOUDrr/WELLPerformanceTesting/index.html</a>
        The fees listed on the Pricing tab of WELL Online for your project are for GBCI to conduct onsite performance testing and data collection. Alternatively, projects may elect to directly contract with local qualified performance testing agents to perform this work. A list of qualified performance testing organizations and performance testing agents can be found at <a href="https://www.wellcertified.com/en/performance-testing">https://www.wellcertified.com/en/performance-testing</a>
    </p>`,
          },
          {
            label: 'Preconditions Pending Documentation',
            value: `<p>
        This review phase has been completed and the report is available in WELL Online. All attempted Preconditions and Optimizations have been reviewed. In addition, a general observation regarding the application have been listed at the top of the first page with review comments. 
        <br>
        The project has one or more Preconditions where the requirements have not been met. Please see the technical advice for those features and submit for Appeal Review with the required revisions.
    </p>`,
          },
        ]
      } else if (
        this.review.phase.includes('Appeal') ||
        this.review.phase.includes('Action Plan')
      ) {
        comments = [
          {
            label: 'Preconditions Pending Documentation',
            value: `
                <p>
        This review phase has been completed and the results are available WELL Online. All appealed Preconditions and Optimizations have been reviewed. In addition, a general observation regarding the application has been listed at the top of the first page with review comments.
        <br>
        The project has one or more Preconditions where the requirements have not been met. Please see the technical advice for those features and submit for Appeal Review with the required revisions.
    </p>
              `,
          },
          {
            label: 'Preconditions Pending PV (Initial PV needed)',
            value:
              this.project.type === 'v1'
                ? `
              <p>
        This review phase has been completed and the results are available WELL Online. All appealed Preconditions and Optimizations have been reviewed. In addition, a general observation regarding the application has been listed at the top of the first page with review comments.
        <br>
        If the project has achieved all Preconditions and is satisfied with the number of Optimizations marked as anticipated, the next step is to schedule Performance Verification with GBCI or an approved performance testing agent. To request performance testing by GBCI, complete the request form and check GBCI's availability at <a href="https://fs11.formsite.com/qOUDrr/WELLPerformanceTesting/index.html">https://fs11.formsite.com/qOUDrr/WELLPerformanceTesting/index.html</a>
        <br>
        The fees listed on the Pricing tab of WELL Online for your project are for GBCI to conduct onsite performance testing and data collection.
    </p>
              `
                : `
              <p>
        This review phase has been completed and the results are available WELL Online. All appealed Preconditions and Optimizations have been reviewed. In addition, a general observation regarding the application has been listed at the top of the first page with review comments.
        <br>
        If the project has achieved all Preconditions and is satisfied with the number of Optimizations marked as anticipated, the next step is to schedule Performance Verification with GBCI or an approved performance testing agent. To request performance testing by GBCI, complete the request form and check GBCI's availability at <a href="https://fs11.formsite.com/qOUDrr/WELLPerformanceTesting/index.html">https://fs11.formsite.com/qOUDrr/WELLPerformanceTesting/index.html</a>
        <br>
        The fees listed on the Pricing tab of WELL Online for your project are for GBCI to conduct onsite performance testing and data collection. Alternatively, projects may elect to directly contract with local qualified performance testing agents to perform this work. A list of qualified performance testing organizations and performance testing agents can be found at <a href="https://www.wellcertified.com/en/performance-testing">https://www.wellcertified.com/en/performance-testing</a>  
    </p>
              `,
          },
          {
            label: 'Preconditions Pending PV (Initial PV completed)',
            value: `
              <p>
        This review phase has been completed and the results are available WELL Online. All appealed Preconditions and Optimizations have been reviewed. In addition, a general observation regarding the application has been listed at the top of the first page with review comments.
        <br>
        To guide you through the next steps, please complete the following form within 180 days after the issuance of the WELL Final Report once the curative actions are planned or completed:  <a href="https://fs11.formsite.com/qOUDrr/CurativeAction/index.html">https://fs11.formsite.com/qOUDrr/CurativeAction/index.html</a>
If retesting is required, the project team has the option to elect GBCI to conduct the performance testing or contract with an approved performance testing organization. Additional information regarding the curative action process is available in the WELL Certification Guidebook.
    </p>
              `,
          },
          {
            label: 'Initial Certification - Project can be certified',
            value: `
              <p>
        This review phase has been completed and the results are available in WELL Online. The Final WELL Report has been completed. This report is available in WELL Online. On behalf of the Green Business Certification Inc., I would like to extend our congratulations on your achievement of Certification under the WELL Building Standard. 
        <br>
        If the project would like to appeal to pursue additional features or parts or challenge any findings in the report, please select “Appeal” from the “Initiate Action” button that is located on the review page within 180 days. If the project would like to initiate curative actions for any of the features or parts, please select “Curative Action” from the button within 180 days.
    </p>
              `,
          },
          {
            label: 'Recertification - Project can be recertified',
            value: `
              <p>
        This review phase has been completed and the results are available in WELL Online. The Final WELL Report has been completed. This report is available in WELL Online. On behalf of the Green Business Certification Inc., I would like to extend our congratulations on your achievement of Recertification under the WELL Building Standard.
        <br>
        If the project would like to appeal to pursue additional features or parts or challenge any findings in the report, please select “Appeal” from the “Initiate Action” button that is located on the review page within 180 days. If the project would like to initiate curative actions for any of the features or parts, please select “Curative Action” from the button within 180 days.
    </p>
              `,
          },
        ]
      } else if (
        this.review.phase.includes('Final WELL Report') ||
        this.review.phase.includes('Final Performance')
      ) {
        comments = [
          {
            label: 'Initial Certification - Project can be certified',
            value: `
            <p>
        This review phase has been completed and the results are available in WELL Online. The Final WELL Report has been completed. This report is available in WELL Online. On behalf of the Green Business Certification Inc., I would like to extend our congratulations on your achievement of Certification under the WELL Building Standard.  
        <br>
        If the project would like to appeal to pursue additional features or parts or challenge any findings in the report, please select “Appeal” from the “Initiate Action” button that is located on the review page within 180 days. If the project would like to initiate curative actions for any of the features or parts, please select “Curative Action” from the button within 180 days.
    </p>
            `,
          },
          {
            label: 'Not Achieved',
            value: `
              <p>
        This review phase for your project has been completed and the report is available in WELL Online. A general observation regarding the application has been listed at the top of the first page with review comments.
        <br>
        As the project has features that are Preconditions with unmet requirements, the project is not eligible for certification without additional action. Please review the report and initiate the curative actions from the [Initiate Action] button above and follow the guidance. To guide you through the next steps, please complete the following form within 180 days after the issuance of the WELL Final Report once the curative actions are planned or completed: <a href="https://fs11.formsite.com/qOUDrr/CurativeAction/index.html">https://fs11.formsite.com/qOUDrr/CurativeAction/index.html</a>
        <br>
        If retesting is required, the project team has the option to elect GBCI to conduct the performance testing or contract with an approved performance testing organization. Additional information regarding the curative action process is available in the WELL Certification Guidebook.
    </p>
              `,
          },
          {
            label: 'Recertification - Project can be certified',
            value: `
              <p>
        This review phase has been completed and the results are available in WELL Online. The Final WELL Report has been completed. This report is available in WELL Online. On behalf of the Green Business Certification Inc., I would like to extend our congratulations on your achievement of Recertification under the WELL Building Standard.
        <br>
        If the project would like to appeal to pursue additional features or parts or challenge any findings in the report, please select “Appeal” from the “Initiate Action” button that is located on the review page within 180 days. If the project would like to initiate curative actions for any of the features or parts, please select “Curative Action” from the button within 180 days.
    </p>
              `,
          },
        ]
      } else if (this.review.phase.includes('Preliminary Performance')) {
        comments = [
          {
            label: 'Preconditions Pending',
            value: `<p>
        This review phase has been completed and the results are available in WELL Online. 
        <br>
        All attempted Preconditions and Optimizations have been reviewed. Features that are pending documentation have performance components that have not yet been met. Provide the additional information listed under the technical advice for that feature. In addition, a general observation regarding the application has been listed at the top of the first page with review comments. 
        <br>
        Please review the comments contained in the report and note the requested clarifications. We recommend submitting for the Final Performance Review within 25 business days.
    </p>`,
          },
          {
            label: 'Initial Certification - Project can be certified ',
            value: `
              <p>
        This review phase has been completed and the results are available in WELL Online. The Final WELL Report has been completed. This report is available in WELL Online. On behalf of the Green Business Certification Inc., I would like to extend our congratulations on your achievement of Certification under the WELL Building Standard.  
        <br>
        If the project would like to appeal to pursue additional features or parts or challenge any findings in the report, please select “Appeal” from the “Initiate Action” button that is located on the review page within 180 days. If the project would like to initiate curative actions for any of the features or parts, please select “Curative Action” from the button within 180 days.
    </p>
              `,
          },
          {
            label: 'Recertification - Project can be certified ',
            value: `
              <p>
        This review phase has been completed and the results are available in WELL Online. The Final WELL Report has been completed. This report is available in WELL Online. On behalf of the Green Business Certification Inc., I would like to extend our congratulations on your achievement of Recertification under the WELL Building Standard.
        <br>
        If the project would like to appeal to pursue additional features or parts or challenge any findings in the report, please select “Appeal” from the “Initiate Action” button that is located on the review page within 180 days. If the project would like to initiate curative actions for any of the features or parts, please select “Curative Action” from the button within 180 days.
    </p>
              `,
          },
        ]
      }
      return comments
    },
    showReviewCommentSuggestionDropdown() {
      if (
        this.review.phase.includes('Final WELL Report') ||
        this.review.phase.includes('Final Performance Review') ||
        this.review.phase.includes('Preliminary Performance') ||
        this.review.phase.includes('Appeal') ||
        this.review.phase.includes('Action Plan') ||
        this.review.phase.includes('Final Documentation') ||
        this.review.phase.includes('Preliminary Documentation') ||
        this.review.phase.includes('Final Precertification') ||
        this.review.phase.includes('Preliminary Precertification')
      ) {
        return true
      } else {
        return false
      }
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
    commentSuggestions(newValue) {
      if (this.review.phase === 'Preliminary Health-Safety Review') {
        if (newValue === 'achieved') {
          this.reviewComment =
            "<p>The WELL Health-Safety Preliminary review for your project has been completed and the results are available in the review report. A copy of the report has been uploaded to WELL Online. All attempted Features have been reviewed. In addition, a general observation regarding the application has been listed at the top of the first page with review comments.</p><p>Please review the comments contained in the report and note the requested clarifications. We recommend submitting for the Final Health-Safety Review within 25 business days.</p><p>The project has achieved at least 15 Features and if satisfied with the number of Features marked as Achieved, the Final WELL Health-Safety Review phase may be skipped. Please email<a class='text-primary-600' target='_blank'  href='mailto:WELL@gbci.org'>WELL@gbci.org</a> if you would like to accept the results as Final, and include the project name and number in the subject line.</p>"
        } else if (newValue === 'not_achieved') {
          this.reviewComment =
            '<p>The WELL Health-Safety Preliminary review for your project has been completed and the results are available in the review report. A copy of the report has been uploaded to WELL Online. All attempted Features have been reviewed. In addition, a general observation regarding the application has been listed at the top of the first page with review comments.</p><p>Please review the comments contained in the report and note the requested clarifications. We recommend submitting for the Final Health-Safety Review within 25 business days.</p>'
        }
      } else if (this.review.phase === 'Final Health-Safety Review') {
        if (newValue === 'achieved') {
          this.reviewComment =
            '<p>The Final Health-Safety Review has been completed. This report is available in WELL Online. I would like to extend our congratulations on your achievement of the WELL Health-Safety Rating!</p>'
        } else if (newValue === 'not_achieved') {
          this.reviewComment =
            '<p>The WELL Health-Safety Final Review for your project has been completed and the results are available in the review report. A copy of the report has been uploaded to WELL Online. All attempted Features have been reviewed. In addition, a general observation regarding the application has been listed at the top of the first page with review comments.</p><p>The project has one or more Features where the requirements have not been met. Please see the technical advice for those Features, and submit for Appeal Review with the required revisions.</p>'
        }
      } else if (this.review.phase === 'Curative Action Plan Review') {
        if (newValue === 'Achieved') {
          this.reviewComment =
            '<p>The Curative Action Health-Safety Review has been completed. This report is available in WELL Online. I would like to extend our congratulations on your achievement of the WELL Health-Safety Rating!</p>'
        } else if (newValue === 'Not Achieved') {
          this.reviewComment =
            '<p>The WELL Health-Safety Curative Action Review for your project has been completed and the results are available in the review report. A copy of the report has been uploaded to WELL Online. All appealed features have been reviewed. In addition, a general observation regarding the application has been listed at the top of the first page with review comments.</p><p>The project has one or more Features where the requirements have not been met. Please see the technical advice for those features and submit for Appeal Review with the required revisions.</p>'
        }
      }
      this.forceReMount++
    },
    reviewCommentSuggestion(newValue) {
      this.reviewComment = newValue
      this.forceReMount++
    },
  },
  async mounted() {
    await this.$store.dispatch('project/getProjectInvoices', this.project.id)
    this.formData.hsr_achieved_date = this.project.hsr_achieved_date
    this.formData.hsr_status = this.project.hsr_status
    this.formData.hsr_review_comment = this.review.hsr_review_comment
    this.formData.project_phase = this.project.project_phase
    this.reviewComment = this.review.review_comment
    this.formData.payment_status = this.review.payment_status
      ? this.review.payment_status
      : 'unpaid'
    if (this.review.phase.includes('Performance Review')) {
      this.formData.payment_status = 'paid'
    }
    if (this.review.review_date) {
      this.formData.review_date = this.review.review_date
    }
    if (
      this.review.project_documents &&
      this.review.project_documents.length > 0
    ) {
      this.review.project_documents.forEach((doc) => {
        if (doc.type === 'hsr') {
          this.hsrDocs.push(doc)
        } else {
          this.documents.push(doc)
        }
      })
    }

    this.forceReMount++
  },
  methods: {
    submitResponse() {
      const data = { ...this.formData, review_comment: this.reviewComment }
      data.documents = []
      if (this.documentsOutput.length > 0) {
        data.documents = this.documentsOutput.map((element) => {
          return { link_s3: element.url }
        })
      }

      data.id = this.review.id
      data.project_id = this.review.project_id

      if (
        this.formData.project_phase === 'Certification Decision' ||
        this.formData.project_phase === 'D&O Decision' ||
        this.formData.project_phase === 'Precertification Decision'
      ) {
        data.need_approval = 1
      }

      let conceptObservations = this.conceptObservations.filter((a) => a.show)

      conceptObservations = conceptObservations.map((e) => {
        return {
          concept: e.concept,
          general_observation: e.general_observation,
        }
      })

      data.general_observation_concepts = conceptObservations
      if (this.hsrDocsOutput.length) {
        this.hsrDocsOutput.forEach((doc) => {
          data.documents.push({
            type: 'hsr',
            link_s3: doc.url,
          })
        })
      }

      this.$store.dispatch('review/returnReview', data).then((response) => {
        this.$parent.$parent.getReviewDetails()
        this.$store.dispatch(
          'project/getProjectByNumber',
          this.project.project_number
        )
        this.$parent.toggleOpen()
      })
    },
  },
}
</script>
