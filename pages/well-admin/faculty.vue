<template>
  <div class="flex flex-col">
    <div v-if="adminFacultyList">
      <NavBreadcrumbs>
        <WHeadingsHTwo heading="Admin Faculty" />
      </NavBreadcrumbs>
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
                $store.dispatch('faculty/getAdminFacultyList', {
                  ...allFilters,
                  page: 1,
                }),
                  ($refs.mobFilters.isExpanded = false)
              }
            "
          >
            <FormulateInput
              v-model="filters.first_name"
              label="First Name"
              type="text"
              :error="error"
            />
            <FormulateInput
              v-model="filters.last_name"
              label="Last Name"
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
              v-model="filters.application_status"
              :options="[
                { label: 'Pending', value: 'pending' },
                { label: 'Approved', value: 'approved' },
                { label: 'Denied', value: 'denied' },
              ]"
              type="select"
              placeholder="Status"
              label="Application Status"
            />
            <div class="mt-6">
              <FormulateInput type="submit" label="Apply" />
            </div>
            <div
              v-if="
                filters.email !== '' ||
                filters.first_name !== '' ||
                filters.last_name !== '' ||
                filters.application_status !== ''
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
        </template>
      </LazyAccordiansBase>
      <!-- end here -->
      <!-- desktop filters start here -->
      <FormulateForm
        class="
          hidden
          sm:grid sm:grid-cols-3
          md:grid-cols-5
          lg:grid-cols-6
          gap-4
          mb-5
        "
        @submit="
          $store.dispatch('faculty/getAdminFacultyList', {
            ...allFilters,
            page: 1,
          })
        "
      >
        <FormulateInput
          v-model="filters.first_name"
          label="First Name"
          type="text"
          :error="error"
        />
        <FormulateInput
          v-model="filters.last_name"
          label="Last Name"
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
          v-model="filters.application_status"
          :options="[
            { label: 'Pending', value: 'pending' },
            { label: 'Approved', value: 'approved' },
            { label: 'Denied', value: 'denied' },
          ]"
          type="select"
          placeholder="Status"
          label="Application Status"
        />
        <div class="mt-6">
          <FormulateInput type="submit" label="Apply" />
        </div>
        <div
          v-if="
            filters.email !== '' ||
            filters.first_name !== '' ||
            filters.last_name !== '' ||
            filters.application_status !== ''
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
      <!-- end here -->
      <div
        class="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg"
      >
        <div class="overflow-x-scroll">
          <table class="min-w-full divide-y divide-gray-200">
            <thead>
              <tr class="text-white bg-primary-700">
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
                  User
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
                  Application Status
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
                  Draft Status
                </th>
                <th
                  class="
                    px-6
                    py-3
                    text-right text-xs
                    leading-4
                    font-medium
                    uppercase
                    tracking-wider
                  "
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="faculty in adminFacultyList.data" :key="faculty.id">
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm leading-5 font-medium text-gray-900">
                    {{ faculty.first_name }} {{ faculty.last_name }}
                  </div>
                  <div class="text-sm leading-5 text-gray-500">
                    {{ faculty.email }}
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm leading-5 text-gray-900">
                    <div
                      :class="{
                        'bg-primary-700':
                          faculty.application_status === 'pending',
                        'bg-danger-500':
                          faculty.application_status === 'denied',
                        'bg-success-600':
                          faculty.application_status === 'approved',
                        'bg-danger-400':
                          faculty.application_status === 'expired',
                      }"
                      class="
                        px-2
                        w-24
                        text-center text-xs
                        leading-5
                        rounded-full
                        text-white
                        uppercase
                      "
                    >
                      {{ faculty.application_status }}
                    </div>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm leading-5 text-gray-900">
                    <span v-if="faculty.is_draft === 1">Draft</span>
                    <span v-else>Submitted</span>
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
                  <div
                    class="
                      cursor-pointer
                      text-primary-600
                      hover:text-primary-900
                    "
                    @click="
                      $router.push(`/well-faculty/register/${faculty.id}`)
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
          @paginate="$store.dispatch('faculty/getAdminFacultyList', allFilters)"
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
export default {
  data() {
    return {
      filters: {
        first_name: '',
        last_name: '',
        email: '',
        application_status: '',
      },
      error: null,
    }
  },
  head() {
    return {
      title: `Admin Faculty`,
    }
  },
  computed: {
    ...mapState({
      adminFacultyList: (state) => state.faculty.adminFacultyList,
    }),
    paginate() {
      if (this.adminFacultyList) {
        return {
          total: this.adminFacultyList.total,
          per_page: this.adminFacultyList.per_page,
          current_page: this.adminFacultyList.current_page,
          last_page: this.adminFacultyList.last_page,
          from: this.adminFacultyList.from,
          to: this.adminFacultyList.to,
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
    return await this.$store
      .dispatch('faculty/getAdminFacultyList')
      .catch((error) => (this.error = error))
  },
  methods: {
    formatPrice(value) {
      const val = (value / 1).toFixed(2)
      return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
    },
    clearFilters() {
      this.filters = {
        first_name: '',
        last_name: '',
        email: '',
        application_status: '',
      }
      this.$store.dispatch('faculty/getAdminFacultyList')
    },
  },
}
</script>
