<template>
  <div v-if="!loading">
    <WFeedbackModal ref="addLocationTeamModal" class="z-50">
      <div class="max-w-xl space-y-2 px-4">
        <WHeadingsHThree
          class="text-primary-900"
          heading="Add new locations."
        />
        <p class="text-primary-900">
          Please download and complete this bulk upload spreadsheet and send to
          your coaching contact once complete.
        </p>
        <WButtonsDropdown>
          <label
            class="text-md font-bold leading-5 text-secondary-800 sm:mt-px sm:pt-2"
          >
            Download bulk upload spreadsheet
          </label>
          <div
            class="rounded-lg mt-2 flex justify-between text-primary-700 border border-primary-300 px-4 py-2 cursor-pointer hover:bg-primary-200"
          >
            <div class="flex items-center space-x-4">
              <div class="rounded-md bg-primary-600 p-3">
                <WIconsBase icon="document-report" class="text-white" />
              </div>
              <span class="text-primary-900 opacity-50"
                >WELL_Bulk_Upload.xlsm</span
              >
            </div>
            <WIconsBase icon="download" />
          </div>
          <template #customButtons>
            <WButtonsBase
              class="leading-3"
              type="neutral"
              @click.native.prevent.stop="downloadTemplate('sqft')"
            >
              Imperial (ft<sup>2</sup>)
            </WButtonsBase>
            <WButtonsBase
              class="leading-3"
              type="neutral"
              @click.native.prevent.stop="downloadTemplate('sqm')"
            >
              Metric (m<sup>2</sup>)
            </WButtonsBase>
          </template>
        </WButtonsDropdown>
      </div>
    </WFeedbackModal>
    <WSlideoversOverlay
      ref="location"
      :title="title"
      :caption="caption"
      class="z-40"
    >
      <template #content>
        <div class="flex px-6">
          <PortfolioPropertiesAdd
            v-if="slideOverMode === 'location'"
            :project-id="selectedLocation ? selectedLocation.id : null"
          />
          <PortfolioCreateSubset v-if="slideOverMode === 'subset'" />

          <PortfolioBulkLocationUpload v-if="slideOverMode === 'upload'" />
          <PortfolioPropertiesFilter v-if="slideOverMode === 'filters'" />
        </div>
      </template>
    </WSlideoversOverlay>
    <div class="grid grid-cols-6 gap-6">
      <div class="col-span-3">
        <WHeadingsHTwo class="text-primary-900" heading="Locations" />
      </div>
    </div>
    <p class="text-gray-700 text-sm mt-2 max-w-3xl mb-3">
      A member’s defined portfolio should accurately reflect the portfolio’s
      population of locations, adding and subtracting any projects that join or
      leave your defined portfolio at least once per year. Annual subscription
      fees are assessed annually based on the current size of the defined
      portfolio in the list below.
    </p>
    <div>
      <WTabsHorizontal
        v-model="currentTab"
        class="w-full -mb-px"
        :tabs="[{ name: 'Overview' }, { name: 'Subset' }]"
      />
      <div class="flex justify-end my-3">
        <div class="flex space-x-2">
          <div
            v-if="!pendingReview || currentUser.role.includes('well-admin')"
            class="w-32"
          >
            <WButtonsDropdown>
              <WButtonsBase icon="plus">Add New</WButtonsBase>

              <template #customButtons>
                <WButtonsBase type="neutral" @click.native="addLocationCheck()">
                  Add Location
                </WButtonsBase>
                <WButtonsBase
                  type="neutral"
                  @click.native="showOverlay('subset')"
                >
                  Create subset
                </WButtonsBase>
              </template>
            </WButtonsDropdown>
          </div>
          <div
            v-if="
              !pendingReview ||
              currentUser.role.includes('well-admin') ||
              currentUser.role.includes('project-coach')
            "
            class="w-32"
          >
            <WButtonsBase
              @click.native="
                $router.push(
                  `/portfolio/${portfolio.portfolio_number}/properties-import`
                )
              "
            >
              Import
            </WButtonsBase>
          </div>
          <div>
            <Flyout triangle="bottom" y="bottom" x="right" class="h-full">
              <WButtonsBase
                icon="download"
                type="primaryInverted"
                @click.native="exportProjects"
              />
              <template #content>
                <div class="text-sm w-48 text-center p-2 text-primary-600">
                  Download locations
                </div>
              </template>
            </Flyout>
          </div>
          <div>
            <Flyout triangle="bottom" y="bottom" x="right" class="h-full">
              <WButtonsBase
                icon="filter"
                type="primaryInverted"
                @click.native="showOverlay('filters')"
              />
              <template #content>
                <div class="text-sm w-48 text-center p-2 text-primary-600">
                  Filters
                </div>
              </template>
            </Flyout>
          </div>
          <div>
            <WButtonsBase
              icon="refresh"
              type="primaryInverted"
              @click.native="
                $store.dispatch('portfolio/getFilterProjects', {
                  paginate: 'Yes',
                  page: 1,
                })
              "
            />
          </div>
        </div>
      </div>
      <div v-if="currentTab === 'Overview'" class="flex flex-col">
        <PortfolioPropertiesOverview />
      </div>
      <div v-if="currentTab === 'Subset'" class="flex flex-col">
        <PortfolioPropertiesSubset />
      </div>
    </div>
  </div>
</template>
<script>
import { mapState, mapActions } from 'vuex'
export default {
  layout: 'sidebar',
  data() {
    return {
      currentTab: 'Overview',
      title: '',
      caption: '',
      slideOverMode: '',
      selectedLocation: {},
    }
  },
  computed: {
    ...mapState({
      allReviews: (state) => state.review.allReviews,
      portfolio: (state) => state.portfolio.portfolio,
      loading: (state) => state.shared.loading,
      currentUser: (state) => state.user.currentUser,
    }),
    pendingReview() {
      if (
        this.allReviews &&
        this.allReviews.length > 0 &&
        this.allReviews.filter((review) => review.status !== 'reviewed')
          .length > 0
      ) {
        return true
      }
      return false
    },
  },
  async mounted() {
    await this.$store.dispatch(
      'review/getSharedReviewList',
      this.$route.params.id.toString().substring(5, 10)
    )
    await this.$store.dispatch('portfolio/getFilterProjects', {
      paginate: 'Yes',
      page: 1,
    })
    await this.$store.dispatch('portfolio/getSubsetList')
  },
  beforeDestroy() {
    this.$store.dispatch('portfolio/resetFilters')
  },
  methods: {
    ...mapActions('portfolio', ['exportProjects']),
    downloadTemplate(type) {
      this.$refs.addLocationTeamModal.isHidden = true
      if (type === 'sqft') {
        window.open(
          'https://cdn.wellcertified.com/Excel-Import-Templates/portfolio-locations-sqft.xlsm',
          '_blank'
        )
      } else {
        window.open(
          'https://cdn.wellcertified.com/Excel-Import-Templates/portfolio-locations-sqm.xlsm',
          '_blank'
        )
      }
    },

    addLocationCheck() {
      const isMember = this.portfolio.members.find(
        (member) => member.id === this.currentUser.id
      )
      // if (this.currentUser.role.includes('well-admin')) {
      //   return this.showOverlay('location')
      // }
      if (this.currentUser.role.includes('well-admin')) {
        this.showOverlay('location')
      } else if (isMember) {
        this.$refs.addLocationTeamModal.isHidden = false
      } else {
        this.showOverlay('location')
      }
    },

    downloadLocationLevelCertificate(locationId) {
      this.$store
        .dispatch('shared/downloadLocationCertificate', {
          portfolio_id: this.portfolio.id,
          location_id: locationId,
        })
        .then((res) => {
          window.open(res.data.url, '_blank')
        })
    },
    showOverlay(type, project) {
      this.slideOverMode = type
      switch (type) {
        case 'location':
          this.title = 'Add a project'
          this.caption = ''
          this.selectedLocation = null
          break
        case 'upload':
          this.title = 'Add multiple locations'
          this.caption =
            ' Upload spreadsheet to automatically create individual location profiles and scorecards for those locations within your WELL Health-Safety Rating'
          break
        case 'filters':
          this.title = 'Filters'
          break
        case 'subset':
          this.title = 'Create a subset'
          this.caption =
            'Group locations into subsets to customize your list and make sharing documents easier.'
          break
        default:
          this.title = ''
          this.caption = ''
          break
      }
      this.$refs.location.toggleOpen()
    },
  },
}
</script>
