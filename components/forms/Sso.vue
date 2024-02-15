<template>
  <div>
    <div v-if="hasToken" class="text-center">Please Wait...</div>
    <FormsSignIn v-else @form-message="formMessage" />
  </div>
</template>

<script>
import { mapActions } from 'vuex'

export default {
  data() {
    return {
      hasToken: false,
    }
  },
  created() {
    if (this.$store.state.auth.loggedIn) {
      this.hasToken = true
    }
  },
  mounted() {
    if (this.$route.path === '/user/sso/' + this.$route.params.subscriber) {
      this.$cookies.set('sso.subscriber', this.$route.fullPath)
    }
    if (!this.$route.params.subscriber || !this.$route.query.return_to) {
      this.$router.replace('/user/login')
    } else if (this.hasToken) {
      this.$cookies.remove('sso.subscriber')
      const payload = {
        route: this.$route,
      }
      this.getJwtSsoToken(payload).then((res) => {
        window.location.href = res
      })
    }
  },
  methods: {
    ...mapActions('authentication', ['getJwtSsoToken']),
    formMessage(type, message) {
      this.$parent.$refs.alert.showAlert(type, message)
    },
  },
}
</script>
