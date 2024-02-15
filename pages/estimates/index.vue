<template>
  <div class="flex flex-col">
    <div v-if="v2EstimatesList" class="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
      <div class="py-2 align-middle inline-block w-full sm:px-6 lg:px-8">
        <NavBreadcrumbs>
          <WHeadingsHTwo heading="Estimates" />
          <template #actions>
            <div class="flex space-x-3">
              <div class="w-48">
                <WButtonsBase
                  icon="plus"
                  type="primaryInverted"
                  @click.native="
                    $router.push('/well-admin/estimates/create/v1')
                  "
                >
                  V1 Estimate
                </WButtonsBase>
              </div>
              <div class="w-48">
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
              <div class="w-48">
                <WButtonsBase
                  icon="plus"
                  type="primaryInverted"
                  @click.native="
                    $router.push('/well-admin/estimates/create/v2')
                  "
                >
                  V2 Estimate
                </WButtonsBase>
              </div>
            </div>
          </template>
        </NavBreadcrumbs>
        <div class="flex">
          <FormulateInput
            v-model="estimatesType"
            type="select"
            label="Type"
            class="mr-3 w-48"
            :options="[
              { value: 'V2', label: 'V2 Estimates' },
              { value: 'V1', label: 'V1 Estimates' },
            ]"
          />
          <form
            v-if="estimatesType === 'V1'"
            class="grid grid-cols-5 gap-4 mb-5"
            @submit.prevent="getv1EstimatesList({ ...allFilters, page: 1 })"
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
            <div class="mt-6">
              <WButtonsBase
                v-if="
                  filters.id !== '' ||
                  filters.email !== '' ||
                  filters.project_number !== ''
                "
                class="mt-auto"
                type="primaryInverted"
                @click.native="clearFilters()"
              >
                Clear filters
              </WButtonsBase>
            </div>
          </form>
          <form
            v-if="estimatesType === 'V2'"
            class="grid grid-cols-5 gap-4 mb-5"
            @submit.prevent="getV2EstimatesList({ ...allFilters, page: 1 })"
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
            <div class="mt-6">
              <WButtonsBase
                v-if="
                  filters.id !== '' ||
                  filters.email !== '' ||
                  filters.project_number !== ''
                "
                class="mt-auto"
                type="primaryInverted"
                @click.native="clearFilters()"
              >
                Clear filters
              </WButtonsBase>
            </div>
          </form>
        </div>
        <div
          class="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg"
        >
          <div class="overflow-x-scroll">
            <table class="w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th
                    class="px-6 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider"
                  >
                    ID
                  </th>
                  <th
                    class="px-6 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Type
                  </th>
                  <th
                    class="px-6 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Country/Region
                  </th>
                  <th
                    class="px-6 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Project #
                  </th>
                  <th
                    class="px-6 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Project Name
                  </th>
                  <th
                    class="px-6 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Email
                  </th>
                  <th
                    class="px-6 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Reg Disc.
                  </th>
                  <th
                    class="px-6 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Cert Disc.
                  </th>
                  <th
                    class="px-6 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Created
                  </th>
                  <th class="px-6 py-3 bg-gray-50"></th>
                </tr>
              </thead>
              <tbody
                v-if="estimatesType === 'V1'"
                class="bg-white divide-y divide-gray-200"
              >
                <tr v-for="estimate in v1EstimatesList.data" :key="estimate.id">
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm leading-5 text-gray-900">
                      {{ estimate.id }}
                    </div>
                  </td>

                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm leading-5 text-gray-900">v1</div>
                  </td>

                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm leading-5 text-gray-900">
                      {{ estimate.country }}
                    </div>
                  </td>

                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm leading-5 text-gray-900">
                      {{ estimate.project_number }}
                    </div>
                  </td>

                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm leading-5 text-gray-900">
                      {{ estimate.projects[0].name }}
                    </div>
                  </td>

                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm leading-5 text-gray-900">
                      {{ estimate.email }}
                    </div>
                  </td>

                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm leading-5 text-gray-900">
                      {{ estimate.reg_discount }}
                    </div>
                  </td>

                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm leading-5 text-gray-900">
                      {{ estimate.cert_discount }}
                    </div>
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
              <tbody
                v-if="estimatesType === 'V2'"
                class="bg-white divide-y divide-gray-200"
              >
                <tr v-for="estimate in v2EstimatesList.data" :key="estimate.id">
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm leading-5 text-gray-900">
                      {{ estimate.id }}
                    </div>
                  </td>

                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm leading-5 text-gray-900">
                      {{ estimate.type }}
                    </div>
                  </td>

                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm leading-5 text-gray-900">
                      {{ estimate.country }}
                    </div>
                  </td>

                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm leading-5 text-gray-900">
                      <span v-if="estimate.projects.length > 0">
                        {{ estimate.projects[0].project_number }}
                      </span>
                    </div>
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
                    <div class="text-sm leading-5 text-gray-900">
                      {{ estimate.reg_discount }}
                    </div>
                  </td>

                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm leading-5 text-gray-900">
                      {{ estimate.cert_discount }}
                    </div>
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
                        $router.push(
                          `/estimates/${estimate.type}/${estimate.id}`
                        )
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
            @paginate="getV2EstimatesList(allFilters)"
          />
          <FormInputsPagination
            v-if="estimatesType === 'V1'"
            :pagination="paginateV1"
            :offset="3"
            @paginate="getv1EstimatesList(allFilters)"
          />
        </div>
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

export default {
  auth: false,
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
      title: `Estimates`,
    }
  },
  computed: {
    ...mapState({
      v2EstimatesList: (state) => state.estimate.v2EstimatesList,
      v1EstimatesList: (state) => state.estimate.v1EstimatesList,
    }),
    paginateV2() {
      if (this.v2EstimatesList) {
        return {
          total: this.v2EstimatesList.total,
          per_page: this.v2EstimatesList.per_page,
          current_page: this.v2EstimatesList.current_page,
          last_page: this.v2EstimatesList.last_page,
          from: this.v2EstimatesList.from,
          to: this.v2EstimatesList.to,
        }
      }
      return {}
    },
    paginateV1() {
      if (this.v1EstimatesList) {
        return {
          total: this.v1EstimatesList.total,
          per_page: this.v1EstimatesList.per_page,
          current_page: this.v1EstimatesList.current_page,
          last_page: this.v1EstimatesList.last_page,
          from: this.v1EstimatesList.from,
          to: this.v1EstimatesList.to,
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
    await this.getV1EstimatesList().catch((error) => (this.error = error))
    await this.getV2EstimatesList().catch((error) => (this.error = error))
  },
  methods: {
    ...mapActions('estimate', ['getV1EstimatesList', 'getV2EstimatesList']),
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

      this.getV2EstimatesList()
      this.getv1EstimatesList()
    },
  },
}
</script>
