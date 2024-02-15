<template>
  <div class="flex flex-col">
    <div v-if="projectsList" class="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
      <div class="py-2 align-middle inline-block w-full sm:px-6 lg:px-8">
        <NavBreadcrumbs>
          <WHeadingsHTwo
            v-if="filters.user_type !== 'user'"
            :heading="
              'WELL v1 - ' +
              filters.user_type.charAt(0).toUpperCase() +
              filters.user_type.slice(1) +
              ' Projects'
            "
          />
          <WHeadingsHTwo v-else heading="WELL v1 Projects" />
          <template v-slot:actions>
            <div class="gap-x-2 gap-y-2 grid grid-cols-2 w-full">
              <WButtonsBase
                type="primaryInverted"
                @click.native="$router.push('/projects/v1/create')"
              >
                Start a WELL Community Project
              </WButtonsBase>
              <WButtonsBase
                v-if="currentUser.role.includes('project-coach')"
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
              <WButtonsBase
                v-if="currentUser.role.includes('well-assessor')"
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
              <WButtonsBase
                v-if="currentUser.role.includes('external-reviewer')"
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
          </template>
        </NavBreadcrumbs>
        <WLinksBase
          v-if="filters.user_type !== 'user'"
          icon="arrow-narrow-left"
          @click.native=";(filters.user_type = 'user'), getProjectsList()"
        >
          Back to list
        </WLinksBase>
        <form
          class="grid grid-cols-6 gap-4 mb-5"
          @submit.prevent="getProjectsList()"
        >
          <FormulateInput
            v-model="filters.project_number"
            type="text"
            placeholder="Project ID"
            label="Project ID"
          />
          <FormulateInput
            v-model="filters.name"
            type="text"
            placeholder="Name"
            label="Name"
          />

          <div class="mt-6">
            <FormulateInput type="submit" label="Apply" />
          </div>
          <div class="mt-6">
            <WButtonsBase
              v-if="
                filters.project_number ||
                filters.country_id ||
                filters.name ||
                filters.status ||
                filters.user_type !== 'user'
              "
              class="mt-auto"
              type="primaryInverted"
              @click.native="clearFilters()"
            >
              Clear filters
            </WButtonsBase>
          </div>
        </form>
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
                    Name
                  </th>
                  <th
                    class="px-6 py-3 bg-gray-50 text-right text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr v-for="project in projectsList.data" :key="project.id">
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm leading-5 font-medium text-gray-900">
                      {{ project.project_number }}
                    </div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm leading-5 font-medium text-gray-900">
                      {{ project.name }}
                    </div>
                  </td>
                  <td
                    class="px-6 py-4 whitespace-nowrap text-right text-sm leading-5 font-medium"
                  >
                    <nuxt-link
                      class="cursor-pointer text-primary-600 hover:text-primary-900"
                      :to="`/projects/v1/${project.project_number}/dashboard/`"
                    >
                      View Dashboard
                    </nuxt-link>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <FormInputsPagination
            :pagination="paginate"
            :offset="3"
            @paginate="$store.dispatch('project/getV1Projects', allFilters)"
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

export default {
  data() {
    return {
      filters: {
        currentPage: 1,
        project_number: '',
        country_id: '',
        name: '',
        user_type: 'user',
      },
      error: null,
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
    allFilters() {
      const res = JSON.parse(JSON.stringify(this.filters))
      res.page = this.paginate.current_page
      return res
    },
  },
  async created() {
    return await this.$store
      .dispatch('project/getV1Projects', this.allFilters)
      .catch((error) => (this.error = error))
  },
  methods: {
    adminFilters(role) {
      const result = { ...this.allFilters }
      result.role = role
      result.v1_project = 1
      result.type = 'v1'
      return result
    },
    getProjectsList() {
      if (this.filters.user_type === 'user') {
        this.$store.dispatch('project/getV1Projects', this.allFilters)
      } else {
        this.$store.dispatch(
          'project/getProjectsForAdminRole',
          this.adminFilters(this.filters.user_type)
        )
      }
    },
    clearFilters() {
      const userType = this.filters.user_type

      this.filters = {
        project_number: '',
        name: '',
        country_id: '',
        user_type: userType,
        currentPage: 1,
      }

      this.getProjectsList()
    },
  },
  head() {
    return {
      title: `v1 Projects`,
    }
  },
}
</script>
