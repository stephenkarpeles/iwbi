<template>
  <div @click=";(isActive = !isActive), analytics()">
    <span
      :class="[
        isActive === true || isActive === '' ? 'bg-primary-600' : 'bg-gray-200',
      ]"
      role="checkbox"
      tabindex="0"
      aria-checked="false"
      class="cursor-pointer relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:shadow-outline"
    >
      <span
        :class="[
          isActive === true || isActive === ''
            ? 'translate-x-5'
            : 'translate-x-0',
        ]"
        aria-hidden="true"
        class="relative inline-block h-5 w-5 rounded-full bg-white shadow transform transition ease-in-out duration-200"
      >
        <span
          :class="[
            isActive === true || isActive === ''
              ? 'opacity-0 ease-out duration-100'
              : 'opacity-100 ease-in duration-200',
          ]"
          class="absolute inset-0 h-full w-full flex items-center justify-center transition-opacity"
        >
          <svg class="h-3 w-3 text-gray-400" fill="none" viewBox="0 0 12 12">
            <path
              d="M4 8l2-2m0 0l2-2M6 6L4 4m2 2l2 2"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </span>
        <span
          :class="[
            isActive === true || isActive === ''
              ? 'opacity-100 ease-in duration-200'
              : 'opacity-0 ease-out duration-100',
          ]"
          class="absolute inset-0 h-full w-full flex items-center justify-center transition-opacity"
        >
          <svg
            class="h-3 w-3 text-primary-600"
            fill="currentColor"
            viewBox="0 0 12 12"
          >
            <path
              d="M3.707 5.293a1 1 0 00-1.414 1.414l1.414-1.414zM5 8l-.707.707a1 1 0 001.414 0L5 8zm4.707-3.293a1 1 0 00-1.414-1.414l1.414 1.414zm-7.414 2l2 2 1.414-1.414-2-2-1.414 1.414zm3.414 2l4-4-1.414-1.414-4 4 1.414 1.414z"
            />
          </svg>
        </span>
      </span>
    </span>
  </div>
</template>

<script>
export default {
  props: {
    value: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
  data() {
    return {
      isActive: false,
    }
  },
  watch: {
    isActive() {
      this.$emit('input', this.isActive)
    },
    value() {
      this.isActive = this.value
      this.$emit('input', this.isActive)
    },
  },
  created() {
    this.isActive = this.value
  },
  methods: {
    analytics() {
      if (
        process.client &&
        this?.$wind?.analytics &&
        this.$wind.analytics === true
      ) {
        window.dataLayer = window.dataLayer || []
        window.dataLayer.push({
          event: 'windEvent',
          category: 'Button click',
          action: this.$el.textContent,
          label: window.location.pathname,
        })
      }
      if (process.client && this?.$wind?.debug && this.$wind.debug === true) {
        // eslint-disable-next-line no-console
        console.log({
          event: 'windEvent',
          category: 'Button click',
          action: this.$el.textContent,
          label: window.location.pathname,
        })
      }
    },
  },
}
</script>
