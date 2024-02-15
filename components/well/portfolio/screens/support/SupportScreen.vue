<template>
  <div>
    <div v-if="tickets" class="flex flex-wrap md:px-10 py-2 md:py-5">
      <div class="w-full">
        <div class="sm:flex justify-between lg:flex-row sm:flex-col md:mb-4">
          <div class="lg:ml-auto">
            <div
              v-if="currentTab !== 'Notes'"
              class="
                sm:flex
                lg:flex-row
                md:flex-row
                flex-col
                md:justify-between
                mb-2
                lg:space-x-2
              "
            >
              <div class="mb-4">
                <Popover class="w-full">
                  <WButtonsBase type="primaryInverted" icon="adjustments">
                    {{ ticketListStatus }}
                  </WButtonsBase>
                  <template #content>
                    <div>
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
              <div class="mb-4">
                <WButtonsBase
                  v-if="
                    currentUser.role.includes('admin') ||
                    currentUser.role.includes('well-admin') ||
                    currentUser.role.includes('project-coach') ||
                    currentUser.role.includes('well-assessor')
                  "
                  type="primaryInverted"
                  icon="minus-circle"
                  @click.native="clearTicketCache"
                >
                  <span v-if="!clearingCache">Clear Cache</span>
                  <span v-else>Clearing cache</span>
                </WButtonsBase>
              </div>
              <div class="mb-4">
                <WButtonsBase
                  icon="question-mark-circle"
                  @click.native="verifyMembership"
                >
                  Get Help
                </WButtonsBase>
              </div>
            </div>
            <div v-if="currentTab === 'Notes'" class="flex space-x-2">
              <div
                v-if="
                  currentUser.role.includes('well-admin') ||
                  currentUser.role.includes('portfolio-admin')
                "
                class="w-full"
              >
                <WButtonsBase icon="plus" @click.native="addNote">
                  Add Notes
                </WButtonsBase>
              </div>
            </div>
          </div>
        </div>
        <div class="mb-6">
          <WHeadingsHThree heading="Support" />
        </div>
        <div class="lg:flex md:flex justify-between lg:mt-12 md:mt-6">
          <div class="lg:w-2/3 sm:w-full">
            <WTabsHorizontal
              ref="tabs"
              v-model="currentTab"
              class="-mb-px md:ml-2"
              alignment="justify-around"
              :tabs="tabOptions"
            />
          </div>
          <div class="w-1/3 relative sm:block hidden">
            <div class="absolute bottom-0 right-0">
              <img
                src="/portfolio/screen/support/portfolio-support-hand.png"
                alt=""
                srcset=""
              />
            </div>
          </div>
        </div>
        <div class="shadow-lg border rounded-lg overflow-auto"></div>
        <div class="grid grid-cols-1 gap-y-6 xl:gap-x-6 xl:grid-cols-3 mt-10">
          <div
            class="w-full border border-primary-200 rounded-lg p-4"
            :class="[
              currentTab === 'Support' && currentScreen === 'view'
                ? 'col-span-3'
                : 'col-span-2',
            ]"
          >
            <div v-if="currentTab === 'Notes' && currentScreen === 'list'">
              <PortfolioNotesTab />
            </div>
            <div v-if="currentTab === 'Notes' && currentScreen === 'add'">
              <WLinksBase
                link="#"
                icon="arrow-narrow-left"
                @click.native="currentScreen = 'list'"
              >
                Back to List
              </WLinksBase>
              <PortfolioNotesAddScreen ref="notes" :notes="{}" />
            </div>
            <div v-if="currentTab === 'Notes' && currentScreen === 'edit'">
              <WLinksBase
                link="#"
                icon="arrow-narrow-left"
                @click.native="currentScreen = 'list'"
              >
                Back to List
              </WLinksBase>
              <PortfolioNotesAddScreen :notes="note" />
            </div>
            <PortfolioHsrPromotionTab v-if="currentTab === 'HSR Promotion'" />
            <PortfolioHealthSafetyTab v-if="currentTab === 'Health-Safety'" />
            <PortfolioUpgradeTab v-if="currentTab === 'Portfolio Upgrade'" />
            <div
              v-if="currentTab === 'Support' && currentScreen === 'view'"
              class="p-4"
            >
              <WLinksBase
                link="#"
                icon="arrow-narrow-left"
                @click.native="currentScreen = 'list'"
              >
                Back to tickets
              </WLinksBase>
              <PortfolioTicketScreen :ticket="currentTicket" />
            </div>
            <div class="overflow-x-scroll">
              <table
                v-if="
                  currentTab === 'Support' &&
                  currentScreen === 'list' &&
                  tickets.length
                "
                class="w-full divide-gray-200"
              >
                <thead>
                  <tr>
                    <th
                      class="
                        px-6
                        py-3
                        bg-gray-50
                        text-left text-xs
                        leading-4
                        font-medium
                        text-gray-500
                        uppercase
                        tracking-wider
                      "
                    >
                      #
                    </th>
                    <th
                      class="
                        px-6
                        py-3
                        bg-gray-50
                        text-left text-xs
                        leading-4
                        font-medium
                        text-gray-500
                        uppercase
                        tracking-wider
                      "
                    >
                      Subject
                    </th>
                    <th
                      class="
                        px-6
                        py-3
                        bg-gray-50
                        text-left text-xs
                        leading-4
                        font-medium
                        text-gray-500
                        uppercase
                        tracking-wider
                      "
                    >
                      Created By
                    </th>
                    <th
                      class="
                        px-6
                        py-3
                        bg-gray-50
                        text-left text-xs
                        leading-4
                        font-medium
                        text-gray-500
                        uppercase
                        tracking-wider
                      "
                    >
                      Date
                    </th>
                    <th
                      class="
                        px-6
                        py-3
                        bg-gray-50
                        text-center text-xs
                        leading-4
                        font-medium
                        text-gray-500
                        uppercase
                        tracking-wider
                      "
                    >
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
                  <tr v-for="(ticket, index) in sortedTickets" :key="index">
                    <td class="px-6 py-4 whitespace-nowrap">
                      <div
                        class="
                          cursor-pointer
                          text-primary-500 text-bold text-sm
                          leading-5
                          uppercase
                        "
                        @click="
                          ;(currentTicket = ticket), (currentScreen = 'view')
                        "
                      >
                        {{ ticket.id }}
                      </div>
                    </td>
                    <td class="px-6 py-4">
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
                      <div class="leading-5">
                        <div
                          :class="[
                            ticket.status === 'solved' && 'bg-gray-500',
                            ticket.status === 'new' && 'bg-yellow-500',
                            ticket.status === 'closed' && 'bg-gray-500',
                            ticket.status === 'open' && 'bg-red-400',
                            ticket.status === 'pending' && 'bg-blue-400',
                            'text-xs text-center badge-info uppercase p-1 text-white rounded w-full',
                          ]"
                          style="font-size: 10px"
                        >
                          {{ ticket.status }}
                        </div>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div
              v-if="
                currentTab === 'Support' &&
                currentScreen === 'list' &&
                tickets.length === 0
              "
              class="w-full text-gray-700 text-sm leading-5"
            >
              <div v-if="ticketListStatus === 'Resolved'">
                <p>You don't have any resolved questions.</p>
                <p>
                  You can either ask a new question by clicking
                  <b>Get Help</b> button above or, select <b>Open</b> from the
                  options above to view your open questions.
                </p>
              </div>
              <div v-else>
                <p class="mb-4">
                  Welcome to your portfolio support page! You can use this page
                  to submit questions, comments or issues to our WELL coaching
                  team. To get started, simply:
                </p>
                <ol class="list-disc list-inside mb-3 ml-2 text-primary-700">
                  <li>Click on <b>Get Help</b></li>
                  <li>Select the topic (<b>Question About</b>).</li>
                  <li>Type your question.</li>
                  <li>Click <b>Submit</b>.</li>
                </ol>
                <p class="mb-3">
                  You can expect an initial response within 2 business days.
                </p>
                <p>
                  Some questions will be easier to answer, while others may
                  require more investigation to resolve. Submitting questions
                  individually allows us to properly track and respond most
                  efficiently.
                </p>
                <p>Thanks!</p>
              </div>
            </div>
          </div>
          <div v-if="currentScreen !== 'view'">
            <div
              class="
                border
                rounded-md
                border-primary-200
                p-4
                h-full
                overflow-auto
              "
            >
              <div class="flex justify-between">
                <div>
                  <div
                    class="
                      text-xs
                      tracking-tighter
                      font-semibold
                      text-primary-600
                      leading-5
                      uppercase
                    "
                  >
                    SUPPORT
                  </div>
                  <div
                    class="
                      text-2xl
                      font-bold
                      text-primary-900
                      whitespace-nowrap
                    "
                  >
                    Dedicated support
                  </div>
                  <div class="my-2 text-base leading-6">
                    <p>
                      Collaboration with our coaching team is included in your
                      WELL Portfolio participation. Coaching contacts can answer
                      questions, share helpful resources and tools and provide
                      thoughtful feedback and direction over the course of the
                      portfolio process.
                    </p>
                  </div>
                </div>
              </div>
            </div>
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
    <WFeedbackModal ref="modal" class="z-40">
      <div class="h-96 overflow-y-scroll">
        <WHeadingsHThree heading="Get Help" />
        <div v-if="verifiedMembership" class="relative flex flex-grow">
          <FormulateForm class="space-y-2 w-96" @submit="createTicket">
            <FormulateInput
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
                selectedCatagory === 'well-v2-feature' && selectedSubCatagory
              "
            >
              <label
                for="applicablePart"
                class="
                  w-full
                  text-sm
                  font-bold
                  leading-5
                  text-gray-700
                  sm:mt-px sm:pt-2
                "
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
                <FormulateInput type="submit" label="Submit" />
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
  </div>
</template>
<script>
import { mapState } from 'vuex'
export default {
  data() {
    return {
      currentTab: 'Support',
      searchValue: '',
      clearingCache: false,
      currentScreen: 'list',
      currentTicket: null,
      note: {},
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
      currentUser: (state) => state.user.currentUser,
      tickets: (state) => state.support.tickets,
      features: (state) => state.features.features,
      portfolio: (state) => state.portfolio.portfolio,
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

          if (this.portfolio.type === 'v1') {
            const keys = Object.keys(this.features)
            for (let i = 0; i < keys.length; i++) {
              options.push({ label: this.features[keys[i]], value: keys[i] })
            }
          } else {
            for (let b = 0; b < this.features.length; b++) {
              const option = {
                label: this.features[b].feature_full_name,
                value: this.features[b].feature_full_name,
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
          this.selectedSubCatagory
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
            { label: 'Legal', value: 'admin-legal' },
            { label: 'Technology', value: 'admin-technology' },
            { label: 'Billing', value: 'admin-billing' },
          ]
        }

        if (this.selectedCatagory === 'process') {
          return [
            {
              label: 'Assess - Registration Support',
              value: 'assess-registration-support',
            },
            {
              label: 'Assess - Project Boundary Clarification',
              value: 'assess-project-boundary-clarification',
            },
            {
              label: 'Assess - Project Type Clarification',
              value: 'assess-project-type-clarification',
            },
            { label: 'Assess - Pricing', value: 'assess-pricing' },
            {
              label: 'Implement - Alternative Adherence Path (AAP) Process',
              value: 'implement-AAP-process',
            },
            {
              label: 'Implement - Equivalency Process',
              value: 'implement-equivalency-process',
            },
            {
              label: 'Implement - LOA Process',
              value: 'implement-LOA-process',
            },
            {
              label: 'Implement - Crosswalk Process',
              value: 'implement-crosswalk-process',
            },
            {
              label: 'Verify - Review Process',
              value: 'verify-review-process',
            },
            {
              label: 'Verify - Testing Process',
              value: 'verify-testing-process',
            },
            {
              label: 'Verify - Curative Action and Appeals Process',
              value: 'verify-curative-action-and-appeals-process',
            },
            {
              label: 'Maintain - Annual submission process',
              value: 'maintain-annual-submission-process',
            },
            {
              label: 'Maintain - Mid-Cycle Review Process',
              value: 'maintain-mid-cycle-review-process',
            },
            {
              label: 'Maintain - Recertification Process',
              value: 'maintain-recertification-process',
            },
          ]
        }
        return null
      },
    }),
    tabOptions() {
      const options = [{ name: 'Support' }, { name: 'Notes' }]
      if (this.portfolio.hsr_scorecard_id) {
        options.push({
          name: 'Health-Safety',
        })
      }

      if (this.currentUser && this.currentUser.role.includes('well-admin')) {
        options.push({
          name: 'Portfolio Upgrade',
        })
      }

      if (this.portfolio.hsr_status === 'achieved') {
        options.push({
          name: 'HSR Promotion',
        })
      }

      return options
    },
  },
  watch: {
    currentTab(value) {
      if (value === 'Support') {
        this.currentScreen = 'list'
      }
      if (value === 'Notes') {
        this.getNotes()
      }
    },
  },

  async mounted() {
    await this.$store.dispatch('portfolio/getPortfolio', {
      id: this.$route.params.id,
    })
    if (
      this.$store.state.support.supportToken === null ||
      this.tickets === null
    ) {
      await this.$store.dispatch('support/getPortfolioToken')
    }
    await this.$store.dispatch('support/getPortfolioTickets', false)
    this.filteredTicketList = this.tickets
    if (this.portfolio.applicable_version_id) {
      await this.$store.dispatch(
        'features/getAllFeaturesByVersionId',
        this.portfolio.applicable_version_id
      )
    } else {
      await this.$store.dispatch('features/getAllPortfolioFeatures')
    }
  },
  methods: {
    async createTicket() {
      const payloadData = { ...this.newTicketData }
      payloadData.issue_catagory = this.selectedCatagory
      payloadData.issue_sub_catagory =
        this.selectedCatagory === 'general-question'
          ? 'Other'
          : this.selectedSubCatagory
      payloadData.issue_feature_parts = this.selectedFeatureParts
      if (payloadData.issue_catagory === 'well-v2-feature') {
        payloadData.issue_feature_parts = this.selectedFeatureParts.map(
          (part) => part.label
        )
      }
      payloadData.uploads = this.uploads.map((item) => item.token)
      const newTicket = await this.$store.dispatch(
        'support/createPortfolioTicket',
        payloadData
      )
      this.filteredTicketList = this.tickets
      this.hideQuestionModal()
      this.newTicketData = {}
      this.currentTab = 'Support'
      this.currentTicket = newTicket
      this.currentScreen = 'view'
    },
    getNotes() {
      this.currentScreen = 'list'
      this.$store.dispatch('portfolio/getNotesList', {
        id: this.$route.params.id,
      })
      this.currentScreen = 'list'
    },
    addNote() {
      this.currentScreen = 'add'
      // this.$refs.notes.note = {}
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
    handleIssueSelected() {
      this.selectedSubCatagory = null
      this.selectedFeatureParts = []
    },
    async getAllTickets() {
      if (this.ticketListStatus !== 'All') {
        this.ticketListStatus = 'All'
        await this.$store.dispatch('support/getPortfolioTickets', false)
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
    handleIssueSubTypeSelected() {
      this.selectedFeatureParts = []
    },
    clearTicketCache() {
      const data = {
        user_name: `${this.currentUser.name} ${
          this.currentUser.last_name ? this.currentUser.last_name : ''
        }`,
        user_email: this.currentUser.email,
        org_name: `'V2-Portfolio-TEST'-${this.portfolio.portfolio_number}-${this.portfolio.name}`,
      }
      this.clearingCache = true
      this.$axios
        .post(process.env.supportApi + 'support/webhook-list', data)
        .then((res) => {
          this.clearingCache = false
          this.$store.dispatch('support/getPortfolioTickets', false)
        })
    },
    clearFilter() {
      this.searchValue = ''
    },
  },
}
</script>
