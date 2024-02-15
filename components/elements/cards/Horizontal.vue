<template>
  <div>
    <div class="rounded-md border border-primary-300">
      <div
        class="
          bg-gray-50
          flex
          justify-between
          px-6
          py-4
          border-b border-primary-600
          rounded-t-md
        "
      >
        <!-- header -->
        <slot name="header"></slot>
        <slot name="action"></slot>
      </div>
      <div class="flex flex-col px-8 py-3">
        <!-- body -->
        <div
          v-if="cardData && cardData.warning"
          class="
            bg-primary-100
            px-4
            py-2
            border-l-2 border-primary-600
            flex
            items-center
            space-x-1
            text-sm
            w-full
          "
        >
          <div>
            <WIconsBase class="text-primary-500 w-4 h-4" icon="exclamation" />
          </div>
          <span class="text-primary-700"
            ><span class="font-semibold">Certification note: </span>
            {{ cardData.warning }}
          </span>
        </div>
        <div
          ref="bodyBox"
          :class="`${
            expand ? '' : isExpandable ? 'h-44' : ''
          }  transition-all duration-300 overflow-hidden`"
        >
          <slot name="body"></slot>
        </div>
        <button
          v-if="isExpandable && isOverflown"
          class="flex items-center text-primary-700"
          @click="expand = !expand"
        >
          <WIconsBase :icon="expand ? 'arrow-sm-up' : 'arrow-sm-down'" />
          <span class="underline font-semibold">{{
            expand ? 'Collapse' : 'Expand'
          }}</span>
        </button>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    cardData: {
      type: Object,
      default: null,
    },
    isExpandable: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      expand: false,
      isOverflown: false,
    }
  },
  mounted() {
    if (this.$refs.bodyBox) {
      this.isOverflown =
        this.$refs.bodyBox.scrollHeight > this.$refs.bodyBox.clientHeight ||
        this.$refs.bodyBox.scrollWidth > this.$refs.bodyBox.clientWidth
    }
  },
}
</script>
