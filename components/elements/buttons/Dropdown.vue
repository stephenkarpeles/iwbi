<template>
  <div class="relative">
    <button
      type="button"
      class="
        w-44
        relative
        bg-white
        border border-gray-300
        rounded-md
        shadow-sm
        pl-3
        pr-10
        py-2
        text-left
        cursor-default
        focus:outline-none
        focus:ring-1
        focus:ring-primary-500
        focus:border-primary-500
        sm:text-sm
      "
      aria-haspopup="listbox"
      aria-expanded="true"
      aria-labelledby="listbox-label"
      @click="showOptions = !showOptions"
    >
      <div class="flex items-center">
        <span
          v-if="selectedOption && selectedOption.color"
          :class="`${selectedOption.color} flex-shrink-0 inline-block h-2 w-2 rounded-full`"
          aria-hidden="true"
        ></span>
        <span
          v-if="selectedOption"
          class="ml-3 block truncate text-primary-800"
        >
          {{ selectedOption.label }}
        </span>
        <span v-else class="ml-3 block truncate text-primary-800">
          Choose option
        </span>
      </div>
      <span
        class="
          absolute
          inset-y-0
          right-0
          flex
          items-center
          pr-2
          pointer-events-none
        "
      >
        <WIconsBase class="h-5 w-5 text-primary-400" icon="selector" />
      </span>
    </button>
    <ul
      :class="`
        absolute
        z-10
        mt-1
        w-full
        bg-white
        shadow-lg
        max-h-60
        rounded-md
        py-1
        text-base
        ring-1 ring-black ring-opacity-5
        overflow-auto
        focus:outline-none
        sm:text-sm
        transition ease-in duration-100
        ${showOptions ? 'opacity-100' : 'opacity-0 hidden'}
      `"
      tabindex="-1"
      role="listbox"
      aria-labelledby="listbox-label"
      aria-activedescendant="listbox-option-3"
    >
      <li
        v-for="(option, index) in options"
        id="listbox-option-0"
        :key="index"
        class="
          text-primary-700
          cursor-default
          select-none
          relative
          py-2
          pl-3
          pr-9
          hover:text-white hover:bg-primary-600
        "
        role="option"
        @click=";(selectedOption = option), (showOptions = false)"
      >
        <div class="flex items-center">
          <span
            :class="`${option.color} flex-shrink-0 inline-block h-2 w-2 rounded-full`"
            aria-hidden="true"
          ></span>
          <span class="font-normal ml-3 block truncate">
            {{ option.label }}
          </span>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  props: {
    options: {
      type: Array,
      required: true,
    },
    value: {
      type: String,
      required: true,
      default: '',
    },
  },
  data() {
    return {
      showOptions: false,
      selectedOption: null,
    }
  },

  watch: {
    selectedOption: {
      deep: true,
      handler(newVal, oldVal) {
        if (newVal !== oldVal) {
          if (newVal?.value) this.$emit('input', newVal.value)
        }
      },
    },
  },

  created() {
    this.selectedOption = this.options.find(
      (option) => option.value === this.value
    )
  },
}
</script>
