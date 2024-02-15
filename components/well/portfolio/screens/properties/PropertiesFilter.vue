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
          :element-class="['list-options']"
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
          :element-class="['list-options']"
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
          label="Undergoing construction / renovation?"
        />
      </div>
      <div v-if="constructionTypes.length">
        <FormulateInput
          v-model="filterConstructionType"
          type="checkbox"
          :options="constructionTypes"
          label="Construction status"
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
      filters: (state) => state.portfolio.projectFilter,
      portfolio: (state) => state.portfolio.portfolio,
    }),
    ...mapGetters('portfolio', [
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
    filterSpaceType: {
      get() {
        return this.$store.state.portfolio.projectFilter.filter_space_type
      },
      set(newValue) {
        const data = {
          key: 'filter_space_type',
          value: newValue,
        }
        this.$store.dispatch('portfolio/setfilters', data)
      },
    },
    filterArchived: {
      get() {
        return this.$store.state.portfolio.projectFilter.deleted_at
      },
      set(newValue) {
        const data = {
          key: 'deleted_at',
          value: newValue,
        }
        this.$store.dispatch('portfolio/setfilters', data)
      },
    },
    filterProjectType: {
      get() {
        return this.$store.state.portfolio.projectFilter.filter_project_type
      },
      set(newValue) {
        const data = {
          key: 'filter_project_type',
          value: newValue,
        }
        this.$store.dispatch('portfolio/setfilters', data)
      },
    },
    filterLocation: {
      get() {
        return this.$store.state.portfolio.projectFilter.filter_location
      },
      set(newValue) {
        const data = {
          key: 'filter_location',
          value: newValue,
        }
        this.$store.dispatch('portfolio/setfilters', data)
      },
    },
    filterArea: {
      get() {
        return this.$store.state.portfolio.projectFilter.filter_area
      },
      set(newValue) {
        const data = {
          key: 'filter_area',
          value: newValue,
        }
        this.$store.dispatch('portfolio/setfilters', data)
      },
    },
    filterConstructionStatus: {
      get() {
        return this.$store.state.portfolio.projectFilter
          .filter_construction_status
      },
      set(newValue) {
        const data = {
          key: 'filter_construction_status',
          value: newValue,
        }
        this.$store.dispatch('portfolio/setfilters', data)
      },
    },
    filterConstructionType: {
      get() {
        return this.$store.state.portfolio.projectFilter
          .filter_construction_type
      },
      set(newValue) {
        const data = {
          key: 'filter_construction_type',
          value: newValue,
        }
        this.$store.dispatch('portfolio/setfilters', data)
      },
    },
    filterIndustry: {
      get() {
        return this.$store.state.portfolio.projectFilter.filter_industry
      },
      set(newValue) {
        const data = {
          key: 'filter_industry',
          value: newValue,
        }
        this.$store.dispatch('portfolio/setfilters', data)
      },
    },
  },
  mounted() {
    this.$store.dispatch('portfolio/getPortfolioFilterList', {
      id: this.portfolio.id,
    })
    this.$store.dispatch('portfolio/getPortfolioSubsetProjects', {
      id: this.portfolio.id,
    })
  },
  methods: {
    getFilteredList() {
      this.$store.dispatch('portfolio/getFilterProjects', {
        paginate: 'Yes',
        page: 1,
      })
      this.$parent.$parent.$refs.location.toggleOpen()
    },
    reset() {
      this.$store.dispatch('portfolio/resetFilters')
      this.$store.dispatch('portfolio/getFilterProjects', {
        paginate: 'Yes',
        page: 1,
      })
      this.$parent.$parent.$refs.location.toggleOpen()
    },
  },
}
</script>

<style>
.list-options {
  display: grid;
  grid-auto-flow: column;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  grid-template-rows: repeat(3, minmax(0, 1fr));
}
</style>
