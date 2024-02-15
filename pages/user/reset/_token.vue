<template>
  <div class="w-full">
    <WFeedbackAlert ref="alert" />
    <div class="min-h-screen bg-white flex">
      <div
        class="lg:w-1/2 flex-1 flex flex-col justify-center py-12 px-4 sm:px-6 lg:flex-none lg:px-20 xl:px-24"
      >
        <div class="mx-auto w-full max-w-sm lg:w-96">
          <div class="mt-8">
            <div class="mt-6">
              <FormsReset @form-message="formMessage" />
            </div>
          </div>
        </div>
      </div>
      <div class="hidden lg:block relative w-0 flex-1">
        <img
          class="absolute inset-0 h-full w-full object-cover"
          src="/login/banner.jpg"
          alt=""
        />
        <img
          class="z-40 absolute pin-center w-1/2"
          src="/logo/light.svg"
          alt=""
        />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  auth: false,
  layout: 'blank',
  methods: {
    formMessage(type, message) {
      this.$refs.alert.showAlert(type, message)
    },
  },
  head() {
    return {
      title: `Password Reset`,
    }
  },
}
</script>
