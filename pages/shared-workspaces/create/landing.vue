<template>
  <div>
    <NavBreadcrumbs>
      <WHeadingsHTwo heading="WELL Health-Safety Rating" />
    </NavBreadcrumbs>
    <div class="relative bg-white rounded-lg shadow-md">
      <div class="lg:absolute lg:inset-0">
        <div class="lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2">
          <img
            class="
              hidden
              lg:block
              h-56
              w-full
              object-cover
              lg:absolute lg:h-full
              rounded-r-lg
            "
            src="/shared-workspace/landing.jpg"
            alt=""
          />
        </div>
      </div>
      <div
        class="
          relative
          md:pt-8
          pb-16
          px-4
          sm:pt-16 sm:px-6
          lg:px-8 lg:max-w-7xl lg:mx-auto lg:grid lg:grid-cols-2
          border
          rounded-md
        "
      >
        <div class="lg:pr-8">
          <div class="max-w-md mx-auto sm:max-w-lg lg:mx-0">
            <ClientOnly>
              <WHeadingsHTwo heading="Re-open with confidence">
                <div class="mt-3 text-base leading-6 text-gray-500">
                  Earn the WELL Health-Safety Rating for your buildings.
                </div>
              </WHeadingsHTwo>
              <WStepsVertical
                :steps="[
                  {
                    name: 'LEARN',
                    status: 'complete',
                    link: 'https://www.wellcertified.com/health-safety',
                  },
                  {
                    name: 'ENROLL',
                    description:
                      'Now that you’ve learned all about the Health-Safety Rating, the next step is to officially enroll.',
                    status: 'current',
                    link: '#',
                  },
                  {
                    name: 'DOCUMENT',
                    status: null,
                    link: '#',
                  },
                  {
                    name: 'ACHIEVE',
                    status: null,
                    link: '#',
                  },
                  {
                    name: 'MAINTAIN',
                    status: null,
                    link: '#',
                  },
                ]"
              />
              <div class="space-y-2">
                <WButtonsBase @click.native="gotoNextStep">
                  Enroll now
                </WButtonsBase>
                <WButtonsBase
                  type="primaryInverted"
                  @click.native="$router.push('/shared-workspaces')"
                >
                  Back to homepage
                </WButtonsBase>
              </div>
            </ClientOnly>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  asyncData({ store }) {
    return {
      currentUser: store.state.user.currentUser,
    }
  },
  head() {
    return {
      title: `Health Safety`,
    }
  },
  computed: {
    reviewStatus() {
      return 'complete'
    },
    paymentStatus() {
      return 'complete'
    },
    submitStatus() {
      return 'complete'
    },
    wireTransferstatus() {
      return this.$route
    },
  },
  methods: {
    gotoNextStep() {
      this.$router.push('/shared-workspaces/create')
    },
  },
}
</script>
