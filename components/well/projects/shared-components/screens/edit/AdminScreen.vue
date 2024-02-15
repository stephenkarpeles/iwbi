<template>
  <div>
    <WFeedbackModal v-if="inputData" ref="modal">
      <div class="" style="width: 900px">
        <PortfolioAnalyzeDataForm
          :mode="{
            name: 'project',
            module: inputData,
          }"
        />
      </div>
    </WFeedbackModal>

    <FormulateForm v-if="formData" @submit="updateProject">
      <div class="shadow-lg border rounded-lg p-5 mb-5">
        <WHeadingsHFour heading="Admin Fields" />
        <FormulateInput
          v-model="formData.coaching_contact_id"
          :options="coachingContacts"
          type="select"
          label="Coaching contact"
        />
        <FormulateInput
          v-model="formData.senior_coaching_contact_id"
          :options="coachingContacts"
          type="select"
          label="Relationship manager"
        />
        <FormulateInput
          v-model="formData.well_assessor_id"
          :options="wellReviewers"
          type="select"
          label="WELL reviewer"
          placeholder="Select WELL reviewer"
        />
        <div class="mt-1 mb-4 shadow-sm">
          <label
            for="externalReviewer"
            class="w-full text-sm font-bold leading-5 text-gray-700 sm:mt-px sm:pt-2"
            >External Reviewer</label
          >
          <multiselect
            v-model="reviewerSelected"
            :open-direction="'bottom'"
            :multiple="true"
            :searchable="true"
            :hide-selected="false"
            :allow-empty="true"
            track-by="value"
            :show-labels="false"
            name="externalReviewer"
            :options="externalReviewers"
            placeholder="Select external reviewer"
            label="label"
            @input="updateExternalReviewers"
          ></multiselect>
        </div>
        <div class="mt-1 mb-4 shadow-sm">
          <label
            for="externalReviewer"
            class="w-full text-sm font-bold leading-5 text-gray-700 sm:mt-px sm:pt-2"
            >WELL Performance testing agent</label
          >
          <multiselect
            v-model="ptaSelected"
            :open-direction="'bottom'"
            :multiple="false"
            :searchable="true"
            :hide-selected="false"
            :allow-empty="true"
            track-by="value"
            :show-labels="false"
            name="ptagents"
            :options="ptAgents"
            placeholder="Select WELL PT Agent"
            label="label"
          ></multiselect>
        </div>
        <FormulateInput
          v-model="formData.registration_status"
          :options="[
            { label: 'N/A', value: '_none' },
            { label: 'Open', value: 'open' },
            { label: 'Closed', value: 'closed' },
            { label: 'Inactive', value: 'inactive' },
            { label: 'Registered - Inactive', value: 'reginactive' },
            { label: 'Registered - Not pursuing', value: 'regclosed' },
            { label: 'Registered - Moved to v2', value: 'regmovedv2' },
            { label: 'Reopened', value: 'reopened' },
            { label: 'Portfolio - closed', value: 'portfolioclosed' },
          ]"
          label="Registration status"
          type="radio"
        />
        <FormulateInput
          v-model="formData.project_phase_internal"
          :options="projectPhaseInternal"
          label="Project phase"
          type="radio"
        />
        <FormulateInput
          v-model="formData.document_submission_date"
          label="Date of documentation submission"
          type="datetimepicker"
          max="9999-01-01"
          :disabled="true"
        />
        <div class="bg-white overflow-hidden sm:rounded-lg sm:shadow mb-4">
          <div class="bg-white px-4 py-5 border-b border-gray-200 sm:px-6">
            <h3 class="text-lg leading-6 font-medium text-gray-900">
              Owner representative
            </h3>
          </div>
          <div class="bg-white px-4 py-5 border-b border-gray-200 sm:px-6">
            <FormulateInput
              v-model="formData.owner_rep_name"
              type="text"
              label="Name"
              name="owner_rep_name"
              class="w-full"
            />
            <FormulateInput
              v-model="formData.owner_rep_email"
              type="email"
              label="Email"
              class="w-full"
            />
          </div>
        </div>
        <div class="bg-white overflow-hidden sm:rounded-lg sm:shadow mb-4">
          <div class="bg-white px-4 py-5 border-b border-gray-200 sm:px-6">
            <h3 class="text-lg leading-6 font-medium text-gray-900">
              Precertification
            </h3>
          </div>
          <div class="bg-white px-4 py-5 border-b border-gray-200 sm:px-6">
            <FormulateInput
              v-model="formData.pre_cert_status"
              type="select"
              label="Project Precertification status"
              name="pre_cert_status"
              :options="projectPreCertStatus"
            />
            <FormulateInput
              v-model="formData.do_date"
              type="datetimepicker"
              label="Precertification date"
              name="do_date"
              max="9999-01-01"
            />
          </div>
        </div>
        <div class="bg-white overflow-hidden sm:rounded-lg sm:shadow mb-4">
          <div class="bg-white px-4 py-5 border-b border-gray-200 sm:px-6">
            <h3 class="text-lg leading-6 font-medium text-gray-900">
              Certification
            </h3>
          </div>
          <div class="bg-white px-4 py-5 border-b border-gray-200 sm:px-6">
            <FormulateInput
              v-model="formData.cert_status"
              type="select"
              label="Project certification status"
              name="cert_status"
              :options="projectCertStatus"
            />
            <div class="flex space-x-2">
              <FormulateInput
                v-model="formData.date_certified"
                class="w-full"
                type="datetimepicker"
                label="Date certified"
                name="date_certified"
                max="9999-01-01"
              />
              <div v-if="formData.date_certified" class="mt-7">
                <WButtonsBase
                  icon="refresh"
                  @click.native="formData.date_certified = null"
                >
                  Clear
                </WButtonsBase>
              </div>
            </div>
          </div>
        </div>
        <div class="bg-white overflow-hidden sm:rounded-lg sm:shadow mb-4">
          <div class="bg-white px-4 py-5 border-b border-gray-200 sm:px-6">
            <h3 class="text-lg leading-6 font-medium text-gray-900">
              Performance verification
            </h3>
          </div>
          <div class="bg-white px-4 py-5 border-b border-gray-200 sm:px-6">
            <FormulateInput
              v-model="formData.performance_verification_date"
              type="datetimepicker"
              label="Date of performance verification"
              name="performance_verification_date"
              max="9999-01-01"
            />
            <FormulateInput
              v-model="formData.performance_verification_date_2"
              type="datetimepicker"
              label="Date of performance verification 2"
              name="performance_verification_date_2"
              max="9999-01-01"
            />
            <FormulateInput
              v-model="formData.performance_verification_date_3"
              type="datetimepicker"
              label="Date of performance verification 3"
              name="performance_verification_date_3"
              max="9999-01-01"
            />
          </div>
        </div>
        <div class="bg-white overflow-hidden sm:rounded-lg sm:shadow mb-4">
          <div class="bg-white px-4 py-5 border-b border-gray-200 sm:px-6">
            <h3 class="text-lg leading-6 font-medium text-gray-900">
              WELL Health-Safety
            </h3>
          </div>
          <div class="bg-white px-4 py-5 border-b border-gray-200 sm:px-6">
            <FormulateInput
              v-model="formData.hsr_status"
              type="radio"
              label="Status"
              name="hsr_status"
              :options="[
                { label: 'N/A', value: null },
                { label: 'Achieved', value: 'achieved' },
                { label: 'Not Achieved', value: 'not_achieved' },
              ]"
            />
            <div class="flex space-x-2">
              <FormulateInput
                v-model="formData.hsr_achieved_date"
                class="w-full"
                type="datetimepicker"
                label="Awarded date"
                name="hsr_achieved_date"
                max="9999-01-01"
              />
              <div v-if="formData.hsr_achieved_date" class="mt-7">
                <WButtonsBase
                  icon="refresh"
                  @click.native="formData.hsr_achieved_date = null"
                >
                  Clear
                </WButtonsBase>
              </div>
            </div>
          </div>
        </div>
        <div class="bg-white overflow-hidden sm:rounded-lg sm:shadow mb-4">
          <div class="bg-white px-4 py-5 border-b border-gray-200 sm:px-6">
            <h3 class="text-lg leading-6 font-medium text-gray-900">
              WELL Performance Rating
            </h3>
          </div>
          <div class="bg-white px-4 py-5 border-b border-gray-200 sm:px-6">
            <FormulateInput
              v-model="formData.wpr_status"
              type="radio"
              label="Status"
              name="wpr_status"
              :options="[
                { label: 'N/A', value: null },
                { label: 'Achieved', value: 'achieved' },
                { label: 'Not Achieved', value: 'not_achieved' },
              ]"
            />
            <div class="flex space-x-2">
              <FormulateInput
                v-model="formData.wpr_achieved_date"
                class="w-full"
                type="datetimepicker"
                label="Awarded date"
                name="wpr_achieved_date"
                max="9999-01-01"
              />
              <div v-if="formData.wpr_achieved_date" class="mt-7">
                <WButtonsBase
                  icon="refresh"
                  @click.native="formData.wpr_achieved_date = null"
                >
                  Clear
                </WButtonsBase>
              </div>
            </div>
          </div>
        </div>
        <div class="bg-white overflow-hidden sm:rounded-lg sm:shadow mb-6">
          <div class="bg-white px-4 py-5 border-b border-gray-200 sm:px-6">
            <h3 class="text-lg leading-6 font-medium text-gray-900">
              Project Closing
            </h3>
          </div>
          <div class="bg-white px-4 py-5 border-b border-gray-200 sm:px-6">
            <FormulateInput
              v-model="formData.close_reason_id"
              type="select"
              label="Project Close Reason"
              name="close-reason"
              :options="projectCloseReason"
            />
            <div class="flex space-x-2">
              <FormulateInput
                v-model="formData.close_date"
                class="w-full"
                type="datetimepicker"
                label="Project Close Date"
                name="close-date"
                max="9999-01-01"
              />
              <div v-if="formData.close_date" class="mt-7">
                <WButtonsBase
                  icon="refresh"
                  @click.native="formData.close_date = null"
                >
                  Clear
                </WButtonsBase>
              </div>
            </div>
            <FormulateInput
              v-model="formData.close_documents"
              label="Attach Document"
              :value="formData.close_documents"
              type="fileupload"
              :mutiple="true"
              :upload-path="'project/' + project_number + '/closedocuments/'"
              mime-types=""
            />
            <div
              v-for="(closeDoc, index) in docList"
              :key="index"
              :class="[
                'mt-3',
                'rounded-lg',
                'shadow',
                'p-4',
                'text-sm',
                'text-primary-600',
                'flex',
                'w-full',
                closeDoc.doc_status === 'invalid' ? 'bg-gray-200' : 'bg-white',
              ]"
            >
              <div class="flex h-12 w-full">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  class="w-4 mr-2 text-primary-500"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"
                  ></path>
                </svg>
                <a
                  :href="closeDoc.link_s3_private"
                  target="_blank"
                  class="my-auto w-10/12 truncate"
                >
                  <div>
                    {{ closeDoc.name }}
                  </div>
                  <div class="text-xs text-gray-400">
                    Uploaded on
                    {{ $dayjs(closeDoc.created_at).format('MMM DD, YYYY') }}
                    by
                    <br />
                    {{ closeDoc.user_name }}
                  </div>
                </a>
              </div>
              <div class="my-auto -ml-3">
                <svg
                  v-if="
                    currentUser.role.includes('well-admin') ||
                    currentUser.id === closeDoc.user_id
                  "
                  class="w-5 text-red-500 hover:text-red-700 cursor-pointer"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  @click="removeCloseDoc(closeDoc.id)"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>
        <FormulateInput
          v-model="formData.coaching_support_time"
          type="select"
          label="WELL coaching support"
          name="coaching_support_time"
          :options="wellCoachingSupport"
        />
        <FormulateInput
          v-model="formData.enthusiasm_level"
          type="select"
          label="WELL enthusiasm level"
          name="enthusiasm_level"
          :options="wellEnthusiasmOptions"
        />
        <FormulateInput
          v-model="formData.pt_org"
          type="radio"
          label="Are you using GBCI as your Performance Testing Organization?"
          name="pt_org"
          :options="[
            { value: 0, label: 'No' },
            { value: 1, label: 'Yes' },
          ]"
        />
        <FormulateInput
          v-model="formData.challenges"
          type="checkbox"
          label="Project challenges"
          name="challenges"
          :options="challengeOptions"
        />
        <FormulateInput
          v-model="formData.billing_status"
          type="text"
          label="Please enter your billing status"
          name="billing_status"
          class="w-full"
        />
        <FormulateInput
          v-model="formData.challenge_note"
          type="textarea"
          label="WELL challenges notes"
          name="challenge_note"
          class="w-full"
        />
        <FormulateInput
          v-model="formData.communication_note"
          type="textarea"
          label="WELL communication notes"
          name="communication_note"
          class="w-full"
        />
        <FormulateInput
          v-model="formData.billing_note"
          type="textarea"
          label="Please enter your billing notes"
          name="billing_note"
          class="w-full"
        />
        <FormulateInput
          v-if="currentUser.role.includes('admin')"
          v-model="formData.mbr"
          type="radio"
          label="Multiple Buildings Program"
          name="mbr"
          :options="[
            { value: 'primary', label: 'Primary' },
            { value: 'secondary', label: 'Secondary' },
          ]"
        />
        <FormulateInput
          v-model="formData.is_test_project"
          type="radio"
          :options="[
            { label: 'Yes', value: 1 },
            { label: 'No', value: 0 },
          ]"
          label="Test project?"
          name="test_project"
        />
        <div class="my-2">
          <WButtonsBase
            type="primaryInverted"
            icon="pencil"
            @click.native="$refs.modal.isHidden = false"
            >Configure dummy data</WButtonsBase
          >
        </div>
        <FormulateInput
          v-if="formData.type !== 'v2-pilot-upgraded'"
          type="submit"
          label="Save Changes"
        />
      </div>
    </FormulateForm>
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  props: {
    inputData: {
      type: Object,
      required: true,
      default: () => null,
    },
    reviewerSelectedInput: {
      type: Array,
      required: true,
      default: () => [],
    },
    ptaSelectedInput: {
      type: Array,
      required: true,
      default: () => [],
    },
  },
  data() {
    return {
      docList: [],
      formData: {
        close_date: null,
        close_reason_id: null,
        close_documents: [],
      },
      reviewerSelected: [],
      ptaSelected: [],
      projectCloseReason: [{ value: null, label: '' }],
      challengeOptions: [
        {
          label: 'Development/approval of AAPs',
          value: 'Development/approval of AAPs',
        },
        {
          label: 'Development/approval of Equivalencies',
          value: 'Development/approval of Equivalencies',
        },
        { label: 'Documentation', value: 'Documentation' },
        {
          label: 'Performance Verification - Scheduling',
          value: 'Performance Verification - Scheduling',
        },
        {
          label: 'Performance Verification – Passing',
          value: 'Performance Verification – Passing',
        },
        { label: 'Curative action', value: 'Curative action' },
        { label: 'Hard costs for WELL', value: 'Hard costs for WELL' },
        { label: 'WELL consulting costs', value: 'WELL consulting costs' },
        { label: 'Managing WELL timeline', value: 'Managing WELL timeline' },
      ],

      projectPhaseInternal: [
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
          value: 'Performance Testing Scheduling on Hold',
          label: 'Performance Testing Scheduling on Hold',
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
        {
          value: 'Renewal Preliminary Health-Safety Review',
          label: 'Renewal Preliminary Health-Safety Review',
        },
        {
          value: 'Renewal Final Health-Safety Review',
          label: 'Renewal Final Health-Safety Review',
        },
      ],
      projectPreCertStatus: [
        { value: 'na', label: 'N/A' },
        { value: 'Compliance', label: 'Achieved' },
      ],

      projectCertStatus: [
        { value: null, label: 'Clear' },
        { value: 'na', label: 'N/A' },
        { value: 'Compliance', label: 'Compliance' },
        { value: 'Bronze', label: 'Bronze' },
        { value: 'Silver', label: 'Silver' },
        { value: 'Gold', label: 'Gold' },
        { value: 'Platinum', label: 'Platinum' },
        { value: 'Pilot', label: 'Pilot' },
      ],
      wellCoachingSupport: [
        {
          label: 'Very high volume: More than 4 hours per month',
          value: 'very_high',
        },
        {
          label: 'High volume: More than 2 - 4 hours per month',
          value: 'high',
        },
        {
          label: 'Average volume: More than .5 - 2 hours per month',
          value: 'average',
        },
        { label: 'Low volume: .5 hrs or less', value: 'low' },
        { label: 'Non-responsive', value: 'non_responsive' },
      ],
      wellEnthusiasmOptions: [
        { label: 'N/A', value: 'na' },
        { label: 'High', value: 'High' },
        { label: 'Average', value: 'Average' },
        { label: 'Low', value: 'Low' },
      ],
    }
  },

  computed: {
    ...mapState({
      project: (state) => state.project.project,
      project_close: (state) => state.project.project.close,
      project_number: (state) => state.project.project.project_number,
      currentUser: (state) => state.user.currentUser,
      coachingContacts: (state) => state.project.coachingContacts,
      wellReviewers: (state) => state.project.wellReviewers,
      externalReviewers: (state) => state.project.externalReviewers,
      ptAgents: (state) => state.project.ptAgents,
    }),
    closeDocs() {
      return this.project_close?.documents ? this.project_close.documents : []
    },
  },
  async mounted() {
    this.formData = JSON.parse(JSON.stringify(this.inputData))
    // Set Project Close Reason Dropdown Options
    const { data } = await this.$axios.get('api/closeReasons')
    data?.forEach((el) => {
      this.projectCloseReason.push({ value: el.id, label: el.name })
    })

    // Set DocList with Existing Docs
    if (this.project?.close?.documents) {
      this.docList = this.project.close.documents
    }

    // Set Project Reason ID to Dropdown
    if (this.project?.close?.close_reason_id) {
      this.formData.close_reason_id = this.project.close.close_reason_id
    }

    // Set Project Date to Date Picker
    if (this.project?.close?.close_date) {
      this.formData.close_date = this.project.close.close_date
    }

    this.reviewerSelected = JSON.parse(
      JSON.stringify(this.reviewerSelectedInput)
    )
    this.ptaSelected = JSON.parse(JSON.stringify(this.ptaSelectedInput))
  },
  methods: {
    updateExternalReviewers() {
      const reviewerIds = this.reviewerSelected.map((a) => a.value)
      this.$store.dispatch('project/updateExternalReviewers', {
        external_reviewer_ids: reviewerIds,
      })
    },
    removeCloseDoc(id) {
      this.docList = this.docList.filter((el) => el.id !== id)
    },
    async updateProject() {
      const payload = {
        coaching_contact_id: null,
        senior_coaching_contact_id: null,
        well_assessor_id: null,
        registration_status: null,
        cert_status: null,
        pre_cert_status: null,
        close_reason_id: null,
        close_date: null,
        close_documents: null,
        project_phase_internal: null,
        performance_verification_date: null,
        performance_verification_date_2: null,
        performance_verification_date_3: null,
        document_submission_date: null,
        date_certified: null,
        date_certified_expire: null,
        do_date: null,
        coaching_support_time: null,
        enthusiasm_level: null,
        pt_org: null,
        challenges: null,
        challenge_note: null,
        communication_note: null,
        billing_status: null,
        billing_note: null,
        mbr: null,
        hide_fee_schedule: null,
        v1_version: null,
        standard_version: null,
        pre_cert_date: null,
        eav: null,
        doc_sub_date_est: null,
        project_phase: null,
        owner_rep_name: null,
        owner_rep_email: null,
        owner_rep_role: null,
        hsr_status: null,
        hsr_achieved_date: null,
        is_test_project: null,
      }

      // Project Close - File Upload
      if (this.formData?.close_documents) {
        this.formData.close_documents.forEach((el) => {
          el.link_s3 = el.url
        })
      }

      // Merge Existing Close Documents with Newly Uploaded DocumentsScreen
      if (this.docList.length > 0) {
        this.formData.close_documents.push(...this.docList)
      }

      Object.keys(this.formData).forEach((key) => {
        if (key in payload) payload[key] = this.formData[key]
      })

      this.formData.pta_ids = []
      if (this.ptaSelected.value) {
        payload.pta_ids = [this.ptaSelected.value]
      }
      this.formData.external_reviewer_ids = []
      if (this.reviewerSelected.length) {
        payload.external_reviewer_ids = this.reviewerSelected.map(
          (a) => a.value
        )
      }

      try {
        await this.$axios.put(
          `api/admin/project/update/${this.formData.id}/adminFields`,
          payload
        )
        this.$store.dispatch('notifications/toastMessage', {
          message: 'Fields updated sucessfully!',
        })
        this.$router.push({
          path: `/projects/${this.formData.type}/${this.formData.project_number}/dashboard`,
          query: { ...this.$route.query },
        })
      } catch (error) {
        this.$store.dispatch('notifications/toastMessage', {
          message: error.response.data.message,
        })
      }
    },
  },
}
</script>
