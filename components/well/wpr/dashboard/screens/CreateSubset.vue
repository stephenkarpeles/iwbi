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
          <AccordiansTransparent label="Location">
            <template #content>
              <FormulateInput
                v-model="filterLocation"
                type="checkbox"
                :options="locations"
              ></FormulateInput>
            </template>
          </AccordiansTransparent>
        </div>
        <div v-if="industries.length">
          <AccordiansTransparent label="Owner industry">
            <template #content>
              <FormulateInput
                v-model="filterIndustry"
                type="checkbox"
                :options="industries"
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
        <div v-if="constructionStatus.length">
          <AccordiansTransparent label="Construction status">
            <template #content>
              <FormulateInput
                v-model="filterConstructionStatus"
                type="checkbox"
                :options="constructionStatus"
              />
            </template>
          </AccordiansTransparent>
        </div>
        <div v-if="constructionTypes.length">
          <AccordiansTransparent label="Construction type">
            <template #content>
              <FormulateInput
                v-model="filterConstructionType"
                type="checkbox"
                :options="constructionTypes"
              />
            </template>
          </AccordiansTransparent>
        </div>
      </div>
      <div class="w-1/2">
        <div class="w-full rounded shadow p-5 mt-5">
          <FormulateInput
            v-model="formData.name"
            type="text"
            label="Title*"
            name="Title"
            placeholder="Add a title"
            validation="required"
          />
          <FormulateInput
            v-model="formData.desc"
            type="text"
            label="Description*"
            name="Description"
            placeholder="Add a description"
            validation="required"
          />
        </div>
        <div class="w-full shadow rounded p-5 mt-5">
          <div v-if="!loadingLocationsList && subsetProjects" class="h-72">
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
                  :options="subsetProjectList"
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
        <FormulateInput class="mt-5" type="submit" label="Create" />
      </div>
    </FormulateForm>
  </div>
</template>
<script>
import { mapState, mapGetters } from 'vuex'
export default {
  data() {
    return {
      loadingLocationsList: true,
      showFilters: false,
      projects: [],
      formData: {
        name: '',
        desc: '',
      },
      selectAllProjects: false,
      subsetProjectList: [],
    }
  },
  computed: {
    ...mapState({
      filters: (state) => state.shared.filters,
      subsetProjects: (state) => state.shared.subsetProjects,
      sharedWorkspace: (state) => state.shared.sharedWorkspace,
    }),
    ...mapGetters('shared', [
      'spaceTypes',
      'ownershipTypes',
      'locations',
      'industries',
      'area',
      'constructionTypes',
      'constructionStatus',
    ]),
    filterSpaceType: {
      get() {
        return this.$store.state.shared.subsetFilters.filter_space_type
      },
      async set(newValue) {
        const data = {
          key: 'filter_space_type',
          value: newValue,
        }

        // First clear to initiate the loader
        this.loadingLocationsList = true
        await this.$store.commit('shared/setSubsetProjects', [])
        // Then re query the api for the new listing
        await this.$store.dispatch('shared/setSubsetFilters', data)
        // requery listing
        await this.$store.dispatch('shared/getSharedSubsetProjects', {})
        this.subsetProjectList = JSON.parse(JSON.stringify(this.subsetProjects))

        this.loadingLocationsList = false
      },
    },
    filterProjectType: {
      get() {
        return this.$store.state.shared.subsetFilters.filter_project_type
      },
      async set(newValue) {
        const data = {
          key: 'filter_project_type',
          value: newValue,
        }
        // First clear to initiate the loader
        this.loadingLocationsList = true
        await this.$store.commit('shared/setSubsetProjects', [])
        // Then re query the api for the new listing
        await this.$store.dispatch('shared/setSubsetFilters', data)
        // requery listing
        await this.$store.dispatch('shared/getSharedSubsetProjects', {})
        this.subsetProjectList = JSON.parse(JSON.stringify(this.subsetProjects))
        this.loadingLocationsList = false
      },
    },
    filterLocation: {
      get() {
        return this.$store.state.shared.subsetFilters.filter_location
      },
      async set(newValue) {
        const data = {
          key: 'filter_location',
          value: newValue,
        }
        // First clear to initiate the loader
        this.loadingLocationsList = true
        await this.$store.commit('shared/setSubsetProjects', [])
        // Then re query the api for the new listing
        await this.$store.dispatch('shared/setSubsetFilters', data)
        // requery listing
        await this.$store.dispatch('shared/getSharedSubsetProjects', {})
        this.subsetProjectList = JSON.parse(JSON.stringify(this.subsetProjects))
        this.loadingLocationsList = false
      },
    },
    filterArea: {
      get() {
        return this.$store.state.shared.subsetFilters.filter_area
      },
      async set(newValue) {
        const data = {
          key: 'filter_area',
          value: newValue,
        }
        // First clear to initiate the loader
        this.loadingLocationsList = true
        await this.$store.commit('shared/setSubsetProjects', [])
        // Then re query the api for the new listing
        await this.$store.dispatch('shared/setSubsetFilters', data)
        // requery listing
        await this.$store.dispatch('shared/getSharedSubsetProjects', {})
        this.subsetProjectList = JSON.parse(JSON.stringify(this.subsetProjects))
        this.loadingLocationsList = false
      },
    },
    filterConstructionStatus: {
      get() {
        return this.$store.state.shared.subsetFilters.filter_construction_status
      },
      async set(newValue) {
        const data = {
          key: 'filter_construction_status',
          value: newValue,
        }
        // First clear to initiate the loader
        this.loadingLocationsList = true
        await this.$store.commit('shared/setSubsetProjects', [])
        // Then re query the api for the new listing
        await this.$store.dispatch('shared/setSubsetFilters', data)
        // requery listing
        await this.$store.dispatch('shared/getSharedSubsetProjects', {})
        this.subsetProjectList = JSON.parse(JSON.stringify(this.subsetProjects))
        this.loadingLocationsList = false
      },
    },
    filterConstructionType: {
      get() {
        return this.$store.state.shared.subsetFilters.filter_construction_type
      },
      async set(newValue) {
        const data = {
          key: 'filter_construction_type',
          value: newValue,
        }
        // First clear to initiate the loader
        this.loadingLocationsList = true
        await this.$store.commit('shared/setSubsetProjects', [])
        // Then re query the api for the new listing
        await this.$store.dispatch('shared/setSubsetFilters', data)
        // requery listing
        await this.$store.dispatch('shared/getSharedSubsetProjects', {})
        this.subsetProjectList = JSON.parse(JSON.stringify(this.subsetProjects))
        this.loadingLocationsList = false
      },
    },
    filterIndustry: {
      get() {
        return this.$store.state.shared.subsetFilters.filter_industry
      },
      async set(newValue) {
        const data = {
          key: 'filter_industry',
          value: newValue,
        }
        // First clear to initiate the loader
        this.loadingLocationsList = true
        await this.$store.commit('shared/setSubsetProjects', [])
        // Then re query the api for the new listing
        await this.$store.dispatch('shared/setSubsetFilters', data)
        // requery listing
        await this.$store.dispatch('shared/getSharedSubsetProjects', {})
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
  },
  async mounted() {
    await this.$store.commit('shared/setSubsetProjects', [])
    await this.$store.dispatch('shared/getSharedFilterList', {
      id: this.sharedWorkspace.id,
    })
    await this.$store.dispatch('shared/getSharedSubsetProjects', {})
    this.subsetProjectList = JSON.parse(JSON.stringify(this.subsetProjects))
    this.loadingLocationsList = false
  },
  beforeDestroy() {
    this.$store.dispatch('shared/resetSubsetFilters')
  },
  methods: {
    async create() {
      const data = {
        ...this.formData,
        project_ids: this.projects,
      }
      await this.$store
        .dispatch('shared/createSubset', data)
        .then((response) => {
          this.$store.dispatch('shared/getSharedProjects', {
            paginate: 'Yes',
            page: 1,
          })
          this.$store.dispatch('shared/getSubsetList')
          this.$parent.$parent.$refs.location.toggleOpen()
        })
    },
  },
}
</script>
