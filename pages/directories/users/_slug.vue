<template>
  <div class="flex flex-wrap">
    <div v-if="viewedUser" class="w-full">
      <div class="w-full">
        <div>
          <nav class="sm:hidden">
            <a
              href="#"
              class="
                flex
                items-center
                text-sm
                leading-5
                font-medium
                text-gray-500
                hover:text-gray-700
                transition
                duration-150
                ease-in-out
              "
            >
              <!-- Heroicon name: chevron-left -->
              <svg
                class="flex-shrink-0 -ml-1 mr-1 h-5 w-5 text-gray-400"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fill-rule="evenodd"
                  d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                  clip-rule="evenodd"
                />
              </svg>
              Back
            </a>
          </nav>
        </div>
        <NavBreadcrumbs>
          <WHeadingsHTwo heading="View Profile" />
        </NavBreadcrumbs>
      </div>

      <WLinksBase
        class="mb-4"
        link="/directories/users/"
        icon="arrow-narrow-left"
      >
        ALL USERS
      </WLinksBase>

      <ProfileView :user="viewedUser" />
    </div>
    <div v-else class="h-screen w-full mt-14">
      <div v-if="error == null" class="mx-auto text-center">
        <WLoadingSpinner class="mx-auto" />
        <div class="mt-3 text-primary-600">Loading User Profile...</div>
      </div>
      <div v-else class="mx-auto text-center">
        <div class="mt-3 text-primary-400 font-medium">Cannot find user</div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  auth: false,
  data() {
    return {
      error: null,
      currentTab: 'about',
      viewedUser: null,
    }
  },
  head() {
    return {
      title: `${this.usersName}`,
    }
  },
  computed: {
    usersName() {
      if (this.viewedUser) {
        return this.viewedUser.full_name
      }
      return 'User Profile'
    },
  },
  async mounted() {
    return await this.$store
      .dispatch('user/getUserInfoBySlug', this.$route.params.slug)
      .then((res) => (this.viewedUser = res.data))
  },
}
</script>
