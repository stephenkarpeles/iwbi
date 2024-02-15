<template>
  <div class="bg-white mt-2 p-3 rounded-lg border border-primary-300 pb-3">
    <div class="flex space-x-2">
      <div :class="moduleType !== 'hsr' ? 'w-1/2' : 'w-full'">
        <div class="text-lg text-primary-700 font-medium">Resources</div>
        <div
          class="
            h-64
            bg-gray-100
            border border-primary-200
            rounded
            overflow-y-auto
          "
        >
          <PortfolioScorecardSubPartResource
            :feature-id="part.feature_id"
            class="p-5"
          />
        </div>
      </div>
      <div :class="moduleType !== 'hsr' ? 'w-1/2' : 'w-full'">
        <div class="text-lg text-primary-700 font-medium">FAQ</div>
        <div
          class="
            h-64
            bg-gray-100
            border border-primary-200
            rounded
            overflow-y-auto
          "
        >
          <PortfolioScorecardSubPartFaq
            :feature-id="part.feature_id"
            class="p-5"
          />
        </div>
      </div>
    </div>

    <div v-if="module.type === 'v2-pilot'">
      <div class="w-full mt-5">
        <div class="text-lg text-primary-700 font-medium">Strategies</div>
        <div
          class="
            h-64
            bg-gray-100
            border border-primary-200
            rounded
            overflow-y-auto
          "
        >
          <PortfolioScorecardStrategiesViewScreen
            :feature-id="part.feature_id"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    part: {
      type: Object,
      required: true,
    },
    module: {
      type: Object,
      required: true,
    },
    moduleType: {
      type: String,
      required: false,
      default: '',
    },
  },
}
</script>
