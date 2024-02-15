<template>
  <div
    :class="`${expand ? 'h-full -bottom-8' : 'bottom-16 h-20'}`"
    class="absolute z-10 w-full bg-white rounded-t-2xl"
  >
    <div class="flex flex-col">
      <button
        class="rounded-full bg-primary-200 w-14 h-2 mx-auto my-4"
        @click="setExpand()"
      ></button>
      <slot name="content" />
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      projects: 10,
      expand: false,
    }
  },
  computed: {},
  methods: {
    setExpand() {
      this.expand = !this.expand
    },
  },
}
</script>
