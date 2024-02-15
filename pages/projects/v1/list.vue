<template>
  <div class="flex flex-col">
    <WFeedbackModal ref="modal">
      <div class="max-w-lg mx-10 my-5">
        <div class="flex justify-center mb-4">
          <div
            class="bg-red-100 flex flex-shrink-0 h-16 items-center justify-center mx-auto rounded-full sm:mx-0 w-16"
          >
            <svg
              class="h-8 w-8 text-red-600"
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
          This action cannot be undone. This will permanently delete the
          <span v-if="selectedProject" class="font-bold">
            #{{ selectedProject.project_number }} - {{ selectedProject.name }}
          </span>
          project, documents, scorecard, and remove all team associations.
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
          <WButtonsBase type="danger" @click.native="deleteProject()">
            I understand the consequences, delete this project!
          </WButtonsBase>
        </div>
      </div>
    </WFeedbackModal>
    <div v-if="projectsList" class="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
      <div class="py-2 align-middle inline-block w-full sm:px-6 lg:px-8">
        <NavBreadcrumbs>
          <WHeadingsHTwo
            class="text-primary-900"
            heading="WELL Community Projects"
          />
          <template #actions>
            <div
              class="gap-x-2 gap-y-2 md:grid grid-cols-2 ml-auto space-y-2 md:space-y-0"
            >
              <div class="w-full md:w-56">
                <WButtonsBase
                  icon="houses"
                  @click.native="$router.push(`/projects/v1/create`)"
                >
                  Start a Community Project
                </WButtonsBase>
              </div>

              <div
                v-if="currentUser.role.includes('project-coach')"
                class="w-56"
              >
                <WButtonsBase
                  type="primaryInverted"
                  @click.native="
                    ;(filters.user_type = 'coach'),
                      $store.dispatch(
                        'project/getProjectsForAdminRole',
                        adminFilters('coach')
                      )
                  "
                >
                  Show Coaching Projects
                </WButtonsBase>
              </div>
              <div
                v-if="currentUser.role.includes('well-assessor')"
                class="w-56"
              >
                <WButtonsBase
                  type="primaryInverted"
                  @click.native="
                    ;(filters.user_type = 'assessor'),
                      $store.dispatch(
                        'project/getProjectsForAdminRole',
                        adminFilters('assessor')
                      )
                  "
                >
                  Show Assessor Projects
                </WButtonsBase>
              </div>
              <div
                v-if="currentUser.role.includes('external-reviewer')"
                class="w-56"
              >
                <WButtonsBase
                  type="primaryInverted"
                  @click.native="
                    ;(filters.user_type = 'reviewer'),
                      $store.dispatch(
                        'project/getProjectsForAdminRole',
                        adminFilters('reviewer')
                      )
                  "
                >
                  Show Reviewer Projects
                </WButtonsBase>
              </div>
            </div>
          </template>
        </NavBreadcrumbs>
        <WLinksBase
          v-if="filters.user_type !== 'user'"
          icon="arrow-narrow-left"
          @click.native=";(filters.user_type = 'user'), getProjectsList()"
        >
          Back to list
        </WLinksBase>
        <FormulateForm
          class="grid grid-cols-6 gap-4 mb-5"
          @submit="getProjectsList()"
        >
          <FormulateInput
            v-model="filters.project_number"
            label="ID"
            name="ID"
            type="text"
          />
          <FormulateInput
            v-model="filters.name"
            label="Name"
            name="Name"
            type="text"
          />
          <FormulateInput
            v-if="countryOptions.length > 0"
            v-model="filters.country_id"
            label="Country/Region"
            :options="countryOptions"
            type="select"
            placeholder=""
          />
          <FormulateInput
            v-model="filters.reg_status"
            :options="[
              { value: '1', label: 'Registered' },
              { value: '2', label: 'Registration in progress' },
              { value: '0', label: 'Not Registered' },
            ]"
            type="select"
            label="Status"
            placeholder="Status"
            :error="error"
          />
          <div class="mt-6">
            <WButtonsBase @click.native="getProjectsList()">
              Apply
            </WButtonsBase>
          </div>
          <div class="mt-6">
            <WButtonsBase
              v-if="hasAppliedFilters"
              type="primaryInverted"
              @click.native="clearFilters()"
            >
              Clear filters
            </WButtonsBase>
          </div>
        </FormulateForm>
        <div
          class="relative shadow overflow-hidden border-b border-gray-200 sm:rounded-lg"
        >
          <div class="overflow-x-scroll">
            <table class="w-full divide-y divide-gray-200">
              <thead>
                <tr class="text-white bg-primary-700">
                  <th
                    class="px-3 md:px-6 py-3 text-left text-xs leading-4 font-medium uppercase tracking-wider"
                  >
                    Project ID
                  </th>
                  <th
                    class="px-3 md:px-6 py-3 text-left text-xs leading-4 font-medium uppercase tracking-wider"
                  >
                    Name
                  </th>
                  <th
                    class="px-3 md:px-6 py-3 text-left text-xs leading-4 font-medium uppercase tracking-wider"
                  >
                    Area
                  </th>
                  <th
                    class="px-3 md:px-6 py-3 text-left text-xs leading-4 font-medium uppercase tracking-wider"
                  >
                    Location
                  </th>
                  <th
                    class="px-3 md:px-6 py-3 text-left text-xs leading-4 font-medium uppercase tracking-wider"
                  >
                    Status
                  </th>
                  <th
                    class="px-3 md:px-6 py-3 text-left text-xs leading-4 font-medium uppercase tracking-wider"
                  >
                    Admin
                  </th>
                  <th
                    class="px-3 md:px-6 py-3 text-left text-xs leading-4 font-medium uppercase tracking-wider"
                  >
                    Owner
                  </th>
                  <th
                    class="px-3 md:px-6 py-3 text-left text-xs leading-4 font-medium uppercase tracking-wider"
                  >
                    Certification Status
                  </th>
                  <th
                    class="px-3 md:px-6 py-3 text-left text-xs leading-4 font-medium uppercase tracking-wider"
                  >
                    Created At
                  </th>
                  <th
                    class="px-3 md:px-6 py-3 text-left text-xs leading-4 font-medium uppercase tracking-wider"
                  >
                    <div class="w-28"></div>
                  </th>
                  <th
                    class="w-28 right-0 transform mt-2 absolute px-3 md:px-6 py-3 text-left text-xs leading-4 font-medium uppercase tracking-wider bg-primary-700"
                  >
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr v-for="project in projectsList.data" :key="project.id">
                  <td class="h-20 px-6 py-4 whitespace-nowrap">
                    <div
                      class="text-sm leading-5 text-primary-500 cursor-pointer flex space-x-2"
                    >
                      <div
                        @click="
                          $router.push(
                            `/projects/${project.type}/${project.project_number}/dashboard`
                          )
                        "
                      >
                        {{ project.project_number }}
                      </div>
                      <a
                        :href="`/projects/${project.type}/${project.project_number}/dashboard`"
                        target="_blank"
                      >
                        <WIconsBase
                          icon="external-link"
                          type="blank"
                          class="text-gray-400 hover:text-gray-500"
                        />
                      </a>
                    </div>
                    <div class="text-sm leading-5">
                      <span
                        v-if="project.type === 'v2'"
                        class="px-2 inline-flex text-xs leading-5 rounded-full bg-primary-600 text-white uppercase"
                        >WELL v2</span
                      >
                      <span
                        v-else-if="project.type === 'v2-pilot'"
                        class="px-2 inline-flex text-xs leading-5 rounded-full bg-green-500 text-white uppercase"
                        >WELL v2 pilot</span
                      >
                      <span
                        v-else-if="project.type === 'v1'"
                        class="px-2 inline-flex text-xs leading-5 rounded-full bg-gray-400 text-white uppercase"
                        >WELL v1</span
                      >
                    </div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm leading-5 font-medium text-gray-900">
                      {{ project.name }}
                    </div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm leading-5 text-gray-900">
                      {{ Number(project.area).toLocaleString() }} sqft
                    </div>
                    <div class="text-sm leading-5 text-gray-500">
                      {{ Number(project.area_in_meter).toLocaleString() }} sqm
                    </div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm leading-5 text-gray-900">
                      {{ getCountryName(project.country_code) }}
                    </div>
                    <div class="text-sm leading-5 text-gray-500">
                      {{ project.map_city }}
                    </div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm leading-5 font-medium text-gray-900">
                      <span
                        v-if="
                          project.reg_status === 1 &&
                          project.reg_payment_status === 'paid'
                        "
                        class="px-2 inline-flex text-xs leading-5 rounded-full bg-green-600 text-white uppercase"
                        >Registered</span
                      >
                      <span
                        v-else-if="
                          project.reg_status === 1 &&
                          project.reg_payment_status !== 'paid'
                        "
                        class="px-2 inline-flex text-xs leading-5 rounded-full bg-yellow-600 text-white uppercase"
                        >Registration in progress</span
                      >
                      <span
                        v-else
                        class="px-2 inline-flex text-xs leading-5 rounded-full bg-secondary-600 text-white uppercase"
                        >Not Registered</span
                      >
                    </div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm leading-5 text-gray-900">
                      <span v-if="project.user">
                        {{ project.user.email }}
                      </span>
                    </div>
                    <div
                      v-if="project.user"
                      class="text-sm leading-5 text-gray-500"
                    >
                      {{ project.user.full_name }}
                    </div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm leading-5 text-gray-900">
                      {{ project.owner_email }}
                    </div>
                    <div class="text-sm leading-5 text-gray-500">
                      {{ project.owner_name }}
                    </div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div
                      class="text-sm leading-5 text-gray-900"
                      v-html="checkValue(project.cert_status)"
                    ></div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm leading-5 text-gray-900">
                      {{ $dayjs(project.created_at).format('MMM DD, YYYY') }}
                    </div>
                  </td>
                  <td class="w-28"></td>
                  <td
                    class="h-20 border-b flex justify-around w-28 right-0 transform absolute px-3 md:px-6 py-4 whitespace-nowrap white-gradient"
                  >
                    <WIconsBase
                      v-if="
                        (currentUser.role.includes('well-admin') ||
                          currentUser.role.includes('admin') ||
                          project.user_id === currentUser.id) &&
                        project.reg_payment_status !== 'paid'
                      "
                      class="cursor-pointer"
                      icon="trash"
                      type="danger"
                      @click.native="
                        ;($refs.modal.isHidden = false),
                          (selectedProject = project)
                      "
                    />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <FormInputsPagination
            :pagination="paginate"
            :offset="3"
            @paginate="
              $store.dispatch('project/getAllUserProjects', allFilters)
            "
          />
        </div>
      </div>
    </div>
    <div v-else class="h-screen w-full mt-14">
      <div v-if="error == null" class="mx-auto text-center">
        <WLoadingSpinner class="mx-auto" />
        <div class="mt-3 text-primary-600">Loading projects...</div>
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
        project_number: '',
        country_id: null,
        name: '',
        reg_status: '',
        v1_project_standard: 'community',
        type: 'v1',
        user_type: 'user',
      },
      selectedProject: null,
      error: null,
    }
  },
  head() {
    return {
      title: `Community Projects`,
    }
  },
  computed: {
    ...mapState({
      projectsList: (state) => state.project.projectsList,
      countries: (state) => state.address.countries,
      currentUser: (state) => state.user.currentUser,
    }),
    countryOptions() {
      const options = []
      this.countries.forEach(function (country) {
        options.push({ value: country.id, label: country.name })
      })
      return options
    },
    paginate() {
      if (this.projectsList) {
        return {
          total: this.projectsList.total,
          per_page: this.projectsList.per_page,
          current_page: this.projectsList.current_page,
          last_page: this.projectsList.last_page,
          from: this.projectsList.from,
          to: this.projectsList.to,
        }
      }
      return {}
    },
    hasAppliedFilters() {
      for (const key in this.filters) {
        if (
          this.filters[key] !== null &&
          this.filters[key] !== '' &&
          key !== 'type' &&
          key !== 'v1_project_standard' &&
          key !== 'user_type'
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
      if (res.type === 'all') {
        delete res.type
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
      res.page = this.paginate.current_page
      return res
    },
  },
  async created() {
    return await this.$store
      .dispatch('project/getAllUserProjects', this.allFilters)
      .catch((error) => (this.error = error))
  },
  methods: {
    deleteProject() {
      this.$store
        .dispatch(`project/deleteProjectById`, this.selectedProject.id)
        .then((response) => {
          this.$refs.modal.isHidden = true
          this.$store.dispatch('notifications/toastMessage', {
            message: 'Project Deleted Successfully!',
          })
          this.$store
            .dispatch('project/getAllUserProjects', this.allFilters)
            .catch((error) => (this.error = error))
        })
    },
    adminFilters(role) {
      const result = { ...this.allFilters }
      result.role = role
      return result
    },
    getProjectsList() {
      if (this.filters.user_type === 'user') {
        this.allFilters.page = 1
        this.$store.dispatch('project/getAllUserProjects', this.allFilters)
      } else {
        this.$store.dispatch(
          'project/getProjectsForAdminRole',
          this.adminFilters(this.filters.user_type)
        )
      }
    },
    getCountryName(countryCode) {
      const res = this.countries.length
        ? this.countries.filter((a) => a.code === countryCode)
        : null
      return res.length ? res[0].name : ''
    },
    clearFilters() {
      const userType = this.filters.user_type

      this.filters = {
        project_number: '',
        country_id: null,
        name: '',
        reg_status: '',
        type: 'all',
        user_type: userType,
      }

      this.getProjectsList()
    },
  },
}
</script>
