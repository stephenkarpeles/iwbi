<template>
  <!-- This example requires Tailwind CSS v2.0+ -->
  <nav aria-label="Progress" class="w-full">
    <ol role="list" class="flex items-center w-full justify-between">
      <li
        v-for="(el, i) in steps"
        :key="i"
        class="relative flex flex-col w-full"
      >
        <div
          :class="i === steps.length - 1 && 'hidden'"
          class="absolute inset-x-0 top-4 flex items-center"
          aria-hidden="true"
        >
          <div class="h-0.5 w-full bg-primary-600"></div>
        </div>
        <div
          class="
            relative
            w-8
            h-8
            flex
            items-center
            justify-center
            bg-white
            border-2 border-primary-600
            rounded-full
          "
        >
          <!-- Heroicon name: solid/check -->
          <WIconsBase
            v-if="el.value === 'completed'"
            icon="check"
            class="w-5 h-5 text-white"
          />
          <span
            v-else
            :class="`h-2.5 w-2.5 bg-primary-600 rounded-full`"
            aria-hidden="true"
          ></span>
          <span class="sr-only">{{ el.label }}</span>
        </div>
        <span
          class="
            text-sm text-primary-600
            font-semibold
            w-10/12
            h-20
            whitespace-pre-wrap
          "
          >{{ el.label }}</span
        >
      </li>
    </ol>
  </nav>
</template>

<script>
export default {
  props: {
    steps: {
      type: Array,
      required: true,
    },
    theme: {
      type: String,
      required: false,
      default: 'primary',
    },
  },
}
</script>
