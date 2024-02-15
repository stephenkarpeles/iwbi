<template>
  <div id="my-app" ref="layout" class="relative font-museo-sans">
    <div class="h-screen flex overflow-hidden bg-gray-100">
      <ClientOnly>
        <NavSidebar />
      </ClientOnly>

      <div class="flex flex-col w-0 flex-1 overflow-hidden">
        <Notification class="z-30" />
        <OfflineNofication />
        <NavPrimary :can-collapse="true" class="z-20" />
        <WFeedbackBanner
          :can-dismiss="$store.state.notifications.banner.canDismiss"
          class="mt-16"
        />
        <main
          ref="content"
          class="flex-1 relative overflow-y-auto focus:outline-none"
          tabindex="0"
        >
          <div class="xl:py-6">
            <div
              class="
                max-w-7xl
                mx-auto
                bg-white
                py-5
                xl:rounded-lg xl:shadow-md
                mt-16
              "
            >
              <Nuxt
                ref="nuxt"
                class="transition-opacity duration-200 px-4 sm:px-6 md:px-8"
              />
            </div>
          </div>
        </main>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SidebarLayout',
  watch: {
    $route() {
      // automatically make the page rest at the top after navigation
      this.$refs.content.scrollTop = 0
    },
  },
}
</script>
