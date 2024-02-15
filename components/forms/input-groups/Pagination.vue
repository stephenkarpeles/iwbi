<template>
  <div
    class="bg-white md:px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6"
  >
    <div class="flex-1 flex justify-between sm:hidden space-x-2 items-center">
      <a
        href="#"
        class="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm leading-5 font-medium rounded-md text-gray-700 bg-white hover:text-gray-500 focus:outline-none focus:shadow-outline-blue focus:border-blue-300 active:bg-gray-100 active:text-gray-700 transition ease-in-out duration-150"
        @click.prevent="change(pagination.current_page - 1)"
      >
        Previous
      </a>
      <div v-if="!simplify" class="text-center">
        <span class="text-sm leading-5 text-gray-700">
          Showing
          <span class="font-medium">{{ pagination.from }}</span>
          to
          <span class="font-medium">{{ pagination.to }}</span>
          of
          <span class="font-medium">{{ pagination.total }}</span>
          results
        </span>
      </div>
      <a
        href="#"
        class="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm leading-5 font-medium rounded-md text-gray-700 bg-white hover:text-gray-500 focus:outline-none focus:shadow-outline-blue focus:border-blue-300 active:bg-gray-100 active:text-gray-700 transition ease-in-out duration-150"
        @click.prevent="change(pagination.current_page + 1)"
      >
        Next
      </a>
    </div>
    <div class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
      <div v-if="!simplify">
        <span class="text-sm leading-5 text-gray-700">
          Showing
          <span class="font-medium">{{ pagination.from }}</span>
          to
          <span class="font-medium">{{ pagination.to }}</span>
          of
          <span class="font-medium">{{ pagination.total }}</span>
          results
        </span>
      </div>

      <nav class="relative z-0 inline-flex">
        <div class="h-full flex mr-3">
          <div v-if="simplify" class="mt-2 text-sm text-gray-600">
            Page {{ pagination.current_page }} of
            {{ Math.ceil(pagination.total / pagination.per_page) }}
          </div>
        </div>
        <a
          v-if="showMax"
          href="#"
          :class="[
            pagination.current_page === 1
              ? 'cursor-not-allowed'
              : 'cursor-pointer',
            'relative inline-flex items-center px-2 py-2 rounded-l-md border border-r-0 border-gray-300 bg-white text-sm leading-5 font-medium text-gray-500 hover:text-gray-400 focus:z-10 focus:outline-none focus:border-blue-300 focus:shadow-outline-blue active:bg-gray-100 active:text-gray-500 transition ease-in-out duration-150',
          ]"
          aria-label="Previous"
          :disabled="pagination.current_page === 1"
          @click.prevent="pagination.current_page !== 1 && change(1)"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M11 19l-7-7 7-7m8 14l-7-7 7-7"
            />
          </svg>
        </a>
        <a
          href="#"
          :class="[
            pagination.current_page === 1
              ? 'cursor-not-allowed'
              : 'cursor-pointer',
            !showMax && 'rounded-l-md',
            'relative inline-flex items-center px-2 py-2  border border-gray-300 bg-white text-sm leading-5 font-medium text-gray-500 hover:text-gray-400 focus:z-10 focus:outline-none focus:border-blue-300 focus:shadow-outline-blue active:bg-gray-100 active:text-gray-500 transition ease-in-out duration-150',
          ]"
          aria-label="Previous"
          :disabled="pagination.current_page === 1"
          @click.prevent="
            pagination.current_page !== 1 && change(pagination.current_page - 1)
          "
        >
          <!-- Heroicon name: chevron-left -->
          <svg class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path
              fill-rule="evenodd"
              d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
              clip-rule="evenodd"
            />
          </svg>
        </a>
        <div v-if="!simplify">
          <a
            v-for="page in pages"
            :key="page"
            href="#"
            :class="[
              page === pagination.current_page
                ? 'text-primary-600 hover:text-primary-800 active:text-primary-800 font-bold'
                : 'text-gray-700 hover:text-gray-500 active:text-gray-700 font-medium',
              '-ml-px relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm leading-5 focus:z-10 focus:outline-none focus:border-blue-300 focus:shadow-outline-blue active:bg-gray-100 transition ease-in-out duration-150',
            ]"
            @click.stop="change(page)"
          >
            {{ page }}
          </a>
        </div>
        <a
          href="#"
          :class="[
            pagination.current_page === pagination.last_page
              ? 'cursor-not-allowed'
              : 'cursor-pointer',
            !showMax && 'rounded-r-md',
            '-ml-px relative inline-flex items-center px-2 py-2 color- border border-gray-300 bg-white text-sm leading-5 font-medium text-gray-500 hover:text-gray-400 focus:z-10 focus:outline-none focus:border-blue-300 focus:shadow-outline-blue active:bg-gray-100 active:text-gray-500 transition ease-in-out duration-150',
          ]"
          aria-label="Next"
          :disabled="
            pagination.current_page === pagination.last_page ? true : false
          "
          @click.prevent="
            pagination.current_page !== pagination.last_page &&
            pagination.current_page !== pagination.to
              ? change(pagination.current_page + 1)
              : null
          "
        >
          <!-- Heroicon name: chevron-right -->
          <svg class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path
              fill-rule="evenodd"
              d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
              clip-rule="evenodd"
            />
          </svg>
        </a>
        <a
          v-if="showMax"
          href="#"
          :class="[
            pagination.current_page === pagination.last_page
              ? 'cursor-not-allowed'
              : 'cursor-pointer',
            '-ml-px relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm leading-5 font-medium text-gray-500 hover:text-gray-400 focus:z-10 focus:outline-none focus:border-blue-300 focus:shadow-outline-blue active:bg-gray-100 active:text-gray-500 transition ease-in-out duration-150',
          ]"
          aria-label="Next"
          :disabled="
            pagination.current_page === pagination.last_page ? true : false
          "
          @click.prevent="
            pagination.current_page !== pagination.last_page &&
            pagination.current_page !== pagination.to
              ? change(pagination.last_page)
              : null
          "
        >
          <!-- Heroicon name: chevron-right -->
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M13 5l7 7-7 7M5 5l7 7-7 7"
            />
          </svg>
        </a>
      </nav>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    pagination: {
      type: Object,
      required: true,
    },
    offset: {
      type: Number,
      default: 3,
    },
    simplify: {
      type: Boolean,
      default: false,
    },
    showMax: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    pages() {
      if (!this.pagination.to) {
        return null
      }
      let from = this.pagination.current_page - this.offset
      if (from < 1) {
        from = 1
      }
      let to = from + this.offset * 2
      if (to >= this.pagination.last_page) {
        to = this.pagination.last_page
      }
      const pages = []
      for (let page = from; page <= to; page++) {
        pages.push(page)
      }
      return pages
    },
  },
  methods: {
    change(page) {
      // eslint-disable-next-line vue/no-mutating-props
      this.pagination.current_page = page
      this.$emit('paginate')
    },
  },
}
</script>
