<template>
  <div v-if="!loading">
    <div class="flex w-full border-b justify-between mb-4">
      <WHeadingsHThree class="text-primary-900" heading="Assign Locations" />
      <WIconsBase
        class="text-primary-900 text-lg cursor-pointer"
        icon="x"
        @click.native="closeModal()"
      />
    </div>
    <div class="flex justify-between">
      <WHeadingsHFour
        class="text-primary-900"
        :heading="`Eligible Locations (${locations.length || '0'})`"
      />
      <div class="flex items-center">
        <WIconsBase class="text-primary-600" icon="information-circle" />
        <span class="text-sm"
          >Audits are triggered from locations pursued now.</span
        >
      </div>
    </div>
    <div class="flex items-start justify-between">
      <FormulateInput
        v-model="filters.name"
        class="w-52"
        type="search"
        name="search"
        placeholder="Search Eligible Locations"
        @keyup.enter="getLocations"
        @input.native="filters.name === '' && getLocations()"
      />
      <button
        class="
          border-2
          p-2
          rounded-md
          border-primary-600
          bg-primary-100
          hover:opacity-80
        "
        @click="showFilters = !showFilters"
      >
        <WIconsBase icon="filter" class="text-primary-600" />
      </button>
    </div>

    <div
      :class="`
        bg-gray-100
        rounded-md
        mb-4
        overflow-hidden
        transition-all
        duration-300
        h-0
        ${showFilters ? 'p-3 h-32' : ''}
      `"
    >
      <span class="text-primary-800">Additional Filters</span>
      <div class="flex space-x-4 items-center">
        <FormulateInput
          v-model="filters['country_codes[]']"
          class="w-80"
          :multiple="true"
          :searchable="true"
          :options="countryOptions"
          label="Countries"
          track-by="value"
          type="multi"
          @input="getLocations"
        />
        <FormulateInput
          v-model="filters.construction_status"
          class="w-60"
          :element-class="['bg-white rounded-md']"
          :options="[
            { label: 'All', value: '' },
            { label: 'Constructed Only', value: '1' },
            { label: 'Under Construction Only', value: '0' },
          ]"
          label="Construction Status"
          type="select"
          @change.native="getLocations"
        />
        <FormulateInput
          v-model="filters['subset_ids[]']"
          :options="subsetOptions"
          :element-class="['bg-white rounded-md']"
          class="w-60"
          label="Subsets"
          type="select"
          @change.native="getLocations"
        />
      </div>
    </div>

    <div class="h-96">
      <div v-if="locations.length" class="flex flex-col">
        <div class="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div
            class="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8"
          >
            <div class="max-h-96 overflow-y-auto sm:rounded-md border">
              <table class="min-w-full divide-y divide-gray-200 table-auto">
                <thead class="bg-primary-700">
                  <tr class="text-white">
                    <th
                      scope="col"
                      class="px-6 py-3 text-left text-xs tracking-wider"
                    >
                      <FormulateInput type="checkbox" @click="toggleAll()" />
                    </th>
                    <th
                      scope="col"
                      class="px-6 py-3 text-left text-xs tracking-wider"
                    >
                      Name
                    </th>
                    <th
                      scope="col"
                      class="px-6 py-3 text-left text-xs tracking-wider"
                    >
                      Construction
                    </th>
                    <th
                      scope="col"
                      class="px-6 py-3 text-left text-xs tracking-wider"
                    >
                      Occupants
                    </th>
                    <th
                      scope="col"
                      class="px-6 py-3 text-left text-xs tracking-wider"
                    >
                      Country
                    </th>
                    <th
                      scope="col"
                      class="px-6 py-3 text-left text-xs tracking-wider"
                    >
                      Pursue
                    </th>
                    <th scope="col" class="relative px-6 py-3">
                      <span class="sr-only">Edit</span>
                    </th>
                  </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
                  <tr v-for="(loc, index) in locations" :key="index">
                    <td
                      class="
                        whitespace-nowrap
                        text-sm
                        font-medium
                        text-gray-900
                        px-6
                        py-4
                      "
                    >
                      <FormulateInput v-model="loc.assigned" type="checkbox" />
                    </td>
                    <td
                      class="
                        whitespace-nowrap
                        text-sm
                        font-medium
                        text-gray-900
                        px-6
                        py-4
                      "
                    >
                      {{ loc.name || '-' }}
                    </td>
                    <td
                      class="
                        whitespace-nowrap
                        text-sm
                        font-medium
                        text-gray-900
                        px-6
                        py-4
                      "
                    >
                      {{
                        loc.construction_status === 0
                          ? 'Under Construction'
                          : 'Constructed'
                      }}
                    </td>
                    <td
                      class="
                        whitespace-nowrap
                        text-sm
                        font-medium
                        text-gray-900
                        px-6
                        py-4
                      "
                    >
                      {{ loc.no_of_occupants || '-' }}
                    </td>
                    <td
                      class="
                        whitespace-nowrap
                        text-sm
                        font-medium
                        text-gray-900
                        px-6
                        py-4
                      "
                    >
                      {{ getCountryNameByCode(loc.country_code) || '-' }}
                    </td>
                    <td
                      colspan="2"
                      class="
                        whitespace-nowrap
                        text-sm
                        font-medium
                        text-gray-900
                      "
                    >
                      <PillSwitch
                        v-if="loc.assigned"
                        v-model="loc.pursue_status"
                      />
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      <div v-else class="w-full p-4 bg-primary-100 rounded-md border">
        <span class="text-primary-700">No locations to display...</span>
      </div>
    </div>

    <div class="border-t mt-4 pt-4 flex justify-between">
      <WButtonsBase
        type="primaryInverted"
        class="w-24"
        icon="arrow-narrow-left"
        @click.native="closeModal()"
        >Back</WButtonsBase
      >
      <div class="flex space-x-6 items-center">
        <span class="text-primary-600 text-sm"
          >{{ selectedLocations.length }} Locations Selected</span
        >
        <WButtonsBase
          class="
            w-32
            disabled:bg-gray-300 disabled:border-0 disabled:cursor-not-allowed
          "
          :disabled="selectedLocations.length <= 0"
          @click.native="assignLocations()"
        >
          <WLoadingSpinner v-if="spinner" type="button" class="mx-auto" />
          <span v-else>Assign</span>
        </WButtonsBase>
      </div>
    </div>
  </div>
  <div v-else>
    <div class="mx-auto text-center">
      <WLoadingSpinner class="mx-auto" />
      <div class="mt-3 text-primary-600">Loading locations...</div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  props: {
    mode: {
      type: String,
      required: false,
      default: '',
    },
    part: {
      type: Object,
      required: true,
    },
    activeOption: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      filters: {
        'country_codes[]': [],
        construction_status: null,
        'subset_ids[]': null,
        name: '',
      },
      toggleAllEnabled: false,
      scorecard_part_id: null,
      locations: [],
      showFilters: false,
      loading: false,
      spinner: false,
    }
  },
  computed: {
    ...mapState({
      scorecard: (state) => state.scorecard.scorecard,
      countries: (state) => state.address.countries,
      subsetList: (state) => state.portfolio.subsetList,
    }),
    selectedLocations() {
      let locations = []
      locations = this.locations.filter(
        (el) => el.assigned === true || el.assigned === 1
      )
      return locations
    },
    countryOptions() {
      return this.countries.map((el) => {
        return {
          label: el.name,
          value: el.code,
        }
      })
    },
    subsetOptions() {
      return this.subsetList.map((el) => {
        return {
          label: el.name,
          value: el.id,
        }
      })
    },
    scorecardPartID() {
      return this.part.scorecard_part.find(
        (el) => el.sub_part_id === this.activeOption.sub_part_id
      )?.id
    },
  },
  async mounted() {
    this.loading = true
    await this.getLocations()
    await this.$store.dispatch('portfolio/getSubsetList')
    this.loading = false
  },
  methods: {
    async getLocations() {
      this.scorecard_part_id = this.part.scorecard_part.find(
        (el) => el.sub_part_id === this.activeOption.sub_part_id
      )?.id
      try {
        await this.$axios
          .get(
            `api/scorecard/${this.scorecard.id}/scorecard_part/${
              this.scorecard_part_id
            }/projects?${this.parseFilters(this.filters)}`
          )
          .then((res) => {
            this.locations = res.data.filter((loc) => loc.assigned === 0)
            this.locations.forEach((loc) => (loc.pursue_status = 'now'))
          })
      } catch (error) {
        this.$store.dispatch('notifications/toastMessage', {
          message: 'Something went wrong... ',
        })
      }
    },

    closeModal() {
      if (this.mode === 'activeSpace') {
        this.$parent.$parent.isListEnabled = false
      } else {
        this.$parent.isHidden = true
      }
    },
    toggleAll() {
      this.toggleAllEnabled = !this.toggleAllEnabled
      this.locations.forEach((loc) => {
        this.toggleAllEnabled ? (loc.assigned = true) : (loc.assigned = false)
      })
    },
    async assignLocations() {
      this.spinner = true
      let body = []
      body = this.selectedLocations.map((el) => {
        return {
          id: el.id,
          status: el.pursue_status,
        }
      })
      try {
        const res = await this.$axios.post(
          `api/scorecard/${this.scorecard.id}/scorecard_part/${this.scorecard_part_id}/projects/add`,
          body
        )
        if (this.mode === 'activeSpace') {
          this.$parent.$parent.isListEnabled = false
          this.$parent.$parent.getProjects()
          await this.$store.dispatch('scorecard/getVerificationList', {
            scorecardPartID: this.scorecardPartID,
          })
        } else {
          this.$parent.isHidden = true
        }
        if (res.status === 200) {
          this.spinner = false
          this.$store.dispatch('notifications/toastMessage', {
            message: 'Location(s) assigned successfully ',
          })
        }
      } catch (error) {
        this.spinner = false
        this.$store.dispatch('notifications/toastMessage', {
          message: 'Something went wrong...',
        })
      }
    },

    parseFilters(payload) {
      const temp = JSON.parse(JSON.stringify(payload))
      let str = ''
      for (const key in temp) {
        if (temp[key] !== null && temp[key] !== '' && temp[key].length !== 0) {
          if (key === 'country_codes[]') {
            temp[key] = temp[key].map((val) => val.value)
          }
          if (str !== '') str += '&'
          str += key + '=' + encodeURIComponent(temp[key])
        }
      }
      return str
    },

    getCountryNameByCode(code) {
      return this.countries.find((el) => el.code === code).name
    },
  },
}
</script>
