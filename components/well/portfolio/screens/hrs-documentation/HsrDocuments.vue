<template>
  <!-- Parent div -->
  <div>
    <!-- Header -->
    <div class="flex justify-around">
      <div>
        <WHeadingsHTwo
          heading="HSR Documentation"
          class="mt-7 text-primary-900"
        />
        <span class="text-primary-900 opacity-60"
          >Information that should be added to the General Documents tab to
          provide GBCI an overview of the project location(s) are:
          Representative floor plans or project maps. Narrative describing the
          project(s) in general. Proof of construction completion. This may be
          through a certificate of occupancy or other documentation that
          similarly confirms that construction is complete.</span
        >
      </div>
      <div class="w-42 mt-5">
        <WButtonsDropdown>
          <WButtonsBase
            v-if="currentUser.role.includes('well-admin')"
            icon="chevron-down"
            type="primaryInverted"
            >Download</WButtonsBase
          >
          <template #customButtons>
            <WButtonsBase
              v-if="portfolio.hsr_opt"
              type="neutral"
              @click.native="
                $store
                  .dispatch('portfolio/downloadAllDocuments', {
                    include: 'hsr',
                  })
                  .then((response) => {
                    $store.dispatch('notifications/toastMessage', {
                      message:
                        'We will notify you by email once we are ready with your file.',
                    })
                  })
              "
            >
              Health-safety documents
            </WButtonsBase>
            <WButtonsBase
              type="neutral"
              @click.native="
                $store
                  .dispatch('portfolio/downloadAllDocuments', {
                    include: 'portfolio',
                  })
                  .then((response) => {
                    $store.dispatch('notifications/toastMessage', {
                      message:
                        'We will notify you by email once we are ready with your file.',
                    })
                  })
              "
            >
              Portfolio documents
            </WButtonsBase>
            <WButtonsBase
              v-if="portfolio.hsr_opt"
              type="neutral"
              @click.native="
                $store
                  .dispatch('portfolio/downloadAllDocuments', {
                    include: 'all',
                  })
                  .then((response) => {
                    $store.dispatch('notifications/toastMessage', {
                      message:
                        'We will notify you by email once we are ready with your file.',
                    })
                  })
              "
            >
              All documents</WButtonsBase
            >
          </template>
        </WButtonsDropdown>
      </div>
    </div>
    <WTabsHorizontal
      v-model="currentTab"
      class="w-full -mb-px"
      :tabs="[
        { name: 'Library', icon: 'support' },
        { name: 'Audit', icon: 'pencil-alt' },
      ]"
    />
    <div :class="{ hidden: currentTab !== 'Library' }">
      <PortfolioLibraryScreen />
    </div>
    <div :class="{ hidden: currentTab !== 'Audit' }">
      <PortfolioAuditScreen />
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  data() {
    return {
      currentTab: 'Library',
    }
  },
  computed: {
    ...mapState({
      portfolio: (state) => state.portfolio.portfolio,
      currentUser: (state) => state.user.currentUser,
    }),
  },

  methods: {
    async getScorcard() {
      if (this.currentTab === 'Library' || this.currentTab === 'Audit') {
        const type =
          this.currentTab === 'Library'
            ? ['Guideline', 'Portfolio-Scale']
            : ['Individual-Scale', 'Audit-Document']
        if (this.portfolio && this.portfolio.hsr_scorecard_id !== null) {
          await this.$store.dispatch('portfolio/getScorecardDocuments', {
            scorecardId: this.portfolio.hsr_scorecard_id,
            page: this.portfolioScorecardPage,
            filterShared: this.filterScorecardList,
            type,
          })
        }
      }
    },
  },
}
</script>
