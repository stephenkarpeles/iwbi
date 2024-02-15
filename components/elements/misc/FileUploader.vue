<template>
  <div>
    <div
      v-if="!document"
      class="
        flex
        justify-center
        px-6
        pt-5
        pb-6
        border-2 border-gray-300 border-dashed
        rounded-md
      "
    >
      <div class="text-center w-full">
        <div class="mt-1 text-sm text-gray-600">
          <div class="overflow-hidden relative w-full mt-4 mb-4">
            <div class="text-center w-full">
              <WIconsBase
                icon="upload-doc"
                class="h-12 w-12 text-gray-400 inline-flex"
              />

              <div class="mt-1 text-sm text-gray-600">
                <div
                  class="
                    font-medium
                    text-primary-600
                    hover:text-primary-500
                    focus:outline-none focus:underline
                    transition
                    duration-150
                    ease-in-out
                  "
                >
                  Upload a file
                </div>
                or drag and drop
              </div>
              <p class="mt-1 text-xs text-gray-500"></p>
            </div>
            <input
              type="file"
              accept=""
              class="
                cursor-pointer
                absolute
                block
                py-2
                px-4
                w-full
                h-full
                opacity-0
                top-0
              "
              @change="handleFileChange($event)"
            />
          </div>
        </div>
      </div>
    </div>
    <div v-else>
      <ul>
        <li
          class="
            bg-gray-100
            max-w-md
            mx-auto
            px-4
            py-3
            rounded-md
            shadow-md
            my-4
            relative
          "
        >
          <span>
            {{ document.name }}
          </span>
          <button
            class="right-0 absolute mr-3 text-danger-500"
            type="button"
            @click="document = null"
          >
            remove
          </button>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      document: null,
    }
  },
  watch: {
    document() {
      this.$emit('input', this.document)
    },
  },
  methods: {
    handleFileChange(event) {
      this.document = event.target.files[0]
    },
  },
}
</script>
