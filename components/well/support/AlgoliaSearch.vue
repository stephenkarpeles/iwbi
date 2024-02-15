<template>
  <div>
    <div class="flex space-x-2">
      <FormulateInput v-model="search" type="text" />
      <FormulateInput
        type="submit"
        label="Search"
        @click.native="fetchResults()"
      />
      <div v-if="results !== null" class="w-15">
        <WButtonsBase
          type="primaryInverted"
          icon="refresh"
          @click.native=";(results = null), (search = '')"
        />
      </div>
    </div>
    <div
      v-if="results && results.hits && results.hits.length > 0"
      class="border border-primary-500 rounded-lg"
    >
      <div
        v-for="(hit, index) in results.hits"
        :key="index"
        :class="[
          index % 2 === 0 && 'bg-primary-50',
          index === 0 && 'rounded-t-lg',
          index === results.hits.length - 1 && 'rounded-b-lg',
          'py-3 px-6 hover:bg-primary-100 transition-colors duration-200 text-sm',
        ]"
      >
        <WLinksBase target="_blank" :link="hit.url">
          <div class="w-full">
            <div>
              {{ hit.title }}
            </div>
            <div class="text-gray-500 italic">
              {{ hit.body.caption }}
            </div>
          </div>
        </WLinksBase>
      </div>
    </div>
    <div
      v-else-if="results"
      class="rounded-md bg-yellow-50 p-4 mb-5 rounded-lg border border-yellow-300 w-full"
    >
      <div class="flex">
        <div class="flex-shrink-0">
          <svg
            class="mt-3 h-5 w-5 text-yellow-400"
            x-description="Heroicon name: exclamation"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fill-rule="evenodd"
              d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
              clip-rule="evenodd"
            ></path>
          </svg>
        </div>
        <div class="ml-3">
          <div class="mt-2 text-sm leading-5 text-yellow-700">
            <p>
              No articles can be found. Please try searching something else.
            </p>
          </div>
        </div>
      </div>
    </div>
    <div
      v-else
      class="rounded-md bg-primary-50 p-4 mb-5 rounded-lg border border-primary-300 w-full"
    >
      <div class="flex">
        <div class="ml-3">
          <div class="mt-2 text-sm leading-5 text-primary-700">
            <p>Use the above search bar to look up helpful articles.</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      testData: null,
      results: null,
      search: '',
    }
  },
  methods: {
    async fetchResults() {
      const index = this.$algolia.initIndex('storyblok')
      this.results = await index.search(this.search + '&page=4')
    },
  },
}
</script>
