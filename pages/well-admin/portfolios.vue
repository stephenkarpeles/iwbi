<template>
  <div class="flex flex-col">
    <div v-if="portfolioList" class="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
      <div class="py-2 align-middle inline-block w-full sm:px-6 lg:px-8">
        <NavBreadcrumbs>
          <div class="sm:flex justify-between">
            <WHeadingsHTwo
              class="text-primary-900"
              heading="Admin Portfolios"
            />
            <div class="mt-2 md:mt-0">
              <WButtonsBase
                type="primary"
                icon="plus"
                @click.native="$router.push('/portfolio/create/')"
              >
                Start a Portfolio
              </WButtonsBase>
            </div>
          </div>
        </NavBreadcrumbs>
        <!-- mobile filters start here -->
        <LazyAccordiansBase
          ref="mobFilters"
          label="filters"
          class="sm:hidden mb-8 capitalize"
        >
          <template #content>
            <FormulateForm @submit="applyFilters">
              <FormulateInput
                v-model="filters.portfolio_number"
                type="text"
                placeholder="ID"
                label="Portfolio ID"
              />
              <FormulateInput
                v-model="filters.name"
                type="text"
                placeholder="Name"
                label="Name"
              />
              <FormulateInput
                v-model="filters.user_email"
                type="text"
                placeholder="Email"
                label="Email"
              />
              <FormulateInput
                v-model="filters.reg_status"
                :options="[
                  { value: '1', label: 'Registered' },
                  { value: '2', label: 'Registration in progress' },
                  { value: '0', label: 'Not Registered' },
                ]"
                type="select"
                label="Registration Status"
                placeholder="Registration Status"
              />
              <FormulateInput
                v-model="filters.agreement_status"
                :options="[
                  { label: 'Signed', value: '1' },
                  { label: 'Not Signed', value: '0' },
                ]"
                type="select"
                label="Agreement Status"
                placeholder="Agreement Status"
              />
              <FormulateInput type="submit" label="Apply" class="mt-6" />
              <div v-if="hasAppliedFilters" class="mt-4">
                <WButtonsBase
                  type="primaryInverted"
                  @click.native="clearFilters()"
                >
                  Clear filters
                </WButtonsBase>
              </div>
            </FormulateForm>
          </template>
        </LazyAccordiansBase>
        <!-- end here -->
        <!-- desktop filters start here -->
        <FormulateForm
          class="
            hidden
            sm:grid
            grid-cols-3
            md:grid-cols-4
            lg:grid-cols-5
            gap-4
            mb-5
          "
          @submit="applyFilters"
        >
          <FormulateInput
            v-model="filters.portfolio_number"
            type="text"
            placeholder="ID"
            label="Portfolio ID"
          />
          <FormulateInput
            v-model="filters.name"
            type="text"
            placeholder="Name"
            label="Name"
          />
          <FormulateInput
            v-model="filters.user_email"
            type="text"
            placeholder="Email"
            label="Email"
          />
          <FormulateInput
            v-model="filters.reg_status"
            :options="[
              { value: '1', label: 'Registered' },
              { value: '2', label: 'Registration in progress' },
              { value: '0', label: 'Not Registered' },
            ]"
            type="select"
            label="Registration Status"
            placeholder="Registration Status"
          />
          <FormulateInput
            v-model="filters.agreement_status"
            :options="[
              { label: 'Signed', value: '1' },
              { label: 'Not Signed', value: '0' },
            ]"
            type="select"
            label="Agreement Status"
            placeholder="Agreement Status"
          />
          <FormulateInput type="submit" label="Apply" class="mt-6" />
          <div v-if="hasAppliedFilters" class="mt-6">
            <WButtonsBase type="primaryInverted" @click.native="clearFilters()">
              Clear filters
            </WButtonsBase>
          </div>
        </FormulateForm>
        <!-- end here -->
        <div
          class="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg"
        >
          <div class="overflow-x-scroll">
            <table class="w-full divide-y divide-gray-200">
              <thead>
                <tr class="bg-primary-700 text-white">
                  <th
                    class="
                      px-6
                      py-3
                      text-left text-xs
                      leading-4
                      font-medium
                      uppercase
                      tracking-wider
                    "
                  >
                    ID
                  </th>
                  <th
                    class="
                      px-6
                      py-3
                      text-left text-xs
                      leading-4
                      font-medium
                      uppercase
                      tracking-wider
                    "
                  >
                    Name
                  </th>
                  <th
                    class="
                      px-6
                      py-3
                      text-left text-xs
                      leading-4
                      font-medium
                      uppercase
                      tracking-wider
                    "
                  >
                    Area
                  </th>
                  <th
                    class="
                      px-6
                      py-3
                      text-left text-xs
                      leading-4
                      font-medium
                      uppercase
                      tracking-wider
                    "
                  >
                    Status
                  </th>
                  <th
                    class="
                      px-6
                      py-3
                      text-left text-xs
                      leading-4
                      font-medium
                      uppercase
                      tracking-wider
                    "
                  >
                    Agreement
                  </th>
                  <th
                    class="
                      px-6
                      py-3
                      text-left text-xs
                      leading-4
                      font-medium
                      uppercase
                      tracking-wider
                    "
                  >
                    Admin
                  </th>
                  <th
                    class="
                      px-6
                      py-3
                      text-left text-xs
                      leading-4
                      font-medium
                      uppercase
                      tracking-wider
                    "
                  >
                    Created
                  </th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr v-for="portfolio in portfolioList.data" :key="portfolio.id">
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div
                      class="
                        text-sm
                        leading-5
                        text-primary-500
                        cursor-pointer
                        flex
                        space-x-2
                      "
                    >
                      <div
                        @click="
                          $router.push(
                            `/portfolio/${portfolio.portfolio_number}/dashboard`
                          )
                        "
                      >
                        {{ portfolio.portfolio_number }}
                      </div>
                      <a
                        :href="`/portfolio/${portfolio.portfolio_number}/dashboard`"
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
                    <div
                      class="
                        text-sm
                        leading-5
                        font-medium
                        text-gray-900
                        max-w-sm
                        truncate
                      "
                    >
                      {{ portfolio.name }}
                    </div>
                    <div class="text-sm leading-5 font-medium text-gray-500">
                      {{ portfolio.no_of_assets }} locations enrolled |
                      {{ portfolio.total_property_count }} locations uploaded
                    </div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm leading-5 font-medium text-gray-900">
                      {{ portfolio.area | formatNumber }} sq ft
                    </div>
                    <div class="text-sm leading-5 font-medium text-gray-500">
                      {{ portfolio.computed_area | formatNumber }} sq ft
                      uploaded
                    </div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm leading-5 font-medium text-gray-900">
                      <span
                        v-if="regStatus(portfolio)"
                        class="
                          px-2
                          inline-flex
                          text-xs
                          leading-5
                          rounded-full
                          bg-primary-600
                          text-white
                          uppercase
                        "
                        >Registered</span
                      >
                      <span
                        v-else
                        class="
                          px-2
                          inline-flex
                          text-xs
                          leading-5
                          rounded-full
                          bg-secondary-600
                          text-white
                          uppercase
                        "
                        >Not Registered</span
                      >
                    </div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm leading-5 font-medium text-gray-900">
                      <span
                        v-if="
                          portfolio.agreement_status !== 0 &&
                          portfolio.agreement_status !== null
                        "
                        class="
                          px-2
                          inline-flex
                          text-xs
                          leading-5
                          rounded-full
                          bg-primary-600
                          text-white
                          uppercase
                        "
                        >Signed</span
                      >
                      <span
                        v-else
                        class="
                          px-2
                          inline-flex
                          text-xs
                          leading-5
                          rounded-full
                          bg-secondary-600
                          text-white
                          uppercase
                        "
                        >Not Signed</span
                      >
                    </div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm leading-5 font-medium text-gray-900">
                      {{ portfolio.user_email }}
                    </div>
                    <div class="text-sm leading-5 font-medium text-gray-500">
                      {{ portfolio.user_name }}
                    </div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm leading-5 font-medium text-gray-900">
                      {{ $dayjs(portfolio.created_at).format('MMM DD, YYYY') }}
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <FormInputsPagination
            :pagination="paginate"
            :offset="3"
            @paginate="
              $store.dispatch('shared/getAdminPortfolioList', allFilters)
            "
          />
        </div>
      </div>
    </div>
    <div v-else class="h-screen w-full mt-14">
      <div v-if="error == null" class="mx-auto text-center">
        <WLoadingSpinner class="mx-auto" />
        <div class="mt-3 text-primary-600">Loading portfolios list...</div>
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

export default {
  data() {
    return {
      filters: {
        type: 'v2-pilot',
        portfolio_number: '',
        name: '',
        user_email: '',
        reg_status: '',
        agreement_status: '',
      },
      error: null,
    }
  },
  head() {
    return {
      title: `Admin Portfolios`,
    }
  },
  computed: {
    ...mapState({
      portfolioList: (state) => state.shared.adminPortfolioList,
    }),
    paginate() {
      if (this.portfolioList) {
        return {
          total: this.portfolioList.total,
          per_page: this.portfolioList.per_page,
          current_page: this.portfolioList.current_page,
          last_page: this.portfolioList.last_page,
          from: this.portfolioList.from,
          to: this.portfolioList.to,
        }
      }
      return {}
    },
    hasAppliedFilters() {
      const excludedKeys = ['type']
      for (const key in this.filters) {
        if (
          this.filters[key] !== null &&
          this.filters[key] !== '' &&
          !excludedKeys.includes(key)
        )
          return true
      }
      return false
    },
    allFilters() {
      const res = JSON.parse(JSON.stringify(this.filters))
      const regStatusVal = this.filters.reg_status
        ? parseInt(this.filters.reg_status)
        : null
      if (regStatusVal === null) {
        delete res.reg_status
      }
      if (this.filters.agreement_status === '') {
        delete res.agreement_status
      }
      if (regStatusVal !== null) {
        if (regStatusVal >= 1) {
          res.reg_status = 1
          res.reg_payment_status = regStatusVal === 2 ? 'unpaid' : 'paid'
        } else {
          res.reg_status = 0
          res.reg_payment_status = 'unpaid'
        }
      }
      res.page = this.paginate.current_page ?? 1
      return res
    },
  },
  async mounted() {
    await this.$store
      .dispatch('shared/getAdminPortfolioList', this.allFilters)
      .catch((error) => (this.error = error))
  },
  methods: {
    applyFilters() {
      this.allFilters.page = 1
      this.$store.dispatch('shared/getAdminPortfolioList', this.allFilters)
      this.$refs.mobFilters.isExpanded = false
    },
    clearFilters() {
      this.filters.portfolio_number = ''
      this.filters.name = ''
      this.filters.user_email = ''
      this.filters.reg_status = ''
      this.filters.agreement_status = ''
      this.$store.dispatch('shared/getAdminPortfolioList', this.allFilters)
    },
    regStatus(portfolio) {
      if (
        (portfolio.reg_status === 1 &&
          portfolio.reg_payment_status === 'paid') ||
        portfolio.reg_payment_status === 'waived'
      ) {
        return true
      } else {
        return false
      }
    },
  },
}
</script>
