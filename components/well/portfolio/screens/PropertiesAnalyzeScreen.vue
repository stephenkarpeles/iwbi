<template>
  <div>
    <WFeedbackModal ref="modal" class="z-50">
      <div class="max-w-xl space-y-2 px-4">
        <div class="flex justify-between">
          <WHeadingsHThree heading="Occupancy Estimate" />
          <WIconsBase
            icon="x"
            class="text-primary-600"
            @click.native="$refs.modal.isHidden = true"
          />
        </div>

        <p>
          *This estimate is provided for your convenience based on an industry
          average of 250 square feet (23.2 square meters) per person, as
          typically found in office spaces. Your space types and occupancy
          density may vary significantly, so we encourage you to update the
          occupancy details for each of your properties to provide a more
          accurate figure.
        </p>
      </div>
    </WFeedbackModal>

    <div class="flex">
      <div class="w-5/12 h-96">
        <p class="text-sm leading-5 mt-5 px-4 py-2">
          Explore an analysis of your portfolio’s composition, including how
          locations are grouped, where they are located, how locations are used,
          current ownership structures or other relevant differentiators.
        </p>
        <div
          v-if="locations && locations.length > 1"
          class="mt-2 p-4 flex w-full items-center justify-between"
        >
          <div class="flex">
            <WIconsBase
              class="text-secondary-700 font-bold my-0"
              icon="office-building"
            />
            <div class="text-primary-800 flex flex-col leading-4">
              <span class="font-semibold">{{ propertyCount || 1000 }}</span>
              <span class="opacity-80 text-sm">locations</span>
            </div>
          </div>
          <div class="flex">
            <WIconsBase
              class="text-secondary-700 font-bold my-0"
              icon="location-marker"
            />
            <div class="text-primary-800 flex flex-col leading-4">
              <span class="font-semibold">{{ propertyArea || 200 }}</span>
              <span class="opacity-80 text-sm">square feet</span>
            </div>
          </div>
          <div
            v-if="analyzeDummyData"
            class="flex cursor-pointer"
            @click="$refs.modal.isHidden = false"
          >
            <WIconsBase
              class="text-secondary-700 font-bold my-0"
              icon="users"
            />
            <div class="text-primary-800 flex flex-col leading-4">
              <span class="font-semibold">{{
                analyzeDummyData.total_no_of_occupant
                  ? analyzeDummyData.total_no_of_occupant
                  : 0
              }}</span>
              <span class="opacity-80 text-sm"># occupants impacted*</span>
            </div>
          </div>
        </div>
      </div>
      <div class="border-2 w-7/12">
        <PortfolioMap />
      </div>
    </div>
    <div class="mt-10">
      <PortfolioChartRow
        type="SpaceType"
        labels="name"
        amount-series="count"
        sqft-series="area_total"
        :color-series="['#095A6D', '#C1E5E9']"
      />
      <PortfolioChartRow
        type="Location"
        labels="country_name"
        amount-series="count"
        sqft-series="area_total"
        :color-series="['#9E3D1B', '#F9E6D7']"
      />
      <PortfolioChartRow
        type="OwnershipType"
        labels="project_type"
        amount-series="count"
        sqft-series="area_total"
        :color-series="['#00977D', '#9CD9AB']"
      />
    </div>
  </div>
</template>
<script>
import { mapState, mapActions, mapGetters } from 'vuex'
export default {
  computed: {
    ...mapState({
      portfolio: (state) => state.portfolio,
      locations: (state) => state.portfolio.locations,
      analyzeDummyData: (state) => state.portfolio.analyzeDummyData,
    }),
    ...mapGetters({
      propertyCount: 'portfolio/totalPropertyCount',
      areaCount: 'portfolio/totalAreaCount',
    }),
    propertyArea() {
      if (this.areaCount) {
        return this.roundVal(this.areaCount)
      }
      return this.areaCount
    },
    occupantEstimate() {
      if (this.areaCount) {
        const sfpp = 250 // square ft per person
        return this.roundVal(this.areaCount / sfpp)
      }
      return this.areaCount
    },
  },
  async mounted() {
    await this.loadProjectBreakdown()
    await this.$store.dispatch('portfolio/getAnalyzeDummyData', {
      mode: 'portfolio',
      id: this.$parent.portfolio.id,
    })
  },
  methods: {
    ...mapActions('analyze', ['loadProjectBreakdown']),
    roundVal(val) {
      if (val > 1e6) {
        return Math.round((val / 1e6) * 1000) / 1000 + 'M'
      } else if (val > 1e3) {
        return Math.round((val / 1e3) * 100) / 100 + 'K'
      }
      return val
    },
  },
}
</script>
