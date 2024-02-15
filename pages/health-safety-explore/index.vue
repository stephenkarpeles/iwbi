<template>
  <div class="min-h-screen exploreIndex-bg">
    <ExploreProjectLoading v-if="currentTab === 'Loading'" class="mt-0" />
    <ExploreLocationSearch v-if="currentTab === 'LocationSearch'" />
    <ExploreMapView
      v-if="currentTab === 'MapView'"
      ref="map"
      :nearby-locations="nearByLocations"
      :user-coordintaes="userCoordinates"
      class="-mt-2"
    />
    <ExploreProjectLanding2
      v-if="currentTab === 'ProjectLanding'"
      class="mt-0"
    />
  </div>
</template>

<script>
export default {
  beforeRouteUpdate(to, from, next) {
    if (to.query.view) {
      this.currentTab = to.query.view
    }
    next()
  },
  layout: 'blank',
  auth: false,
  data() {
    return {
      currentTab: 'Loading',
      nearByLocations: [],
      userCoordinates: {},
      currentLocation: null,
    }
  },
  head() {
    return {
      link: [
        {
          rel: 'stylesheet',
          href: 'https://api.tiles.mapbox.com/mapbox-gl-js/v2.3.0/mapbox-gl.css',
        },
      ],
    }
  },
  mounted() {
    if (this.$route.query.view) {
      this.currentTab = this.$route.query.view
    }
  },
  updated() {
    // this.currentTab = this.$route.query.view || 'MapView'
  },
  methods: {},
}
</script>

<style scoped lang="scss">
.exploreIndex-bg {
  background-color: #17353f;
}
</style>
