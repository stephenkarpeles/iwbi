<template>
  <div
    id="my-app"
    ref="layout"
    class="
      relative
      flex flex-col
      h-screen
      overflow-hidden
      bg-gray-100
      font-museo-sans
    "
  >
    <!-- noticafition section start here -->
    <Notification class="z-40" />
    <!-- top navbar start here -->
    <NavPrimary class="z-30" />
    <!-- feedback banner start here -->
    <WFeedbackBanner class="mt-16" />
    <!-- offline notifiction start here -->
    <OfflineNofication />
    <!-- main section start here -->
    <main
      ref="content"
      class="relative overflow-y-auto focus:outline-none mt-16"
      tabindex="0"
    >
      <div class="xl:py-6">
        <div class="max-w-7xl mx-auto bg-white py-5 xl:rounded-lg xl:shadow-md">
          <Nuxt class="transition-opacity duration-200 px-6 md:px-8" />
        </div>
      </div>
      <!-- footer start here -->
      <NavFooter />
    </main>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'DefaultLayout',
  computed: {
    ...mapState({
      visible: (state) => state.notifications.banner.visible,
    }),
  },
  watch: {
    $route() {
      // automatically make the page rest at the top after navigation
      this.$refs.content.scrollTop = 0
    },
  },
}
</script>
