<template>
  <div v-if="!isHidden" class="fixed z-30 inset-0 overflow-y-auto">
    <div
      :class="[
        'flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0',
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
        <div class="absolute inset-0 opacity-75 -ml-8 absolute">
          <div
            class="animate__animated animate__fadeIn bg-gray-800 w-full h-full"
          ></div>
        </div>
      </div>

      <span class="hidden sm:inline-block sm:align-middle sm:h-screen"></span
      >&#8203;
      <div
        class="align-bottom animate__animated animate__faster animate__zoomIn bg-white inline-block rounded-lg shadow-xl sm:align-middle text-left transform transition-all"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-headline"
      >
        <div
          v-if="header !== ''"
          class="flex items-center justify-between px-6 py-3 rounded-t-md text-gray-600 border-b-2 w-full"
          :class="headerBackground ? 'border-b-2' : 'bg-primary-800'"
        >
          <span
            class="font-semibold text-2xl flex"
            :class="headerBackground ? 'text-black opacity-60' : 'text-white'"
            v-html="header"
          ></span>
          <WIconsBase
            icon="x"
            class="cursor-pointer"
            :class="headerBackground ? 'text-gray-500' : 'text-white'"
            @click.native="isHidden = true"
          />
        </div>
        <div
          v-if="showBackOption"
          class="flex items-center justify-between px-6 py-3 rounded-t-md text-gray-600 border-b-2 w-full"
          :class="headerBackground ? 'border-b-2' : 'bg-primary-800'"
        >
          <span
            class="font-bold text-base cursor-pointer leading-6 flex py-4"
            :class="headerBackground ? 'text-primary-500' : 'text-white'"
            @click="$parent.mode = 'main'"
          >
            <WIconsBase icon="arrow-narrow-left" class="mr-2" /> Return to
            previous page</span
          >
        </div>

        <div class="pb-4 pt-5" :class="headerBackground ? '' : 'sm:p-6 px-4'">
          <slot />
        </div>
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
    header: {
      type: String,
      required: false,
      default: '',
    },
    headerBackground: {
      type: Boolean,
      required: false,
      default: false,
    },
    showBackOption: {
      type: Boolean,
      required: false,
      default: false,
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
