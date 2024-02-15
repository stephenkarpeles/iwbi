<template>
  <div>
    <div v-if="tickets" class="flex flex-wrap px-1 md:px-10 py-2 md:py-5">
      <WFeedbackModal ref="modal" class="z-40">
        <div class="h-96 overflow-y-scroll">
          <WHeadingsHThree heading="Get Help" />
          <div v-if="verifiedMembership" class="relative flex flex-grow">
            <FormulateForm class="space-y-2 w-96" @submit="createTicket">
              <FormulateInput
                data-id="about-input"
                v-model="selectedCatagory"
                type="select"
                placeholder="Please select a topic"
                :options="[
                  { label: 'Feature', value: 'well-v2-feature' },
                  { label: 'Certification Process', value: 'certification' },
                  { label: 'Administrative', value: 'administrative' },
                  { label: 'Other', value: 'general-question' },
                ]"
                label="Question About"
                validation="required"
                @input="handleIssueSelected"
              />

              <FormulateInput
                data-id="subject-input"
                v-if="
                  selectedCatagory === 'process' ||
                  selectedCatagory === 'administrative' ||
                  selectedCatagory === 'certification'
                "
                v-model="selectedSubCatagory"
                type="select"
                placeholder="Please select a topic"
                :options="subTypeOptions"
                label="Issue Sub Type"
                validation="required"
              />

              <FormulateInput
                v-if="selectedCatagory === 'well-v2-feature'"
                v-model="selectedSubCatagory"
                type="select"
                placeholder="Please select a topic"
                :options="featureOptions"
                label="Issue Sub Type"
                validation="required"
                @input="handleIssueSubTypeSelected"
              />
              <div
                v-if="
                  selectedCatagory === 'well-v2-feature' &&
                  project.type !== 'v1' &&
                  selectedSubCatagory
                "
              >
                <label
                  for="applicablePart"
                  class="w-full text-sm font-bold leading-5 text-gray-700 sm:mt-px sm:pt-2"
                  >Applicable Part</label
                >
                <multiselect
                  v-model="selectedFeatureParts"
                  :multiple="true"
                  :options="partOptions"
                  label="label"
                  name="applicablePart"
                  validation="required"
                  track-by="value"
                ></multiselect>
              </div>

              <FormulateInput
                v-model="newTicketData.subject"
                type="text"
                validation="required"
                label="Subject"
              />
              <FormulateInput
                data-id="description-input"
                v-model="newTicketData.description"
                type="textarea"
                validation="required"
                label="Description"
                input-class="h-44 border-primary-300 rounded-lg text-primary-700 block w-full mb-4 transition duration-150 ease-in-out sm:text-sm sm:leading-5"
              />
              <FormulateInput
                :key="0"
                v-model="uploads"
                label="Documents"
                :value="uploads"
                type="fileupload"
                upload-path="Aap/"
                mime-types=""
                :is-zendesk-upload="true"
              />
              <div class="flex justify-between pt-5">
                <div>
                  <WButtonsBase
                    type="primaryInverted"
                    @click.native="hideQuestionModal"
                  >
                    Cancel
                  </WButtonsBase>
                </div>
                <div>
                  <FormulateInput
                    data-id="submit-btn"
                    type="submit"
                    label="Submit"
                  />
                </div>
              </div>
            </FormulateForm>
          </div>
          <div v-else-if="verifyingMembership">
            <div class="mx-auto text-center m-8 p-8">
              <WLoadingSpinner class="mx-auto" />
              <div class="mt-3 text-primary-600">Please Wait...</div>
            </div>
          </div>
          <div v-else>
            <div class="mx-auto text-center m-8 p-8">
              <div class="mt-3 text-primary-600">{{ membershipError }}</div>
            </div>
          </div>
        </div>
      </WFeedbackModal>
      <div class="w-full">
        <WHeadingsHThree heading="Support" />
        <div class="md:flex md:pt-12">
          <WTabsHorizontal
            ref="tabs"
            v-model="currentTab"
            class="-mb-px md:ml-2 w-3/4"
            alignment="justify-around"
            :tabs="tabOptions"
          />
          <div class="ml-auto">
            <div class="flex justify-between space-x-2">
              <div class="pt-3 md:pt-0">
                <WButtonsBase
                  data-id="get-help-btn"
                  v-if="project.type !== 'v2-pilot-upgraded'"
                  icon="question-mark-circle"
                  @click.native="verifyMembership"
                >
                  Get Help
                </WButtonsBase>
              </div>
              <div>
                <Popover>
                  <WButtonsBase type="primaryInverted" icon="adjustments">
                    {{ ticketListStatus }}
                  </WButtonsBase>
                  <template #content>
                    <div class="w-32">
                      <WButtonsBase
                        type="neutral"
                        @click.native="getAllTickets"
                      >
                        All
                      </WButtonsBase>
                      <WButtonsBase
                        type="neutral"
                        @click.native="getOpenTickets"
                      >
                        Open
                      </WButtonsBase>
                      <WButtonsBase
                        type="neutral"
                        @click.native="getResolvedTickets"
                      >
                        Resolved
                      </WButtonsBase>
                    </div>
                  </template>
                </Popover>
              </div>
            </div>
          </div>
        </div>
        <div class="shadow-lg border rounded-lg overflow-auto">
          <ProjectResourcesTab
            v-if="currentTab === 'Resources'"
            class="p-2 md:p-4"
          />
          <ProjectNoteScreen
            v-if="currentTab === 'Project Notes'"
            :project="project"
          />
          <ProjectHsrPromotionTab
            v-if="currentTab === 'HSR Promotion'"
            class="p-2 md:p-4"
          />
          <ProjectHealthSafetyTab
            v-if="currentTab === 'Health-Safety'"
            class="p-2 md:p-4"
          />
          <WPRSupport v-if="currentTab === 'Performance'" class="p-2 md:p-4" />
          <div v-if="currentTab === 'Search'" class="p-5">
            <SupportAlgoliaSearch />
          </div>
          <div
            v-if="currentTab === 'Inbox' && currentScreen === 'view'"
            class="p-4"
          >
            <WLinksBase
              link="#"
              icon="arrow-narrow-left"
              @click.native="currentScreen = 'list'"
            >
              Back to tickets
            </WLinksBase>
            <ProjectTicketScreen :ticket="currentTicket" />
          </div>
          <table
            v-if="
              currentTab === 'Inbox' &&
              currentScreen === 'list' &&
              tickets.length
            "
            class="w-full divide-y divide-gray-200"
          >
            <thead>
              <tr>
                <th
                  class="px-6 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider"
                >
                  #
                </th>
                <th
                  class="px-6 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider"
                >
                  Subject
                </th>
                <th
                  class="px-6 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider"
                >
                  Created By
                </th>
                <th
                  class="px-6 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider"
                >
                  Date
                </th>
                <th
                  class="px-6 py-3 bg-gray-50 text-center text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider"
                >
                  Status
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="(ticket, index) in sortedTickets" :key="index">
                <td class="px-6 py-4 whitespace-nowrap">
                  <div
                    class="cursor-pointer text-primary-500 text-bold text-sm leading-5 uppercase"
                    @click=";(currentTicket = ticket), (currentScreen = 'view')"
                  >
                    {{ ticket.id }}
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm leading-5 text-gray-900">
                    {{ ticket.subject }}
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm leading-5 text-gray-900">
                    {{ ticket.submitted_by }}
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm leading-5 text-gray-900">
                    {{ $dayjs(ticket.created_at).format('MMM DD, YYYY') }}
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="leading-5 text-gray-900">
                    <div
                      :class="[
                        ticket.status === 'solved' && 'bg-gray-500',
                        ticket.status === 'new' && 'bg-yellow-500',
                        ticket.status === 'closed' && 'bg-gray-500',
                        ticket.status === 'open' && 'bg-red-400',
                        ticket.status === 'pending' && 'bg-blue-400',
                        'text-xs text-center badge-info uppercase p-1 text-white rounded w-full',
                      ]"
                    >
                      {{ ticket.status }}
                    </div>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
          <div
            v-if="
              currentTab === 'Inbox' &&
              currentScreen === 'list' &&
              tickets.length === 0
            "
            class="w-full my-5 text-gray-700 p-5"
          >
            <p class="mb-4">
              Welcome to your project support page! You can use this page to
              submit questions, comments or issues to our WELL coaching team. To
              get started, simply:
            </p>
            <ol class="list-decimal list-inside mb-3">
              <li>Click on <b>Get Help</b></li>
              <li>Select the topic (<b>Question About</b>).</li>
              <li>Type your question.</li>
              <li>Click <b>Submit</b>.</li>
            </ol>
            <p class="mb-3">
              You can expect an initial response within 2 business days.
            </p>
            <p>
              Some questions will be easier to answer, while others may require
              more investigation to resolve. Submitting questions individually
              allows us to properly track and respond most efficiently.
            </p>
            <p>Thanks!</p>
          </div>
        </div>
      </div>
    </div>
    <div v-else>
      <div class="mx-auto text-center m-8 p-8">
        <WLoadingSpinner class="mx-auto" />
        <div class="mt-3 text-primary-600">Loading Support Tickets...</div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapState } from 'vuex'

export default {
  data() {
    return {
      currentTab: 'Resources',
      currentScreen: 'list',
      currentTicket: null,
      newTicketData: {},
      verifiedMembership: false,
      verifyingMembership: false,
      membershipError: null,
      uploads: [],
      ticketListStatus: 'All',
      filteredTicketList: [],
      selectedCatagory: null,
      selectedSubCatagory: null,
      selectedFeatureParts: [],
    }
  },
  computed: {
    ...mapState({
      tickets: (state) => state.support.tickets,
      features: (state) => state.features.features,
      project: (state) => state.project.project,
      sortedTickets() {
        let tickets = []
        if (this.filteredTicketList.length > 0) {
          tickets = JSON.parse(JSON.stringify(this.filteredTicketList))
          tickets = tickets.sort((a, b) => b.id - a.id)
        }
        return tickets
      },
      featureOptions() {
        if (this.features) {
          const options = []

          if (this.project.type === 'v1') {
            const keys = Object.keys(this.features)
            for (let i = 0; i < keys.length; i++) {
              options.push({ label: this.features[keys[i]], value: keys[i] })
            }
          } else {
            for (let i = 0; i < this.features.length; i++) {
              const option = {
                label: this.features[i].feature_full_name,
                value: this.features[i].feature_full_name,
              }
              options.push(option)
            }
          }

          return options
        }
        return null
      },
      partOptions() {
        if (
          this.selectedCatagory === 'well-v2-feature' &&
          this.selectedSubCatagory &&
          this.project.type !== 'v1'
        ) {
          const featureParts = this.features.find(
            (feature) => feature.feature_full_name === this.selectedSubCatagory
          ).parts

          const options = []

          options.push({
            label: 'All',
            value: 'all',
          })

          for (let i = 0; i < featureParts.length; i++) {
            const option = {
              label: featureParts[i].name,
              value: featureParts[i].name,
            }
            options.push(option)
          }

          return options
        }
        return null
      },
      subTypeOptions() {
        if (this.selectedCatagory === 'certification') {
          return [
            { label: 'Registration', value: 'registration' },
            { label: 'Pricing', value: 'pricing' },
            { label: 'Precertification', value: 'precertification' },
            {
              label: 'Project Boundary Question',
              value: 'project-boundary-question',
            },
            { label: 'Documentation', value: 'documentation' },
            { label: 'Documentation Review', value: 'documentation-review' },
            { label: 'Performance Testing', value: 'performance-testing' },
            {
              label: 'Alternative Adherence Path (AAP)',
              value: 'aap',
            },
            {
              label: 'Equivalency Process (EP)',
              value: 'ep',
            },
            { label: 'Crosswalk', value: 'crosswalk' },
            {
              label: 'Curative Action and Appeals',
              value: 'curative-action-and-appeals',
            },
            {
              label: 'Mid-cycle Review (MRC)',
              value: 'mrc',
            },
            { label: 'Recertification', value: 'recertification' },
            { label: 'Other', value: 'other' },
          ]
        }

        if (this.selectedCatagory === 'administrative') {
          return [
            { label: 'Billing', value: 'admin-billing' },
            { label: 'Legal', value: 'admin-legal' },
            { label: 'Technology', value: 'admin-technology' },
          ]
        }

        if (this.selectedCatagory === 'process') {
          return [
            {
              label: 'Registration Support',
              value: 'assess-registration-support',
            },
            {
              label: 'Project Boundary Clarification',
              value: 'assess-project-boundary-clarification',
            },
            {
              label: 'Project Type Clarification',
              value: 'assess-project-type-clarification',
            },
            { label: 'Pricing', value: 'assess-pricing' },
            {
              label: 'Alternative Adherence Path (AAP) Process',
              value: 'implement-AAP-process',
            },
            {
              label: 'Equivalency Process',
              value: 'implement-equivalency-process',
            },
            { label: 'LOA Process', value: 'implement-LOA-process' },
            {
              label: 'Crosswalk Process',
              value: 'implement-crosswalk-process',
            },
            { label: 'Review Process', value: 'verify-review-process' },
            { label: 'Testing Process', value: 'verify-testing-process' },
            {
              label: 'Curative Action and Appeals Process',
              value: 'verify-curative-action-and-appeals-process',
            },
            {
              label: 'Annual submission process',
              value: 'maintain-annual-submission-process',
            },
            {
              label: 'Mid-Cycle Review Process',
              value: 'maintain-mid-cycle-review-process',
            },
            {
              label: 'Recertification Process',
              value: 'maintain-recertification-process',
            },
          ]
        }
        return null
      },
    }),
    tabOptions() {
      const options = [
        { name: 'Resources' },
        { name: 'Inbox' },
        { name: 'Project Notes' },
        { name: 'Search' },
      ]

      if (this.project.hsr_opt === 1) {
        options.push({
          name: 'Health-Safety',
        })
      }

      if (this.project.hsr_status === 'achieved') {
        options.push({
          name: 'HSR Promotion',
        })
      }

      if (this.project.wpr_opt === 1) {
        options.push({
          name: 'Performance',
        })
      }

      return options
    },
  },
  async mounted() {
    await this.$store.dispatch('support/getToken')

    await this.$store.dispatch('support/getTickets')
    this.filteredTicketList = this.tickets
    if (this.project.type === 'v1') {
      const communityFlag =
        this.project.v1_project_standard === 'community' ? 1 : 0
      this.$store.dispatch('features/getStaticV1Features', communityFlag)
    } else {
      await this.$store.dispatch(
        'features/getAllFeaturesByVersionId',
        this.project.applicable_version_id
      )
    }
  },
  methods: {
    async createTicket() {
      const payloadData = { ...this.newTicketData }

      payloadData.issue_catagory = this.selectedCatagory
      payloadData.issue_sub_catagory = this.selectedSubCatagory
      payloadData.issue_feature_parts = this.selectedFeatureParts

      if (
        payloadData.issue_catagory === 'well-v2-feature' &&
        this.project.type !== 'v1'
      ) {
        payloadData.issue_feature_parts = this.selectedFeatureParts.map(
          (part) => part.label
        )
      }
      if (this.project.type === 'v1') {
        payloadData.issue_catagory =
          this.project.v1_project_standard === 'community'
            ? 'well-community-standard-feature'
            : 'well-v1-feature'
      }
      payloadData.uploads = this.uploads.map((item) => item.token)

      const primaryAddress = this.project.addresses.filter(
        (address) => address.is_primary === 1
      )[0]
      payloadData.country_code = primaryAddress
        ? primaryAddress.country_code
        : null

      if (payloadData.country_code === null) {
        const billingAddress = this.project.addresses.filter(
          (address) => address.is_billing === 1
        )[0]
        payloadData.country_code = billingAddress
          ? billingAddress.country_code
          : null
      }

      if (payloadData.country_code === null) {
        const shippingAddress = this.project.addresses.filter(
          (address) => address.is_shipping === 1
        )[0]
        payloadData.country_code = shippingAddress
          ? shippingAddress.country_code
          : null
      }

      const newTicket = await this.$store.dispatch(
        'support/createTicket',
        payloadData
      )
      this.filteredTicketList = this.tickets
      this.hideQuestionModal()
      this.newTicketData = {}
      this.currentTab = 'Inbox'
      this.currentTicket = newTicket
      this.currentScreen = 'view'
    },
    async verifyMembership() {
      this.$refs.modal.isHidden = false
      this.newTicketData = {}
      this.verifyingMembership = true
      await this.$store
        .dispatch('support/verifyUserMembership')
        .then(() => {
          this.verifyingMembership = false
          this.verifiedMembership = true
        })
        .catch((e) => {
          this.verifyingMembership = false
          this.verifiedMembership = false
          this.membershipError = e.message
        })
    },
    hideQuestionModal() {
      this.$refs.modal.isHidden = true
      this.verifiedMembership = false
      this.verifyingMembership = false
      this.membershipError = null
      this.uploads = []
      this.selectedCatagory = null
      this.selectedSubCatagory = null
      this.selectedFeatureParts = []
    },
    async getAllTickets() {
      if (this.ticketListStatus !== 'All') {
        this.ticketListStatus = 'All'
        await this.$store.dispatch('support/getTickets')
      }
    },
    getOpenTickets() {
      if (this.ticketListStatus !== 'Open') {
        this.ticketListStatus = 'Open'
        this.filteredTicketList = this.tickets.filter(
          (ticket) => !['solved', 'closed'].includes(ticket.status)
        )
      }
    },
    getResolvedTickets() {
      if (this.ticketListStatus !== 'Resolved') {
        this.ticketListStatus = 'Resolved'
        this.filteredTicketList = this.tickets.filter((ticket) =>
          ['solved', 'closed'].includes(ticket.status)
        )
      }
    },
    handleIssueSelected() {
      this.selectedSubCatagory = null
      this.selectedFeatureParts = []
    },
    handleIssueSubTypeSelected() {
      this.selectedFeatureParts = []
    },
  },
}
</script>
