<template>
  <div class="w-full flex space-x-4">
    <div class="w-3/12">
      <WHeadingsHThree
        v-if="portfolio"
        heading="Edit Portfolio"
        :sub-heading="portfolio.name"
      />
      <WButtonsBase
        type="primary"
        @click.native="() => (currentTab = 'Portfolio Information')"
        >Portfolio Information</WButtonsBase
      >
      <WButtonsBase
        v-if="currentUser.role.includes('well-admin')"
        class="mt-2"
        type="primaryInverted"
        @click.native="() => (currentTab = 'Admin Fields')"
        >Admin Fields</WButtonsBase
      >
    </div>
    <div class="w-9/12">
      <div v-if="currentTab === 'Portfolio Information'" class="mt-2">
        <WHeadingsHTwo heading="Portfolio Information" />
        <PortfolioEditScreen v-if="portfolio" />
      </div>
      <div v-if="currentTab === 'Admin Fields'" class="mt-2">
        <WHeadingsHTwo heading="Admin Fields" />
        <PortfolioAdminEditScreen v-if="portfolio" />
      </div>
    </div>
  </div>
</template>
<script>
import { mapState } from 'vuex'
export default {
  layout: 'sidebar', // sidebar layout
  data() {
    return {
      currentTab: 'Portfolio Information',
    }
  },
  // get portfolio by id
  head() {
    return {
      title: `Portfolio Edit`,
    }
  },
  computed: {
    ...mapState({
      portfolio: (state) => state.portfolio.portfolio,
      currentUser: (state) => state.user.currentUser,
    }),
  },
  async mounted() {
    if (this.$route.query.tab) {
      this.$store.commit('settings/setSidebarTab', this.$route.query.tab)
    } else {
      this.$store.commit('settings/setSidebarTab', 'Edit')
    }
    await this.$store.dispatch('portfolio/getPortfolio', {
      id: this.$route.params.id,
    })
  },
}
</script>
