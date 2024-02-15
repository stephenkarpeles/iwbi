<template>
  <div v-if="open" class="fixed inset-0 overflow-hidden">
    <div class="absolute inset-0 overflow-hidden">
      <div
        class="
          animate__animated animate__fadeIn animate__fast
          absolute
          inset-0
          bg-gray-800 bg-opacity-75
          transition-opacity
        "
      ></div>
      <section
        class="
          animate__animated animate__slideInRight animate__fast
          absolute
          inset-y-0
          right-0
          md:pl-10
          max-w-full
          flex
        "
      >
        <div class="relative w-screen md:max-w-2xl lg:max-w-3xl xl:max-w-5xl">
          <div
            class="
              hidden
              md:flex
              -ml-8
              absolute
              animate__animated animate__delay-1s animate__fast animate__fadeIn
              left-0
              pr-2
              sm:-ml-10 sm:pr-4
              top-0
            "
          >
            <button
              aria-label="Close panel"
              class="
                mt-5
                text-gray-300
                hover:text-white
                transition
                ease-in-out
                duration-150
              "
              @click="toggleOpen"
            >
              <!-- Heroicon name: x -->
              <svg
                class="h-6 w-6"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
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
          <div class="h-full flex flex-col bg-white shadow-xl overflow-y-auto">
            <header
              v-if="title"
              class="z-10 p-4 md:px-6 md:pt-6 md:pb-2 bg-primary-900"
            >
              <div class="flex items-start justify-between space-x-3">
                <div class="space-y-1 flex-1">
                  <h2 class="text-lg leading-7 font-bold text-white">
                    {{ title }}
                  </h2>
                  <p v-if="description" class="text-sm text-white leading-5">
                    Get started by filling in the information below to create
                    your new project.
                  </p>
                  <p v-if="caption" class="text-sm text-white leading-5">
                    {{ caption }}
                  </p>
                </div>
                <slot name="headerActions"></slot>
                <button
                  aria-label="Close panel"
                  class="
                    text-gray-300
                    hover:text-white
                    transition
                    ease-in-out
                    duration-150
                    ml-auto
                    block
                    md:hidden
                  "
                  @click="toggleOpen"
                >
                  <!-- Heroicon name: x -->
                  <svg
                    class="h-6 w-6"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
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
            </header>
            <div class="relative flex-1 md:py-6">
              <slot name="content" />
            </div>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    title: {
      type: String,
      require: false,
      default: null,
    },
    description: {
      type: String,
      require: false,
      default: null,
    },
    caption: {
      type: String,
      require: false,
      default: null,
    },
  },
  data() {
    return {
      open: false,
    }
  },
  methods: {
    toggleOpen() {
      this.open = !this.open
      if (!this.open) {
        this.$emit('dismiss')
      }
    },
  },
}
</script>
