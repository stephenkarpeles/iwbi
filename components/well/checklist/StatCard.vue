<template>
  <div
    class="bg-white border border-primary-300 p-4 rounded-lg shadow-lg flex space-x-3"
  >
    <div class="">
      <ScorecardRadialIndicator
        :radius="45"
        :progress="progress"
        :stroke="9"
        :color="'#5EABC4'"
        :fill="'#F4F9FB'"
      />
    </div>
    <div class="my-auto w-full pr-10">
      <div
        class="uppercase font-bold tracking-tight text-primary-800 leading-none"
      >
        {{ header }}
      </div>
      <div class="text-gray-400 text-sm mb-1">
        {{ subHeader }}
      </div>
      <ScorecardHorizontalIndicator
        :yes="yes"
        :no="no"
        :maybe="maybe"
        :total="totalStrategies"
      />
      <div class="flex space-x-3 text-sm text-primary-400 mt-2">
        <div class="flex">
          <div class="my-auto w-2 h-2 bg-primary-700 rounded-full mr-2"></div>
          <div class="my-auto">{{ yes }} Yes</div>
        </div>
        <div class="flex">
          <div class="my-auto w-2 h-2 bg-secondary-700 rounded-full mr-2"></div>
          <div class="my-auto">{{ maybe }} Maybe</div>
        </div>
        <div class="flex">
          <div class="my-auto w-2 h-2 bg-gray-300 rounded-full mr-2"></div>
          <div class="my-auto">{{ no }} No</div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    progress: {
      type: Number,
      required: false,
      default() {
        return 0
      },
    },
    yes: {
      type: Number,
      required: false,
      default() {
        return 0
      },
    },
    maybe: {
      type: Number,
      required: false,
      default() {
        return 0
      },
    },
    no: {
      type: Number,
      required: false,
      default() {
        return 0
      },
    },
    totalStrategies: {
      type: Number,
      required: false,
      default() {
        return 1
      },
    },
    header: {
      type: String,
      required: false,
      default() {
        return 'No Header Given'
      },
    },
    subHeader: {
      type: String,
      required: false,
      default() {
        return 'No Sub-Header Given'
      },
    },
  },
}
</script>
