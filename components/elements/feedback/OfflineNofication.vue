<template>
  <div
    v-if="$nuxt.isOffline"
    class="
      fixed
      bottom-0
      left-0
      z-50
      bg-primary-800
      text-white
      h-14
      mb-2
      ml-2
      rounded
      flex
      text-center
      px-4
      py-2
    "
  >
    <div class="my-auto flex">
      <WIconsBase icon="no-wifi" class="text-white mr-2" />
      <div class="mr-2">You are offline.</div>
      <div class="text-primary-500 cursor-pointer" @click="reload()">
        Refresh
      </div>
    </div>
  </div>
</template>

<script>
export default {
  methods: {
    reload() {
      if (process.client) {
        window.location.reload()
      }
    },
  },
}
</script>
