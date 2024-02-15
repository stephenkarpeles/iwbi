<template>
  <aside
    class="
      fixed
      inset-y-0
      right-0
      top-16
      pl-10
      max-w-full
      flex
      transform
      transition
      ease-in-out
      duration-500
      sm:duration-700
      translate-x-0
    "
    :class="!isHidden ? '' : 'translate-x-full'"
  >
    <div class="w-screen max-w-xs">
      <div class="h-full flex flex-col py-6 bg-white shadow-xl bg-primary-50">
        <div class="px-2 sm:px-4">
          <div class="flex items-center pb-4">
            <div class="h-7 flex items-center mr-2">
              <button
                type="button"
                class="
                  rounded-md
                  text-gray-400
                  hover:text-gray-500
                  focus:outline-none
                  focus:ring-2
                  focus:ring-offset-2
                  focus:ring-primary-500
                "
                @click="isHidden = true"
              >
                <span class="sr-only">Close panel</span>
                <!-- Heroicon name: outline/x -->
                <svg
                  class="h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
            <slot name="header" />
          </div>
        </div>
        <div class="relative flex-1 px-4 sm:px-6 overflow-y-auto h-screen">
          <slot name="content" />
        </div>
      </div>
    </div>
  </aside>
</template>

<script>
export default {
  data() {
    return {
      isHidden: true,
    }
  },
}
</script>
