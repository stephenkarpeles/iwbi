<template>
  <div class="flex flex-col">
    <div v-if="adminInnovationsList">
      <NavBreadcrumbs>
        <WHeadingsHTwo class="text-primary-900" heading="Admin Innovations" />
      </NavBreadcrumbs>
      <!-- desktop filters start here -->
      <FormulateForm
        class="hidden sm:grid grid-cols-3 md:grid-cols-4 gap-4 my-5"
        @submit="applyFilters()"
      >
        <FormulateInput
          v-model="filters.status"
          type="select"
          label="Status"
          :options="[
            { value: 'pending', label: 'Pending' },
            { value: 'approved', label: 'Approved' },
            { value: 'altered', label: 'Approved with Altered' },
            { value: 'inforequested', label: 'Additional Info Requested' },
          ]"
        />
        <FormulateInput
          v-model="filters.id"
          type="text"
          placeholder="Innovation ID"
          label="Innovation ID"
        />
        <FormulateInput class="mt-6" type="submit" label="Apply" />
        <div v-if="filters.id !== '' || filters.status !== ''" class="mt-6">
          <WButtonsBase
            type="primaryInverted"
            class="mt-auto"
            @click.native="clearFilters()"
          >
            Clear filters
          </WButtonsBase>
        </div>
      </FormulateForm>
      <!-- end here -->
      <!-- mobile filters start here -->
      <LazyAccordiansBase
        ref="mobFilters"
        label="filters"
        class="sm:hidden mb-8 capitalize"
      >
        <template #content>
          <FormulateForm @submit="applyFilters()">
            <FormulateInput
              v-model="filters.status"
              type="select"
              label="Status"
              :options="[
                { value: 'pending', label: 'Pending' },
                { value: 'approved', label: 'Approved' },
                { value: 'altered', label: 'Approved with Altered' },
                { value: 'inforequested', label: 'Additional Info Requested' },
              ]"
            />
            <FormulateInput
              v-model="filters.id"
              type="text"
              placeholder="Innovation ID"
              label="Innovation ID"
            />
            <div class="mt-6">
              <FormulateInput type="submit" label="Apply" />
            </div>
            <div v-if="filters.id !== '' || filters.status !== ''" class="mt-4">
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
      <div
        class="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg"
      >
        <div class="overflow-x-scroll">
          <table class="table-auto w-full">
            <thead>
              <tr class="uppercase bg-primary-700 text-white px-3 text-xs">
                <th class="text-left py-4 px-6">ID</th>
                <th class="text-left py-4 px-6">Type</th>
                <th class="text-left py-4 px-6">User</th>
                <th class="text-left py-4 px-6">Status</th>
                <th class="text-left py-4 px-6">Created On</th>
                <th class="text-left py-4 px-6">action</th>
              </tr>
            </thead>
            <tbody class="text-left divide-y divide-gray-200">
              <tr
                v-for="innovation in adminInnovationsList.data"
                :key="innovation.id"
              >
                <td class="px-6 py-4 whitespace-nowrap">
                  <WLinksBase
                    :link="`/well-admin/innovations/${innovation.id}`"
                  >
                    I0{{ innovation.id }}
                  </WLinksBase>
                </td>
                <td
                  class="
                    px-6
                    py-4
                    whitespace-nowrap
                    text-primary-900 text-sm
                    lowercase
                  "
                >
                  <div
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
                  >
                    <div v-if="innovation.type">
                      {{ innovation.type }}
                    </div>
                    <div v-else>Innovation</div>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex flex-col text-primary-900 text-sm">
                    <span>
                      {{ innovation.user_name }}
                    </span>
                    <span class="opacity-80">
                      {{ innovation.user_email }}
                    </span>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div
                    :class="[
                      innovation.status === 'approved' && 'bg-green-400',
                      innovation.status === 'pending' && 'bg-yellow-500',
                      innovation.status === 'altered' && 'bg-green-500',
                      innovation.status === 'denied' && 'bg-danger-300',
                      innovation.status === 'not-applicable' && 'bg-gray-500',
                      innovation.status === 'inforequested' && 'bg-primary-500',
                      'text-center badge-info uppercase p-1 text-white rounded font-semibold text-xs w-28',
                    ]"
                  >
                    {{
                      innovation.status === 'denied'
                        ? 'Not Approved'
                        : innovation.status
                    }}
                  </div>
                </td>

                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm leading-5 text-gray-900">
                    <span v-if="innovation.created_at">
                      {{ $dayjs(innovation.created_at).format('MMM DD, YYYY') }}
                    </span>
                  </div>
                </td>
                <td
                  class="
                    px-6
                    py-4
                    whitespace-nowrap
                    text-right text-sm
                    leading-5
                    font-medium
                  "
                >
                  <WLinksBase
                    :link="`/well-admin/innovations/${innovation.id}`"
                  >
                    View
                  </WLinksBase>
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
    <div v-else class="h-screen w-full mt-14">
      <div v-if="error == null" class="mx-auto text-center">
        <WLoadingSpinner class="mx-auto" />
        <div class="mt-3 text-primary-600">Loading innovations...</div>
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
        id: '',
        status: '',
      },
      error: null,
    }
  },
  head() {
    return {
      title: `Admin Innovations`,
    }
  },
  computed: {
    ...mapState({
      adminInnovationsList: (state) => state.innovation.adminInnovationsList,
    }),

    paginate() {
      if (this.adminInnovationsList) {
        return {
          total: this.adminInnovationsList.total,
          per_page: this.adminInnovationsList.per_page,
          current_page: this.adminInnovationsList.current_page,
          last_page: this.adminInnovationsList.last_page,
          from: this.adminInnovationsList.from,
          to: this.adminInnovationsList.to,
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
      res.page = this.paginate.current_page
      return res
    },
  },
  watch: {
    altType(newValue) {
      switch (newValue) {
        case 'V1':
          this.filters = {
            type_internal: '',
            v1_aap: '1',
            orderBy: 'id',
            order: 'desc',
            page: 1,
          }
          break
        case 'V2-Pilot':
          this.filters = {
            type_internal: 'v2-pilot',
            v1_aap: '',
            orderBy: 'id',
            order: 'desc',
            page: 1,
          }
          break
        case 'V2':
          this.filters = {
            type_internal: 'v2',
            v1_aap: '',
            orderBy: 'id',
            order: 'desc',
            page: 1,
          }
          break
        case 'HSR':
          this.filters = {
            type_internal: 'v2-hsr',
            orderBy: 'id',
            order: 'desc',
            page: 1,
          }
          break
        case 'all':
          this.filters = {
            type_internal: 'all',
            v1_aap: '',
            orderBy: 'id',
            order: 'desc',
            page: 1,
            project_number: '',
            type: '',
            status: '',
          }
          break
      }
      this.$store
        .dispatch('innovation/getAdminInnovationsList', this.filters)
        .catch((error) => (this.error = error))
    },
  },

  async mounted() {
    return await this.$store
      .dispatch('innovation/getAdminInnovationsList', this.allFilters)
      .catch((error) => (this.error = error))
  },
  methods: {
    applyFilters() {
      this.allFilters.page = 1
      this.$store.dispatch(
        'innovation/getAdminInnovationsList',
        this.allFilters
      )
      this.$refs.mobFilters.isExpanded = false
    },
    async getAdminInvoicesList(allFilters) {
      if (this.adminInnovationsList) {
        await this.$store.dispatch(
          'innovation/getAdminInnovationsList',
          allFilters
        )
      }
    },
    clearFilters() {
      this.altType = 'all'
      this.filters = {
        id: '',
        status: '',
      }
      this.$store.dispatch('innovation/getAdminInnovationsList', this.filters)
    },
  },
}
</script>
