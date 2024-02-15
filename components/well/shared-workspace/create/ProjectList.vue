<template>
  <div class="bg-gray-100 p-0 md:p-4 mx-0 md:mx-10 my-0 md:my-10">
    <div class="p-0 md:p-8 bg-white rounded-md">
      <div
        v-if="sharedWorkspaceList"
        class="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8"
      >
        <div class="py-2 align-middle inline-block w-full sm:px-6 lg:px-8">
          <NavBreadcrumbs>
            <WHeadingsHTwo heading="WELL Health-Safety" />
            <template #actions>
              <div class="md:flex gap-x-2 gap-y-2 md:grid grid-cols-2">
                <WButtonsBase disabled icon="plus" type="primary">
                  Start a New Project
                </WButtonsBase>
              </div>
            </template>
          </NavBreadcrumbs>

          <form
            class="md:grid grid-cols-6 gap-4 mb-5"
            @submit.prevent="
              $store.dispatch('portfolio/getPortfolioList', allFilters)
            "
          >
            <FormulateInput
              v-model="filters.portfolio_number"
              disabled
              type="text"
              placeholder="ID"
              label="Health-Safety ID"
            />
            <FormulateInput
              v-model="filters.name"
              disabled
              type="text"
              placeholder="Name"
              label="Name"
            />

            <FormulateInput
              type="submit"
              label="Apply"
              disabled
              class="my-auto pt-1"
            />
            <div class="my-auto pt-1">
              <WButtonsBase
                v-if="
                  filters.portfolio_number ||
                  filters.name ||
                  filters.type !== 'v2-hsr'
                "
                type="primaryInverted"
                @click.native="clearFilters()"
              >
                Clear filters
              </WButtonsBase>
            </div>
          </form>

          <div class="border-b">
            <div class="md:w-1/3 mr-auto">
              <WTabsHorizontal
                v-model="tab"
                alignment="justify-between"
                class="w-full -mb-px"
                :tabs="[
                  { name: 'Active Projects', icon: '' },
                  { name: 'Archived Projects', icon: '' },
                ]"
              />
            </div>
          </div>

          <WFeedbackModal ref="modal">
            <div class="max-w-lg mx-10 my-5">
              <div class="flex justify-center mb-4">
                <div
                  class="bg-yellow-100 flex flex-shrink-0 h-16 items-center justify-center mx-auto rounded-full sm:mx-0 w-16"
                >
                  <svg
                    class="h-8 w-8 text-yellow-600"
                    x-description="Heroicon name: outline/exclamation"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                    ></path>
                  </svg>
                </div>
              </div>
              <div class="mb-5 text-primary-800 text-center py-4">
                This will remove
                <span v-if="selectedPortfolio" class="font-bold">
                  #{{ selectedPortfolio.portfolio_number }} -
                  {{ selectedPortfolio.name }}
                </span>
                from your Active Projects tab and move it to the Archived
                Projects tab. You will be able to restore it later if you
                choose.
              </div>
              <div class="flex justify-between space-x-5">
                <div class="w-24">
                  <WButtonsBase
                    type="primaryInverted"
                    @click.native="$refs.modal.isHidden = true"
                  >
                    Cancel
                  </WButtonsBase>
                </div>
                <WButtonsBase type="primary" @click.native="deletePortfolio()">
                  I understand, archive this project.
                </WButtonsBase>
              </div>
            </div>
          </WFeedbackModal>

          <div
            class="mt-2 relative shadow overflow-hidden border-b border-gray-200 sm:rounded-lg"
          >
            <div class="overflow-x-scroll">
              <table class="w-full divide-y divide-gray-200">
                <thead>
                  <tr class="text-white bg-primary-700">
                    <th
                      class="md:px-6 px-3 py-3 text-left text-xs leading-4 font-medium uppercase tracking-wider"
                    >
                      ID
                    </th>
                    <th
                      class="md:px-6 px-3 py-3 text-left text-xs leading-4 font-medium uppercase tracking-wider"
                    >
                      Name
                    </th>
                    <th
                      class="md:px-6 px-3 py-3 text-left text-xs leading-4 font-medium uppercase tracking-wider"
                    >
                      Status
                    </th>
                    <th
                      class="md:px-6 px-3 py-3 text-xs leading-4 font-medium uppercase tracking-wider"
                    >
                      <span v-if="tab === 'Active Projects'"> Next Steps </span>
                    </th>
                    <th
                      class="md:px-6 px-3 py-3 text-left text-xs leading-4 font-medium uppercase tracking-wider"
                    >
                      <div class="w-28"></div>
                    </th>
                    <th
                      class="w-28 right-0 transform absolute md:px-6 px-3 py-3 text-left text-xs leading-4 font-medium uppercase tracking-wider"
                    >
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody
                  v-if="sharedWorkspace"
                  class="bg-white divide-y divide-gray-200"
                >
                  <tr>
                    <td class="h-20 px-3 md:px-6 py-4 whitespace-nowrap">
                      <div
                        class="text-sm leading-5 text-primary-500 cursor-pointer flex space-x-2"
                      >
                        <div
                          @click="
                            paidStatus(sharedWorkspace)
                              ? $router.push(
                                  `/shared-workspaces/${sharedWorkspace.portfolio_number}/dashboard`
                                )
                              : $router.push(
                                  `/shared-workspaces/create/${
                                    sharedWorkspace.portfolio_number
                                  }${
                                    sharedWorkspace.from_assessment
                                      ? '?prelim=0'
                                      : ''
                                  }`
                                )
                          "
                        >
                          <div
                            v-if="sharedWorkspace.from_assessment"
                            class="w-20"
                          >
                            Prelim
                          </div>
                          <div v-else class="w-20">
                            {{ sharedWorkspace.portfolio_number }}
                          </div>
                        </div>
                        <a
                          :href="
                            paidStatus(sharedWorkspace)
                              ? `/shared-workspaces/${sharedWorkspace.portfolio_number}/dashboard`
                              : `/shared-workspaces/create/${
                                  sharedWorkspace.portfolio_number
                                }${
                                  sharedWorkspace.from_assessment
                                    ? '?prelim=0'
                                    : ''
                                }`
                          "
                          target="_blank"
                        >
                          <WIconsBase
                            icon="external-link"
                            type="blank"
                            class="text-gray-400 hover:text-gray-500"
                          />
                        </a>
                      </div>
                    </td>
                    <td class="px-3 md:px-6 py-4 whitespace-nowrap">
                      <div class="text-sm leading-5 font-medium text-gray-900">
                        {{ sharedWorkspace.name }}
                      </div>
                    </td>
                    <td class="px-3 md:px-6 py-4 whitespace-nowrap">
                      <div class="text-sm leading-5 font-medium text-gray-900">
                        <div
                          v-if="sharedWorkspace.portfolio_status === 'Achieved'"
                          class="px-2 inline-flex text-xs leading-5 rounded-full bg-success-600 text-white uppercase"
                        >
                          Achieved
                        </div>
                        <div
                          v-else-if="
                            sharedWorkspace.portfolio_status ===
                            'Payment Pending'
                          "
                          class="px-2 inline-flex text-xs leading-5 rounded-full bg-primary-600 text-white uppercase"
                        >
                          Payment Pending
                        </div>
                        <div
                          v-else-if="
                            sharedWorkspace.portfolio_status ===
                            'Pre-Enrollment'
                          "
                          class="px-2 inline-flex text-xs leading-5 rounded-full bg-secondary-600 text-white uppercase"
                        >
                          Pre-Enrollment
                        </div>
                        <div
                          v-else-if="
                            sharedWorkspace.portfolio_status ===
                            'Ready to Enroll'
                          "
                          class="px-2 inline-flex text-xs leading-5 rounded-full bg-secondary-600 text-white uppercase"
                        >
                          Ready to Enroll
                        </div>
                        <div
                          v-else-if="
                            sharedWorkspace.portfolio_status === 'Registered'
                          "
                          class="px-2 inline-flex text-xs leading-5 rounded-full bg-green-600 text-white uppercase"
                        >
                          Registered
                        </div>
                        <div
                          v-else-if="
                            sharedWorkspace.portfolio_status === 'Under Review'
                          "
                          class="px-2 inline-flex text-xs leading-5 rounded-full bg-yellow-600 text-white uppercase"
                        >
                          Under Review
                        </div>
                        <div
                          v-else-if="
                            sharedWorkspace.portfolio_status ===
                            'Action Required'
                          "
                          class="px-2 inline-flex text-xs leading-5 rounded-full bg-red-600 text-white uppercase"
                        >
                          Action Required
                        </div>
                        <div
                          v-else-if="
                            sharedWorkspace.portfolio_status === 'Expired'
                          "
                          class="px-2 inline-flex text-xs leading-5 rounded-full bg-red-600 text-white uppercase"
                        >
                          Expired
                        </div>
                      </div>
                    </td>
                    <td
                      class="md:px-6 px-3 py-4 whitespace-nowrap text-sm leading-5 font-medium"
                    >
                      <div v-if="tab === 'Active Projects'">
                        <span
                          v-if="
                            sharedWorkspace.portfolio_status === 'Under Review'
                          "
                        >
                          Results expected by
                          {{
                            $dayjs(
                              sharedWorkspace.pending_review_est_date
                            ).format('MMM DD, YYYY')
                          }}
                        </span>
                        <span
                          v-else-if="
                            sharedWorkspace.portfolio_status === 'Expired'
                          "
                        >
                          Expired on
                          {{
                            $dayjs(sharedWorkspace.hsr_achieved_date).format(
                              'MMM DD, YYYY'
                            )
                          }}
                          -
                          <span
                            class="cursor-pointer text-primary-600 hover:text-primary-900"
                            :disabled="true"
                            @click="goToNextStep(sharedWorkspace)"
                          >
                            Enroll Now
                          </span>
                        </span>
                        <span
                          v-else-if="
                            sharedWorkspace.portfolio_status === 'Achieved'
                          "
                        >
                          Expires on
                          {{
                            $dayjs(sharedWorkspace.hsr_achieved_date)
                              .add(1, 'year')
                              .format('MMM DD, YYYY')
                          }}

                          <span
                            v-if="
                              monthDiff(
                                new Date(),
                                new Date(
                                  $dayjs(sharedWorkspace.hsr_achieved_date).add(
                                    1,
                                    'year'
                                  )
                                )
                              ) <= 9
                            "
                          >
                            -
                            <span
                              class="cursor-pointer text-primary-600 hover:text-primary-900 text-center"
                              :disabled="true"
                              @click="goToNextStep(sharedWorkspace)"
                            >
                              Renew Now
                            </span>
                          </span>
                          <span
                            v-else
                            class="cursor-pointer text-primary-600 hover:text-primary-900 text-center"
                            :disabled="true"
                            @click="goToNextStep(sharedWorkspace)"
                          >
                            - Promote your achievement</span
                          >
                        </span>
                        <span
                          v-else-if="paidStatus(sharedWorkspace)"
                          class="cursor-pointer text-primary-600 hover:text-primary-900 text-center"
                          :disabled="true"
                          @click="goToNextStep(sharedWorkspace)"
                        >
                          View Dashboard
                        </span>
                        <span
                          v-else-if="
                            sharedWorkspace.portfolio_status ===
                            'Payment Pending'
                          "
                          :disabled="true"
                          class="cursor-pointer text-primary-600 hover:text-primary-900 text-center"
                          @click="goToNextStep(sharedWorkspace)"
                        >
                          Complete Payment
                        </span>
                        <span
                          v-else
                          class="cursor-pointer text-primary-600 hover:text-primary-900 text-center"
                          :disabled="true"
                          @click="goToNextStep(sharedWorkspace)"
                        >
                          Enroll now!
                        </span>
                      </div>
                    </td>
                    <td class="w-28"></td>
                    <td
                      v-if="
                        sharedWorkspace.portfolio_status == 'Payment Pending'
                      "
                      class="h-20 border-b flex justify-around w-28 right-0 transform absolute md:px-6 px-3 py-4 whitespace-nowrap white-gradient"
                    >
                      <Popover v-if="!paidStatus(sharedWorkspace)">
                        <WIconsBase
                          icon="dots-vertical"
                          class="cursor-pointer"
                          type="primary"
                        />

                        <template #content>
                          <div class="w-56">
                            <WButtonsBase
                              v-if="tab === 'Archived Projects'"
                              type="blank"
                              class="px-4 flex focus:outline-none py-3 text-primary-700 w-full"
                              @click.native="
                                restorePortfolio(sharedWorkspace.id)
                              "
                            >
                              Restore project
                            </WButtonsBase>
                            <WButtonsBase
                              v-if="
                                tab === 'Active Projects' &&
                                sharedWorkspace.assessment &&
                                sharedWorkspace.assessment.code
                              "
                              type="blank"
                              class="px-4 flex focus:outline-none py-3 text-primary-700 w-full"
                              @click.native="
                                $router.push(
                                  `/shared-workspaces/roadmap/report/${sharedWorkspace.assessment.code}`
                                )
                              "
                            >
                              <span
                                v-if="sharedWorkspace.assessment.completed_at"
                              >
                                Review Your Journey
                              </span>
                              <span v-else> Plan Your Journey </span>
                            </WButtonsBase>
                            <WButtonsBase
                              v-if="
                                tab === 'Active Projects' &&
                                (currentUser.role.includes('well-admin') ||
                                  currentUser.role.includes('admin') ||
                                  sharedWorkspace.user_id === currentUser.id) &&
                                sharedWorkspace.reg_payment_status !== 'paid'
                              "
                              type="blank"
                              class="px-4 flex focus:outline-none py-3 text-primary-700 w-full"
                              :disabled="true"
                              @click.native="
                                ;($refs.modal.isHidden = false),
                                  (selectedPortfolio = sharedWorkspace)
                              "
                            >
                              Archive This Project
                            </WButtonsBase>
                          </div>
                        </template>
                      </Popover>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <!-- <FormInputsPagination
              :pagination="paginate"
              :offset="3"
              @paginate="
                $store.dispatch('portfolio/getPortfolioList', allFilters)
              "
            /> -->
          </div>
        </div>
      </div>
      <div v-else class="h-screen w-full mt-14">
        <div v-if="error == null" class="mx-auto text-center">
          <WLoadingSpinner class="mx-auto" />
          <div class="mt-3 text-primary-600">Loading shared workspaces...</div>
        </div>
        <div v-else class="mx-auto text-center">
          <div class="mt-3 text-danger-400 font-medium">
            Something went wrong. Please check that you have correct permissions
            to view this.
            <br />
            Error: {{ error }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapState } from 'vuex'

export default {
  data() {
    return {
      tab: 'Active Projects',
      selectedPortfolio: null,
      filters: {
        type: 'v2-hsr',
        portfolio_number: '',
        name: '',
        deleted_at: null,
      },
      error: null,
    }
  },
  head() {
    return {
      title: `Health Safety`,
    }
  },

  computed: {
    ...mapState({
      sharedWorkspaceList: (state) => state.portfolio.portfolioList,
      currentUser: (state) => state.user.currentUser,
    }),
    sharedWorkspace() {
      return this.sharedWorkspaceList.data.find(
        (item) => item.portfolio_number === this.$route.params.id
      )
    },
    paginate() {
      if (this.sharedWorkspaceList) {
        return {
          total: this.sharedWorkspaceList.total,
          per_page: this.sharedWorkspaceList.per_page,
          current_page: this.sharedWorkspaceList.current_page,
          last_page: this.sharedWorkspaceList.last_page,
          from: this.sharedWorkspaceList.from,
          to: this.sharedWorkspaceList.to,
        }
      }
      return {}
    },
    allFilters() {
      const res = JSON.parse(JSON.stringify(this.filters))
      res.page = this.paginate.current_page
      return res
    },
  },
  watch: {
    tab(newValue) {
      if (newValue === 'Active Projects') {
        this.filters.deleted_at = null
      } else {
        this.filters.deleted_at = 'only'
      }
      this.$store.dispatch('portfolio/getPortfolioList', this.allFilters)
    },
  },
  async created() {
    return await this.$store
      .dispatch('portfolio/getPortfolioList', this.allFilters)
      .catch((error) => (this.error = error))
  },
  methods: {
    monthDiff(d1, d2) {
      let months
      months = (d2.getFullYear() - d1.getFullYear()) * 12
      months -= d1.getMonth()
      months += d2.getMonth()
      return months <= 0 ? 0 : months
    },
    goToNextStep(sharedWorkspace) {
      if (sharedWorkspace.portfolio_status === 'Expired') {
        this.$router.push(
          `/shared-workspaces/${sharedWorkspace.portfolio_number}/recertification`
        )
      } else if (sharedWorkspace.portfolio_status === 'Achieved') {
        if (
          this.monthDiff(
            new Date(),
            new Date(
              this.$dayjs(sharedWorkspace.hsr_achieved_date).add(1, 'year')
            )
          ) <= 9
        ) {
          this.$router.push(
            `/shared-workspaces/${sharedWorkspace.portfolio_number}/recertification`
          )
        } else {
          this.$router.push(
            `/shared-workspaces/${sharedWorkspace.portfolio_number}/promotions`
          )
        }
      } else if (
        this.paidStatus(sharedWorkspace) &&
        sharedWorkspace.d_and_o_submitted === 0
      ) {
        this.$router.push(
          `/shared-workspaces/${sharedWorkspace.portfolio_number}/documents`
        )
      } else if (this.paidStatus(sharedWorkspace)) {
        this.$router.push(
          `/shared-workspaces/${sharedWorkspace.portfolio_number}/dashboard`
        )
      } else {
        this.$router.push(
          `/shared-workspaces/create/${sharedWorkspace.portfolio_number}${
            sharedWorkspace.from_assessment ? '?prelim=0' : ''
          }`
        )
      }
    },
    deletePortfolio() {
      this.$store
        .dispatch(`portfolio/deletePortfolioById`, this.selectedPortfolio.id)
        .then((response) => {
          this.$refs.modal.isHidden = true
          this.$store.dispatch('notifications/toastMessage', {
            message: 'Project Archived Successfully!',
          })
          this.$store
            .dispatch('portfolio/getPortfolioList', this.allFilters)
            .catch((error) => (this.error = error))
        })
    },
    restorePortfolio(id) {
      this.$store
        .dispatch(`portfolio/restorePortfolioById`, id)
        .then((response) => {
          this.$store.dispatch('notifications/toastMessage', {
            message: 'Project Restored Successfully!',
          })
          this.$store
            .dispatch('portfolio/getPortfolioList', this.allFilters)
            .catch((error) => (this.error = error))
        })
    },
    clearFilters() {
      this.filters.portfolio_number = ''
      this.filters.name = ''
      this.$store.dispatch('portfolio/getPortfolioList', this.allFilters)
    },
    paidStatus(sharedWorkspace) {
      if (
        (sharedWorkspace.reg_status === 1 &&
          sharedWorkspace.reg_payment_status === 'paid') ||
        sharedWorkspace.reg_payment_status === 'waived'
      ) {
        return true
      } else {
        return false
      }
    },
  },
}
</script>
