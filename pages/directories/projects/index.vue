<template>
  <div class="flex flex-col">
    <div
      v-if="
        projectsList &&
        countries &&
        projectTypes &&
        standardTypes &&
        statusTypes
      "
      class="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8"
    >
      <div class="py-2 align-middle inline-block w-full sm:px-6 lg:px-8">
        <NavBreadcrumbs>
          <WHeadingsHTwo heading="WELL Projects" />
          <template #actions>
            <div class="justify-end w-full flex">
              <div>
                <WButtonsBase
                  type="primaryInverted"
                  icon="download"
                  @click.native="downloadExcelExport()"
                >
                  Download
                </WButtonsBase>
              </div>
            </div>
          </template>
        </NavBreadcrumbs>
        <form
          class="grid grid-cols-4 gap-4 my-5"
          @submit.prevent="
            $store.dispatch('project/getDirectoryProjectsList', allFilters)
            $store.commit('project/setProjectDirectoryFilters', filters)
          "
        >
          <FormulateInput
            v-model="filters.name"
            type="text"
            placeholder="Search"
          />
          <multiselect
            v-model="filters.project_type"
            :open-direction="'bottom'"
            :multiple="false"
            :searchable="false"
            :hide-selected="false"
            :allow-empty="true"
            track-by="value"
            :show-labels="false"
            name="projectType"
            :options="projectTypes"
            placeholder="Project Type"
            :custom-label="nameLabel"
            @input="
              $store.dispatch('project/getDirectoryProjectsList', allFilters)
              $store.commit('project/setProjectDirectoryFilters', filters)
            "
          ></multiselect>
          <multiselect
            v-model="filters.standard"
            :open-direction="'bottom'"
            :multiple="false"
            :searchable="false"
            :hide-selected="false"
            :allow-empty="true"
            track-by="value"
            :show-labels="false"
            name="projectSector"
            :options="standardTypes"
            placeholder="Sector"
            :custom-label="nameLabel"
            @input="
              $store.dispatch('project/getDirectoryProjectsList', allFilters)
              $store.commit('project/setProjectDirectoryFilters', filters)
            "
          ></multiselect>
          <multiselect
            v-model="filters.country"
            :open-direction="'bottom'"
            :multiple="false"
            :searchable="true"
            :hide-selected="false"
            :allow-empty="true"
            track-by="value"
            :show-labels="false"
            name="projectCountry"
            :options="countries"
            placeholder="Country / Region"
            :custom-label="countryLabel"
            @input="
              $store.dispatch('project/getDirectoryProjectsList', allFilters)
              $store.commit('project/setProjectDirectoryFilters', filters)
            "
          ></multiselect>
          <multiselect
            v-model="filters.state"
            :open-direction="'bottom'"
            :multiple="false"
            :searchable="false"
            :hide-selected="false"
            :allow-empty="true"
            track-by="value"
            :show-labels="false"
            name="projectState"
            :options="filteredStates"
            placeholder="State / Province"
            :custom-label="stateLabel"
            @input="
              $store.dispatch('project/getDirectoryProjectsList', allFilters)
              $store.commit('project/setProjectDirectoryFilters', filters)
            "
          ></multiselect>
          <multiselect
            v-model="filters.certification_status"
            :open-direction="'bottom'"
            :multiple="false"
            :searchable="false"
            :hide-selected="false"
            :allow-empty="true"
            track-by="value"
            :show-labels="false"
            name="projectStatus"
            :options="statusTypes"
            placeholder="Project Status"
            :custom-label="nameLabel"
            @input="
              $store.dispatch('project/getDirectoryProjectsList', allFilters)
              $store.commit('project/setProjectDirectoryFilters', filters)
            "
          ></multiselect>
          <div>
            <FormulateInput type="submit" label="Apply" />
          </div>
          <WButtonsBase
            v-if="hasAppliedFilters"
            class="mt-0"
            type="primaryInverted"
            @click.native="clearFilters()"
            >Clear filters</WButtonsBase
          >
        </form>
        <div
          class="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg"
        >
          <div class="overflow-x-scroll">
            <div
              class="
                grid grid-cols-1
                sm:grid-cols-3
                gap-x-5 gap-y-16
                p-5
                bg-primary-100
              "
            >
              <WLinksBase
                v-for="(project, index) in projectsList.data"
                :key="index"
                class="h-full animate__zoomIn animate__animated animate__faster"
                :link="'/directories/projects/' + project.slug"
              >
                <WCardsBase
                  :heading="project.name"
                  class="w-full"
                  :description="
                    project.is_featured === 1 ? 'Early Adopter' : ''
                  "
                >
                  <template #subHeading>
                    <span class="org">{{ project.organization }}</span
                    ><br />
                    <span class="text-gray-400">
                      <span v-if="project.state">{{
                        project.state + ', '
                      }}</span
                      >{{ project.country }}
                    </span>
                  </template>
                  <template #image>
                    <div class="p-3">
                      <img
                        class="rounded"
                        :src="
                          'https://asw9rfeyn.cloudimg.io/crop/600x400/x/' +
                          project.project_image_url
                        "
                      />
                    </div>
                  </template>
                  <template #footer>
                    <div
                      v-if="
                        project.certification_status &&
                        project.certification_status.length
                      "
                      class="
                        flex
                        font-light
                        items-baseline
                        justify-between
                        text-gray-500 text-sm
                      "
                    >
                      <div>
                        <div
                          v-for="badge in project.certification_status"
                          :key="badge.date"
                          :class="getCertStatusClass(badge.type)"
                        >
                          {{ badge.type }}
                        </div>
                      </div>
                      <span
                        class="float-right mb-2"
                        v-html="getProjectArea(project)"
                      ></span>
                    </div>
                  </template>
                </WCardsBase>
              </WLinksBase>
            </div>
          </div>
          <FormInputsPagination
            :pagination="paginate"
            :offset="3"
            @paginate="
              $store.dispatch('project/getDirectoryProjectsList', allFilters)
              $store.commit('project/setProjectDirectoryFilters', filters)
            "
          />
        </div>
      </div>
    </div>
    <div v-else class="h-screen w-full mt-14">
      <div v-if="error == null" class="mx-auto text-center">
        <WLoadingSpinner class="mx-auto" />
        <div class="mt-3 text-primary-600">Loading directory...</div>
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
  auth: false,
  data() {
    return {
      filters: {
        name: null,
        project_type: null,
        standard: null,
        country: null,
        state: null,
        certification_status: null,
      },
      apiFilters: null,
      error: null,
    }
  },
  head() {
    return {
      title: `Projects Directory`,
    }
  },
  computed: {
    ...mapState({
      projectsList: (state) => state.project.directoryProjects,
    }),
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
        if (this.filters[key] !== null && this.filters[key] !== '') return true
      }
      return false
    },
    allFilters() {
      const res = []
      if (this.filters.name !== '') {
        res.name = this.filters.name
      }
      if (this.filters.state !== null) {
        res.state = this.filters.state.state
      }
      if (this.filters.country !== null) {
        res.country = this.filters.country.country
      }
      if (this.filters.project_type !== null) {
        res.project_type = this.filters.project_type.name
      }
      if (this.filters.certification_status !== null) {
        res.certification_status = this.filters.certification_status.name
      }
      if (this.filters.standard !== null) {
        res.standard = this.filters.standard.name
      }
      res.page = this.paginate.current_page
      return res
    },
    filteredStates() {
      if (this.filters.country === null) {
        return this.apiFilters.state_filter
      } else {
        const result = []
        for (const index in this.apiFilters.state_filter) {
          if (
            this.apiFilters.state_filter[index].country ===
            this.filters.country.country
          ) {
            result.push(this.apiFilters.state_filter[index])
          }
        }
        return result
      }
    },
    countries() {
      if (this.apiFilters) {
        return this.apiFilters.country_filter
      }
      return null
    },
    projectTypes() {
      if (this.apiFilters) {
        return this.apiFilters.project_type
      }
      return null
    },
    standardTypes() {
      if (this.apiFilters) {
        return this.apiFilters.standard
      }
      return null
    },
    statusTypes() {
      if (this.apiFilters) {
        return this.apiFilters.certification_status
      }
      return null
    },
  },
  async mounted() {
    if (this.$store.state.project.projectDirectoryFilters) {
      this.filters = await this.$store.state.project.projectDirectoryFilters
    }
    await this.$store.dispatch(
      'project/getDirectoryProjectsList',
      this.allFilters
    )
    this.$store.commit('project/setProjectDirectoryFilters', this.filters)
    await this.$store
      .dispatch('project/getDirectoryFilters')
      .then((res) => (this.apiFilters = res.data))
  },
  methods: {
    clearFilters() {
      this.filters = {
        name: null,
        project_type: null,
        standard: null,
        country: null,
        state: null,
        certification_status: null,
      }
      this.$store.dispatch('project/getDirectoryProjectsList')
      this.$store.commit('project/setProjectDirectoryFilters', this.filters)
    },
    downloadExcelExport() {
      window.open(
        this.$axios.defaults.baseURL + 'api/project-directory/excel',
        '_blank'
      )
    },
    getCertStatusClass(certStatus) {
      if (certStatus && certStatus !== 'Certified') {
        certStatus = certStatus.replace('Certified ', '')
      }
      return (
        'px-2 py-1 uppercase mb-2 rounded status-' + certStatus.toLowerCase()
      )
    },
    getProjectArea(project) {
      if (project.standard === 'Community') {
        let area = project.area
        area = area.replace('sq ft', 'acres')
        return area
      } else {
        return project.area
      }
    },
    countryLabel({ count, country }) {
      return country + ` (${count})`
    },
    stateLabel({ count, state }) {
      return state + ` (${count})`
    },
    nameLabel({ count, name }) {
      return name + ` (${count})`
    },
  },
}
</script>
