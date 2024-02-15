<template>
  <div
    class="relative animate__zoomIn animate__animated animate__faster cursor-pointer py-10 px-6 bg-white border-primary-200 border shadow-lg text-center rounded-lg xl:px-10 xl:text-left hover:bg-primary-800 text-primary-800 hover:text-white transition-colors"
    @click="$router.push('/directories/users/' + user.slug)"
  >
    <div class="absolute top-0 right-0 mr-3 mt-3">
      <!-- <img
        v-if="user.well_ap && user.well_ap === 1"
        src="/profile/well-Ap.png"
        class="h-10 rounded-full shadow-md bg-white"
      /> -->

      <img
        v-if="user.gb_award && user.gb_award === 'well-ap-of-the-year'"
        src="/profile/badges/badges-2021/well-ap.png"
        class="h-10 rounded-full shadow-md bg-white"
      />
      <img
        v-if="user.gb_award && user.gb_award === 'well-advisor'"
        src="/profile/badges/badges-2021/well-advisor.png"
        class="h-10 rounded-full shadow-md bg-white"
      />
      <img
        v-if="user.gb_award && user.gb_award === 'well-portfolio'"
        src="/profile/badges/badges-2021/well-portfolio.png"
        class="h-10 rounded-full shadow-md bg-white"
      />
      <!-- Temporarily removing well faculty badge as it it more of a status rather than an award -->
      <img
        v-if="user.gb_award && user.gb_award === 'well-faculty'"
        src="/profile/badges/badges-2021/well-faculty.png"
        class="h-10 rounded-full shadow-md bg-white"
      />
    </div>
    <div class="space-y-6 xl:space-y-10">
      <div
        class="mx-auto h-32 w-32 relative border-primary-400 border-4 rounded-full overflow-hidden"
      >
        <div
          class="-mt-1 -ml-1 bg-primary-400 h-32 w-32 rounded-full bg-center bg-cover absolute z-0"
          style="background-image: url('/profile/avatar.jpg')"
        ></div>
        <div
          class="-mt-1 -ml-1 h-32 w-32 rounded-full bg-center bg-cover z-10 relative"
          :style="{ backgroundImage: `url('${user.profile_pic}')` }"
        ></div>
      </div>
      <div class="space-y-2 text-center">
        <div class="font-medium text-lg leading-6 space-y-1">
          <h3 class="">{{ user.name }} {{ user.last_name }}</h3>
          <p class="text-primary-400 text-sm truncate">
            {{ user.job_title }}
          </p>
          <p class="text-sm truncate">
            {{ user.organization }}
          </p>
          <div>
            <span
              v-if="user.well_advisory"
              class="px-2 inline-flex text-xs leading-5 rounded-full bg-success-300 text-success-900 uppercase"
            >
              WELL Advisory
            </span>
            <span
              v-if="user.well_ap && user.well_ap === 1"
              class="px-2 inline-flex text-xs leading-5 rounded-full bg-secondary-400 text-secondary-900 uppercase"
            >
              WELL AP
            </span>
            <span
              v-if="user.well_faculty && user.well_faculty === 1"
              class="px-2 inline-flex text-xs leading-5 rounded-full bg-primary-400 text-primary-900 uppercase"
            >
              WELL Faculty
            </span>
            <span
              v-if="user.well_pta"
              class="px-2 inline-flex text-xs leading-5 rounded-full bg-primary-400 text-primary-900 uppercase"
            >
              WELL PTA
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    user: {
      type: Object,
      required: true,
    },
  },
}
</script>
