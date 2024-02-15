<template>
  <div class="flex flex-col">
    <div v-if="adminAltList">
      <NavBreadcrumbs>
        <WHeadingsHTwo class="text-primary-900" heading="Admin Alternatives" />
        <template #actions>
          <div class="justify-end w-full sm:flex">
            <div>
              <WButtonsBase
                type="primaryInverted"
                icon="download"
                @click.native="downloadAll"
              >
                Download All
              </WButtonsBase>
            </div>
          </div>
        </template>
      </NavBreadcrumbs>
      <!-- desktop filtrers start here -->
      <FormulateForm
        class="hidden sm:grid grid-cols-3 md:grid-cols-4 gap-x-4 my-5"
        @submit="applyFilters()"
      >
        <FormulateInput
          v-if="altType !== 'HSR'"
          v-model="filters.id"
          type="text"
          label="Strategy #"
          placeholder="Strategy #"
        />
        <FormulateInput
          v-model="altType"
          type="select"
          label="Version"
          class="mr-3 mt-auto"
          :options="[
            { value: 'all', label: 'All Alternatives' },
            { value: 'V1', label: 'V1 Alternatives' },
            { value: 'V2-Pilot', label: 'V2-Pilot Alternatives' },
            { value: 'V2', label: 'V2 Alternatives' },
            { value: 'HSR', label: 'HSR Alternatives' },
          ]"
        />
        <FormulateInput
          v-if="altType !== 'HSR'"
          v-model="filters.type"
          type="select"
          label="Type"
          class="mr-3 mt-auto"
          :options="[
            { value: 'aap', label: 'AAPs' },
            { value: 'ep', label: 'EPs' },
          ]"
        />
        <FormulateInput
          v-model="filters.status"
          type="select"
          label="Status"
          class="mr-3 mt-auto"
          :options="[
            { value: 'pending', label: 'Pending' },
            { value: 'approved', label: 'Approved' },
            { value: 'altered', label: 'Approved with Altered' },
            { value: 'inforequested', label: 'Additional Info Requested' },
          ]"
        />
        <FormulateInput
          v-if="altType !== 'HSR'"
          v-model="filters.project_number"
          type="text"
          label="Project ID"
          placeholder="Project ID"
          class="mr-5 mt-auto"
        />
        <div class="mt-6">
          <FormulateInput
            v-if="
              filters.type_internal !== '' ||
              filters.v1_aap !== '1' ||
              filters.orderBy !== 'id' ||
              filters.order !== 'desc' ||
              filters.project_number !== '' ||
              filters.type !== '' ||
              filters.status !== ''
            "
            class="mr-3"
            type="submit"
            label="Apply"
          />
        </div>
        <div class="mt-6 mr-3">
          <WButtonsBase
            v-if="
              filters.type_internal !== '' ||
              filters.v1_aap !== '1' ||
              filters.orderBy !== 'id' ||
              filters.order !== 'desc' ||
              filters.project_number !== '' ||
              filters.type !== '' ||
              filters.status !== ''
            "
            type="primaryInverted"
            class="mt-auto mr-3"
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
              v-if="altType !== 'HSR'"
              v-model="filters.id"
              type="text"
              label="Strategy #"
              placeholder="Strategy #"
            />
            <FormulateInput
              v-model="altType"
              type="select"
              label="Version"
              :options="[
                { value: 'all', label: 'All Alternatives' },
                { value: 'V1', label: 'V1 Alternatives' },
                { value: 'V2-Pilot', label: 'V2-Pilot Alternatives' },
                { value: 'V2', label: 'V2 Alternatives' },
                { value: 'HSR', label: 'HSR Alternatives' },
              ]"
            />
            <FormulateInput
              v-if="altType !== 'HSR'"
              v-model="filters.type"
              type="select"
              label="Type"
              :options="[
                { value: 'aap', label: 'AAPs' },
                { value: 'ep', label: 'EPs' },
              ]"
            />
            <FormulateInput
              v-model="filters.status"
              type="select"
              label="Status"
              :options="[
                { value: 'pending', label: 'Pending' },
                { value: 'approved', label: 'Approved' },
                { value: 'altered', label: 'Approved with Altered' },
                {
                  value: 'inforequested',
                  label: 'Additional Info Requested',
                },
              ]"
            />
            <FormulateInput
              v-if="altType !== 'HSR'"
              v-model="filters.project_number"
              type="text"
              label="Project ID"
              placeholder="Project ID"
            />
            <div class="mt-6">
              <FormulateInput
                v-if="
                  filters.type_internal !== '' ||
                  filters.v1_aap !== '1' ||
                  filters.orderBy !== 'id' ||
                  filters.order !== 'desc' ||
                  filters.project_number !== '' ||
                  filters.type !== '' ||
                  filters.status !== ''
                "
                type="submit"
                label="Apply"
              />
            </div>
            <div
              v-if="
                filters.type_internal !== '' ||
                filters.v1_aap !== '1' ||
                filters.orderBy !== 'id' ||
                filters.order !== 'desc' ||
                filters.project_number !== '' ||
                filters.type !== '' ||
                filters.status !== ''
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
        </template>
      </LazyAccordiansBase>
      <!-- end here -->
      <div
        class="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg"
      >
        <div v-if="adminAltList" class="overflow-x-scroll">
          <table class="w-full">
            <thead class="bg-primary-700 w-full">
              <tr class="uppercase text-white px-3 text-xs">
                <th class="text-left p-4">Strategies#</th>
                <th class="text-left p-4">Project ID</th>
                <th class="text-left p-4">Version</th>
                <th class="text-left p-4">Features</th>
                <th class="text-left p-4">Request Type</th>
                <th class="text-left p-4">Submission Date</th>
                <th class="text-left p-4">Submitted by</th>
                <th class="text-left p-4">Status</th>
              </tr>
            </thead>

            <tbody class="text-left">
              <tr
                v-for="(alternative, index) in adminAltList.data"
                :key="index"
              >
                <td
                  v-if="alternative.feature"
                  class="p-4 text-sm flex justify-between"
                >
                  <nuxt-link
                    :to="{
                      path: `/alternatives/${alternative.id}`,
                      query: { redirect: $route.fullPath },
                    }"
                    class="font-light text-primary-600 uppercase pointer"
                  >
                    {{ alternative.type }}-0{{ alternative.id }}
                  </nuxt-link>
                  <a
                    :href="`/alternatives/${alternative.id}?redirect=${$route.fullPath}`"
                    target="_blank"
                  >
                    <WIconsBase
                      icon="external-link"
                      type="blank"
                      class="text-gray-400 hover:text-gray-500"
                    />
                  </a>
                </td>
                <td v-else class="p-4 text-sm flex justify-between">
                  <nuxt-link
                    :to="{
                      path: `/alternatives/${alternative.id}`,
                      query: { redirect: $route.fullPath },
                    }"
                    class="font-light text-primary-600 uppercase pointer"
                    >{{ alternative.type }}-{{ alternative.id }}</nuxt-link
                  >
                  <a
                    :href="`/alternatives/${alternative.id}?redirect=${$route.fullPath}`"
                    target="_blank"
                  >
                    <WIconsBase
                      icon="external-link"
                      type="blank"
                      class="text-gray-400 hover:text-gray-500"
                    />
                  </a>
                </td>
                <td class="p-4 text-sm">
                  <div
                    v-if="alternative.portfolio"
                    class="flex justify-between"
                  >
                    <nuxt-link
                      v-if="alternative.portfolio"
                      :to="`/shared-workspaces/${alternative.portfolio.portfolio_number}/dashboard`"
                      class="font-light text-primary-600"
                      >{{ alternative.portfolio.portfolio_number }}</nuxt-link
                    >
                    <a
                      v-if="alternative.portfolio.portfolio_number"
                      :href="`/shared-workspaces/${alternative.portfolio.portfolio_number}/dashboard`"
                      target="_blank"
                    >
                      <WIconsBase
                        icon="external-link"
                        type="blank"
                        class="text-gray-400 hover:text-gray-500"
                      />
                    </a>
                  </div>
                  <div
                    v-else-if="
                      alternative.project_number === null &&
                      alternative.portfolio_number === null
                    "
                    v-html="checkValue(alternative.portfolio_number)"
                  ></div>
                  <div v-else class="flex justify-between">
                    <nuxt-link
                      :to="`/projects/${alternative.type_internal}/${alternative.project_number}/dashboard`"
                      class="font-light text-primary-600"
                      >{{ alternative.project_number }}</nuxt-link
                    >
                    <a
                      v-if="alternative.project_number"
                      :href="`/projects/${alternative.type_internal}/${alternative.project_number}/dashboard`"
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
                <td class="p-4">
                  <div class="text-xs leading-5 text-white uppercase w-28">
                    <span
                      v-if="alternative.type_internal === 'v2'"
                      class="px-2 inline-flex rounded-full bg-primary-600"
                      >WELL v2</span
                    >

                    <span
                      v-else-if="alternative.type_internal === 'v2-pilot'"
                      class="px-2 inline-flex rounded-full bg-green-500"
                      >WELL v2 pilot</span
                    >
                    <span
                      v-else-if="alternative.type_internal === 'v1'"
                      class="px-2 inline-flex rounded-full bg-gray-400"
                      >WELL v1</span
                    >
                    <span
                      v-else-if="alternative.type_internal === 'v2-hsr'"
                      class="px-2 inline-flex rounded-full bg-gray-400"
                      >HSR</span
                    >
                    <span
                      v-else-if="alternative.type_internal === 'community'"
                      class="px-2 inline-flex rounded-full bg-gray-400"
                      >Community</span
                    >
                    <span
                      v-if="alternative.type_internal === 'wpr'"
                      class="px-2 inline-flex rounded-full bg-gray-400"
                      >WPR</span
                    >
                  </div>
                </td>
                <td class="p-4 text-sm">
                  <strong
                    v-if="alternative.feature"
                    class="text-gray-500 opacity-100 font-small"
                  >
                    {{ alternative.feature.feature_full_name }}</strong
                  >
                  <strong
                    v-if="alternative.v1feature"
                    class="text-gray-500 opacity-100 font-small"
                    >{{ alternative.v1feature.name }}
                  </strong>
                </td>
                <td class="p-4 text-sm">
                  <strong
                    class="text-gray-500 opacity-100 font-small uppercase"
                    >{{ alternative.type }}</strong
                  >
                </td>
                <td class="p-4 font-light text-sm">
                  {{ $dayjs(alternative.created_at).format(' DD-MM-YYYY') }}
                </td>
                <td class="p-4 font-light text-sm">
                  {{ alternative.user.full_name }}
                </td>
                <td class="p-4 flex">
                  <div
                    :class="[
                      alternative.status === 'approved' && 'bg-green-400',
                      alternative.status === 'pending' && 'bg-yellow-500',
                      alternative.status === 'altered' && 'bg-green-500',
                      alternative.status === 'denied' && 'bg-danger-300',
                      alternative.status === 'not-applicable' && 'bg-gray-500',
                      alternative.status === 'inforequested' &&
                        'bg-primary-500',
                      'text-center badge-info uppercase p-1 text-white rounded font-semibold w-full',
                    ]"
                    style="font-size: 10px"
                  >
                    {{
                      alternative.status === 'denied'
                        ? 'Not Approved'
                        : alternative.status
                    }}
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <FormInputsPagination
          :pagination="paginate"
          :offset="3"
          @paginate="$store.dispatch('alternative/getAdminAltList', allFilters)"
        />
      </div>
    </div>
    <div v-else class="h-screen w-full mt-14">
      <div v-if="error == null" class="mx-auto text-center">
        <WLoadingSpinner class="mx-auto" />
        <div class="mt-3 text-primary-600">Loading alternatives...</div>
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
      altType: 'all',
      filters: {
        type_internal: 'all',
        v1_aap: '',
        orderBy: 'id',
        order: 'desc',
        page: 1,
        project_number: '',
        type: '',
        status: '',
      },
      error: null,
    }
  },
  head() {
    return {
      title: `Admin Alternatives`,
    }
  },
  computed: {
    ...mapState({
      adminAltList: (state) => state.alternative.adminAltList,
    }),

    paginate() {
      if (this.adminAltList) {
        return {
          total: this.adminAltList.total,
          per_page: this.adminAltList.per_page,
          current_page: this.adminAltList.current_page,
          last_page: this.adminAltList.last_page,
          from: this.adminAltList.from,
          to: this.adminAltList.to,
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
        .dispatch('alternative/getAdminAltList', this.filters)
        .catch((error) => (this.error = error))
    },
  },

  async mounted() {
    return await this.$store
      .dispatch('alternative/getAdminAltList', this.allFilters)
      .catch((error) => (this.error = error))
  },
  methods: {
    applyFilters() {
      this.allFilters.page = 1
      this.$store.dispatch('alternative/getAdminAltList', this.allFilters)
      this.$refs.mobFilters.isExpanded = false
    },
    clearFilters() {
      this.altType = 'all'
      this.filters = {
        id: '',
        type_internal: 'all',
        v1_aap: '',
        orderBy: 'id',
        order: 'desc',
        page: 1,
        project_number: '',
        type: '',
        status: '',
      }
      this.$store.dispatch('alternative/getAdminAltList', this.filters)
    },
    downloadAll() {
      const url =
        this.$axios.defaults.baseURL +
        `api/admin/aap/excelExport?token=${this.$store.state.authentication.token}`
      window.open(url, '_blank')
    },
  },
}
</script>
