<template>
  <div class="w-full">
    <FormulateForm class="my-2 flex space-x-5" @submit="create">
      <div class="w-1/2 relative p-2">
        <div
          v-if="loadingLocationsList"
          class="
            w-full
            h-full
            absolute
            top-0
            bg-primary-600
            rounded-lg
            opacity-10
            border-primary-900 border
          "
        ></div>
        <WHeadingsHFour
          class="ml-2 text-priamry-600"
          heading="Possible subset category filters"
        />
        <div>
          <AccordiansTransparent label="WELL version">
            <template #content>
              <FormulateInput
                v-model="filterPropertyTypeSelection"
                type="radio"
                :options="propertyTypes"
              />
            </template>
          </AccordiansTransparent>
        </div>
        <div v-if="spaceTypes.length">
          <AccordiansTransparent label="Space type">
            <template #content>
              <FormulateInput
                v-model="filterSpaceType"
                type="checkbox"
                :options="spaceTypes"
              ></FormulateInput>
            </template>
          </AccordiansTransparent>
        </div>
        <div v-if="ownershipTypes.length">
          <AccordiansTransparent label="Ownership type">
            <template #content>
              <FormulateInput
                v-model="filterProjectType"
                type="checkbox"
                :options="ownershipTypes"
              ></FormulateInput>
            </template>
          </AccordiansTransparent>
        </div>
        <div v-if="locations.length">
          <AccordiansTransparent label="Locations">
            <template #content>
              <FormulateInput
                v-model="filterLocation"
                type="checkbox"
                :options="locations"
              ></FormulateInput>
            </template>
          </AccordiansTransparent>
        </div>
        <div v-if="area">
          <AccordiansTransparent label="Occupancy size range (sqft)">
            <template #content>
              <FormulateInput
                v-model="filterArea"
                type="radio"
                :options="area"
              ></FormulateInput>
            </template>
          </AccordiansTransparent>
        </div>
      </div>
      <div class="w-1/2">
        <div class="w-full rounded shadow p-5 mt-5">
          <FormulateInput
            v-model="formData.name"
            type="text"
            label="Title"
            placeholder="Add a title"
          ></FormulateInput>
          <FormulateInput
            v-model="formData.desc"
            type="text"
            label="Description*"
            validation="required"
            placeholder="Add a description"
          ></FormulateInput>
        </div>
        <div class="w-full shadow rounded p-5 mt-5">
          <div v-if="!loadingLocationsList && subsetProjects" class="h-64">
            <div v-if="subsetProjects.length > 0">
              <WHeadingsHFour
                :heading="
                  'Selected locations (' +
                  projects.length +
                  ' out of ' +
                  subsetProjects.length +
                  ')'
                "
              />
              <FormulateInput
                v-model="selectAllProjects"
                class="mb-3"
                label="Select all projects"
                type="checkbox"
              />
              <div class="overflow-y-scroll h-48">
                <FormulateInput
                  v-model="projects"
                  type="checkbox"
                  :options="subsetProjectListOptions"
                />
              </div>
            </div>
            <div v-else>
              <div
                class="
                  mt-5
                  rounded-md
                  bg-yellow-50
                  p-4
                  mb-5
                  rounded-lg
                  border border-yellow-300
                "
              >
                <div class="flex">
                  <div class="flex-shrink-0">
                    <svg
                      x-description="Heroicon name: exclamation"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      class="mt-2 h-5 w-5 text-yellow-400"
                    >
                      <path
                        fill-rule="evenodd"
                        d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                        clip-rule="evenodd"
                      ></path>
                    </svg>
                  </div>
                  <div class="ml-3">
                    <div class="mt-2 text-sm leading-5 text-yellow-700">
                      <p>No locations matching your search can be found!</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div v-else class="h-56 w-full flex">
            <div class="mx-auto text-center my-auto">
              <WLoadingSpinner class="mx-auto" />
              <div class="mt-3 text-primary-600">Loading Locations...</div>
            </div>
          </div>
        </div>
        <FormulateInput
          class="mt-5"
          type="submit"
          label="Create"
        ></FormulateInput>
      </div>
    </FormulateForm>
  </div>
</template>
<script>
import { mapState, mapGetters, mapActions } from 'vuex'
export default {
  data() {
    return {
      loadingLocationsList: true,
      showFilters: false,
      projects: [],
      subsetProjectList: [],
      selectAllProjects: false,
      formData: {
        name: '',
        desc: '',
      },
      propertyTypes: [
        { label: 'WELL V2-pilot', value: 'v2-pilot' },
        { label: 'WELL V2', value: 'v2' },
      ],
      filterPropertyTypeSelection: 'v2',
    }
  },

  computed: {
    ...mapState({
      filters: (state) => state.portfolio.projectFilter,
      subsetProjects: (state) => state.portfolio.subsetProjects,
      portfolio: (state) => state.portfolio.portfolio,
    }),
    subsetProjectListOptions() {
      return this.subsetProjectList.map((el) => {
        return {
          label: el.label,
          value: el.value,
        }
      })
    },
    calcPortfolioId() {
      const id = this.$route.params.id.toString().substring(5, 10)
      return parseInt(id)
    },
    ...mapGetters('portfolio', [
      'spaceTypes',
      'ownershipTypes',
      'locations',
      'area',
    ]),
    filterSpaceType: {
      get() {
        return this.$store.state.portfolio.subsetFilters.filter_space_type
      },
      async set(newValue) {
        const data = {
          key: 'filter_space_type',
          value: newValue,
        }

        // First clear to initiate the loader
        this.loadingLocationsList = true
        await this.$store.commit('portfolio/setSubsetProjects', [])
        // Then re query the api for the new listing
        await this.$store.dispatch('portfolio/setSubsetFilters', data)
        // requery listing
        await this.$store.dispatch('portfolio/getPortfolioSubsetProjects', {
          id: this.portfolio.id,
        })
        this.subsetProjectList = JSON.parse(JSON.stringify(this.subsetProjects))
        this.loadingLocationsList = false
      },
    },
    filterProjectType: {
      get() {
        return this.$store.state.portfolio.subsetFilters.filter_project_type
      },
      async set(newValue) {
        const data = {
          key: 'filter_project_type',
          value: newValue,
        }
        // First clear to initiate the loader
        this.loadingLocationsList = true
        await this.$store.commit('portfolio/setSubsetProjects', [])
        // Then re query the api for the new listing
        await this.$store.dispatch('portfolio/setSubsetFilters', data)
        // requery listing
        await this.$store.dispatch('portfolio/getPortfolioSubsetProjects', {
          id: this.portfolio.id,
        })
        this.subsetProjectList = JSON.parse(JSON.stringify(this.subsetProjects))
        this.loadingLocationsList = false
      },
    },
    filterLocation: {
      get() {
        return this.$store.state.portfolio.subsetFilters.filter_location
      },
      async set(newValue) {
        const data = {
          key: 'filter_location',
          value: newValue,
        }
        // First clear to initiate the loader
        this.loadingLocationsList = true
        await this.$store.commit('portfolio/setSubsetProjects', [])
        // Then re query the api for the new listing
        await this.$store.dispatch('portfolio/setSubsetFilters', data)
        // requery listing
        await this.$store.dispatch('portfolio/getPortfolioSubsetProjects', {})
        this.subsetProjectList = JSON.parse(JSON.stringify(this.subsetProjects))
        this.loadingLocationsList = false
      },
    },
    filterArea: {
      get() {
        return this.$store.state.portfolio.subsetFilters.filter_area
      },
      async set(newValue) {
        const data = {
          key: 'filter_area',
          value: newValue,
        }
        // First clear to initiate the loader
        this.loadingLocationsList = true
        await this.$store.commit('portfolio/setSubsetProjects', [])
        // Then re query the api for the new listing
        await this.$store.dispatch('portfolio/setSubsetFilters', data)
        // requery listing
        await this.$store.dispatch('portfolio/getPortfolioSubsetProjects', {})
        this.subsetProjectList = JSON.parse(JSON.stringify(this.subsetProjects))
        this.loadingLocationsList = false
      },
    },
  },
  watch: {
    selectAllProjects(newValue) {
      if (newValue && this.subsetProjectList.length > 0) {
        const newOptions = []
        for (let i = 0; i < this.subsetProjectList.length; i++) {
          newOptions.push(this.subsetProjectList[i].value)
        }
        this.projects = newOptions
      } else {
        this.projects = []
      }
    },

    async filterPropertyTypeSelection(newValue) {
      const data = {
        key: 'filter_type',
        value: newValue,
      }
      // First clear to initiate the loader
      this.loadingLocationsList = true
      await this.$store.commit('portfolio/setSubsetProjects', [])
      // Then re query the api for the new listing
      await this.$store.dispatch('portfolio/setSubsetFilters', data)
      // requery listing
      await this.$store.dispatch('portfolio/getPortfolioSubsetProjects', {
        id: this.portfolio.id,
      })
      this.subsetProjectList = JSON.parse(JSON.stringify(this.subsetProjects))
      this.loadingLocationsList = false
    },
  },
  async mounted() {
    // this.getPortfolioSummary({ id: this.calcPortfolioId })
    await this.$store.commit('portfolio/setSubsetProjects', [])
    await this.$store.dispatch('portfolio/getPortfolioFilterList', {
      id: this.calcPortfolioId,
    })
    // get v2 locations
    await this.$store.dispatch('portfolio/getPortfolioSubsetProjects', {
      id: this.portfolio.id,
    })
    // await this.$store.dispatch('shared/getSharedSubsetProjects', {})
    this.subsetProjectList = JSON.parse(JSON.stringify(this.subsetProjects))
    this.filterPropertyTypeSelection = this.$store.state.portfolio.subsetFilters
      .filter_type
      ? this.$store.state.portfolio.subsetFilters.filter_type
      : 'v2'
    this.loadingLocationsList = false
  },
  beforeDestroy() {
    this.$store.dispatch('portfolio/resetSubsetFilters')
  },
  methods: {
    ...mapActions('portfolio', ['getPortfolioSummary']),
    async create() {
      const data = {
        ...this.formData,
        project_ids: this.projects,
      }
      await this.$store
        .dispatch('portfolio/createSubset', { id: this.portfolio.id, data })
        .then((response) => {
          this.$store.dispatch('portfolio/getPortfolioProjects', {
            paginate: 'Yes',
            page: 1,
          })
          this.$store.dispatch('portfolio/getSubsetList')
          this.$parent.$parent.$refs.location.toggleOpen()
        })
    },
  },
}
</script>
