<template>
  <div class="flex flex-wrap px-10 py-5">
    <div class="w-full mb-5 lg:w-1/3 lg:pr-16">
      <WFeedbackAlert ref="alert" />
      <WHeadingsHThree
        heading="Edit Project"
        :sub-heading="sharedWorkspace.name"
      />
      <div class="space-y-2">
        <WButtonsBase
          :type="currentTab === 'Organization' ? 'primary' : 'primaryInverted'"
          @click.native="currentTab = 'Organization'"
        >
          Organization Information
        </WButtonsBase>
        <WButtonsBase
          v-if="AdminAccess && recertificationList.length"
          :type="currentTab === 'Renewal' ? 'primary' : 'primaryInverted'"
          @click.native="currentTab = 'Renewal'"
        >
          Renewal Fields
        </WButtonsBase>
        <WButtonsBase
          v-if="AdminAccess"
          :type="currentTab === 'Admin' ? 'primary' : 'primaryInverted'"
          @click.native="currentTab = 'Admin'"
        >
          Admin Fields
        </WButtonsBase>
      </div>
    </div>
    <div class="w-full lg:w-2/3">
      <div v-if="currentTab === 'Organization'">
        <FormulateForm class="space-y-2" @submit="saveProject">
          <div class="shadow-lg border rounded-lg p-5">
            <WHeadingsHFour heading="Project Information" />
            <hr class="my-5" />
            <div class="mb-5">
              <FormulateInput
                v-model="formData.name"
                type="text"
                label="Project Name *"
                class="w-full"
                :disabled="currentUser.role.includes('admin') ? false : true"
              />
            </div>
            <div class="mt-5 text-sm font-medium leading-5 text-primary-800">
              Gross Area *
            </div>
            <div class="w-full relative">
              <FormulateInput
                v-model="formData.area"
                type="number"
                min="0"
                step=".01"
                name="area"
                placeholder="Gross Area"
                :disabled="AdminAccess ? false : true"
                validation="required|number"
                @keyup="changeAreaInMeter()"
              />
              <div
                class="absolute right-0 top-0 flex h-10 bg-primary-100 text-primary-400 border border-primary-300 rounded-r"
              >
                <div class="my-auto px-3">sq ft</div>
              </div>
            </div>
            <div class="w-full relative my-5">
              <FormulateInput
                v-model="formData.area_in_meter"
                type="number"
                min="0"
                step=".01"
                name="area_in_meter"
                placeholder="Gross Area"
                validation="required|number"
                :disabled="AdminAccess ? false : true"
                @keyup="changeAreaInFeet()"
              />
              <div
                class="absolute right-0 top-0 flex h-10 bg-primary-100 text-primary-400 border border-primary-300 rounded-r"
              >
                <div class="my-auto px-3">sq m</div>
              </div>
            </div>
            <div class="mb-5">
              <FormulateInput
                v-model="formData.no_of_assets"
                type="text"
                label="Number of locations *"
                class="w-full"
              />
            </div>
            <div class="shadow-md justify-between border rounded-md mt-5 mb-5">
              <div
                class="w-full bg-primary-50 rounded-t-md border-b px-8 py-4 text-primary-800"
              >
                <div class="font-bold">Owner Information</div>
              </div>
              <div class="px-8 py-4">
                <div>
                  <p class="text-sm">
                    The owner is the individual or entity that holds all legal
                    right to possess and control workspace-relevant location and
                    to authorize decisions pertaining to the location.
                  </p>
                </div>
                <div class="mb-5">
                  <FormulateInput
                    v-model="ownerCompany"
                    type="companymultisearch"
                    name="organization"
                    label="Organization*"
                    :searchable="true"
                    :clearonselect="false"
                    :closeonselect="true"
                    :optionslimit="10"
                  />
                </div>
                <div class="mb-5">
                  <FormulateInput
                    v-model="formData.owner_name"
                    type="text"
                    placeholder="Primary contact of the owner organization"
                    label="Owner name *"
                    class="w-full"
                  />
                </div>
                <div class="mb-5">
                  <FormulateInput
                    v-model="formData.owner_email"
                    type="text"
                    placeholder="Email address of the primary contact"
                    label="Owner email *"
                    class="w-full"
                  />
                </div>
                <div class="mb-5">
                  <FormulateInput
                    v-model="formData.owner_phone"
                    type="tel"
                    placeholder="Phone Number"
                    label="Owner phone"
                    class="w-full"
                  />
                </div>
                <div class="mb-5">
                  <FormulateInput
                    v-model="formData.industry"
                    :options="industry"
                    placeholder="Select industry"
                    type="select"
                    label="Industry"
                  />
                </div>
                <div class="mb-5">
                  <FormulateInput
                    v-model="formData.org_website"
                    type="url"
                    placeholder="Organization website"
                    label="Organization website"
                    class="w-full"
                  />
                </div>
                <div class="mb-5">
                  <FormulateInput
                    v-model="formData.org_overview"
                    type="textarea"
                    placeholder="Description"
                    label="Organization overview"
                    class="w-full"
                  />
                </div>
              </div>
            </div>
            <div class="shadow-md justify-between border rounded-md mt-5 mb-5">
              <div
                class="w-full bg-primary-50 rounded-t-md border-b px-8 py-4 text-primary-800"
              >
                <div class="font-bold">Owner address</div>
              </div>
              <div class="px-8 py-4">
                <FormInputsAddressFormulate
                  :address="ownerAddress"
                  :target="ownerAddress"
                  :required="true"
                  class-key="grid grid-cols-2 gap-x-4 gap-y-4 w-full"
                />
              </div>
            </div>
            <div class="mb-5">
              <FormulateInput
                v-model="formData.doc_sub_date_est"
                type="datetimepicker"
                max="9999-01-01"
                label="Estimated date of document submission"
              />
            </div>
            <div class="mb-5">
              <FormulateInput
                v-model="formData.scope_and_premises"
                label="WELL Health-Safety scope & premises"
                type="textarea"
              />
            </div>
            <div class="mb-5">
              <FormulateInput
                v-model="formData.goals_and_vision"
                label="WELL Health-Safety goals and vision"
                type="textarea"
              />
            </div>
            <div class="shadow-md justify-between border rounded-md mt-5 mb-5">
              <div
                class="w-full bg-primary-50 rounded-t-md border-b px-8 py-4 text-primary-800"
              >
                <div class="font-bold">Directory Listing</div>
              </div>
              <div class="px-8 py-4">
                <div>
                  <p class="text-sm">
                    As a default, an organization enrolling locations to earn a
                    WELL Health-Safety Rating has their organization name and
                    locations listed in the associated WELL directories and may
                    be referenced in IWBI materials or communications. You can
                    opt-out of these opportunities at the time of enrollment to
                    remain confidential, but organizations cannot publicly
                    promote any participation or achievements in the WELL
                    Health-Safety Rating or use any IWBI intellectual location
                    including logos until their status is public. You may change
                    the privacy setting for your project at any time before
                    issuance of the rating designation using functionality in
                    the platform. Your privacy status will be automatically
                    transitioned to a public project upon issuance of the
                    rating, but you can also adjust it from private to public at
                    any time in your account.
                  </p>
                </div>
                <div class="my-5">
                  <FormulateInput
                    v-model="formData.portfolio_public"
                    :options="[
                      { label: 'Yes', value: 1 },
                      { label: 'No', value: 0 },
                    ]"
                    label="Is this participation considered public?*"
                    type="radio"
                  />
                </div>
              </div>
            </div>
            <FormulateInput type="submit" label="Save Changes" />
          </div>
        </FormulateForm>
      </div>
      <div v-if="currentTab === 'Admin'">
        <FormulateForm @submit="saveProject">
          <div class="shadow-lg border rounded-lg p-5">
            <WHeadingsHFour heading="Admin Fields" />
            <hr class="my-5" />
            <div class="mb-5">
              <FormulateInput
                v-model="formData.coaching_contact_id"
                :options="JSON.parse(JSON.stringify(coachingContacts))"
                type="select"
                placeholder="Select coaching contact"
                label="Coaching contact"
              />
            </div>
            <div class="mb-5">
              <FormulateInput
                v-model="formData.senior_coaching_contact_id"
                :options="JSON.parse(JSON.stringify(coachingContacts))"
                type="select"
                placeholder="Select relationship manager"
                label="Relationship manager"
              />
            </div>
            <div class="mb-5">
              <FormulateInput
                v-model="formData.well_assessor_id"
                :options="JSON.parse(JSON.stringify(wellReviewers))"
                type="select"
                placeholder="Select WELL reviewer"
                label="WELL reviewer"
              />
            </div>
            <div class="mb-5 shadow-sm">
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
                :options="JSON.parse(JSON.stringify(externalReviewers))"
                placeholder="Select WELL reviewer"
                label="label"
                @input="updateExternalReviewers"
              ></multiselect>
            </div>
            <div class="mb-5 shadow-sm">
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

            <div class="shadow-md justify-between border rounded-md mt-5 mb-5">
              <div
                class="w-full bg-primary-50 rounded-t-md border-b px-8 py-4 text-primary-800"
              >
                <div class="font-bold">WELL Health Safety</div>
              </div>
              <div class="px-8 py-4">
                <div class="mb-5">
                  <FormulateInput
                    v-model="formData.hsr_status"
                    :options="[
                      { label: 'N/A', value: null },
                      { label: 'Achieved', value: 'achieved' },
                      { label: 'Not Achieved', value: 'not_achieved' },
                    ]"
                    label="Status"
                    type="radio"
                  />
                </div>
                <div class="flex space-x-2 justify-between">
                  <FormulateInput
                    v-model="formData.hsr_achieved_date"
                    class="w-full"
                    type="datetimepicker"
                    max="9999-01-01"
                    label="Awarded Date"
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
                  :upload-path="
                    'project/' + project_number + '/closedocuments/'
                  "
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
                    closeDoc.doc_status === 'invalid'
                      ? 'bg-gray-200'
                      : 'bg-white',
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
            <div class="mb-5">
              <FormulateInput
                v-model="formData.coaching_support_time"
                :options="wellCoachingSupport"
                placeholder="Select WELL coaching support"
                type="select"
                label="WELL coaching support (over portfolio life)"
              />
            </div>
            <div class="mb-5">
              <FormulateInput
                v-model="formData.enthusiasm_level"
                :options="wellenthsiasm"
                label="WELL enthusiasm level:"
                type="radio"
              />
            </div>
            <div class="mb-5">
              <FormulateInput
                v-model="formData.show_dashboard"
                type="radio"
                :options="[
                  { label: 'Yes', value: 1 },
                  { label: 'No', value: 0 },
                ]"
                label="Enable Analyze view for Dashboard"
              />
            </div>
            <div>
              <FormulateInput class="mt-4" type="submit" label="Save Changes" />
            </div>
          </div>
        </FormulateForm>
      </div>
      <div v-if="currentTab === 'Renewal'">
        <div v-for="renewal in recertificationList" :key="renewal.id">
          <div class="shadow-md justify-between border rounded-md mt-5 mb-5">
            <div
              class="w-full bg-primary-50 rounded-t-md border-b px-8 py-4 text-primary-800 flex justify-between items-center"
            >
              <div class="font-bold">
                WELL Health Safety -
                {{ $dayjs(renewal.created_at).format('MMMM DD, YYYY') }}
              </div>
              <div class="w-1/4">
                <WButtonsBase
                  :disabled="updatingRecert === renewal.id"
                  @click.native="updateRecert(renewal)"
                >
                  <span v-if="updatingRecert === renewal.id">
                    <WLoadingSpinner type="button" class="mx-auto" />
                  </span>
                  <span v-else>Save</span>
                </WButtonsBase>
              </div>
            </div>
            <div class="px-8 py-4">
              <div class="mb-5">
                <FormulateInput
                  v-model="renewal.cert_status"
                  :options="[
                    { label: 'N/A', value: null },
                    { label: 'Achieved', value: 'achieved' },
                    { label: 'Not Achieved', value: 'not_achieved' },
                  ]"
                  label="Status"
                  type="radio"
                />
              </div>
              <div class="mb-5">
                <FormulateInput
                  v-model="renewal.date_certified"
                  type="datetimepicker"
                  max="9999-01-01"
                  label="Awarded Date"
                />
              </div>
              <div v-if="renewal.discount" class="mb-5">
                <FormulateInput
                  v-model="renewal.discount.code"
                  disabled
                  type="text"
                  label="Discount Code"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapState } from 'vuex'

export default {
  props: {
    sharedWorkspace: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      docList: [],
      currentTab: 'Organization',
      ownerCompany: null,
      formData: {
        ...this.sharedWorkspace,
        close_date: null,
        close_reason_id: null,
        close_documents: [],
      },
      ownerAddress: {
        country_code: '',
        state: '',
        street: '',
        city: '',
        postal_code: '',
      },
      areaLabel: 'sq ft',
      subAreaLabel: 'sq m',
      portfolioInfo: {},
      portfolioAreaInMeter: '',
      countries: [],
      estimatedDocSubmission: '',
      anticipatedConstruction: '',
      assessorUsers: [],
      wellPtas: [],
      reviewerUsers: [],
      reviewerUsersSelected: [],
      assessorUsersSelected: [],
      wellPtaSelected: null,
      relationshipManagerSelected: null,
      projectCloseReason: [{ value: null, label: '' }],
      wellStandardList: [
        {
          label: 'WELL Building Standard for Commercial & Institutional Office',
          value: 'office',
        },
        {
          label: 'WELL Building Standard for Multifamily Residential (Pilot)',
          value: 'residential',
        },
        { label: 'WELL Building Standard for Retail (Pilot)', value: 'retail' },
        {
          label: 'WELL Building Standard for Educational Facilities (Pilot)',
          value: 'education',
        },
        {
          label: 'WELL Building Standard for Restaurants (Pilot)',
          value: 'restaurant',
        },
        { label: 'WELL Community', value: 'community' },
      ],
      constructionType: [
        { value: 1, label: 'Yes' },
        { value: 0, label: 'No, exisiting building' },
      ],
      reviewerSelected: [],
      ptaSelected: [],
      industry: [
        { value: 'Agriculture', label: 'Agriculture' },
        { value: 'Apparel', label: 'Apparel' },
        { value: 'Architecture', label: 'Architecture' },
        { value: 'Banking', label: 'Banking' },
        { value: 'Biotechnology', label: 'Biotechnology' },
        { value: 'Chemicals', label: 'Chemicals' },
        { value: 'Communications', label: 'Communications' },
        { value: 'Construction', label: 'Construction' },
        { value: 'Consulting', label: 'Consulting' },
        { value: 'Education', label: 'Education' },
        { value: 'Electronics', label: 'Electronics' },
        { value: 'Energy', label: 'Energy' },
        { value: 'Engineering', label: 'Engineering' },
        { value: 'Entertainment', label: 'Entertainment' },
        { value: 'Environmental', label: 'Environmental' },
        { value: 'Finance', label: 'Finance' },
        { value: 'Food & Beverage', label: 'Food & Beverage' },
        { value: 'Government', label: 'Government' },
        { value: 'Healthcare', label: 'Healthcare' },
        { value: 'Hospitality', label: 'Hospitality' },
        { value: 'Insurance', label: 'Insurance' },
        { value: 'Legal', label: 'Legal' },
        { value: 'Machinery', label: 'Machinery' },
        { value: 'Manufacturing', label: 'Manufacturing' },
        { value: 'Media', label: 'Media' },
        { value: 'Not For Profit', label: 'Not For Profit' },
        { value: 'Real Estate', label: 'Real Estate' },
        { value: 'Recreation', label: 'Recreation' },
        { value: 'Retail', label: 'Retail' },
        { value: 'Technology', label: 'Technology' },
        { value: 'Telecommunications', label: 'Telecommunications' },
        { value: 'Transportation', label: 'Transportation' },
        { value: 'Utilities', label: 'Utilities' },
        { value: 'Other', label: 'Other' },
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
          value: 'Documentation Review Complete',
          label: 'Documentation Review Complete',
        },
        {
          value: 'Performance Testing Scheduling on Hold',
          label: 'Performance Testing Scheduling on Hold',
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
      docSubmitPhase: '',
      portfolioCertStatus: [
        { value: 'na', label: 'N/A' },
        { value: 'Compliance', label: 'Compliance' },
        { value: 'Silver', label: 'Silver' },
        { value: 'Gold', label: 'Gold' },
        { value: 'Platinum', label: 'Platinum' },
        { value: 'Pilot', label: 'Pilot' },
      ],
      targetCertificationLevel: [
        { value: 'Bronze', label: 'Bronze' },
        { value: 'Silver', label: 'Silver' },
        { value: 'Gold', label: 'Gold' },
        { value: 'Platinum', label: 'Platinum' },
      ],
      portfolioCurrentStatus: [
        { label: 'Concept Design', value: 'concept_design' },
        { label: 'Schematic Design', value: 'schematic_design' },
        { label: 'Design Development', value: 'design_development' },
        {
          label: 'Construction Documentation',
          value: 'construction_documentation',
        },
        { label: 'Under construction', value: 'under_construction' },
        { label: 'Construction complete', value: 'construction_complete' },
        {
          label: 'Existing building or space',
          value: 'existing_building_or_space',
        },
      ],
      otherCertificationList: [
        { label: 'BREEAM', value: 'breeam' },
        { label: 'DGNB', value: 'dgnb' },
        { label: 'Green Star', value: 'green_star' },
        { label: 'HQE', value: 'hqe' },
        { label: 'LEED', value: 'leed' },
        {
          label: 'Living Building Challenge',
          value: 'living_building_challenge',
        },
        { label: 'OSMOZ', value: 'osmoz' },
        { label: 'Other', value: 'other' },
      ],
      portfolioTypes: [
        { value: 'nc', label: 'New and Existing Buildings' },
        { value: 'ci', label: 'New and Existing Interiors' },
        { value: 'cs', label: 'Core & Shell' },
        {
          value: 'cics',
          label:
            'New and Existing Interiors in a Core & Shell Certified Building',
        },
      ],
      applicantList: [
        { label: 'Acoustician', value: 'acoustician' },
        { label: 'Architect', value: 'architect' },
        {
          label: 'Commissioning Agent',
          value: 'commissioning_agent',
        },
        {
          label: 'Construction Manager',
          value: 'construction_manager',
        },
        { label: 'Contractor', value: 'contractor' },
        { label: 'Facilities Manager', value: 'facilities_manager' },
        { label: 'Interior Designer', value: 'interior_designer' },
        { label: 'Lighting Designer', value: 'lighting_designer' },
        { label: 'MEP Engineer', value: 'mep_engineer' },
        { label: 'Owner', value: 'Owner' },
        { label: 'portfolio Manager', value: 'portfolio_manager' },
        {
          label: 'Sustainability Consultant',
          value: 'sustainability_consultant',
        },
        { label: 'Wellness Consultant', value: 'wellness_consultant' },
        { label: 'Administrator', value: 'administrator' },
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
      wellenthsiasm: [
        { label: 'N/A', value: 'na' },
        { label: 'High', value: 'High' },
        { label: 'Average', value: 'Average' },
        { label: 'Low', value: 'Low' },
      ],
      wellCoachingSupportSelected: null,
      coachingContactBackupSelected: null,
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
      portfolioCertType: [
        { label: 'N/A', value: 'na' },
        { label: 'Certification', value: 'Certification' },
        { label: 'Compliance', value: 'Compliance' },
      ],
      portfolioPreCertStatus: [
        { value: 'na', label: 'N/A' },
        { value: 'Compliance', label: 'Compliance' },
        { value: 'Silver', label: 'Silver' },
        { value: 'Gold', label: 'Gold' },
        { value: 'Platinum', label: 'Platinum' },
        { value: 'Pilot', label: 'Pilot' },
      ],
      feeStructure: [
        { label: 'Yes', value: 'Yes' },
        { label: 'No', value: 'No' },
      ],
      coachingContactSelected: null,
      coachingUsers: [],
      applicantRole: '',
      showSubStandard: false,
      dods: '',
      dopv: '',
      hsrAchievedDate: '',
      precertDate: '',
      doc: '',
      doDate: '',
      updatingRecert: '',
    }
  },
  computed: {
    ...mapState({
      project: (state) => state.shared.sharedWorkspace,
      project_number: (state) => state.shared.sharedWorkspace.portfolio_number,
      currentUser: (state) => state.user.currentUser,
      coachingContacts: (state) => state.shared.coachingContacts,
      wellReviewers: (state) => state.shared.wellReviewers,
      externalReviewers: (state) => state.shared.externalReviewers,
      ptAgents: (state) => state.shared.ptAgents,
      recertificationList: (state) => state.recertification.recertificationList,
    }),
    AdminAccess() {
      return this.$store.getters['user/portfolioAdminAccess']
    },
  },
  async mounted() {
    const ownerAddress = this.formData.addresses
      ? this.formData.addresses.find((a) => a.is_shipping)
      : {}
    this.ownerAddress = {
      country_code: ownerAddress.country_code,
      city: ownerAddress.city,
      street: ownerAddress.street,
      state: ownerAddress.state,
      postal_code: ownerAddress.postal_code,
    }
    if (this.formData.owner_org && this.formData.owner_org !== '') {
      this.ownerCompany = {
        ...this.Company,
        name: this.formData.owner_org,
      }
    }
    if (this.formData.owner_company_id) {
      this.ownerCompany = {
        ...this.ownerCompany,
        id: this.formData.owner_company_id,
      }
    }

    if (this.currentUser.role.includes('well-admin')) {
      this.getCoach()
    }

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
  },
  methods: {
    removeCloseDoc(id) {
      this.docList = this.docList.filter((el) => el.id !== id)
    },
    async updateRecert(payload) {
      this.updatingRecert = payload.id
      await this.$store.dispatch('recertification/updateRecert', payload)
      await this.$store.dispatch('recertification/getHSRRecertification')
      this.$store.dispatch('notifications/toastMessage', {
        message: 'Renewal updated successfully!',
      })
      this.updatingRecert = ''
    },
    saveProject() {
      if (
        this.ownerCompany.name &&
        this.ownerCompany.id &&
        this.ownerCompany.name !== ''
      ) {
        this.formData.owner_company_id = this.ownerCompany.id
        this.formData.owner_org = this.ownerCompany.name
      }

      this.formData.pta_ids = []
      if (this.ptaSelected.value) {
        this.formData.pta_ids = [this.ptaSelected.value]
      }
      this.formData.external_reviewer_ids = []
      if (this.reviewerSelected.length) {
        this.formData.external_reviewer_ids = this.reviewerSelected.map(
          (a) => a.value
        )
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

      const data = {
        ...this.formData,
        owner_country_code: this.ownerAddress.country_code,
        owner_state: this.ownerAddress.state,
        owner_street: this.ownerAddress.street,
        owner_city: this.ownerAddress.city,
        owner_zip: this.ownerAddress.postal_code,
        space_types: this.formData.space_types.map((e) => {
          return e.id
        }),
      }

      this.$store.dispatch('shared/updateSharedWorkspaceInfo', data)
      this.$store.dispatch('notifications/toastMessage', {
        message: 'Shared workspaces updated successfully!',
      })
      this.$router.push(
        `/shared-workspaces/${this.formData.portfolio_number}/dashboard`
      )
    },
    async updateExternalReviewers() {
      const self = this
      const reviewers = []
      if (self.reviewerSelected !== null) {
        for (let index = 0; index < self.reviewerSelected.length; index++) {
          reviewers.push(self.reviewerSelected[index].value)
        }
      }
      await this.$store
        .dispatch('shared/updateExternalReviewers', {
          external_reviewer_ids: reviewers,
        })
        .then((res) => {
          this.$store.dispatch('notifications/toastMessage', {
            message: 'External reviewer updated successfully!',
          })
        })
    },
    changeAreaInMeter(event) {
      if (this.formData.area) {
        this.formData.area_in_meter = Number.parseFloat(
          this.formData.area / 10.764
        ).toFixed(2)
      } else {
        this.formData.area_in_meter = 0
      }
    },
    changeAreaInFeet(event) {
      if (this.formData.area_in_meter) {
        this.formData.area = Number.parseFloat(
          this.formData.area_in_meter * 10.764
        ).toFixed(2)
      } else {
        this.formData.area = 0
      }
    },
    getCoach() {
      const self = this
      this.$store
        .dispatch('shared/getAdminUsersByRoleWithLimitedFields')
        .then(() => {
          if (self.formData.reviewers.length) {
            for (
              let index = 0;
              index < self.formData.reviewers.length;
              index++
            ) {
              if (
                self.externalReviewers.filter(
                  (a) => a.value === self.formData.reviewers[index].id
                ).length
              ) {
                self.reviewerSelected.push(
                  self.externalReviewers.filter(
                    (a) => a.value === self.formData.reviewers[index].id
                  )[0]
                )
              }
            }
          }
          if (self.formData.ptas.length) {
            for (let index = 0; index < self.formData.ptas.length; index++) {
              if (
                self.ptAgents.filter(
                  (a) => a.value === self.formData.ptas[index].id
                ).length
              ) {
                self.ptaSelected.push(
                  self.ptAgents.filter(
                    (a) => a.value === self.formData.ptas[index].id
                  )[0]
                )
              }
            }
          }
        })
    },
  },
}
</script>
