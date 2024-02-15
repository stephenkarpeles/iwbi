<template>
  <div class="flex flex-col">
    <div v-if="adminCredentialsList">
      <NavBreadcrumbs>
        <WHeadingsHTwo class="text-primary-900" heading="Admin Credentials" />
      </NavBreadcrumbs>
      <WFeedbackModal ref="modal">
        <div
          v-if="selectedCredential"
          class="space-y-4 md:max-w-2xl lg:max-w-max"
        >
          <WHeadingsHFour
            :heading="'Update Credential: ' + selectedCredential.email"
          />
          <div class="md:grid md:grid-cols-2 lg:grid-cols-4 space-y-4 gap-x-2">
            <FormulateInput
              :key="forceReRender"
              v-model="selectedCredential.credential_opt_date"
              class="mt-auto"
              label="Credential Recieved Date"
              type="datetimepicker"
              :error="error"
              max="9999-01-01"
            />
            <FormulateInput
              :key="forceReRender + 1"
              v-model="selectedCredential.credential_start_date"
              class="mt-auto"
              label="Credential Start Date"
              type="datetimepicker"
              :error="error"
              max="9999-01-01"
            />
            <FormulateInput
              :key="forceReRender + 2"
              v-model="selectedCredential.credential_end_date"
              class="mt-auto"
              label="Credential End Date"
              type="datetimepicker"
              max="9999-01-01"
              :error="error"
            />
            <div class="flex">
              <div class="mt-2 md:mt-7 w-full">
                <WButtonsBase @click.native="updateCredential">
                  Save
                </WButtonsBase>
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
          <FormulateForm @submit="applyFilters()">
            <FormulateInput
              v-model="filters.name"
              name="first_name"
              label="First Name"
              type="text"
              :error="error"
            />
            <FormulateInput
              v-model="filters.last_name"
              name="last_name"
              label="Last Name"
              type="text"
              :error="error"
            />
            <FormulateInput
              v-model="filters.email"
              name="email"
              label="Email"
              type="text"
              :error="error"
            />
            <FormulateInput
              v-model="filters.status"
              label="Status"
              type="select"
              :options="{
                active: 'Active',
                expired: 'Expired',
              }"
              :error="error"
            />
            <FormulateInput
              v-model="filters.country_code"
              :options="countryOptions"
              type="select"
              label="Country/Region"
              placeholder="Country/Region"
            />
            <div class="mt-6">
              <FormulateInput type="submit" label="Apply" />
            </div>
            <div v-if="hasAppliedFilters" class="mt-4">
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
      <!-- desktop filters start here -->
      <FormulateForm
        class="hidden sm:grid grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-4 mb-5"
        @submit="applyFilters()"
      >
        <FormulateInput
          v-model="filters.name"
          name="first_name"
          label="First Name"
          type="text"
          :error="error"
        />
        <FormulateInput
          v-model="filters.last_name"
          name="last_name"
          label="Last Name"
          type="text"
          :error="error"
        />
        <FormulateInput
          v-model="filters.email"
          name="email"
          label="Email"
          type="text"
          :error="error"
        />
        <FormulateInput
          v-model="filters.status"
          label="Status"
          type="select"
          :options="{
            active: 'Active',
            expired: 'Expired',
          }"
          :error="error"
        />
        <FormulateInput
          v-model="filters.country_code"
          :options="countryOptions"
          type="select"
          label="Country/Region"
          placeholder="Country/Region"
        />
        <div class="mt-6">
          <FormulateInput type="submit" label="Apply" />
        </div>
        <div v-if="hasAppliedFilters" class="mt-6">
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
          <table class="min-w-full divide-y divide-gray-200">
            <thead>
              <tr class="text-white bg-primary-700">
                <th
                  class="px-6 py-3 text-left text-xs leading-4 font-medium uppercase tracking-wider"
                >
                  User
                </th>
                <th
                  class="px-6 py-3 text-left text-xs leading-4 font-medium uppercase tracking-wider"
                >
                  Date Certified
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
                  Country
                </th>
                <th
                  class="px-6 py-3 text-left text-xs leading-4 font-medium uppercase tracking-wider"
                >
                  Status
                </th>
                <th class="px-6 py-3"></th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr
                v-for="credential in adminCredentialsList.data"
                :key="credential.id"
              >
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm leading-5 font-medium text-gray-900">
                    {{ credential.name }} {{ credential.last_name }}
                  </div>
                  <div class="text-sm leading-5 text-gray-500">
                    {{ credential.email }}
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm leading-5 text-gray-900">
                    {{
                      $dayjs(credential.credential_opt_date).format(
                        'MMM DD, YYYY'
                      )
                    }}
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm leading-5 text-gray-900">
                    {{
                      $dayjs(credential.credential_start_date).format(
                        'MMM DD, YYYY'
                      )
                    }}
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm leading-5 text-gray-900">
                    {{
                      $dayjs(credential.credential_end_date).format(
                        'MMM DD, YYYY'
                      )
                    }}
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div
                    v-html="checkValue(credential.addresses[0].country_name)"
                  ></div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span
                    v-if="getStatus(credential.credential_end_date)"
                    class="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium bg-green-50 text-success-700 border border-green-100"
                    >Active</span
                  >
                  <span
                    v-else
                    class="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium bg-gray-100 text-gray-400 border border-gray-100"
                    >Expired</span
                  >
                </td>
                <td
                  class="px-6 py-4 whitespace-nowrap text-right text-sm leading-5 font-medium"
                >
                  <a
                    href="#"
                    class="text-primary-600 hover:text-primary-900"
                    @click="updateCredentialDates(credential)"
                  >
                    Edit
                  </a>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <FormInputsPagination
          :pagination="paginate"
          :offset="3"
          @paginate="getAdminCredentialsList(allFilters)"
        />
      </div>
    </div>
    <div v-else class="h-screen w-full mt-14">
      <div v-if="error == null" class="mx-auto text-center">
        <WLoadingSpinner class="mx-auto" />
        <div class="mt-3 text-primary-600">Loading Credentials...</div>
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
import { mapState } from 'vuex'
import { tableMixin } from '~/mixins/tableMixin'

export default {
  mixins: [tableMixin],

  data() {
    return {
      forceReRender: 0,
      selectedCredential: null,
      filters: {
        name: null,
        last_name: null,
        email: null,
        location: null,
        status: null,
      },
      error: null,
    }
  },
  head() {
    return {
      title: `Admin Credentials`,
    }
  },
  computed: {
    ...mapState({
      adminCredentialsList: (state) => state.credential.adminCredentialsList,
      countries: (state) => state.address.countries,
    }),
    countryOptions() {
      const options = []
      for (let i = 0; i < this.countries.length; i++) {
        const option = {
          value: this.countries[i].code,
          label: this.countries[i].name,
        }
        options.push(option)
      }
      return options
    },
    paginate() {
      if (this.adminCredentialsList) {
        return {
          total: this.adminCredentialsList.total,
          per_page: this.adminCredentialsList.per_page,
          current_page: this.adminCredentialsList.current_page,
          last_page: this.adminCredentialsList.last_page,
          from: this.adminCredentialsList.from,
          to: this.adminCredentialsList.to,
        }
      }
      return {}
    },
    hasAppliedFilters() {
      for (const key in this.filters) {
        if (this.filters[key] !== null && this.filters[key] !== '') return true
      }
      return false
    },
    allFilters() {
      const res = JSON.parse(JSON.stringify(this.filters))
      if (this.hasAppliedFilters) res.page = 1
      else res.page = this.paginate.current_page
      return res
    },
  },
  async created() {
    return await this.$store
      .dispatch('credential/getAdminCredentialsList', this.allFilters)
      .catch((error) => (this.error = error))
  },
  methods: {
    applyFilters() {
      this.allFilters.page = 1
      this.$store.dispatch(
        'credential/getAdminCredentialsList',
        this.allFilters
      )
      this.$refs.mobFilters.isExpanded = false
    },
    updateCredentialDates(credential) {
      this.$refs.modal.isHidden = false
      this.selectedCredential = { ...credential }
      this.selectedCredential.credential_opt_date =
        this.selectedCredential.credential_opt_date.substring(0, 10)
      this.selectedCredential.credential_start_date =
        this.selectedCredential.credential_start_date.substring(0, 10)
      this.selectedCredential.credential_end_date =
        this.selectedCredential.credential_end_date.substring(0, 10)
      this.forceReRender++
      this.forceReRender++
      this.forceReRender++
    },
    async updateCredential() {
      await this.$store.dispatch('credential/updateCredDates', {
        id: this.selectedCredential.id,
        credential_opt_date: this.selectedCredential.credential_opt_date,
        credential_start_date: this.selectedCredential.credential_start_date,
        credential_end_date: this.selectedCredential.credential_end_date,
      })
      await this.$store.dispatch(
        'credential/getAdminCredentialsList',
        this.allFilters
      )
      this.$refs.modal.isHidden = true
    },
    formatPrice(value) {
      const val = (value / 1).toFixed(2)
      return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
    },
    clearFilters() {
      Object.keys(this.filters).forEach((k) => {
        this.filters[k] = null
      })
      this.$store.dispatch(
        'credential/getAdminCredentialsList',
        this.allFilters
      )
    },
    getStatus(endDate) {
      const currentDate = this.$dayjs(new Date()).format('YYYY-MM-DD')
      const endDateFormatted = this.$dayjs(endDate)

      const status = endDateFormatted.diff(currentDate, 'day')

      if (status <= 0) {
        return false
      }
      return true
    },
  },
}
</script>
