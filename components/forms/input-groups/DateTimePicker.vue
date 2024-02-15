<template>
  <div
    :class="`formulate-input-element formulate-input-element--${context.type}`"
    :data-type="context.type"
  >
    <div class="mt-1 mb-4 flex rounded-md shadow-sm">
      <span
        class="inline-flex items-center px-3 rounded-l-md border border-r-0 border-primary-300 bg-gray-50 text-gray-500 sm:text-sm"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          class="h-5 w-5 text-gray-400"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
      </span>
      <datetime
        v-model="dateVal"
        class="w-full"
        placeholder="MMM DD, YYYY"
        :min-datetime="min"
        input-class="h-10 text-primary-700 appearance-none w-full px-3 py-2 border border-primary-300 rounded-r-md placeholder-primary-400 focus:outline-none focus:shadow-outline-blue focus:border-blue-300 transition duration-150 ease-in-out sm:text-sm sm:leading-5"
        value-zone="local"
        :disabled="context.attributes.disabled"
      ></datetime>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    context: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      selectedIndex: 0,
      dateVal: null,
    }
  },
  computed: {
    model() {
      return this.context.model
    },
    min() {
      if (this.context.attributes.min) {
        return this.context.attributes.min
      } else {
        return ''
      }
    },
  },
  watch: {
    dateVal(val) {
      if (val && val !== '0000-00-00') {
        // eslint-disable-next-line vue/no-mutating-props
        this.context.model = this.$dayjs(val).format('YYYY-MM-DD')
      }
    },
    model(val) {
      this.dateVal = val
    },
  },
  mounted() {
    if (this.model) {
      this.dateVal = this.model
    } else {
      this.dateVal = this.context.model
    }
  },
}
</script>
