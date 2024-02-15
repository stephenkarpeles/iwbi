<template>
  <div
    class="w-8 p-1 rounded-full my-auto"
    @mouseover="hover = true"
    @mouseleave="hover = false"
  >
    <div v-if="!hover">
      <div v-if="type === 'comments'">
        <svg
          v-if="part.note_count > 0"
          class="w-full mr-2 text-primary-500"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"
          />
        </svg>
      </div>
      <div v-if="type === 'documents'">
        <svg
          v-if="documentCount > 0"
          class="w-full mr-2 text-primary-500"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"
          />
        </svg>
      </div>
    </div>
    <div v-else class="">
      <div
        v-if="type === 'comments' && part.note_count > 0"
        class="my-auto mx-auto text-center bg-primary-500 text-white rounded-full"
      >
        {{ part.note_count }}
      </div>
      <div
        v-if="type === 'documents' && documentCount"
        class="my-auto mx-auto text-center bg-primary-500 text-white rounded-full"
      >
        {{ documentCount }}
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    part: {
      type: Object,
      required: true,
    },
    type: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      hover: false,
    }
  },
  computed: {
    documentCount() {
      return this.part.all_document_count
    },
  },
}
</script>
