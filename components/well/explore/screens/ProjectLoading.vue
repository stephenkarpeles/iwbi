<template>
  <div
    class="h-screen w-full flex flex-col justify-center items-center radial-bg"
  >
    <img src="/explore/hsr.png" alt="" />
  </div>
</template>

<script>
export default {
  data() {
    return {
      timeoutTimer: null,
    }
  },
  mounted() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        this.GeoLocationUpdated,
        this.GeoLocationError
      )
    }

    // wait for 10s for user to grant/deny access to his current location
    // before falling back to 'LocationSearch' view
    this.timeoutTimer = setTimeout(() => {
      this.$parent.currentTab = 'LocationSearch'
    }, 10000)
  },
  beforeDestroy() {
    clearTimeout(this.timeoutTimer)
  },
  methods: {
    GeoLocationUpdated(position) {
      const { latitude, longitude } = position.coords
      this.$parent.userCoordinates = {
        lng: longitude,
        lat: latitude,
      }
      this.$parent.currentTab = 'MapView'
    },
    GeoLocationError() {
      this.$parent.currentTab = 'LocationSearch'
    },
  },
}
</script>

<style scoped>
.radial-bg {
  background: rgb(31, 131, 164);
  background: radial-gradient(
    circle,
    rgba(31, 131, 164, 1) 0%,
    rgba(4, 88, 116, 1) 50%,
    rgba(23, 53, 63, 1) 100%
  );
  mix-blend-mode: normal;
}
</style>
