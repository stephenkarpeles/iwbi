<template>
  <div>
    <WFeedbackModal ref="modal">
      <div style="width: 900px">
        <PortfolioScorecardAssignLocationsScreen
          v-if="activeOption"
          :part="part"
          :active-option="activeOption"
        />
        <div v-else>
          <div class="mx-auto text-center py-5">
            <WLoadingSpinner class="mx-auto" />
            <div class="mt-3 text-primary-600">Loading locations...</div>
          </div>
        </div>
      </div>
    </WFeedbackModal>
    <div v-if="selectedSubpartOptionID === null">
      <WHeadingsHFour
        heading="Select between one of the following options:"
        class="text-primary-900"
      />
      <PortfolioScorecardOptionsListScreen
        :part="part"
        :active-option="activeOption"
        :sub-part="subPart"
      />
    </div>
    <div v-else>
      <PortfolioScorecardActiveSpaceScreen
        v-if="activeOption"
        :part="part"
        :active-option="activeOption"
        :sub-part="subPart"
      />
    </div>
  </div>
</template>
<script>
import { mapState } from 'vuex'

export default {
  props: {
    part: {
      type: Object,
      required: true,
    },
    subPart: {
      type: Object,
      required: true,
    },
    selectedSubpartOptionID: {
      type: Number,
      required: false,
      default: null,
    },
  },

  computed: {
    ...mapState({
      scorecard: (state) => state.scorecard.scorecard,
    }),

    activeOption() {
      if (this.selectedSubpartOptionID !== null) {
        return this.subPart.options.find(
          (el) => el.id === this.selectedSubpartOptionID
        )
      }
      return null
    },
  },
}
</script>
