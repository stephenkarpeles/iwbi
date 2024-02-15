<template>
  <div
    class="
      mt-3
      w-96
      rounded-lg
      shadow-lg
      ring-1 ring-black ring-opacity-5
      overflow-hidden
    "
  >
    <div class="relative grid gap-6 bg-white px-5 py-6 sm:gap-8 sm:p-8">
      <nuxt-link
        to="/user/profile"
        class="-m-3 p-3 flex items-start rounded-lg hover:bg-gray-50"
        @click="$parent.isActive = false"
      >
        <div class="mb-auto mt-1">
          <WIconsBase icon="user" type="primary" />
        </div>
        <div class="ml-4">
          <p class="text-base font-bold text-primary-700">Profile</p>
          <p class="mt-1 text-sm text-gray-500">
            View and customize your WELL profile.
          </p>
        </div>
      </nuxt-link>
      <nuxt-link
        to="/membership"
        class="-m-3 p-3 flex items-start rounded-lg hover:bg-gray-50"
        @click="$parent.isActive = false"
      >
        <div class="mb-auto mt-1">
          <WIconsBase icon="users" type="primary" />
        </div>
        <div class="ml-4">
          <p class="text-base font-bold text-primary-700">My Membership</p>
          <p class="mt-1 text-sm text-gray-500">
            Register, view and manage your organization.
          </p>
        </div>
      </nuxt-link>
      <nuxt-link
        to="/alternatives"
        class="-m-3 p-3 flex items-start rounded-lg hover:bg-gray-50"
        @click="$parent.isActive = false"
      >
        <div class="mb-auto mt-1">
          <WIconsBase icon="view-grid" type="primary" />
        </div>
        <div class="ml-4">
          <p class="text-base font-bold text-primary-700">My Alternatives</p>
          <p class="mt-1 text-sm text-gray-500">
            Submit a proposal for an equivalency or alternatives.
          </p>
        </div>
      </nuxt-link>
    </div>
    <div
      class="
        px-5
        py-5
        bg-primary-600
        space-y-6
        sm:flex sm:space-y-0 sm:space-x-10 sm:px-8
      "
    >
      <div class="w-full flex justify-end">
        <div>
          <WButtonsBase
            icon="logout"
            type="neutral"
            class="text-white hover:bg-primary-700 rounded-lg"
            @click.native="$router.push('/logout'), ($parent.isActive = false)"
          >
            Logout
          </WButtonsBase>
        </div>
      </div>
    </div>
  </div>
</template>
