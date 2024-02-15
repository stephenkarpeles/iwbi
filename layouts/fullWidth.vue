<template>
  <div id="my-app" class="relative font-museo-sans">
    <div class="h-screen flex overflow-hidden bg-gray-100">
      <ClientOnly>
        <NavSidebar />
      </ClientOnly>
      <div class="flex flex-col w-0 flex-1 overflow-hidden">
        <Notification class="z-30" />
        <OfflineNofication />
        <NavPrimary :can-collapse="true" class="z-20" />
        <WFeedbackBanner class="mt-16" />
        <main
          ref="content"
          class="flex-1 relative overflow-y-auto focus:outline-none mt-16"
          tabindex="0"
        >
          <div class="xl:py-6">
            <div
              class="max-w-7xl mx-auto bg-white pt-5 xl:rounded-lg xl:shadow-md"
            >
              <Nuxt />
              <NavFooter />
            </div>
          </div>
        </main>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'FullWidth',
  watch: {
    $route() {
      // automatically make the page rest at the top after navigation
      this.$refs.content.scrollTop = 0
    },
  },
}
</script>
