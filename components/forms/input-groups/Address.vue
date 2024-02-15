<template>
  <div class="border-gray-200 mb-5 pb-5 sm:mb-2 sm:pb-2">
    <div>
      <h3 class="text-lg leading-6 font-medium text-gray-900">
        {{ addressLabel }}
      </h3>
    </div>

    <div class="mt-6 sm:mt-4">
      <label
        :for="`country` + elementId"
        class="block text-sm font-medium leading-5 text-gray-700 sm:mt-px sm:pt-2"
      >
        Country / Region
      </label>
      <div class="mt-1 sm:mt-0 sm:col-span-2">
        <div class="rounded-md shadow-sm">
          <select
            :id="`country` + elementId"
            v-model="country"
            class="text-primary-700 appearance-none w-full px-3 py-2 border border-primary-300 rounded-md placeholder-primary-400 focus:outline-none focus:shadow-outline-blue focus:border-blue-300 transition duration-150 ease-in-out sm:text-sm sm:leading-5"
          >
            <option
              v-for="ctry in countries"
              :key="ctry.code"
              :value="ctry.code"
            >
              {{ ctry.name }}
            </option>
          </select>
        </div>
      </div>
    </div>

    <div v-if="filteredStates.length" class="mt-6 sm:mt-4">
      <label
        :for="`state` + elementId"
        class="block text-sm font-medium leading-5 text-gray-700 sm:mt-px sm:pt-2"
      >
        State / Province
      </label>
      <div class="mt-1 sm:mt-0 sm:col-span-2">
        <div class="rounded-md shadow-sm">
          <select
            :id="`state` + elementId"
            v-model="state"
            class="text-primary-700 appearance-none w-full px-3 py-2 border border-primary-300 rounded-md placeholder-primary-400 focus:outline-none focus:shadow-outline-blue focus:border-blue-300 transition duration-150 ease-in-out sm:text-sm sm:leading-5"
          >
            <option v-for="st in filteredStates" :key="st" :value="st">
              {{ st }}
            </option>
          </select>
        </div>
      </div>
    </div>

    <div class="mt-6 sm:mt-4">
      <label
        :for="`street_address` + elementId"
        class="block text-sm font-medium leading-5 text-gray-700 sm:mt-px sm:pt-2"
      >
        Street address
      </label>
      <div class="mt-1 sm:mt-0 sm:col-span-2">
        <div class="rounded-md shadow-sm">
          <input
            :id="`street_address` + elementId"
            v-model="street"
            class="text-primary-700 appearance-none w-full px-3 py-2 border border-primary-300 rounded-md placeholder-primary-400 focus:outline-none focus:shadow-outline-blue focus:border-blue-300 transition duration-150 ease-in-out sm:text-sm sm:leading-5"
          />
        </div>
      </div>
    </div>

    <div class="mt-6 sm:mt-4">
      <label
        :for="`city` + elementId"
        class="block text-sm font-medium leading-5 text-gray-700 sm:mt-px sm:pt-2"
      >
        City
      </label>
      <div class="mt-1 sm:mt-0 sm:col-span-2">
        <div class="rounded-md shadow-sm">
          <input
            :id="`city` + elementId"
            v-model="city"
            class="text-primary-700 appearance-none w-full px-3 py-2 border border-primary-300 rounded-md placeholder-primary-400 focus:outline-none focus:shadow-outline-blue focus:border-blue-300 transition duration-150 ease-in-out sm:text-sm sm:leading-5"
          />
        </div>
      </div>
    </div>

    <div class="mt-6 sm:mt-4">
      <label
        :for="`postalCode` + elementId"
        class="block text-sm font-medium leading-5 text-gray-700 sm:mt-px sm:pt-2"
      >
        Postal Code
      </label>
      <div class="mt-1 sm:mt-0 sm:col-span-2">
        <div class="rounded-md shadow-sm">
          <input
            :id="`postalCode` + elementId"
            v-model="postalCode"
            class="text-primary-700 appearance-none w-full px-3 py-2 border border-primary-300 rounded-md placeholder-primary-400 focus:outline-none focus:shadow-outline-blue focus:border-blue-300 transition duration-150 ease-in-out sm:text-sm sm:leading-5"
          />
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { createNamespacedHelpers } from 'vuex'
const { mapState } = createNamespacedHelpers('address')
export default {
  props: {
    addressData: {
      type: [Array, Object],
      required: false,
      default: () => {
        return {}
      },
    },
    addressLabel: {
      type: String,
      required: false,
      default: null,
    },
    elementId: {
      type: String,
      required: false,
      default: 'address',
    },
  },
  data() {
    return {
      country: null,
      state: null,
      city: null,
      street: null,
      postalCode: null,
    }
  },
  computed: {
    ...mapState(['countries', 'states']),
    filteredStates() {
      if (this.country) {
        return this.getStates(this.country)
      }
      return []
    },
  },
  mounted() {
    if (this.addressData) {
      this.prefillAddress(this.addressData)
    }
  },
  methods: {
    prefillAddress(addr) {
      if (addr.country) {
        this.country = addr.country
      }

      if (addr.country_code) {
        this.country = this.countries.filter(
          (a) => a.code === addr.country_code
        )[0].code
      }

      if (addr.postalCode) {
        this.postalCode = addr.postalCode
      } else {
        this.postalCode = addr.postal_code
      }

      this.state = addr.state
      this.street = addr.street
      this.city = addr.city
    },
    getStates(ctry) {
      if (ctry && this.states[ctry]) {
        return Object.values(this.states[ctry])
      }
      return []
    },
    getAddress() {
      return {
        country_code: this.country,
        state: this.state,
        city: this.city,
        street: this.street,
        postal_code: this.postalCode,
      }
    },
  },
}
</script>
