<template>
  <div class="lg:max-h-96 lg:h-[600px] overflow-x-auto overflow-y-auto pr-2">
    <div>
      <div class="flex items-center justify-between text-primary-700">
        <span class="text-lg uppercase font-semibold"
          >Locations ({{
            isAudit
              ? auditLocations.data && auditLocations.data.length
              : locations.length
          }})</span
        >
        <span class="text-sm"
          >Note: Achieved locations cannot be untagged.</span
        >
      </div>
      <div class="flex items-center space-x-2 mt-2">
        <FormulateInput
          v-model="filters.name"
          class="-mb-4 w-full"
          type="search"
          placeholder="Search locations"
          @keyup.enter="getLocations"
          @input.native="filters.name === '' && getLocations()"
        />
        <div>
          <WButtonsBase
            class="shadow-none"
            type="primaryInverted"
            icon="filter"
            @click.native="showFilters = !showFilters"
            >Filters</WButtonsBase
          >
        </div>
      </div>
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
        ${showFilters ? 'p-3 h-32 mt-4 overflow-visible' : ''}
      `"
    >
      <span class="text-primary-800">Additional Filters</span>
      <div class="grid grid-cols-4 gap-2">
        <FormulateInput
          v-model="filters['country_codes[]']"
          :multiple="true"
          :searchable="true"
          :options="countryOptions"
          label="Countries"
          track-by="value"
          type="multi"
          class="col-span-2"
          @input="getLocations"
        />
        <FormulateInput
          v-model="filters.construction_status"
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
          label="Subsets"
          type="select"
          @change.native="getLocations"
        />
      </div>
    </div>

    <Table v-if="!loading && locations.length" class="my-4">
      <template #header>
        <tr class="text-white uppercase text-sm">
          <th scope="col" class="px-6 py-3 text-left tracking-wider">
            <FormulateInput type="checkbox" @click="toggleAll()" />
          </th>
          <th scope="col" class="px-6 py-3 text-left tracking-wider">Name</th>
          <th scope="col" class="px-6 py-3 text-left tracking-wider">
            Country
          </th>
          <th scope="col" class="px-6 py-3 text-left tracking-wider">City</th>
          <th scope="col" class="px-6 py-3 text-left tracking-wider">Status</th>
        </tr>
      </template>
      <template #body>
        <tr
          v-for="(loc, index) in isAudit ? auditLocations.data : locations"
          :key="index"
          :class="loc.pursue_status === 'achieved' ? 'bg-gray-100' : ''"
        >
          <td
            class="whitespace-nowrap text-sm font-medium text-primary-900 px-6 py-4"
          >
            <FormulateInput
              v-model="loc.selected"
              :disabled="loc.pursue_status === 'achieved'"
              type="checkbox"
            />
          </td>
          <td
            class="whitespace-nowrap text-sm font-medium text-primary-900 px-6 py-4"
          >
            {{ loc.name || '-' }}
          </td>
          <td
            class="whitespace-nowrap text-sm font-medium text-primary-900 px-6 py-4"
          >
            {{
              loc.country_code ? getCountryNameByCode(loc.country_code) : '-'
            }}
          </td>
          <td
            class="whitespace-nowrap text-sm font-medium text-primary-900 px-6 py-4"
          >
            {{ loc.map_city ? loc.map_city : loc.city ? loc.city : '-' }}
          </td>
          <td
            class="whitespace-nowrap text-sm font-medium text-primary-900 px-6 py-4"
          >
            <span v-if="loc.pursue_status">
              {{
                loc.pursue_status === 'now'
                  ? 'Assigned'
                  : loc.pursue_status | capitalize
              }}
            </span>
            <span v-else>-</span>
          </td>
        </tr>
      </template>
    </Table>
    <div v-if="loading" class="mx-auto text-center">
      <WLoadingSpinner class="mx-auto" />
      <div class="mt-3 text-primary-600">Loading locations...</div>
    </div>
    <div v-if="!loading && locations.length === 0">
      <span>No locations</span>
    </div>

    <div
      v-if="locations.length"
      class="absolute bg-gray-200 bottom-0 flex items-center justify-between left-0 px-6 py-2 rounded-md w-full"
    >
      <div>
        <WButtonsBase
          type="primaryInverted"
          class="shadow-none font-semibold"
          @click.native="abort()"
          >{{ scorecardPartId ? 'Back' : 'Cancel' }}</WButtonsBase
        >
      </div>
      <div class="flex items-center space-x-4">
        <span class="block text-primary-700"
          >{{ selectedLocations.length }} locations selected</span
        >
        <div>
          <WButtonsBase
            :disabled="selectedLocations.length <= 0"
            class="shadow-none font-semibold disabled:bg-gray-300 disabled:border-0 disabled:cursor-not-allowed"
            @click.native=";(assigning = true), assignLocations()"
          >
            <WLoadingSpinner v-if="assigning" type="button" class="mx-auto" />
            <span v-else>Assign</span></WButtonsBase
          >
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  props: {
    part: {
      type: Object,
      required: true,
    },
    prefilledLocations: {
      type: Array,
      required: false,
      default: () => {
        return []
      },
    },
    verification: {
      type: Object,
      required: true,
      default: () => {
        return {}
      },
    },
    scorecardPartId: {
      type: [Number, String],
      required: true,
      default: () => {
        return null
      },
    },
  },
  data() {
    return {
      locName: '',
      showFilters: false,
      filters: {
        'country_codes[]': [],
        construction_status: null,
        'subset_ids[]': null,
        name: '',
      },
      locations: [],
      auditLocations: [],
      toggleAllEnabled: false,
      loading: false,
      assigning: false,
    }
  },
  computed: {
    ...mapState({
      portfolio: (state) => state.portfolio.portfolio,
      scorecard: (state) => state.scorecard.scorecard,
      countries: (state) => state.address.countries,
      subsetList: (state) => state.portfolio.subsetList,
    }),
    selectedLocations() {
      if (this.isAudit && this.auditLocations.data) {
        return this.auditLocations?.data.filter((el) => el.selected === true)
      } else {
        return this.locations.filter((el) => el.selected === true)
      }
    },
    isAudit() {
      return this.verification ? this.verification.is_auditable : false
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
      return [
        { label: 'None', value: '' },
        ...this.subsetList.map((el) => {
          return {
            label: el.name,
            value: el.id,
          }
        }),
      ]
    },
  },
  async mounted() {
    await this.initalSetup()
  },
  methods: {
    async initalSetup() {
      this.$parent.isLocation = true
      await this.getLocations()
      await this.$store.dispatch('portfolio/getSubsetList')
      if (this.isAudit) await this.getAuditLocations()
      if (this.prefilledLocations.length) {
        for (let i = 0; i < this.prefilledLocations.length; i++) {
          if (
            this.locations.find(
              (location) => location.id === this.prefilledLocations[i]
            )
          ) {
            this.locations.find(
              (location) => location.id === this.prefilledLocations[i]
            ).selected = true
          }
        }
      } else if (this.scorecardPartId) {
        this.assignLocations()
      }
      this.$parent.isLocation = false
    },
    async getLocations() {
      this.loading = true
      try {
        const url =
          'api/scorecard/' +
          this.scorecard.id +
          '/projects?sort=desc&paginate=no'
        const res = await this.$axios.get(
          `${url}${this.parseFilters(this.filters)}`
        )
        if (this.prefilledLocations.length) {
          res.data.forEach((el) =>
            el.pursue_status === 'achieved'
              ? (el.selected = true)
              : (el.selected = false)
          )
        } else {
          res.data.forEach((el) =>
            el.pursue_status === 'achieved' || el.pursue_status === 'now'
              ? (el.selected = true)
              : (el.selected = false)
          )
        }
        this.locations = res.data
        this.loading = false
      } catch (error) {
        this.$store.dispatch('notifications/toastMessage', {
          message: 'Something went wrong... ',
        })
        this.loading = false
      }
      this.$parent.errorLocation = false
    },
    getCountryNameByCode(code) {
      return this.countries.find((el) => el.code === code).name
    },
    parseFilters(payload) {
      const temp = JSON.parse(JSON.stringify(payload))
      let str = ''
      if (temp['country_codes[]'].length) {
        str = '&' + this.parseCountryCodes(temp['country_codes[]'])
        delete temp['country_codes[]']
      }
      for (const key in temp) {
        if (temp[key] !== null && temp[key] !== '' && temp[key].length !== 0) {
          if (key === 'country_codes[]') {
            temp[key] = temp[key].map((val) => val.value)
          }
          str += '&'
          str += key + '=' + encodeURIComponent(temp[key])
        }
      }
      return str
    },
    toggleAll() {
      this.toggleAllEnabled = !this.toggleAllEnabled
      if (this.auditLocations.data && this.auditLocations.data.length) {
        this.auditLocations.data.forEach((loc) => {
          if (loc.pursue_status !== 'achieved') {
            this.toggleAllEnabled
              ? (loc.selected = true)
              : (loc.selected = false)
          }
        })
      }
      this.locations.forEach((loc) => {
        if (loc.pursue_status !== 'achieved') {
          this.toggleAllEnabled ? (loc.selected = true) : (loc.selected = false)
        }
      })
    },
    assignLocations() {
      this.assigning = false
      this.returnLocationIds()
    },

    returnLocationIds() {
      const data = this.selectedLocations.map((el) => el.id)
      this.$emit('getLocationList', data)
      this.$parent.mode = ''
      this.$parent.$parent.$parent.mode = ''
    },

    async getAuditLocations() {
      this.loading = true
      let page = '1'
      if (this.auditLocations.length) page = this.auditLocations.current_page
      const vType =
        this.portfolio.type === 'v2'
          ? 'Verification'
          : this.verification.type
              .toLowerCase()
              .split('_')
              .map((word) => word.charAt(0).toUpperCase() + word.substring(1))
              .join('')
              .slice(0, -1)
      try {
        const { data } = await this.$axios.get(
          `api/scorecard/${this.scorecard.id}/scorecard_part/${this.scorecardPartId}/${vType}/${this.verification.id}/todo?page=${page}`
        )
        data.data.forEach((el) =>
          el.pursue_status === 'achieved' || el.pursue_status === 'now'
            ? (el.selected = true)
            : (el.selected = false)
        )
        this.auditLocations = data
        if (this.auditLocations.data.length) {
          this.$parent.errorLocation = false
        } else {
          this.$parent.errorLocation = true
        }
        this.loading = false
      } catch (error) {
        this.$store.dispatch('notifications/toastMessage', {
          message: 'Something went wrong... ',
        })
        this.loading = false
      }
    },
    abort() {
      if (this.scorecardPartId) {
        this.$parent.mode = 'main'
      } else {
        this.$parent.mode = 'main'
        this.$parent.isHidden = true
      }
      this.$parent.$parent.$parent.mode = ''
    },

    parseCountryCodes(values) {
      let str = ''
      values.forEach((el) => {
        if (str !== '') str += '&'
        str += `country_codes[]=${el.value}`
      })
      return str
    },
  },
}
</script>
