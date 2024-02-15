<template>
  <div class="flex w-64">
    <div
      class="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10"
    >
      <WIconsBase class="h-6 w-6 text-red-600" icon="exclamation" />
    </div>
    <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
      <h3 id="modal-title" class="text-lg leading-6 font-medium text-gray-900">
        {{ header }}
      </h3>
      <div class="mt-2">
        <p class="text-sm text-gray-500">Are you sure?</p>
      </div>
      <div class="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
        <button
          type="button"
          class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
          @click="deleteSelected()"
        >
          Yes
        </button>
        <button
          type="button"
          class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:mt-0 sm:w-auto sm:text-sm"
          @click="$parent.isHidden = true"
        >
          No
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  props: {
    part: {
      type: Object,
      required: false,
    },
    selected: {
      type: Object,
      required: true,
    },
    header: {
      type: String,
      required: false,
      default: '',
    },
  },
  computed: {
    ...mapState({
      scorecard: (state) => state.scorecard.scorecard,
    }),
  },
  methods: {
    async deleteSelected() {
      await this.deleteDocument(this.selected.id)
    },
    async deleteDocument(id) {
      try {
        if (Object.keys(this.selected).includes('documentable_sub_type')) {
          await this.$store.dispatch('portfolio/deleteDocument', this.selected)
        } else {
          await this.$axios.delete(
            `api/scorecard/${this.scorecard.id}/document/${id}`
          )
        }

        this.$store.dispatch('notifications/toastMessage', {
          message: 'Document deleted successfully!',
        })
        this.$parent.isHidden = true
        await this.$parent.$parent.getDocuments()
      } catch (error) {
        this.$store.dispatch('notifications/toastMessage', {
          message: error,
        })
      }
    },
  },
}
</script>
