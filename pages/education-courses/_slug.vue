<template>
  <div>
    <iframe
      v-if="authToken"
      :src="`https://legacy-wellonline.wellcertified.com/api/well-v2/sso/${slug}/${currentUser.external_id}?secret=${encodedToken}`"
      style="min-height: calc(100vh - 85px)"
      class="w-full"
    ></iframe>
  </div>
</template>
<script>
import { mapState } from 'vuex'

export default {
  data() {
    return {
      authToken: null,
      slug: this.$route.params.slug,
    }
  },
  computed: {
    ...mapState({
      currentUser: (state) => state.user.currentUser,
    }),
    encodedToken() {
      if (this.authToken) {
        return encodeURIComponent(this.authToken.replace('/', '~'))
      }
      return ''
    },
  },
  mounted() {
    this.getSsoToken()
  },
  methods: {
    getSsoToken() {
      this.$axios.get(`api/sso/getToken`).then((response) => {
        this.authToken = response.data.token
      })
    },
  },
  head() {
    return {
      title: `Education`,
    }
  },
}
</script>
