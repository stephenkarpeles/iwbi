<template>
  <div>
    <NavBreadcrumbs>
      <WHeadingsHTwo heading="Change Password" />
    </NavBreadcrumbs>
    <div class="text-3xl">
      <WFeedbackAlert ref="alert" />
      <div class="max-w-lg mx-auto mt-8">
        <FormulateForm
          v-model="passwordValues"
          name="form"
          :schema="passwordSchema"
          :form-errors="formErrors"
          @submit="submit"
        >
          <FormulateErrors
            class="my-2 p-2 text-base text-center text-red-500"
          />
        </FormulateForm>
      </div>
    </div>
  </div>
</template>
<script>
import { createNamespacedHelpers } from 'vuex'

const { mapState, mapActions } = createNamespacedHelpers('user')

export default {
  data() {
    return {
      passwordValues: {},
      formErrors: [],
      passwordSchema: [
        {
          type: 'password',
          name: 'current_password',
          label: 'Current password*',
          validation: 'required',
          'validation-name': 'Current Password',
        },
        {
          type: 'password',
          name: 'password',
          label: 'New password*',
          validation: 'required',
        },
        {
          type: 'password',
          name: 'password_confirm',
          label: 'Confirm password*',
          validation: 'required|confirm',
          'validation-name': 'Password confirmation',
        },
        {
          type: 'submit',
          label: 'Change Password',
          class: 'mt-3',
        },
      ],
    }
  },
  computed: {
    ...mapState(['currentUser']),
  },
  methods: {
    ...mapActions(['fetchUser']),
    formMessage(type, message) {
      this.$refs.alert.showAlert(type, message)
    },
    async submit() {
      const postData = {
        old_password: this.passwordValues.current_password,
        password: this.passwordValues.password,
      }

      if (
        this.passwordValues.current_password === this.passwordValues.password
      ) {
        this.formMessage(
          'error',
          'The current password and new password cannot be the same!'
        )
        this.formErrors = [
          'The current password and new password cannot be the same!',
        ]
      } else {
        try {
          await this.$axios.post(
            'api/user/update/' + this.currentUser.id + '/password',
            postData
          )
          this.$formulate.reset('form')
          this.formMessage('success', 'Password Updated!')
        } catch (error) {
          this.error = true
          this.$formulate.handle(error, 'form')
          this.formMessage('error', 'Password failed to update.')
        }
      }
    },
  },
  head() {
    return {
      title: `Change Password`,
    }
  },
}
</script>
