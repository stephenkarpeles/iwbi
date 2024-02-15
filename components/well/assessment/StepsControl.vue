<template>
  <section>
    <div class="pt-4 pb-8">
      <div
        class="
          flex
          justify-between
          items-center
          mx-auto
          text-primary-900
          leading-21
        "
      >
        <div
          v-if="canClickBack"
          class="
            cursor-pointer
            flex
            items-center
            md:hover:text-primary-500
            transition-colors
            duration-300
          "
          @click="$emit('back')"
        >
          <img class="mr-2.5" src="/assessment/arrow-left.svg" alt="back" />
          <span class="hidden text-sm md:inline">Back</span>
        </div>
        <div
          v-else
          class="
            cursor-pointer
            flex
            items-center
            md:hover:text-primary-500
            transition-colors
            duration-300
          "
        ></div>
        <div
          v-if="!hideNext"
          class="
            cursor-pointer
            flex
            items-center
            justify-between
            md:hover:text-primary-500
            transition-colors
            duration-300
          "
          @click="$emit('next')"
        >
          <img
            class="transform rotate-180 mr-2"
            src="/assessment/arrow-left.svg"
            alt="next"
          />
          <span v-if="next" class="hidden text-sm md:inline">Next</span>
          <span v-else class="hidden text-sm md:inline">Next section</span>
        </div>
        <div
          v-else
          class="
            cursor-pointer
            flex
            items-center
            md:hover:text-primary-500
            transition-colors
            duration-300
          "
        ></div>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  props: {
    canClickBack: {
      type: Boolean,
      default: true,
    },
    next: {
      type: Boolean,
      default: true,
    },
    hideNext: {
      type: Boolean,
      default: false,
    },
  },
}
</script>
