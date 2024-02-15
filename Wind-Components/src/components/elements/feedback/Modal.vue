<template>
  <div :class="['fixed z-30 inset-0 overflow-y-auto', { hidden: isHidden }]">
    <div
      :class="[
        'flex items-center justify-center min-h-screen p-2 sm:p-6 text-center sm:block',
      ]"
    >
      <div
        class="fixed inset-0 transition-opacity"
        @click="
          if (canManuallyClose) {
            isHidden = !isHidden
          }
        "
      >
        <div class="absolute inset-0 opacity-75 -ml-8">
          <div
            class="animate__animated animate__fadeIn bg-gray-800 w-full h-full"
          ></div>
        </div>
      </div>
      <span class="hidden sm:inline-block sm:align-middle sm:h-screen"></span
      >&#8203;
      <div
        class="
          animate__animated animate__faster animate__zoomIn
          bg-white
          inline-block
          p-4
          sm:p-6
          rounded-lg
          shadow-xl
          sm:align-middle sm:my-8
          text-left
          transform
          transition-all
          w-full
          md:w-auto
        "
        :class="modalWidth ? modalWidth : ''"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-headline"
      >
        <slot />
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    canManuallyClose: {
      type: Boolean,
      default: true,
      required: false,
    },
    modalWidth: {
      type: String,
      default: '',
      required: false,
    },
  },
  data() {
    return {
      isHidden: true,
    }
  },
  computed: {
    expanded() {
      if (this.$store.state.settings.navExpanded == null) {
        return true
      }
      if (this.$store.state.settings.navExpanded === 'false') {
        return false
      }
      if (this.$store.state.settings.navExpanded === 'true') {
        return true
      }
      return this.$store.state.settings.navExpanded
    },
  },
}
</script>
