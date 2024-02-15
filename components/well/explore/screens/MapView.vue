<template>
  <div>
    <div class="w-full h-screen">
      <div class="w-full bg-primary-900 text-white fixed top-0 z-10 h-16">
        <div class="flex h-full justify-around">
          <div class="my-auto pl-3 w-9">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="
                my-auto
                w-6
                text-white
                ml-auto
                -scale-x-1
                transform
                cursor-pointer
              "
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              @click="$parent.currentTab = 'LocationSearch'"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M17 8l4 4m0 0l-4 4m4-4H3"
              />
            </svg>
          </div>
          <img
            src="/logo/light.svg"
            alt="Workflow"
            class="cursor-pointer h-8 w-auto mx-auto my-auto"
            @click="$router.push('/')"
          />
          <div class="my-auto pr-3 w-9">
            <svg
              stroke="currentColor"
              fill="none"
              viewBox="0 0 24 24"
              class="
                my-auto
                w-6
                text-white
                ml-auto
                -scale-x-1
                transform
                cursor-pointer
              "
              @click="$refs.bottomSheet.setExpand()"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M4 6h16M4 12h16M4 18h7"
              ></path>
            </svg>
          </div>
        </div>
      </div>

      <ClientOnly>
        <MglMap
          ref="mglMapComponent"
          :access-token="accessToken"
          :map-style="mapStyle"
          @load="onMapLoaded"
        >
          <MglGeolocateControl
            ref="geoLocateControl"
            :track-user-location="true"
            @geolocate="GeoLocationUpdated"
            @error="GeoLocationError"
          />

          <MglMarker
            v-for="_location in nearbyLocations"
            :key="_location.number"
            :coordinates="[_location.lng, _location.lat]"
          >
            <WIconsBase
              slot="marker"
              icon="location-marker-bold"
              class="text-white"
            />
            <MglPopup
              :close-button="true"
              :coordinates="[_location.lng, _location.lat]"
              :offset="[4, -20]"
              anchor="bottom"
            >
              <div class="flex flex-col">
                <span
                  class="font-semibold cursor-pointer"
                  @click="goToProjectLanding(_location)"
                  v-html="_location.name"
                />
                <span
                  class="cursor-pointer"
                  @click="goToProjectLanding(_location)"
                  v-html="
                    `${_location.street}, ${_location.state}, ${_location.country} ${_location.postal_code}.`
                  "
                />
              </div>
            </MglPopup>
          </MglMarker>
        </MglMap>
      </ClientOnly>
    </div>
    <!-- bottom sheet -->
    <ExploreBottomSheet v-if="coordinates" ref="bottomSheet">
      <template #content>
        <ExploreProjectsList
          :projects="nearbyLocationsArray"
          :radius="radius"
          :default-coordinates="coordinates"
        />
      </template>
    </ExploreBottomSheet>
  </div>
</template>

<script>
export default {
  props: {
    nearbyLocations: {
      type: Array,
      default: () => [],
    },
    userCoordinates: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      nearbyLocationsArray: this.nearbyLocations,
      accessToken:
        'pk.eyJ1IjoibWJvYm9qb25vdiIsImEiOiJja3ExM202MmEwYXgyMnVwbGxqMDdobGd3In0.CuSpH4_bfPFo5MMTAK6B8A',
      mapStyle: 'mapbox://styles/mbobojonov/ckq1a1j1x3syw17pqc88prow5',
      location: null,
      coordinates: this.$parent.userCoordinates,
      radius: 200000, // @TODO; change to a real value.
    }
  },
  mounted() {},
  methods: {
    async onMapLoaded(event) {
      const asyncActions = event.component.actions

      await asyncActions.flyTo({
        center: this.coordinates,
        zoom: 15,
        speed: 1,
      })
    },
    async loadNearbyLocations(options) {
      await this.$axios
        .get('api/public/hsr/areaSearch', {
          params: options,
        })
        .then((response) => {
          if (response.data && response.data.length) {
            this.nearbyLocationsArray = response.data.data
          } else {
            this.nearbyLocationsArray = []
          }
        })
        // eslint-disable-next-line node/handle-callback-err
        .catch((error) => {
          this.nearbyLocationsArray = []
        })
    },
    GeoLocationUpdated(control) {
      const { latitude, longitude } = control.mapboxEvent.coords
      this.coordinates = {
        lat: latitude,
        lng: longitude,
      }
      this.loadNearbyLocations({
        lat: latitude,
        lng: longitude,
        radius: this.radius,
        units: 'M',
      })
    },
    GeoLocationError() {
      // alert(`Failed to load location with error: ${error.mapboxEvent.message}`)
    },
    goToProjectLanding({ type, number }) {
      this.$router.push(
        {
          path: this.$route.path,
          force: true,
          query: {
            view: 'ProjectLanding',
            projectType: type,
            projectNumber: number,
          },
        },
        () => {
          this.$router.app.refresh()
        }
      )
    },
  },
}
</script>

<style>
.mapboxgl-popup-content {
  background: #0f2329;
  color: white;
}

.mapboxgl-popup-close-button {
  font-size: 1.125rem;
  line-height: 1.75rem;
  font-weight: 700;
  right: 0.5rem;
}
</style>
