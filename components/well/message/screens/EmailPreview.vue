<template>
  <div
    class="max-w-7xl top-25 rounded left-15 shadow-lg bg-white text-black p-4"
    style="width: 70vw"
  >
    <div class="flex justify-between bg-primary-800 text-white">
      <div class="p-4">
        <p class="text-xl font-bold">{{ message.subject }}</p>
        <p class="text-sm font-light">Preview Email</p>
      </div>
      <div class="p-4">
        <WButtonsBase
          icon="x-circle"
          type="blank"
          @click.native="$parent.$parent.$refs.modal.isHidden = true"
        />
      </div>
    </div>
    <div class="bg-gray-100 p-8 border border-secondary-500 mt-5 shadow">
      <div class="flex">
        <div class="ml-auto text-primary-700">
          <div class="font-bold text-3xl">WELL</div>
          <div class="font-bold">
            The International WELL
            <br />
            Building Institute
          </div>
          <div>220 Fifth Avenue, 8th</div>
          <div>Floor New York, NY 10001</div>
          <div>WELLCertified.com</div>
        </div>
      </div>
      <!-- eslint-disable-next-line vue/no-v-html -->
      <div class="max-w-5xl" v-html="message.content"></div>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    message: {
      type: Object,
      required: true,
    },
  },
}
</script>
