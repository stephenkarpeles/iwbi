<template>
  <div class="min-h-screen w-full flex flex-col locationSearch-bg">
    <div class="w-full bg-primary-900 text-white fixed top-0 z-10 h-16">
      <div class="flex h-full justify-around">
        <img
          src="/logo/light.svg"
          alt="Workflow"
          class="cursor-pointer h-8 w-auto mx-auto my-auto"
          @click="$router.push('/')"
        />
      </div>
    </div>

    <div
      :class="[
        searchResults && searchResults.length ? 'rounded-t-lg' : 'rounded-lg',
      ]"
      class="
        flex flex-row
        w-11/12
        py-3
        px-3
        mx-auto
        mt-24
        items-center
        bg-1E4D5C
      "
    >
      <div class="">
        <WIconsBase
          icon="location-search-search"
          class="w-4 h-4 text-gray-600"
        />
      </div>
      <div class="relative pl-3 flex-grow">
        <input
          v-model="searchTerm"
          type="text"
          class="
            block
            w-full
            p-0
            pr-7
            border-0
            text-gray-100
            focus:border-0 focus:outline-none focus:shadow-none
            bg-1E4D5C
          "
        />
        <div
          class="absolute top-1 right-0 cursor-pointer"
          @click="clearSearch()"
        >
          <WIconsBase
            icon="location-search-clear"
            class="w-4 h-4 text-gray-600"
          />
        </div>
      </div>
    </div>

    <div
      v-if="searchResults && searchResults.length"
      class="
        flex flex-col
        w-11/12
        mx-auto
        bg-white
        rounded-b-lg
        overflow-hidden
      "
    >
      <div
        v-for="item in searchResults"
        :key="item.id"
        class="
          flex flex-row
          align-center
          w-full
          pt-3
          pb-2
          px-3
          bg-white
          cursor-pointer
          hover:bg-gray-100
        "
        @click="locationSelected(item)"
      >
        <WIconsBase icon="location-search-pin" class="w-5 h-5" />
        <div class="flex flex-col pl-3">
          <div class="text-sm font-bold color-2E3436" v-html="item.text" />
          <div
            class="text-gray-400 text-xs font-bold"
            v-html="getLocationContextString(item.context)"
          />
        </div>
      </div>
    </div>

    <div class="mt-5 px-6 text-white text-center text-sm">
      Type an address to search WELL Health-Safety locations.
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      mapBoxAccessToken:
        'pk.eyJ1IjoibWJvYm9qb25vdiIsImEiOiJja3ExM202MmEwYXgyMnVwbGxqMDdobGd3In0.CuSpH4_bfPFo5MMTAK6B8A',
      mapBoxApiEndpoint: 'https://api.mapbox.com/geocoding/v5/mapbox.places/',
      mapBoxSearchTypes: 'country,address,place',
      mapBoxNoOfResults: 8,
      searchTerm: '',
      searchResults: [],
    }
  },
  watch: {
    async searchTerm(newValue) {
      if (!newValue || !newValue.length) {
        this.clearSearch()
        return false
      }

      this.searchResults = await this.$axios
        .get(this.getFullSearchUrl(newValue), {
          params: {
            types: this.mapBoxSearchTypes,
            limit: this.mapBoxNoOfResults,
            access_token: this.mapBoxAccessToken,
          },
        })
        .then((response) => {
          if (response.data && response.data.features) {
            return response.data.features
          }
          return []
        })
        .catch(() => {
          return []
        })
    },
  },
  methods: {
    clearSearch() {
      this.searchTerm = ''
      this.searchResults = []
    },
    getFullSearchUrl(searchString) {
      return this.mapBoxApiEndpoint + encodeURI(searchString) + '.json'
    },
    locationSelected(location) {
      this.$parent.userCoordinates = {
        lng: location.center[0],
        lat: location.center[1],
      }
      this.$parent.currentTab = 'MapView'
    },
    getLocationContextString(locationContext) {
      if (!locationContext || !locationContext.length) {
        return ''
      } else if (locationContext.length === 1) {
        return locationContext[0].text
      }
      const length = locationContext.length
      return (
        locationContext[length - 2].text +
        ', ' +
        locationContext[length - 1].text
      )
    },
    searchByCurrentLocation() {
      this.$parent.currentTab = 'Loading'
      this.$router.go(0)
    },
  },
}
</script>

<style scoped lang="scss">
.locationSearch-bg {
  background-color: #17353f;
}

.color-2E3436 {
  color: #2e3436;
}

.bg-1E4D5C {
  background-color: #1e4d5c;
}
</style>
