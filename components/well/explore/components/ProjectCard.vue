<template>
  <div class="bg-white px-4">
    <h1>hello world!</h1>
    <div class="flex bg-white">
      <img
        class="w-full rounded-md"
        :src="projectDetails.imageUrl !== '' ? imageUrl : defaultImg"
        alt=""
      />
    </div>
    <div class="flex flex-col text-primary-900 mt-4 mb-2">
      <span class="font-semibold">{{ projectDetails.space_name }}</span>
      <span class="text-sm opacity-80">{{ projectDetails.address }}</span>
      <span class="text-sm opacity-80">{{ projectDetails.space_type }}</span>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    projectDetails: {
      type: Object,
      required: true,
      default: () => {},
    },
  },
  data() {
    return {
      defaultImg: this.$config.assetsURL + 'explore/building_main.png',
    }
  },
}
</script>
