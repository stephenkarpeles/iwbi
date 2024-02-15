<template>
  <div>
    <WFeedbackAlert ref="alert" class="z-50" />
    <FormulateForm v-if="loadedData" @submit="updateFrom">
      <FormulateInput
        v-model="formData.coaching_contact_id"
        type="select"
        label="Coaching contact:"
        :options="JSON.parse(JSON.stringify(coachingContacts))"
      />
      <FormulateInput
        v-model="formData.well_assessor_id"
        type="select"
        :options="JSON.parse(JSON.stringify(assessorUsers))"
        label="WELL reviewer:"
      />
      <FormulateInput
        v-model="ptaSelected"
        type="select"
        :options="JSON.parse(JSON.stringify(ptAgents))"
        label="WELL Performance testing agent:"
      />
      <!-- Multiselect goes here -->
      <ClientOnly>
        <FormulateInput
          v-model="reviewerSelected"
          :multiple="true"
          :searchable="true"
          :options="JSON.parse(JSON.stringify(externalReviewers))"
          label="External reviewer:"
          track-by="value"
          type="multi"
          @input="updateExternalReviewers"
        />
      </ClientOnly>

      <FormulateInput
        v-model="formData.senior_coaching_contact_id"
        type="select"
        :options="JSON.parse(JSON.stringify(coachingContacts))"
        label="Relationship Manager:"
      />
      <div class="shadow overflow-hidden sm:rounded-lg">
        <div class="px-4 py-5 sm:px-6">
          <h3 class="text-md leading-6 font-medium text-gray-900">Status</h3>
        </div>
        <div class="border-t border-gray-200 px-4 py-5">
          <FormulateInput
            v-model="formData.hide_fees"
            :options="{
              1: 'Yes',
              0: 'No',
            }"
            type="radio"
            label="Hide fee structure:"
          />
          <FormulateInput
            v-model="formData.status"
            :options="[
              { label: 'Active', value: 'active' },
              { label: 'Inactive', value: 'inactive' },
            ]"
            type="radio"
            label="Portfolio status:"
          />
          <FormulateInput
            v-model="formData.cert_status"
            :options="portfolioCertStatus"
            type="radio"
            label="Certification status:"
          />

          <FormulateInput
            :value="
              portfolio.reg_payment_status === 'paid'
                ? portfolio.sub_payment_status === 'paid'
                  ? 'Subscribed'
                  : 'Enrolled'
                : 'Pre-enrolled'
            "
            type="text"
            label="Portfolio commitment status:"
            :disabled="true"
          />

          <FormulateInput
            v-model="formData.cert_type"
            :options="[
              { label: 'N/A', value: 'na' },
              { label: 'Certification', value: 'Certification' },
              { label: 'Compliance', value: 'Compliance' },
            ]"
            type="radio"
            label="Portfolio certification type"
          />

          <FormulateInput
            v-model="formData.portfolio_phase_internal"
            :options="portfolioPhaseInternal"
            type="radio"
            label="Portfolio phase:"
          />
          <FormulateInput
            v-model="formData.pilot_participant"
            :options="{
              1: 'Yes',
              0: 'No',
            }"
            type="radio"
            label="Portfolio pilot participant:"
          />

          <FormulateInput
            v-model="formData.review_cycle_status"
            class="capitalize"
            :options="[
              'preparation',
              'scheduled',
              'submitted',
              'under review',
              'awarded',
              'curative action',
            ]"
            type="radio"
            label="Review cycle status:"
          />

          <FormulateInput
            v-model="formData.sub_term_year"
            :options="[
              { label: '1 year', value: '1' },
              { label: '2 years', value: '2' },
              { label: '3 years', value: '3' },
              { label: '4 years', value: '4' },
            ]"
            type="radio"
            label="Subscription term years"
          />

          <FormulateInput
            v-model="formData.reg_date"
            type="datetimepicker"
            max="9999-01-01"
            label="Date of enrollment:"
            :disabled="true"
          />

          <FormulateInput
            v-model="formData.sub_date"
            type="datetimepicker"
            max="9999-01-01"
            label="Date of subscription activation:"
            :disabled="true"
          />

          <FormulateInput
            v-model="formData.performance_verification_date"
            type="datetimepicker"
            max="9999-01-01"
            label="Date of performance verification:"
          />

          <FormulateInput
            v-model="formData.document_submission_date"
            type="datetimepicker"
            max="9999-01-01"
            label="Date of documentation submission:"
            :disabled="true"
          />

          <FormulateInput
            v-model="formData.date_certified"
            type="datetimepicker"
            max="9999-01-01"
            label="Date certified:"
          />
        </div>
      </div>
      <div class="shadow overflow-hidden sm:rounded-lg mt-4">
        <div class="px-4 py-5 sm:px-6">
          <h3 class="text-md leading-6 font-medium text-gray-900">
            WELL Health Safety
          </h3>
        </div>
        <div class="border-t border-gray-200 px-4 py-5">
          <FormulateInput
            v-model="formData.hsr_status"
            :options="[
              { label: 'N/A', value: null },
              { label: 'Achieved', value: 'achieved' },
              { label: 'Not Achieved', value: 'not_achieved' },
            ]"
            type="radio"
            label="Status:"
          />

          <FormulateInput
            v-model="formData.hsr_achieved_date"
            type="datetimepicker"
            max="9999-01-01"
            label="Awarded Date:"
          />
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
            :upload-path="'project/' + portfolio_number + '/closedocuments/'"
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
        :options="wellCoachingSupport"
        type="select"
        label="WELL coaching support (over portfolio life):"
      />

      <FormulateInput
        v-model="formData.score"
        type="text"
        label="Current WELL portfolio score:"
      />

      <FormulateInput
        v-model="formData.enthusiasm_level"
        :options="[
          { label: 'N/A', value: 'na' },
          { label: 'High', value: 'High' },
          { label: 'Average', value: 'Average' },
          { label: 'Low', value: 'Low' },
        ]"
        type="radio"
        label="WELL enthusiasm level:"
      />

      <FormulateInput
        v-model="formData.challenges"
        class="mt-4"
        :options="challenges"
        type="checkbox"
        label="Portfolio challenges:"
      />

      <FormulateInput
        v-model="formData.challenge_note"
        label="Portfolio challenges notes:"
        placeholder="Portfolio challenges notes:"
        type="textarea"
      />

      <FormulateInput
        v-model="formData.communication_note"
        label="Portfolio communication notes:"
        placeholder="Portfolio challenges notes:"
        type="textarea"
      />
      <FormulateInput
        v-model="formData.description"
        label="Portfolio description:"
        placeholder="Portfolio description:"
        type="textarea"
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
      <FormulateInput
        v-model="formData.show_dashboard"
        type="radio"
        :options="[
          { label: 'Yes', value: 1 },
          { label: 'No', value: 0 },
        ]"
      >
        <template #label>
          <div>
            <div class="flex space-x-2">
              <div>Enable Analyze view</div>
              <div
                v-if="
                  formData.show_dashboard === '0' ||
                  formData.show_dashboard === 0
                "
                class="border-l-2 ml-2 pl-2 flex active:text-primary-700 font-medium text-primary-600 hover:text-primary-800 transition duration-150 ease-in-out h-full"
                @click="
                  $router.push(
                    `/portfolio/${portfolio.portfolio_number}/dashboard/?view=analyze`
                  )
                "
              >
                Preview dashboard
              </div>
            </div>
          </div>
        </template>
      </FormulateInput>

      <FormulateInput class="mt-5" type="submit">Save</FormulateInput>
    </FormulateForm>
    <div v-else>
      <div class="mx-auto text-center">
        <WLoadingSpinner class="mx-auto" />
        <div class="mt-3 text-primary-600">Loading...</div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  data() {
    return {
      docList: [],
      formData: {
        close_date: null,
        close_reason_id: null,
        close_documents: [],
      },
      address: {},
      coaching_contact: null,
      loadedData: false,
      reviewerSelected: [],
      ptaSelected: [],
      projectCloseReason: [{ value: null, label: '' }],
      portfolioCertStatus: [
        { value: 'na', label: 'N/A' },
        { value: 'Compliance', label: 'Compliance' },
        { value: 'Silver', label: 'Silver' },
        { value: 'Gold', label: 'Gold' },
        { value: 'Platinum', label: 'Platinum' },
        { value: 'Pilot', label: 'Pilot' },
      ],
      challenges: [
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
      portfolioPhaseInternal: [
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
          value: 'Preliminary Documentation Application',
          label: 'Preliminary Documentation Application',
        },
        {
          value: 'Preliminary Documentation Review',
          label: 'Preliminary Documentation Review',
        },
        {
          value: 'Precertification Decision',
          label: 'Precertification Decision',
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
          value: 'Performance Verification Appeal Application',
          label: 'Performance Verification Appeal Application',
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
          value: 'Performance Verification Scheduling In Progress',
          label: 'Performance Verification Scheduling In Progress',
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
          value: 'Performance Verification Scheduled',
          label: 'Performance Verification Scheduled',
        },
        {
          value: 'Final WELL Report',
          label: 'Final WELL Report',
        },
        {
          value:
            'Documentation Review Complete - Performance Testing Scheduling on Hold',
          label:
            'Documentation Review Complete - Performance Testing Scheduling on Hold',
        },
        {
          value:
            'Performance Testing in progress with independent Performance Testing Agent',
          label:
            'Performance Testing in progress with independent Performance Testing Agent',
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
          value: 'Preliminary Health-Safety Review',
          label: 'Preliminary Health-Safety Review',
        },
        {
          value: 'Final Health-Safety Review',
          label: 'Final Health-Safety Review',
        },
        {
          value: 'Final Health-Safety Application',
          label: 'Final Health-Safety Application',
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
    }
  },
  computed: {
    ...mapState({
      currentUser: (state) => state.user.currentUser,
      portfolio: (state) => state.portfolio.portfolio,
      portfolio_number: (state) => state.portfolio.portfolio.portfolio_number,
      coachingContacts: (state) => state.portfolio.coachingContacts,
      wellReviewers: (state) => state.portfolio.externalReviewers,
      assessorUsers: (state) => state.portfolio.wellReviewers,
      externalReviewers: (state) => state.portfolio.externalReviewers,
      ptAgents: (state) => state.portfolio.ptAgents,
    }),
  },
  async mounted() {
    const self = this

    this.formData = {
      ...JSON.parse(JSON.stringify(this.portfolio)),
      close_documents: this.formData.close_documents,
    }

    // Set portfolio Close Reason Dropdown Options
    const { data } = await this.$axios.get('api/closeReasons')
    data?.forEach((el) => {
      this.projectCloseReason.push({ value: el.id, label: el.name })
    })

    // Set DocList with Existing Docs
    if (this.portfolio?.close?.documents) {
      this.docList = this.portfolio.close.documents
    }

    // Set portfolio Reason ID to Dropdown
    if (this.portfolio?.close?.close_reason_id) {
      this.formData.close_reason_id = this.portfolio.close.close_reason_id
    }

    // Set portfolio Date to Date Picker
    if (this.portfolio?.close?.close_date) {
      this.formData.close_date = this.portfolio.close.close_date
    }

    const addressIndex = this.portfolio.addresses.findIndex(
      (a) => a.is_shipping
    )
    this.parseOwnerAddress(addressIndex)
    await this.$store.dispatch('portfolio/getAdminUsersByRole').then(() => {
      if (self.formData.reviewers !== null) {
        for (let index = 0; index < self.formData.reviewers.length; index++) {
          self.reviewerSelected.push(
            self.externalReviewers.filter(
              (a) => a.value === self.formData.reviewers[index].id
            )[0]
          )
        }
      }
      if (self.formData.ptas.length) {
        self.ptaSelected = self.ptAgents.find(
          (a) => parseInt(a.value) === self.formData.ptas[0].id
        ).value
      }
    })

    this.loadedData = true
  },
  methods: {
    removeCloseDoc(id) {
      this.docList = this.docList.filter((el) => el.id !== id)
    },
    updateFrom() {
      this.formData.pta_ids = []
      if (this.ptaSelected.length > 0) {
        this.formData.pta_ids.push(this.ptaSelected)
      }
      this.formData.external_reviewer_ids = []
      if (this.reviewerSelected.length) {
        this.formData.external_reviewer_ids = this.reviewerSelected.map(
          (a) => a.value
        )
      }
      this.formData.well_assessor_id = parseInt(this.formData.well_assessor_id)

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

      // Update
      const data = { ...this.formData }
      // Format data before submission
      data.owner_country_code = this.address.country_code
      data.owner_state = this.address.state
      data.owner_city = this.address.city
      data.owner_postal_code = this.address.postal_code
      data.owner_street = this.address.street
      this.$store
        .dispatch('portfolio/updatePortfolio', {
          id: this.portfolio.id,
          data,
        })
        .then((res) => {
          this.$refs.alert.showAlert(
            'success',
            'Changes have been saved successfully.'
          )
          this.$router.push(
            `/portfolio/${this.portfolio.portfolio_number}/dashboard`
          )
        })
    },
    updateExternalReviewers() {
      const reviewerIds = this.reviewerSelected.map((a) => a.value)
      this.$store.dispatch('portfolio/updateExternalReviewers', {
        external_reviewer_ids: reviewerIds,
      })
    },
    parseOwnerAddress(index) {
      if (index !== -1) {
        this.address = JSON.parse(
          JSON.stringify(this.portfolio.addresses[index])
        )
      }
    },
  },
}
</script>
