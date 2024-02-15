<template>
  <div class="w-full">
    <PortfolioRegister />
  </div>
</template>
<script>
import { mapState } from 'vuex'
export default {
  layout: 'sidebar', // sidebar layout
  head() {
    return {
      title: `Portfolio #${this.$route.params.id} Registration`,
    }
  },
  // get portfolio by id
  computed: {
    ...mapState({
      portfolio: (state) => state.portfolio.portfolio,
    }),
  },
  async mounted() {
    if (this.$route.query.tab) {
      this.$store.commit('settings/setSidebarTab', this.$route.query.tab)
    } else {
      this.$store.commit('settings/setSidebarTab', 'Register')
    }
    await this.$store.dispatch('portfolio/getPortfolio', {
      id: this.$route.params.id,
    })
  },
}
</script>
