<template>
  <div class="flex flex-wrap">
    <div v-if="currentUser" class="w-full">
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
        <div class="mt-2 md:flex md:items-center md:justify-between">
          <NavBreadcrumbs>
            <WHeadingsHTwo heading="View Profile" />
          </NavBreadcrumbs>
          <div class="mt-4 flex-shrink-0 flex md:mt-0 md:ml-4">
            <span class="shadow-sm rounded-md">
              <WButtonsBase
                type="primaryInverted"
                icon="pencil"
                @click.native="
                  $router.push('/user/profile/' + currentUser.slug + '/edit')
                "
              >
                <span class="ml-2">Edit</span>
              </WButtonsBase>
            </span>
            <!-- <span class="ml-3 shadow-sm rounded-md">
              <WButtonsBase
                type="primaryInverted"
                icon="link"
                @click.native="
                  $router.push('/user/profile/' + currentUser.slug)
                "
              >
                <span class="ml-2">View</span>
              </WButtonsBase>
            </span> -->
            <span class="ml-3 shadow-sm rounded-md">
              <WButtonsBase
                type="primaryInverted"
                icon="pencil"
                @click.native="$router.push('/user/profile/password')"
              >
                <span class="ml-2">Reset Password</span>
              </WButtonsBase>
            </span>
          </div>
        </div>
      </div>

      <ProfileView v-if="currentUser" :user="currentUser" />
    </div>
    <div v-else class="h-screen w-full mt-14">
      <div class="mx-auto text-center">
        <WLoadingSpinner class="mx-auto" />
        <div class="mt-3 text-primary-600">Loading User Profile...</div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  head() {
    return {
      title: `My Profile`,
    }
  },
  computed: {
    ...mapState({
      currentUser: (state) => state.user.currentUser,
    }),
  },
}
</script>
