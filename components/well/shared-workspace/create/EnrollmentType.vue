<template>
  <div
    class="w-shared-workspace-gradient relative bg-white rounded-lg shadow-md"
  >
    <div class="rounded-lg">
      <div class="pt-8 xl:pt-24">
        <div class="max-w-screen-xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <div class="max-w-3xl mx-auto space-y-2 lg:max-w-none">
            <h2
              class="text-3xl leading-2 font-semibold text-black tracking-wider"
            >
              Confirm your enrollment type
            </h2>
            <div></div>
          </div>
        </div>
      </div>
      <div class="mt-8 pb-12 sm:mt-12 sm:pb-16 lg:mt-4 lg:pb-8">
        <div class="relative">
          <div class="absolute inset-0 h-3/4"></div>
          <div
            class="relative z-10 max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8"
          >
            <div
              class="
                max-w-md
                mx-auto
                space-y-4
                lg:max-w-5xl lg:grid lg:grid-cols-2 lg:gap-5 lg:space-y-0
              "
            >
              <div class="flex flex-col rounded-lg shadow-lg overflow-hidden">
                <div class="px-6 pt-8 pb-1 md:pb-8 bg-white sm:p-10 sm:pt-6">
                  <div>
                    <h3
                      id="tier-standard"
                      class="
                        inline-flex
                        px-4
                        py-1
                        rounded-full
                        text-sm
                        leading-5
                        font-semibold
                        tracking-wide
                        uppercase
                        bg-primary-200
                        text-primary-800
                      "
                    >
                      TYPE ONE
                    </h3>
                  </div>
                  <div
                    class="
                      mt-4
                      flex
                      items-baseline
                      text-xl
                      xl:text-3xl
                      leading-none
                      font-extrabold
                    "
                  >
                    Standard Locations
                  </div>
                  <p class="mt-5 text-lg leading-7 text-gray-500">
                    Individual spaces/buildings not yet registered to pursue
                    WELL Certification or subscribed in the WELL Portfolio
                    program. Bulk pricing is available for locations having a
                    single owner and applying streamlined documentation.
                  </p>
                </div>
                <div
                  class="
                    flex-1 flex flex-col
                    justify-end
                    px-6
                    pt-0
                    md:pt-6
                    pb-6
                    md:pb-8
                    bg-white
                    space-y-6
                    sm:p-10 sm:pt-6
                  "
                >
                  <div class="rounded-md shadow">
                    <WButtonsBase
                      type="primaryInverted"
                      @click.native="createSharedWorkspace(0)"
                      >Enroll now</WButtonsBase
                    >
                  </div>
                </div>
              </div>

              <div class="flex flex-col rounded-lg shadow-lg overflow-hidden">
                <div class="px-6 pt-8 md:pb-8 pb-1 bg-white sm:p-10 sm:pt-6">
                  <div>
                    <h3
                      id="tier-standard"
                      class="
                        inline-flex
                        px-4
                        py-1
                        rounded-full
                        text-sm
                        leading-5
                        font-semibold
                        tracking-wide
                        uppercase
                        bg-primary-200
                        text-primary-800
                      "
                    >
                      TYPE TWO
                    </h3>
                  </div>
                  <div
                    class="
                      mt-4
                      flex
                      items-baseline
                      text-xl
                      xl:text-3xl
                      leading-none
                      font-extrabold
                    "
                  >
                    High-volume, multi-use locations
                  </div>
                  <p class="mt-5 text-lg leading-7 text-gray-500">
                    High-volume locations are designed to accommodate more than
                    10,000 people daily and provide four or more distinct uses,
                    such as retail, dining, entertainment, residential, lodging,
                    offices, etc. Examples: stadiums, large hotel complexes,
                    airports and shopping centers. Some large multi-use office
                    towers with high-volume facilities may also meet these
                    criteria.
                  </p>
                </div>
                <div
                  class="
                    flex-1 flex flex-col
                    justify-end
                    px-6
                    pt-0
                    md:pt-6
                    pb-6
                    md:pb-8
                    bg-white
                    space-y-6
                    sm:p-10 sm:pt-6
                  "
                >
                  <div class="rounded-md shadow">
                    <WButtonsBase @click.native="createSharedWorkspace(1)"
                      >Enroll now</WButtonsBase
                    >
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  methods: {
    async createSharedWorkspace(type) {
      const sharedWorkspace = { ...this.$store.state.shared.sharedWorkspace }
      sharedWorkspace.multi_use = type
      if (sharedWorkspace.space_types.length) {
        sharedWorkspace.space_types =
          this.$store.state.shared.sharedWorkspace.space_types.map((e) => {
            return e.id
          })
      }
      await this.$store.dispatch(
        'shared/updateSharedWorkspace',
        sharedWorkspace
      )
      this.$store.dispatch('shared/setActiveTab', 'LOCATION INFORMATION')
    },
  },
}
</script>
<style scoped>
.w-shared-workspace-gradient {
  background: linear-gradient(180.54deg, #cfe6ed -219.41%, #f5f7f8 90.35%);
}
</style>
