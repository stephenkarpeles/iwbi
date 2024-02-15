<template>
  <div>
    <div v-if="verifying" class="mx-auto mt-5 text-center">
      <WLoadingSpinner class="mx-auto" />
      <div class="mt-3 text-primary-600">Please Wait...</div>
    </div>
    <WLinksBase
      v-if="!verifying"
      type="navPrimary"
      link="/user/login"
      icon="arrow-narrow-left"
    >
      Back to login
    </WLinksBase>
    <div v-if="!verifying">
      <h2 class="mt-6 text-3xl leading-9 font-extrabold text-gray-900">
        Create your account
      </h2>
    </div>

    <FormulateForm
      v-if="!verifying"
      name="registration"
      class="space-y-3"
      @submit="createAccount"
    >
      <FormulateInput
        v-model="formData.first_name"
        type="text"
        label="First Name"
        validation="required"
      />
      <FormulateInput
        v-model="formData.last_name"
        type="text"
        label="Last Name"
        validation="required"
      />
      <FormulateInput
        v-model="formData.email"
        type="email"
        label="Email addresss"
        validation="required"
        :error="error"
        :disabled="$route.query.code && formData.email"
        :input-class="
          $route.query.code && formData.email ? ['input-disabled'] : []
        "
      />
      <FormulateInput
        v-model="formData.company"
        type="companymultisearch"
        name="organization"
        label="Organization*"
        validation="required"
        :searchable="true"
        :clearonselect="false"
        :closeonselect="true"
        :optionslimit="10"
      />
      <FormulateInput type="submit" label="Create Account" />
    </FormulateForm>
    <div v-if="!verifying">
      <div class="mt-6 relative">
        <div class="absolute inset-0 flex items-center">
          <div class="w-full border-t border-gray-300"></div>
        </div>
        <div class="relative flex justify-center text-sm leading-5">
          <span class="px-2 bg-white text-gray-500"> OR </span>
        </div>
      </div>
      <div>
        <p class="text-sm leading-5 font-medium text-gray-700 text-center">
          Sign up with
        </p>

        <div class="mt-1 grid grid-cols-3 gap-3">
          <div>
            <span
              class="w-full inline-flex rounded-md shadow-sm"
              @click="$auth.loginWith('facebook')"
            >
              <WButtonsBase type="primaryInverted" icon="facebook" />
            </span>
          </div>

          <div>
            <span
              class="w-full inline-flex rounded-md shadow-sm"
              @click="$auth.loginWith('google')"
            >
              <WButtonsBase type="primaryInverted" icon="google" />
            </span>
          </div>
          <div>
            <span class="w-full inline-flex rounded-md shadow-sm">
              <WButtonsBase type="primaryInverted" icon="linkedin" />
            </span>
          </div>
        </div>
      </div>
    </div>
    <WFeedbackModal ref="modal" class="z-50">
      <div class="max-w-xl space-y-2 px-4">
        <WHeadingsHThree
          heading="Congratulations! Your WELL account is ready."
        />
        <p>
          We just sent an email to the email address you provided to confirm
          your identity. After receiving the email, follow the link provided in
          the email to complete your registration.
        </p>
        <p class="small">
          Please note that the one-time link sent in the email will expire in 24
          hours.
        </p>
        <div class="flex w-full">
          <div class="mx-auto w-32">
            <WButtonsBase @click.native="$refs.modal.isHidden = true"
              >Close</WButtonsBase
            >
          </div>
        </div>
      </div>
    </WFeedbackModal>
  </div>
</template>
<script>
export default {
  data() {
    return {
      formData: {},
      error: false,
      verifying: false,
    }
  },
  created() {
    if (this.$route.query.code) {
      this.verifying = true
    }
  },
  async mounted() {
    if (this.$route.query.code) {
      this.formData.code = this.$route.query.code

      try {
        await this.$axios
          .get('api/invite/check/' + this.$route.query.code)
          .then((res) => {
            this.formData.email = res.data.email
          })
      } catch (error) {
        this.$emit('form-message', 'error', 'Invalid invite code.')
        this.$router.push('/user/register')
      } finally {
        this.verifying = false
      }
    }
  },
  methods: {
    async createAccount() {
      this.formData.company_id = this.formData.company.id
      this.formData.organization = this.formData.company.name
      try {
        await this.$axios
          .post('api/register', this.formData)
          .then((res) =>
            this.$emit(
              'form-message',
              'success',
              'Account created! An email will be sent to you shortly.'
            )
          )
        this.$formulate.reset('registration')
        this.$refs.modal.isHidden = false
      } catch (error) {
        this.error = true
        if (error.response.data.errors.email) {
          this.$emit(
            'form-message',
            'error',
            error.response.data.errors.email[0]
          )
        } else {
          this.$emit('form-message', 'error', error.response.data.message)
        }
      }
    },
  },
}
</script>
<style>
.input-disabled {
  background-color: #f3f5f7;
}
</style>
