<template>
  <div class="w-full">
    <div
      v-if="$config.supportLink"
      class="cursor-pointer bg-yellow-500 mx-auto py-3 px-3 sm:px-6 lg:px-8"
      @click="$router.push('/support')"
    >
      <div class="flex mx-auto">
        <div class="font-medium text-white text-center mx-auto underline">
          {{ $config.supportLink }}
        </div>
      </div>
    </div>
    <WFeedbackAlert ref="alert" />
    <div class="min-h-screen bg-white flex">
      <div
        class="lg:w-1/2 flex-1 flex flex-col justify-center py-12 px-4 sm:px-6 lg:flex-none lg:px-20 xl:px-24"
      >
        <div class="mx-auto w-full max-w-sm lg:w-96">
          <div class="mt-8">
            <div class="mt-6">
              <FormsSignIn
                v-if="$route.params.action === 'login'"
                @form-message="formMessage"
              />
              <FormsRegistration
                v-if="$route.params.action === 'register'"
                @form-message="formMessage"
              />
              <FormsRecovery
                v-if="$route.params.action === 'forgot-password'"
                @form-message="formMessage"
              />
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
          class="z-20 absolute pin-center w-1/2"
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
  head() {
    return {
      title: `${this.pageTitle}`,
    }
  },
  computed: {
    pageTitle() {
      switch (this.$route.params.action) {
        case 'login':
          return 'Login'
        case 'register':
          return 'Register'
        case 'forgot-password':
          return 'Password Recovery'
        default:
          return 'Login'
      }
    },
  },
  methods: {
    formMessage(type, message) {
      this.$refs.alert.showAlert(type, message)
    },
  },
}
</script>
