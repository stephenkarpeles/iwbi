<template>
  <div class="flex flex-col">
    <div v-if="adminOrganizationsList">
      <NavBreadcrumbs>
        <WHeadingsHTwo class="text-primary-900" heading="Memberships" />
        <template #actions>
          <div class="justify-end w-full sm:flex">
            <div>
              <WButtonsBase
                type="primaryInverted"
                icon="download"
                @click.native="
                  $store.dispatch('membership/downloadExcelExport')
                "
              >
                Download
              </WButtonsBase>
            </div>
          </div>
        </template>
      </NavBreadcrumbs>
      <WFeedbackModal ref="modal">
        <div v-if="selectedOrg">
          <WHeadingsHFour
            :heading="'Update Membership Expiration Date - ' + selectedOrg.name"
          />
          <div class="space-y-4 md:grid grid-cols-3 gap-2">
            <FormulateInput
              v-if="selectedOrg.subscriptions[0]"
              :key="forceReRender"
              v-model="selectedOrg.subscriptions[0].starts_at"
              :value="selectedOrg.subscriptions[0].starts_at"
              class="mt-auto"
              label="Membership Start Date"
              type="datetimepicker"
            />
            <FormulateInput
              :key="forceReRender + 1"
              v-model="selectedOrg.subscriptions[0].ends_at"
              :value="selectedOrg.subscriptions[0].ends_at"
              class="mt-auto"
              label="Membership End Date"
              type="datetimepicker"
            />
            <div class="flex">
              <div class="mt-2 md:mt-7 w-full">
                <WButtonsBase @click.native="updateOrg">Save</WButtonsBase>
              </div>
            </div>
          </div>
        </div>
      </WFeedbackModal>
      <!-- mobile filters start here -->
      <LazyAccordiansBase
        ref="mobFilters"
        label="filters"
        class="sm:hidden mb-8 capitalize"
      >
        <template #content>
          <FormulateForm
            @submit="
              () => {
                getAdminOrganizationsList({ ...allFilters, page: 1 }),
                  ($refs.mobFilters.isExpanded = false)
              }
            "
          >
            <FormulateInput
              v-model="filters.org_id"
              label="ID"
              type="text"
              :error="error"
            />
            <FormulateInput
              v-model="filters.name"
              label="Name"
              type="text"
              :error="error"
            />
            <FormulateInput
              v-model="filters.user_email"
              label="User Email"
              type="text"
              :error="error"
            />
            <FormulateInput
              v-model="filters.status"
              label="Subscription Status"
              :options="{ paid: 'Active', unpaid: 'In Progress' }"
              type="select"
              placeholder=""
            />
            <div class="mt-6">
              <FormulateInput type="submit" label="Apply" />
            </div>
            <div
              v-if="
                filters.org_id ||
                filters.name ||
                filters.user_email ||
                filters.status
              "
              class="mt-4"
            >
              <WButtonsBase
                type="primaryInverted"
                @click.native="clearFilters()"
                >Clear filters</WButtonsBase
              >
            </div>
          </FormulateForm>
        </template>
      </LazyAccordiansBase>
      <!-- end here -->
      <!-- desktop filters satrt here -->
      <FormulateForm
        class="hidden sm:grid sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-6 gap-4 mb-5"
        @submit="getAdminOrganizationsList({ ...allFilters, page: 1 })"
      >
        <FormulateInput
          v-model="filters.org_id"
          label="ID"
          type="text"
          :error="error"
        />
        <FormulateInput
          v-model="filters.name"
          label="Name"
          type="text"
          :error="error"
        />
        <FormulateInput
          v-model="filters.user_email"
          label="User Email"
          type="text"
          :error="error"
        />
        <FormulateInput
          v-model="filters.status"
          label="Subscription Status"
          :options="{ paid: 'Active', unpaid: 'In Progress' }"
          type="select"
          placeholder=""
        />
        <div class="mt-6">
          <FormulateInput type="submit" label="Apply" />
        </div>
        <div
          v-if="
            filters.org_id ||
            filters.name ||
            filters.user_email ||
            filters.status
          "
          class="mt-6"
        >
          <WButtonsBase type="primaryInverted" @click.native="clearFilters()"
            >Clear filters</WButtonsBase
          >
        </div>
      </FormulateForm>
      <!-- end here -->
      <div
        class="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg"
      >
        <div class="overflow-x-scroll">
          <table class="w-full divide-y divide-gray-200">
            <thead>
              <tr class="text-white bg-primary-700">
                <th
                  class="px-6 py-3 text-left text-xs leading-4 font-medium uppercase tracking-wider"
                >
                  ID
                </th>
                <th
                  class="px-6 py-3 text-left text-xs leading-4 font-medium uppercase tracking-wider"
                >
                  Name
                </th>
                <th
                  class="px-6 py-3 text-left text-xs leading-4 font-medium uppercase tracking-wider"
                >
                  Years
                </th>
                <th
                  class="px-6 py-3 text-left text-xs leading-4 font-medium uppercase tracking-wider"
                >
                  Subscription
                </th>
                <th
                  class="px-6 py-3 text-left text-xs leading-4 font-medium uppercase tracking-wider"
                >
                  Status
                </th>
                <th
                  class="px-6 py-3 text-left text-xs leading-4 font-medium uppercase tracking-wider"
                >
                  Owner
                </th>
                <th
                  class="px-6 py-3 text-left text-xs leading-4 font-medium uppercase tracking-wider"
                >
                  POC
                </th>
                <th
                  class="px-6 py-3 text-left text-xs leading-4 font-medium uppercase tracking-wider"
                >
                  Start Date
                </th>
                <th
                  class="px-6 py-3 text-left text-xs leading-4 font-medium uppercase tracking-wider"
                >
                  End Date
                </th>
                <th
                  class="px-6 py-3 text-left text-xs leading-4 font-medium uppercase tracking-wider"
                >
                  Created At
                </th>
                <th class="px-6 py-3"></th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr
                v-for="(organization, index) in adminOrganizationsList.data"
                :key="index"
              >
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm leading-5 text-gray-900">
                    {{ organization.id }}
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center">
                    <div class="flex-shrink-0 h-10 w-10 relative">
                      <div
                        class="bg-primary-400 h-10 w-10 rounded-full bg-center bg-cover absolute z-0"
                        style="background-image: url('/profile/avatar.jpg')"
                      ></div>
                      <div
                        class="h-10 w-10 rounded-full bg-center bg-cover z-10 relative"
                        :style="[
                          organization.profile_pic != null
                            ? {
                                backgroundImage:
                                  'url(' + organization.profile_pic + ')',
                              }
                            : { backgroundImage: 'url(/profile/avatar.jpg)' },
                        ]"
                      ></div>
                    </div>
                    <div class="ml-4">
                      <div class="text-sm leading-5 font-medium text-gray-900">
                        {{ organization.name }}
                      </div>
                      <div class="text-sm leading-5 text-gray-500">
                        {{ organization.code }}
                      </div>
                    </div>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm leading-5 text-gray-900 text-center">
                    {{ organization.no_of_years }}
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div
                    v-if="organization.subscriptions[0]"
                    class="text-sm leading-5 text-gray-900"
                  >
                    {{ organization.subscriptions[0].name }}
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm leading-5 text-center text-gray-900">
                    <div
                      v-if="organization.subscription_id"
                      class="w-24 px-2 text-xs leading-5 rounded-full bg-primary-600 text-white uppercase"
                    >
                      Active
                    </div>
                    <div
                      v-else
                      class="w-24 px-2 text-xs leading-5 rounded-full bg-secondary-700 text-white uppercase"
                    >
                      In progress
                    </div>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm leading-5 text-gray-900">
                    <div
                      v-html="
                        checkValue(
                          organization.owner_name,
                          'Owner not set',
                          'text-sm leading-5 text-gray-900 font-medium'
                        )
                      "
                    ></div>
                    <div
                      v-html="
                        checkValue(
                          organization.owner_email,
                          'Owner email not set',
                          'text-sm leading-5 text-gray-500'
                        )
                      "
                    ></div>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm leading-5 text-gray-900">
                    <div class="text-sm leading-5 font-medium text-gray-900">
                      {{ organization.poc_name }}
                    </div>
                    <div class="text-sm leading-5 text-gray-500">
                      {{ organization.poc_email }}
                    </div>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm leading-5">
                    <span
                      v-if="organization.subscriptions[0]"
                      class="text-primary-500 cursor-pointer hover:text-primary-800"
                      @click="updateOrgInfo(organization)"
                    >
                      {{
                        $dayjs(organization.subscriptions[0].starts_at).format(
                          'MMM DD, YYYY'
                        )
                      }}
                    </span>
                    <span v-else class="text-gray-300"> No Date </span>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm leading-5">
                    <span
                      v-if="organization.subscriptions[0]"
                      class="text-primary-500 cursor-pointer hover:text-primary-800"
                      @click="updateOrgInfo(organization)"
                    >
                      {{
                        $dayjs(organization.subscriptions[0].ends_at).format(
                          'MMM DD, YYYY'
                        )
                      }}
                    </span>
                    <span v-else class="text-gray-300"> No Date </span>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm leading-5 text-gray-900">
                    <span v-if="organization.created_at">
                      {{
                        $dayjs(organization.created_at).format('MMM DD, YYYY')
                      }}
                    </span>
                    <span v-else class="text-gray-300"> No Date </span>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm leading-5 text-gray-900">
                    <svg
                      class="ml-3 w-5 text-secondary-700 cursor-pointer"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      @click="
                        $router.push(
                          `/membership/dashboard?id=${organization.id}&tab=Profile`
                        )
                      "
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M8 16l2.879-2.879m0 0a3 3 0 104.243-4.242 3 3 0 00-4.243 4.242zM21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <FormInputsPagination
          :pagination="paginate"
          :offset="3"
          @paginate="getAdminOrganizationsList(allFilters)"
        />
      </div>
    </div>
    <div v-else class="h-screen w-full mt-14">
      <div v-if="error == null" class="mx-auto text-center">
        <WLoadingSpinner class="mx-auto" />
        <div class="mt-3 text-primary-600">Loading organizations...</div>
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
</template>
<script>
import { mapState, mapActions } from 'vuex'
import { tableMixin } from '~/mixins/tableMixin'

export default {
  mixins: [tableMixin],

  data() {
    return {
      forceReRender: 0,
      selectedOrg: null,
      filters: {
        org_id: '',
        name: '',
        user_email: '',
        status: '',
      },
      error: null,
    }
  },
  head() {
    return {
      title: `Admin Memberships`,
    }
  },
  computed: {
    ...mapState({
      adminOrganizationsList: (state) =>
        state.membership.adminOrganizationsList,
    }),
    paginate() {
      if (this.adminOrganizationsList) {
        return {
          total: this.adminOrganizationsList.total,
          per_page: this.adminOrganizationsList.per_page,
          current_page: this.adminOrganizationsList.current_page,
          last_page: this.adminOrganizationsList.last_page,
          from: this.adminOrganizationsList.from,
          to: this.adminOrganizationsList.to,
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
  async created() {
    return await this.getAdminOrganizationsList().catch(
      (error) => (this.error = error)
    )
  },
  methods: {
    ...mapActions('membership', ['getAdminOrganizationsList']),
    async updateOrg() {
      await this.$store.dispatch('membership/updateOrgSubscription', {
        org_id: this.selectedOrg.id,
        sub_id: this.selectedOrg.subscription_id,
        starts_at: this.selectedOrg.subscriptions[0].starts_at,
        ends_at: this.selectedOrg.subscriptions[0].ends_at,
        active: 1,
      })
      await this.getAdminOrganizationsList(this.allFilters)
      this.$refs.modal.isHidden = true
    },
    updateOrgInfo(organization) {
      this.selectedOrg = JSON.parse(JSON.stringify(organization))

      this.selectedOrg.subscriptions[0].starts_at =
        this.selectedOrg.subscriptions[0].starts_at.substring(0, 10)

      this.selectedOrg.subscriptions[0].ends_at =
        this.selectedOrg.subscriptions[0].ends_at.substring(0, 10)

      this.forceReRender++
      this.forceReRender++
      this.$refs.modal.isHidden = false
    },
    clearFilters() {
      this.filters = {
        org_id: '',
        name: '',
        user_email: '',
        status: '',
      }
      this.getAdminOrganizationsList()
    },
  },
}
</script>
