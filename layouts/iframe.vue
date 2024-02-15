<template>
  <div id="my-app" ref="layout" class="relative font-museo-sans">
    <div class="h-screen flex overflow-hidden bg-gray-100">
      <div class="flex flex-col w-0 flex-1 overflow-hidden">
        <Notification class="z-30" />
        <OfflineNofication />
        <NavPrimary class="z-20" />
        <WFeedbackBanner class="mt-16" />
        <main
          ref="content"
          class="flex-1 relative overflow-y-auto focus:outline-none mt-16"
          tabindex="0"
        >
          <div class="w-full bg-white pb-5 xl:rounded-lg xl:shadow-md">
            <Nuxt class="transition-opacity duration-200" />
          </div>
          <NavFooter />
        </main>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'IframeLayout',
  watch: {
    $route() {
      // automatically make the page rest at the top after navigation
      this.$refs.content.scrollTop = 0
    },
  },
}
</script>
