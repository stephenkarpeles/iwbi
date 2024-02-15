<template>
  <div class="flex flex-col">
    <div
      v-if="adminInvoicesList"
      class="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8"
    >
      <div class="py-2 align-middle inline-block w-full sm:px-6 lg:px-8">
        <NavBreadcrumbs>
          <div class="md:flex justify-between">
            <WHeadingsHTwo class="text-primary-900" heading="Invoices" />
            <div class="mt-4 md:mt-0">
              <WButtonsBase
                type="primaryInverted"
                icon="plus"
                @click.native="$router.push(`/well-admin/invoices/create`)"
              >
                Create Invoice
              </WButtonsBase>
            </div>
          </div>
        </NavBreadcrumbs>
        <LazyAccordiansBase
          ref="mobFilters"
          label="Filters"
          class="md:hidden mb-8 capitalize"
        >
          <template #content>
            <FormulateForm
              @submit="getAdminInvoicesList({ ...allFilters, page: 1 })"
            >
              <FormulateInput
                v-model="filters.invoice_number"
                name="invoice_number"
                label="Invoice Number"
                type="text"
                :error="error"
              />
              <FormulateInput
                v-model="filters.project_number"
                name="project_number"
                label="Project ID"
                type="text"
                :error="error"
              />
              <FormulateInput
                v-model="filters.project_name"
                name="project_name"
                label="Project Name"
                type="text"
                :error="error"
              />
              <FormulateInput
                v-model="filters.user_email"
                label="User Email"
                name="user_email"
                type="text"
                :error="error"
              />
              <FormulateInput
                v-model="filters.organization"
                name="organization"
                type="text"
                label="Organization"
                :error="error"
              />
              <FormulateInput
                v-model="filters.country_code"
                :options="countryOptions"
                type="select"
                name="country_code"
                label="Country/Region"
                placeholder="Country/Region"
              />
              <FormulateInput
                v-model="filters.amount"
                name="invoice_amount"
                label="Invoice Amount"
                type="number"
                :error="error"
              />
              <FormulateInput
                v-model="filters.status"
                name="invoice_status"
                label="Invoice Status"
                type="select"
                :options="{
                  '': '',
                  paid: 'Paid',
                  unpaid: 'Unpaid',
                  waived: 'Waived',
                }"
                :error="error"
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
        <FormulateForm
          class="hidden md:grid grid-cols-5 gap-4 mb-5"
          @submit="getAdminInvoicesList({ ...allFilters, page: 1 })"
        >
          <FormulateInput
            v-model="filters.invoice_number"
            name="invoice_number"
            label="Invoice Number"
            type="text"
            :error="error"
          />
          <FormulateInput
            v-model="filters.project_number"
            name="project_number"
            label="Project ID"
            type="text"
            :error="error"
          />
          <FormulateInput
            v-model="filters.project_name"
            name="project_name"
            label="Project Name"
            type="text"
            :error="error"
          />
          <FormulateInput
            v-model="filters.user_email"
            label="User Email"
            name="user_email"
            type="text"
            :error="error"
          />
          <FormulateInput
            v-model="filters.organization"
            name="organization"
            type="text"
            label="Organization"
            :error="error"
          />
          <FormulateInput
            v-model="filters.country_code"
            :options="countryOptions"
            type="select"
            name="country_code"
            label="Country/Region"
            placeholder="Country/Region"
          />
          <FormulateInput
            v-model="filters.amount"
            name="invoice_amount"
            label="Invoice Amount"
            type="number"
            :error="error"
          />
          <FormulateInput
            v-model="filters.status"
            name="invoice_status"
            label="Invoice Status"
            type="select"
            :options="{
              '': '',
              paid: 'Paid',
              unpaid: 'Unpaid',
              waived: 'Waived',
            }"
            :error="error"
          />
          <div class="mt-6">
            <FormulateInput type="submit" label="Apply" />
          </div>
          <div class="mt-6">
            <WButtonsBase
              v-if="hasAppliedFilters"
              type="primaryInverted"
              @click.native="clearFilters()"
              >Clear filters</WButtonsBase
            >
          </div>
        </FormulateForm>
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
                    Description
                  </th>
                  <th
                    class="px-6 py-3 text-left text-xs leading-4 font-medium uppercase tracking-wider"
                  >
                    Project
                  </th>
                  <th
                    class="px-6 py-3 text-left text-xs leading-4 font-medium uppercase tracking-wider"
                  >
                    Amount
                  </th>
                  <th
                    class="px-6 py-3 text-left text-xs leading-4 font-medium uppercase tracking-wider"
                  >
                    Status
                  </th>
                  <th
                    class="px-6 py-3 text-left text-xs leading-4 font-medium uppercase tracking-wider"
                  >
                    Created On
                  </th>
                  <th class="px-6 py-3"></th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr v-for="invoice in adminInvoicesList.data" :key="invoice.id">
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div
                      class="text-sm leading-5 text-primary-500 cursor-pointer flex space-x-2"
                    >
                      <div
                        class="text-sm leading-5 text-primary-500 cursor-pointer flex space-x-2"
                      >
                        {{ invoice.invoice_number }}
                      </div>
                      <a
                        :href="`/invoice/${invoice.invoice_number}?redirect=/well-admin/invoices`"
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
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm leading-5 text-gray-900">
                      {{ invoice.description }}
                    </div>
                    <div
                      v-if="invoice.addresses.length"
                      class="text-sm leading-5 text-gray-500"
                    >
                      {{ invoice.addresses[0].first_name }}
                      <span v-if="invoice.addresses[0].email"
                        >({{ invoice.addresses[0].email }})</span
                      >
                    </div>
                    <div v-else class="text-sm leading-5 text-gray-500">
                      {{ invoice.user_name }} ({{ invoice.user_email }})
                    </div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div v-if="invoice.project_number">
                      <span
                        v-if="invoice.v1_project === 1"
                        class="px-2 inline-flex text-xs leading-5 rounded-full bg-gray-400 text-white uppercase"
                      >
                        WELL v1
                      </span>
                      <span
                        v-else
                        class="px-2 inline-flex text-xs leading-5 rounded-full bg-primary-600 text-white uppercase"
                      >
                        WELL v2
                      </span>
                    </div>
                    <div
                      v-else
                      v-html="checkValue(invoice.project_number, 'No Project')"
                    ></div>
                    <div
                      class="text-sm leading-5 text-primary-600 cursor-pointer hover:text-primary-700"
                      @click="$router.push(showProject(invoice))"
                    >
                      {{ invoice.project_number }}
                    </div>
                    <div class="text-sm leading-5 text-gray-500">
                      {{ invoice.project_name }}
                    </div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm leading-5 text-gray-900">
                      $ {{ formatPrice(invoice.total_amount) }}
                    </div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm leading-5 text-gray-900">
                      <span
                        v-if="invoice.status === 'unpaid'"
                        class="px-2 inline-flex text-xs leading-5 rounded-full bg-secondary-600 text-white uppercase"
                      >
                        Unpaid
                      </span>
                      <span
                        v-else
                        class="px-2 inline-flex text-xs leading-5 rounded-full bg-success-500 text-white uppercase"
                      >
                        {{ invoice.status }}
                      </span>
                    </div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div v-html="checkValue(invoice.created_date, 'N/A')"></div>
                  </td>
                  <td
                    class="px-6 py-4 whitespace-nowrap text-right text-sm leading-5 font-medium"
                  >
                    <div
                      class="text-primary-600 hover:text-primary-900 cursor-pointer"
                      @click="
                        $router.push({
                          path: '/invoice/' + invoice.invoice_number,
                          params: {
                            invoiceNumber: invoice.invoice_number,
                            redirect: '/well-admin/invoices',
                          },
                        })
                      "
                    >
                      View
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <FormInputsPagination
            :pagination="paginate"
            :offset="3"
            @paginate="getAdminInvoicesList(allFilters)"
          />
        </div>
      </div>
    </div>
    <div v-else class="h-screen w-full mt-14">
      <div v-if="error == null" class="mx-auto text-center">
        <WLoadingSpinner class="mx-auto" />
        <div class="mt-3 text-primary-600">Loading invoices...</div>
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
      filters: {
        invoice_number: null,
        project_name: null,
        project_number: null,
        user_email: null,
        organization: null,
        country_code: null,
        amount: null,
      },
      error: null,
    }
  },
  head() {
    return {
      title: `Admin Invoices`,
    }
  },
  computed: {
    ...mapState({
      countries: (state) => state.address.countries,
      adminInvoicesList: (state) => state.invoice.adminInvoicesList,
    }),
    paginate() {
      if (this.adminInvoicesList) {
        return {
          total: this.adminInvoicesList.total,
          per_page: this.adminInvoicesList.per_page,
          current_page: this.adminInvoicesList.current_page,
          last_page: this.adminInvoicesList.last_page,
          from: this.adminInvoicesList.from,
          to: this.adminInvoicesList.to,
        }
      }
      return {}
    },
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
    hasAppliedFilters() {
      for (const key in this.filters) {
        if (this.filters[key] !== null && this.filters[key] !== '') return true
      }
      return false
    },
    allFilters() {
      const res = JSON.parse(JSON.stringify(this.filters))
      res.page = this.paginate.current_page
      return res
    },
  },
  async mounted() {
    return await this.$store
      .dispatch('invoice/getAdminInvoicesList')
      .catch((error) => (this.error = error))
  },
  methods: {
    showProject(invoice) {
      if (invoice.v1_project && invoice.v1_project_id) {
        return '/projects/v1/' + invoice.project_id + '/dashboard/'
      }
      if (invoice.v1_project && !invoice.v1_project_id) {
        return '/projects/v1/' + invoice.project_number + '/dashboard/'
      }
      if (!invoice.v1_project && !invoice.v1_project_id) {
        return '/projects/v2/' + invoice.project_number + '/dashboard/'
      }
    },
    getAdminInvoicesList(filters) {
      this.$store.dispatch('invoice/getAdminInvoicesList', filters)
      this.$refs.mobFilters.isExpanded = false
    },
    formatPrice(value) {
      const val = (value / 1).toFixed(2)
      return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
    },
    clearFilters() {
      Object.keys(this.filters).forEach((k) => {
        this.filters[k] = null
      })
      this.$store.dispatch('invoice/getAdminInvoicesList')
    },
  },
}
</script>
