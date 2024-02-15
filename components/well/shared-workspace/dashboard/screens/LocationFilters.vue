<template>
  <div class="w-full">
    <div class="grid grid-cols-6">
      <div class="col-start-6 flex">
        <WButtonsBase type="primary" @click.native="getFilteredList()">
          Apply
        </WButtonsBase>
        <WButtonsBase class="ml-2" type="danger" @click.native="reset()">
          Reset
        </WButtonsBase>
      </div>
    </div>
    <div class="w-full">
      <div v-if="spaceTypes.length">
        <FormulateInput
          v-model="filterSpaceType"
          type="checkbox"
          :options="spaceTypes"
          label="Space type"
        />
      </div>
      <div v-if="ownershipTypes.length">
        <FormulateInput
          v-model="filterProjectType"
          type="checkbox"
          :options="ownershipTypes"
          label="Ownership type"
        />
      </div>
      <div v-if="locations.length">
        <FormulateInput
          v-model="filterLocation"
          type="checkbox"
          :options="locations"
          label="Location"
        />
      </div>
      <div v-if="industries.length">
        <FormulateInput
          v-model="filterIndustry"
          type="checkbox"
          :options="industries"
          label="Owner industry"
        />
      </div>
      <div v-if="area">
        <FormulateInput
          v-model="filterArea"
          type="radio"
          :options="area"
          label="Occupancy size range (sqft)"
        />
      </div>
      <div v-if="constructionStatus.length">
        <FormulateInput
          v-model="filterConstructionStatus"
          type="checkbox"
          :options="constructionStatus"
          label="Construction type"
        />
      </div>
      <div v-if="constructionTypes.length">
        <FormulateInput
          v-model="filterConstructionType"
          type="checkbox"
          :options="constructionTypes"
          label="Construction type"
        />
      </div>
      <div v-if="deleted_at">
        <FormulateInput
          v-model="filterArchived"
          type="radio"
          :options="deleted_at"
          label="Location status"
        />
      </div>
    </div>
  </div>
</template>
<script>
import { mapState, mapGetters } from 'vuex'
export default {
  data() {
    return {}
  },
  computed: {
    ...mapState({
      filters: (state) => state.shared.filters,
      sharedWorkspace: (state) => state.shared.sharedWorkspace,
    }),
    ...mapGetters('shared', [
      'spaceTypes',
      'ownerName',
      'projectPublic',
      'ownerOrg',
      'dAndO',
      'ownershipTypes',
      'locations',
      'industries',
      'area',
      'constructionTypes',
      'constructionStatus',
      'deleted_at',
    ]),
    filterArchived: {
      get() {
        return this.$store.state.shared.filters.deleted_at
      },
      set(newValue) {
        const data = {
          key: 'deleted_at',
          value: newValue,
        }
        this.$store.dispatch('shared/setfilters', data)
      },
    },
    filterSpaceType: {
      get() {
        return this.$store.state.shared.filters.filter_space_type
      },
      set(newValue) {
        const data = {
          key: 'filter_space_type',
          value: newValue,
        }
        this.$store.dispatch('shared/setfilters', data)
      },
    },
    filterProjectType: {
      get() {
        return this.$store.state.shared.filters.filter_project_type
      },
      set(newValue) {
        const data = {
          key: 'filter_project_type',
          value: newValue,
        }
        this.$store.dispatch('shared/setfilters', data)
      },
    },
    filterLocation: {
      get() {
        return this.$store.state.shared.filters.filter_location
      },
      set(newValue) {
        const data = {
          key: 'filter_location',
          value: newValue,
        }
        this.$store.dispatch('shared/setfilters', data)
      },
    },
    filterArea: {
      get() {
        return this.$store.state.shared.filters.filter_area
      },
      set(newValue) {
        const data = {
          key: 'filter_area',
          value: newValue,
        }
        this.$store.dispatch('shared/setfilters', data)
      },
    },
    filterConstructionStatus: {
      get() {
        return this.$store.state.shared.filters.filter_construction_status
      },
      set(newValue) {
        const data = {
          key: 'filter_construction_status',
          value: newValue,
        }
        this.$store.dispatch('shared/setfilters', data)
      },
    },
    filterConstructionType: {
      get() {
        return this.$store.state.shared.filters.filter_construction_type
      },
      set(newValue) {
        const data = {
          key: 'filter_construction_type',
          value: newValue,
        }
        this.$store.dispatch('shared/setfilters', data)
      },
    },
    filterIndustry: {
      get() {
        return this.$store.state.shared.filters.filter_industry
      },
      set(newValue) {
        const data = {
          key: 'filter_industry',
          value: newValue,
        }
        this.$store.dispatch('shared/setfilters', data)
      },
    },
  },
  mounted() {
    this.$store.dispatch('shared/getSharedFilterList', {
      id: this.sharedWorkspace.id,
    })
    this.$store.dispatch('shared/getSharedSubsetProjects', {
      id: this.sharedWorkspace.id,
    })
  },
  methods: {
    getFilteredList() {
      this.$store.dispatch('shared/getSharedProjects', {
        paginate: 'Yes',
        page: 1,
      })
      this.$parent.$parent.$refs.location.toggleOpen()
    },
    reset() {
      this.$store.dispatch('shared/resetFilters')
      this.$store.dispatch('shared/getSharedProjects', {
        paginate: 'Yes',
        page: 1,
      })
      this.$parent.$parent.$refs.location.toggleOpen()
    },
  },
}
</script>
