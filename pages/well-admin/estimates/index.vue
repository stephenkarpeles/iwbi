<template>
  <div class="flex flex-col">
    <div v-if="adminV2EstimatesList">
      <NavBreadcrumbs>
        <div class="lg:flex justify-between">
          <WHeadingsHTwo class="text-primary-900" heading="Estimates" />
          <div class="md:flex md:space-x-3 mt-4 lg:mt-0 space-y-4 md:space-y-0">
            <div class="md:w-48">
              <WButtonsBase
                icon="plus"
                type="primaryInverted"
                @click.native="$router.push('/well-admin/estimates/create/v1')"
              >
                WCS Estimate
              </WButtonsBase>
            </div>
            <div class="md:w-48">
              <WButtonsBase
                icon="plus"
                type="primaryInverted"
                @click.native="
                  $router.push('/well-admin/estimates/create/v2-pilot')
                "
              >
                V2 Pilot Estimate
              </WButtonsBase>
            </div>
            <div class="md:w-48">
              <WButtonsBase
                icon="plus"
                type="primaryInverted"
                @click.native="$router.push('/well-admin/estimates/create/v2')"
              >
                V2 Estimate
              </WButtonsBase>
            </div>
          </div>
        </div>
      </NavBreadcrumbs>
      <!-- mobile filters start here -->
      <LazyAccordiansBase
        ref="mobFilters"
        label="filters"
        class="md:hidden mb-8 capitalize"
      >
        <template #content>
          <FormulateInput
            v-model="estimatesType"
            type="select"
            label="Type"
            :options="[
              { value: 'V2', label: 'V2 Estimates' },
              { value: 'V1', label: 'V1 Estimates' },
            ]"
          />
          <FormulateForm
            v-if="estimatesType === 'V1'"
            @submit="
              () => {
                getAdminV1EstimatesList({ ...allFilters, page: 1 })
                $refs.mobFilters.isExpanded = false
              }
            "
          >
            <FormulateInput
              v-model="filters.id"
              label="Estimate ID"
              type="text"
              :error="error"
            />
            <FormulateInput
              v-model="filters.email"
              label="Email"
              type="text"
              :error="error"
            />
            <FormulateInput
              v-model="filters.project_number"
              label="Project #"
              type="text"
              :error="error"
            />
            <div class="mt-6">
              <FormulateInput type="submit" label="Apply" />
            </div>
            <div
              v-if="
                filters.id !== '' ||
                filters.email !== '' ||
                filters.project_number !== ''
              "
              class="mt-4"
            >
              <WButtonsBase
                type="primaryInverted"
                @click.native="clearFilters()"
              >
                Clear filters
              </WButtonsBase>
            </div>
          </FormulateForm>
          <FormulateForm
            v-if="estimatesType === 'V2'"
            @submit="
              () => {
                getAdminV2EstimatesList({ ...allFilters, page: 1 })
                $refs.mobFilters.isExpanded = false
              }
            "
          >
            <FormulateInput
              v-model="filters.id"
              label="Estimate ID"
              type="text"
              :error="error"
            />
            <FormulateInput
              v-model="filters.email"
              label="Email"
              type="text"
              :error="error"
            />
            <FormulateInput
              v-model="filters.project_number"
              label="Project #"
              type="text"
              :error="error"
            />
            <div class="mt-6">
              <FormulateInput type="submit" label="Apply" />
            </div>
            <div
              v-if="
                filters.id !== '' ||
                filters.email !== '' ||
                filters.project_number !== ''
              "
              class="mt-4"
            >
              <WButtonsBase
                class="mt-auto"
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
      <div class="hidden md:flex">
        <FormulateInput
          v-model="estimatesType"
          type="select"
          label="Type"
          class="flex-shrink-0 mr-3 w-48"
          :options="[
            { value: 'V2', label: 'V2 Estimates' },
            { value: 'V1', label: 'V1 Estimates' },
          ]"
        />
        <FormulateForm
          v-if="estimatesType === 'V1'"
          class="grid grid-cols-4 lg:grid-cols-5 gap-4 mb-5"
          @submit="getAdminV1EstimatesList({ ...allFilters, page: 1 })"
        >
          <FormulateInput
            v-model="filters.id"
            label="Estimate ID"
            type="text"
            :error="error"
          />
          <FormulateInput
            v-model="filters.email"
            label="Email"
            type="text"
            :error="error"
          />
          <FormulateInput
            v-model="filters.project_number"
            label="Project #"
            type="text"
            :error="error"
          />
          <div class="mt-6">
            <FormulateInput type="submit" label="Apply" />
          </div>
          <div
            v-if="
              filters.id !== '' ||
              filters.email !== '' ||
              filters.project_number !== ''
            "
            class="mt-6"
          >
            <WButtonsBase
              class="mt-auto"
              type="primaryInverted"
              @click.native="clearFilters()"
            >
              Clear filters
            </WButtonsBase>
          </div>
        </FormulateForm>
        <FormulateForm
          v-if="estimatesType === 'V2'"
          class="grid grid-cols-4 lg:grid-cols-5 gap-4 mb-5"
          @submit="getAdminV2EstimatesList({ ...allFilters, page: 1 })"
        >
          <FormulateInput
            v-model="filters.id"
            label="Estimate ID"
            type="text"
            :error="error"
          />
          <FormulateInput
            v-model="filters.email"
            label="Email"
            type="text"
            :error="error"
          />
          <FormulateInput
            v-model="filters.project_number"
            label="Project #"
            type="text"
            :error="error"
          />
          <div class="mt-6">
            <FormulateInput type="submit" label="Apply" />
          </div>
          <div
            v-if="
              filters.id !== '' ||
              filters.email !== '' ||
              filters.project_number !== ''
            "
            class="mt-6"
          >
            <WButtonsBase
              class="mt-auto"
              type="primaryInverted"
              @click.native="clearFilters()"
            >
              Clear filters
            </WButtonsBase>
          </div>
        </FormulateForm>
      </div>
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
                  Type
                </th>
                <th
                  class="px-6 py-3 text-left text-xs leading-4 font-medium uppercase tracking-wider"
                >
                  Country/Region
                </th>
                <th
                  class="px-6 py-3 text-left text-xs leading-4 font-medium uppercase tracking-wider"
                >
                  Project #
                </th>
                <th
                  class="px-6 py-3 text-left text-xs leading-4 font-medium uppercase tracking-wider"
                >
                  Project Name
                </th>
                <th
                  class="px-6 py-3 text-left text-xs leading-4 font-medium uppercase tracking-wider"
                >
                  Email
                </th>
                <th
                  class="px-6 py-3 text-left text-xs leading-4 font-medium uppercase tracking-wider"
                >
                  Reg Disc.
                </th>
                <th
                  class="px-6 py-3 text-left text-xs leading-4 font-medium uppercase tracking-wider"
                >
                  Cert Disc.
                </th>
                <th
                  class="px-6 py-3 text-left text-xs leading-4 font-medium uppercase tracking-wider"
                >
                  Created
                </th>
                <th class="px-6 py-3"></th>
              </tr>
            </thead>
            <!-- v1 Estimates -->
            <tbody
              v-if="estimatesType === 'V1'"
              class="bg-white divide-y divide-gray-200"
            >
              <tr
                v-for="estimate in adminV1EstimatesList.data"
                :key="estimate.id"
              >
                <td class="px-6 py-4 whitespace-nowrap">
                  <div
                    class="text-sm leading-5 text-primary-500 cursor-pointer flex space-x-2"
                  >
                    <a
                      :href="`/estimates/v1/${estimate.id}`"
                      class="text-sm leading-5 text-primary-500 cursor-pointer flex space-x-2"
                    >
                      {{ estimate.id }}
                    </a>
                    <a :href="`/estimates/v1/${estimate.id}`" target="_blank">
                      <WIconsBase
                        icon="external-link"
                        type="blank"
                        class="text-gray-400 hover:text-gray-500"
                      />
                    </a>
                  </div>
                </td>

                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm leading-5 text-gray-900">v1</div>
                </td>

                <td class="px-6 py-4 whitespace-nowrap">
                  <div v-html="checkValue(estimate.country)"></div>
                </td>

                <td class="px-6 py-4 whitespace-nowrap">
                  <div v-html="checkValue(estimate.project_number)"></div>
                </td>

                <td class="px-6 py-4 whitespace-nowrap">
                  <div
                    v-if="estimate.projects.length > 0"
                    class="text-sm leading-5 text-gray-900"
                  >
                    {{ estimate.projects[0].name }}
                  </div>
                </td>

                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm leading-5 text-gray-900">
                    {{ estimate.email }}
                  </div>
                </td>

                <td class="px-6 py-4 whitespace-nowrap">
                  <div v-html="checkValue(estimate.reg_discount)"></div>
                </td>

                <td class="px-6 py-4 whitespace-nowrap">
                  <div v-html="checkValue(estimate.cert_discount)"></div>
                </td>

                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm leading-5 text-gray-900">
                    {{ $dayjs(estimate.created_at).format('MMM DD, YYYY') }}
                  </div>
                </td>

                <td
                  class="px-6 py-4 whitespace-nowrap text-right text-sm leading-5 font-medium"
                >
                  <div
                    class="text-primary-600 hover:text-primary-900 cursor-pointer"
                    @click="$router.push(`/estimates/v1/${estimate.id}`)"
                  >
                    View
                  </div>
                </td>
              </tr>
            </tbody>
            <!-- V2 Estimates -->
            <tbody
              v-if="estimatesType === 'V2'"
              class="bg-white divide-y divide-gray-200"
            >
              <tr
                v-for="estimate in adminV2EstimatesList.data"
                :key="estimate.id"
              >
                <td class="px-6 py-4 whitespace-nowrap">
                  <div
                    class="text-sm leading-5 text-primary-500 cursor-pointer flex space-x-2"
                  >
                    <a
                      :href="`/estimates/${estimate.type}/${estimate.id}`"
                      class="text-sm leading-5 text-primary-500 cursor-pointer flex space-x-2"
                    >
                      {{ estimate.id }}
                    </a>
                    <a
                      :href="`/estimates/${estimate.type}/${estimate.id}`"
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
                    {{ estimate.type }}
                  </div>
                </td>

                <td class="px-6 py-4 whitespace-nowrap">
                  <div v-html="checkValue(estimate.country)"></div>
                </td>

                <td class="px-6 py-4 whitespace-nowrap">
                  <div
                    v-html="checkValue(estimate.projects[0].project_number)"
                  ></div>
                </td>

                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm leading-5 text-gray-900">
                    <span v-if="estimate.projects.length > 0">
                      {{ estimate.projects[0].name }}
                    </span>
                  </div>
                </td>

                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm leading-5 text-gray-900">
                    {{ estimate.email }}
                  </div>
                </td>

                <td class="px-6 py-4 whitespace-nowrap">
                  <div v-html="checkValue(estimate.reg_discount)"></div>
                </td>

                <td class="px-6 py-4 whitespace-nowrap">
                  <div v-html="checkValue(estimate.cert_discount)"></div>
                </td>

                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm leading-5 text-gray-900">
                    {{ $dayjs(estimate.created_at).format('MMM DD, YYYY') }}
                  </div>
                </td>

                <td
                  class="px-6 py-4 whitespace-nowrap text-right text-sm leading-5 font-medium"
                >
                  <div
                    class="text-primary-600 hover:text-primary-900 cursor-pointer"
                    @click="
                      $router.push(`/estimates/${estimate.type}/${estimate.id}`)
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
          v-if="estimatesType === 'V2'"
          :pagination="paginateV2"
          :offset="3"
          @paginate="getAdminV2EstimatesList(allFilters)"
        />
        <FormInputsPagination
          v-if="estimatesType === 'V1'"
          :pagination="paginateV1"
          :offset="3"
          @paginate="getAdminV1EstimatesList(allFilters)"
        />
      </div>
    </div>
    <div v-else class="h-screen w-full mt-14">
      <div v-if="error == null" class="mx-auto text-center">
        <WLoadingSpinner class="mx-auto" />
        <div class="mt-3 text-primary-600">Loading estimates...</div>
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
      estimatesType: 'V2',
      filters: {
        id: '',
        project_number: '',
        email: '',
      },
      error: null,
    }
  },
  head() {
    return {
      title: `Admin Estimates`,
    }
  },
  computed: {
    ...mapState({
      adminV2EstimatesList: (state) => state.estimate.adminV2EstimatesList,
      adminV1EstimatesList: (state) => state.estimate.adminV1EstimatesList,
    }),
    paginateV2() {
      if (this.adminV2EstimatesList) {
        return {
          total: this.adminV2EstimatesList.total,
          per_page: this.adminV2EstimatesList.per_page,
          current_page: this.adminV2EstimatesList.current_page,
          last_page: this.adminV2EstimatesList.last_page,
          from: this.adminV2EstimatesList.from,
          to: this.adminV2EstimatesList.to,
        }
      }
      return {}
    },
    paginateV1() {
      if (this.adminV1EstimatesList) {
        return {
          total: this.adminV1EstimatesList.total,
          per_page: this.adminV1EstimatesList.per_page,
          current_page: this.adminV1EstimatesList.current_page,
          last_page: this.adminV1EstimatesList.last_page,
          from: this.adminV1EstimatesList.from,
          to: this.adminV1EstimatesList.to,
        }
      }
      return {}
    },
    allFilters() {
      const res = JSON.parse(JSON.stringify(this.filters))
      res.page =
        this.estimatesType === 'V2'
          ? this.paginateV2.current_page
          : this.paginateV1.current_page
      return res
    },
  },
  async created() {
    await this.getAdminV1EstimatesList().catch((error) => (this.error = error))
    await this.getAdminV2EstimatesList().catch((error) => (this.error = error))
  },
  methods: {
    ...mapActions('estimate', [
      'getAdminV1EstimatesList',
      'getAdminV2EstimatesList',
    ]),
    formatPrice(value) {
      const val = (value / 1).toFixed(2)
      return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
    },
    clearFilters() {
      this.filters = {
        id: '',
        project_number: '',
        email: '',
      }

      this.getAdminV2EstimatesList()
      this.getAdminV1EstimatesList()
    },
  },
}
</script>
