<template>
  <div>
    <ModalsGeneral
      ref="selectModal"
      :header-background="true"
      :header="
        !removeModal
          ? `<img class='rounded-full w-8 mx-auto mr-2' src='/scorecard/icons/${part.concept_name
              .replace(/\s+/g, '-')
              .toLowerCase()}.png'/> ${part.part_prefix}`
          : ''
      "
    >
      <div style="width: 600px" class="overflow-auto px-6">
        <PortfolioScorecardSelectOptionsScreen
          ref="selectionScreen"
          :part="part"
        />
      </div>
    </ModalsGeneral>
    <div v-show="!apiLoading" class="space-y-8">
      <div class="space-y-2">
        <div
          v-if="showMultiPoints && selectedOptions.length"
          class="px-5 pt-3 bg-primary-100 border border-primary-600 text-primary-600 mt-4 rounded"
        >
          <div class="flex justify-between">
            <div class="text-sm w-4/5 leading-4 mt-3">
              This part has multiple point thresholds available. Please review
              the requirements and select the appropriate number of points-
            </div>
            <div class="w-1/5">
              <FormulateInput
                v-model="partPointsVal"
                class="text-primary-700"
                placeholder="Select Points"
                type="select"
                :options="getPartPointsOptions"
                @change="setPoints"
              />
            </div>
          </div>
        </div>
        <div class="flex space-x-4 items-center">
          <span class="text-primary-600 text-lg font-semibold pl-2">
            {{
              selectedOptions.length ? 'Selected Options' : 'Select an Option'
            }}
          </span>
          <div>
            <WButtonsBase
              v-if="selectedOptions.length"
              class="bg-transparent shadow-none border-primary-500 text-primary-600 font-semibold text-sm"
              type="primaryInverted"
              @click.native="
                ;($refs.selectModal.isHidden = false), (removeModal = false)
              "
              >Edit options</WButtonsBase
            >
          </div>
        </div>

        <div
          v-if="selectedOptions.length === 0"
          class="bg-white rounded-md border-primary-300 border p-6 flex flex-col items-center"
        >
          <span class="text-primary-500 text-xl font-semibold mt-2"
            >Three simple steps to improving health</span
          >

          <dl
            class="mt-5 grid grid-cols-1 rounded-lg bg-white overflow-hidden md:grid-cols-3"
          >
            <div class="px-4 py-5 sm:p-6">
              <dt
                class="text-base font-normal text-primary-900 flex items-center justify-center"
              >
                <span
                  class="h-8 w-8 rounded-full bg-primary-300 flex items-center justify-center ring-8 ring-white"
                  >1</span
                >
              </dt>
              <dd class="mt-2 flex-column md:block text-center lg:flex-column">
                <div class="font-semibold text-primary-700">
                  Select an option
                </div>
                <div class="text-primary-500 mt-1">
                  Define your approach for all relevant space types
                </div>
              </dd>
            </div>

            <div class="px-4 py-5 sm:p-6">
              <dt
                class="text-base font-normal text-primary-900 flex items-center justify-center"
              >
                <span
                  class="h-8 w-8 rounded-full bg-primary-300 flex items-center justify-center ring-8 ring-white"
                  >2</span
                >
              </dt>
              <dd class="mt-2 flex-column md:block text-center lg:flex-column">
                <div class="font-semibold text-primary-700">
                  Assign locations
                </div>
                <div class="text-primary-500 mt-1">
                  Tag all locations meeting the same requirements to reveal your
                  tasks
                </div>
              </dd>
            </div>

            <div class="px-4 py-5 sm:p-6">
              <dt
                class="text-base font-normal text-primary-900 flex items-center justify-center"
              >
                <span
                  class="h-8 w-8 rounded-full bg-primary-300 flex items-center justify-center ring-8 ring-white"
                  >3</span
                >
              </dt>
              <dd class="mt-2 flex-column md:block text-center lg:flex-column">
                <div class="font-semibold text-primary-700">
                  Upload verification
                </div>
                <div class="text-primary-500 mt-1">
                  Prepare submittals for your next review cycle
                </div>
              </dd>
            </div>
          </dl>

          <button
            class="px-8 py-2 bg-primary-600 text-white rounded font-semibold hover:bg-primary-500 mt-2"
            @click="
              ;($refs.selectModal.isHidden = false), (removeModal = false)
            "
          >
            Add option
          </button>
        </div>
        <div v-else class="space-y-4">
          <PortfolioScorecardOptionsListView :part="part" />
        </div>
      </div>

      <div v-if="selectedOptions.length > 0" class="space-y-2">
        <span class="text-primary-600 text-lg font-semibold pl-2">Tasks</span>
        <PortfolioScorecardTasksListView :part="part" />
      </div>

      <div v-if="selectedOptions.length > 0" class="space-y-2 flex flex-wrap">
        <div class="text-primary-600 text-lg font-semibold pl-2 w-full">
          Documents
        </div>
        <PortfolioScorecardDocumentsListView :part="part" />
      </div>
    </div>
    <div v-if="apiLoading" class="mx-auto mt-5 text-center">
      <WLoadingSpinner class="mx-auto" />
      <div class="mt-3 text-primary-600">Please Wait...</div>
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
  },
  data() {
    return { apiLoading: false, partPointsVal: 0, removeModal: false }
  },
  computed: {
    ...mapState({
      selectedOptions: (state) => state.scorecard.selectedOptions,
      portfolio: (state) => state.portfolio.portfolio,
    }),
    showMultiPoints() {
      if (this.part.points) {
        if (this.portfolio.type === 'v2-pilot') {
          if (
            this.part.min_points > 0 &&
            this.part.min_points < this.part.points &&
            this.part.points > 1
          ) {
            return true
          }
        } else if (
          (this.part.possible_points !== null &&
            this.portfolio.project_type !== 'cs') ||
          (this.part.possible_core_points !== null &&
            this.portfolio.project_type === 'cs')
        ) {
          return true
        }
      }
      return false
    },
    getPartPointsOptions() {
      const points = []
      if (this.part && this.portfolio.type === 'v2') {
        if (
          this.portfolio.project_type === 'cs' &&
          this.part.possible_core_points !== null
        ) {
          this.part.possible_core_points.forEach((element) => {
            if (element <= 1) {
              points.push({ label: 'Point ' + element, value: element })
            } else {
              points.push({ label: 'Points ' + element, value: element })
            }
          })
        } else if (this.part.possible_points !== null) {
          this.part.possible_points.forEach((element) => {
            if (element <= 1) {
              points.push({ label: 'Point ' + element, value: element })
            } else {
              points.push({ label: 'Points ' + element, value: element })
            }
          })
        } else {
          return [{ label: '', value: '' }]
        }
        return points
      }
      if (this.part && this.portfolio.type === 'v2-pilot') {
        const point = this.part.points
        for (let index = 1; index <= point; index++) {
          if (index <= 1) {
            points.push({ label: 'Point ' + index, value: index })
          } else {
            points.push({ label: 'Points ' + index, value: index })
          }
        }
        return points
      }
      return [{ label: '', value: '' }]
    },
  },
  async mounted() {
    this.apiLoading = true
    await this.$store.dispatch('scorecard/getSelectedOptions', {
      part_id: this.part.id,
    })
    this.partPointsVal =
      this.part.scorecard_part && this.part.scorecard_part.length
        ? this.part.scorecard_part[0].points
        : 0
    this.apiLoading = false
  },
  methods: {
    setPoints(e) {
      const data = {
        partId: this.part.id,
        response: 'yes',
        concept: this.part.concept_name,
        version_id: this.$store.state.scorecard.scorecard.version_id,
        option_id: this.part.subParts[0].options[0].id,
        sub_part_id: this.part.subParts[0].id,
        points: this.partPointsVal,
        response_reason: 'User-entered',
        phase: 'assessment',
        isHSR: false,
      }
      this.$store.dispatch('scorecard/updatePart', data)
      this.$parent.partPointsVal = this.partPointsVal
    },
  },
}
</script>
