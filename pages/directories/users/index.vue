<template>
  <div class="flex flex-col">
    <div v-if="usersList" class="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
      <div class="py-2 align-middle inline-block w-full sm:px-6 lg:px-8">
        <WHeadingsHTwo heading="IWBI Users" />
        <form
          class="grid grid-cols-5 gap-x-4 my-5"
          @submit.prevent="
            $store.dispatch('user/getPublicUsersList', allFirstPageFilters)
          "
        >
          <FormulateInput
            v-model="filters.name"
            type="text"
            label="First Name"
          />
          <FormulateInput
            v-model="filters.last_name"
            type="text"
            label="Last Name"
          />
          <FormulateInput
            v-model="filters.organization"
            type="text"
            label="Organization"
          />
          <FormulateInput
            v-model="filters.country_code"
            :options="countryOptions"
            type="select"
            label="Country/Region"
          />
          <FormulateInput v-model="filters.state" type="text" label="State" />
          <FormulateInput v-model="filters.city" type="text" label="City" />
          <FormulateInput
            v-model="filters.well_advisory"
            :options="advisoryOptions"
            type="select"
            label="WELL Advisory"
          />
          <FormulateInput
            v-model="selectedDesignation"
            :options="designationOptions"
            type="select"
            label="Designation"
            @change="setDesignationFilter"
          />
          <div class="mt-4">
            <FormulateInput type="submit" label="Apply" />
          </div>
          <div class="mt-4">
            <WButtonsBase
              v-if="
                filters.type !== '' ||
                filters.name !== '' ||
                filters.last_name !== '' ||
                filters.country_code !== '' ||
                filters.well_ap === 1 ||
                filters.well_pta === 1 ||
                filters.well_faculty === 1 ||
                filters.well_advisory !== '' ||
                filters.organization !== ''
              "
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
            <div
              class="grid grid-cols-1 sm:grid-cols-4 gap-x-5 gap-y-5 p-5 bg-primary-100"
            >
              <UserProfileCard
                v-for="(user, index) in usersList.data"
                :key="index"
                :user="user"
              />
            </div>
          </div>
          <FormInputsPagination
            :pagination="paginate"
            :offset="3"
            @paginate="$store.dispatch('user/getPublicUsersList', allFilters)"
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
        type: '',
        name: '',
        last_name: '',
        country_code: '',
        city: '',
        state: '',
        well_advisory: '',
        limit: 20,
        well_pta: 0,
        well_ap: 0,
        well_faculty: 0,
        organization: '',
      },
      selectedDesignation: null,
      designationOptions: [
        { label: 'WELL AP', value: 'wellap' },
        { label: 'WELL Faculty', value: 'faculty' },
        { label: 'WELL PTA', value: 'pta' },
      ],
      error: null,
      advisoryOptions: [
        { label: 'All', value: 'all' },
        { label: 'Portfolio', value: 'portfolio' },
        { label: 'Water', value: 'water' },
        { label: 'Light', value: 'light' },
        { label: 'Air Thermal', value: 'air-thermal' },
        { label: 'Materials', value: 'materials' },
        { label: 'Sound', value: 'sound' },
        { label: 'Community', value: 'community' },
        { label: 'Movement', value: 'movement' },
        { label: 'Nourishment', value: 'nourishment' },
        { label: 'Mind', value: 'mind' },
      ],
    }
  },
  head() {
    return {
      title: `User Directory`,
    }
  },
  computed: {
    ...mapState({
      countries: (state) => state.address.countries,
      usersList: (state) => state.user.publicUsersList,
    }),
    countryOptions() {
      const options = []
      for (let i = 0; i < this.countries.length; i++) {
        const option = {
          value: this.countries[i].code,
          label: this.countries[i].name,
        }
        options.push(option)
      }
      return options
    },

    paginate() {
      if (this.usersList) {
        return {
          total: this.usersList.total,
          per_page: this.usersList.per_page,
          current_page: this.usersList.current_page,
          last_page: this.usersList.last_page,
          from: this.usersList.from,
          to: this.usersList.to,
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
    allFirstPageFilters() {
      const res = JSON.parse(JSON.stringify(this.filters))
      res.page = 1
      return res
    },
  },
  created() {
    this.$store
      .dispatch('user/getPublicUsersList', this.allFilters)
      .catch((error) => (this.error = error))
  },
  methods: {
    setDesignationFilter() {
      if (this.selectedDesignation !== null) {
        if (this.selectedDesignation === 'wellap') {
          this.filters.well_ap = 1
          this.filters.well_faculty = this.filters.well_pta = 0
        } else if (this.selectedDesignation === 'faculty') {
          this.filters.well_faculty = 1
          this.filters.well_ap = this.filters.well_pta = 0
        } else if (this.selectedDesignation === 'pta') {
          this.filters.well_pta = 1
          this.filters.well_faculty = this.filters.well_ap = 0
        }
      }
    },
    clearFilters() {
      this.filters = {
        type: '',
        name: '',
        last_name: '',
        country_code: '',
        city: '',
        state: '',
        well_advisory: null,
        well_ap: 0,
        well_faculty: 0,
        well_pta: 0,
        limit: '20',
        organization: '',
      }
      this.selectedDesignation = null
      this.$store.dispatch('user/getPublicUsersList', this.filters)
    },
  },
}
</script>
