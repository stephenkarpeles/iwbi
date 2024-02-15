<template>
  <div>
    <div
      v-for="(equivalency, index) in equivalencies"
      :key="index"
      class="pt-5"
    >
      <div class="m-5">
        <div
          class="flex justify-between border shadow px-5 bg-white rounded-lg"
        >
          <div class="w-1/5 py-3">
            <div class="text-primary-500 text-xs">
              {{ $dayjs(equivalency.approval_date).format('MMM DD, YYYY') }}
            </div>
            <div class="text-xs leading-5">
              {{ equivalency.strategy_number }}
            </div>
            <div>
              <span
                v-if="equivalency.Approved"
                class="text-xs uppercase bg-green-600 text-white py-1 px-1 rounded"
                >Not Approved</span
              >
              <span
                v-else
                class="text-xs uppercase bg-green-600 text-white py-1 px-1 rounded"
                >Approved</span
              >
            </div>
          </div>
          <div class="w-4/5 py-3 border-l-2 pl-3">
            <p
              class="text-sm leading-5 space-y-4"
              v-html="equivalency.reason"
            ></p>
            <p class="text-xs mb-0 pt-5">
              Parts: <b>{{ equivalency.parts }}</b> <br />
              <span
                >Applicable Region:
                <strong>{{ getStrategyRegions(index) }}</strong></span
              >
            </p>
          </div>
        </div>
      </div>
    </div>
    <div v-if="epCountZero" class="bg-white py-15 shadow">
      <div class="p-5">
        <div class="text-sm text-primary-500">
          There are no approved equivalencies for this feature.
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    featureId: {
      type: [String, Number],
      required: false,
      default: null,
    },
  },
  data() {
    return {
      equivalencies: [],
      type: '',
    }
  },
  computed: {
    epCountZero() {
      return this.equivalencies.length === 0 || this.equivalencies === null
    },
  },
  watch: {
    featureId() {
      this.getEquivalency()
    },
  },
  mounted() {
    this.getEquivalency()
  },
  methods: {
    getEquivalency() {
      this.$axios
        .get('api/features/' + this.featureId + '/equivalency')
        .then((response) => {
          this.equivalencies = response.data
        })
    },
    getStrategyRegions(index) {
      let regions = ''
      const regionKeys = Object.keys(
        this.equivalencies[index].applicable_location_name
      )
      for (let i = 0; i < regionKeys.length; i++) {
        regions +=
          this.equivalencies[index].applicable_location_name[regionKeys[i]] +
          ', '
      }
      return regions.slice(0, -2)
    },
  },
}
</script>
