<template>
  <div
    class="fixed inset-0 flex items-end justify-center px-4 py-6 pointer-events-none sm:p-6 sm:items-start sm:justify-end"
  >
    <div
      :class="[
        !toast.visible && 'hidden',
        'animate__animated animate__backInRight bottom-0 fixed mb-4 max-w-sm w-full bg-primary-600 text-white shadow-lg rounded-lg pointer-events-auto ring-1 ring-black ring-opacity-5 overflow-hidden',
      ]"
    >
      <div class="p-4">
        <div class="flex items-start">
          <div class="ml-3 w-0 flex-1 pt-0.5">
            <p class="text-sm" v-html="toast.message"></p>
          </div>
          <div class="ml-4 flex-shrink-0 flex">
            <button
              class="bg-primary-500 rounded-md inline-flex text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              @click="$store.dispatch('notifications/clearToast')"
            >
              <span class="sr-only">Close</span>
              <svg
                class="h-5 w-5"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
              >
                <path
                  fill-rule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clip-rule="evenodd"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapState } from 'vuex'
export default {
  computed: {
    ...mapState({
      toast: (state) => state.notifications.toast,
    }),
  },
  watch: {
    toast: {
      handler(newMessage) {
        const self = this
        setTimeout(function () {
          self.$store.dispatch('notifications/clearToast')
        }, 8000)
      },
      deep: true,
    },
  },
}
</script>
