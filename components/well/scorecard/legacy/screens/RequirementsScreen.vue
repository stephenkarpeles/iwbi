<template>
  <div>
    <div
      v-if="part.note && part.note !== ''"
      class="bg-yellow-50 border-yellow-400 p-4 border rounded-lg mb-4"
    >
      <div class="flex">
        <div class="flex-shrink-0">
          <WIconsBase
            icon="shield-exclamation"
            type="blank"
            class="h-5 w-5 text-yellow-400"
          />
        </div>
        <div class="ml-3">
          <!-- eslint-disable-next-line vue/no-v-html -->
          <p
            class="text-sm text-yellow-700"
            v-html="addCitations(part.note, $store.state.project.project)"
          ></p>
        </div>
      </div>
    </div>

    <div class="my-4">
      <div
        v-if="filterPartGuidance"
        class="
          bg-white
          w-full
          border border-primary-300
          px-6
          py-4
          rounded-md
          space-y-2
        "
      >
        <div class="font-bold text-primary-900">WELL Core Guidance:</div>
        <p
          v-for="(guidance, index) in filterPartGuidance"
          :key="index"
          class="leading-5 font-light text-primary-800"
          v-html="
            addCitations(guidance.doc_guidance, $store.state.project.project)
          "
        ></p>
        <FormulateInput
          v-if="showIfGuidanceTrue()"
          v-model="partGuianceOpted"
          :element-class="['text-primary-900']"
          type="checkbox"
          label="I would like to pursue additional point opportunities for WELL Core."
          @input="togglePartGuidance()"
        />
      </div>
    </div>

    <div
      v-if="showMultiPoints"
      class="
        px-5
        py-3
        bg-white
        border border-primary-300
        text-primary-800
        my-4
        rounded-md
      "
    >
      <div class="flex justify-between items-center">
        <div class="w-4/5 flex space-x-4 items-center">
          <div class="bg-primary-100 rounded-full px-2 py-3">
            <WIconsBase class="text-primary-500" icon="annotation" />
          </div>
          <span>
            This part has multiple point thresholds available. Please review the
            requirements and select the appropriate number of points.
          </span>
        </div>
        <div class="w-1/5">
          <FormulateInput
            v-model="partPointsVal"
            class="text-primary-700 -mb-4"
            placeholder="Select Points"
            type="select"
            :options="getPartPointsOptions"
            @change="setPoints"
          />
        </div>
      </div>
    </div>

    <div class="rounded-md bg-white border border-primary-300">
      <BarTab v-model="reqCurrentTab" :tabs="getParts" />

      <div v-if="reqCurrentTab" class="py-8 px-6">
        <PortfolioScorecardSubPartOption
          :part="part"
          :sub-part="
            part.subParts.find((subPart) => subPart.id === reqCurrentTab)
          "
          :selected-subpart-option-i-d="selectedSubpartOptionID"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions, mapState } from 'vuex'
import { globalMixin } from '~/mixins/globalMixin'
export default {
  mixins: [globalMixin],
  props: {
    part: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      reqCurrentTab: '',
      partGuianceOpted: false,
      partPointsVal: 0,
    }
  },
  computed: {
    ...mapState({ scorecard: (state) => state.scorecard.scorecard }),
    ...mapGetters('scorecard', ['filterPartGuidance']),
    getParts() {
      const parts = JSON.parse(JSON.stringify(this.part.subParts))

      const self = this

      const results = parts.map(function (el) {
        const o = Object.assign({}, el)
        o.name = self.getSubPartTitle(el)
        o.value = el.id
        o.isActive = self.part.scorecard_part.find(
          (part) => part.sub_part_id === el.id
        )
        return o
      })
      return results
    },
    selectedSubpartOptionID() {
      const temp = this.part.scorecard_part.find(
        (part) => part.sub_part_id === this.reqCurrentTab
      )
      if (temp?.option_id) {
        return temp.option_id
      } else {
        return null
      }
    },
    showMultiPoints() {
      if (this.part.points) {
        if (this.scorecard.type === 'v2-pilot') {
          if (
            this.part.min_points > 0 &&
            this.part.min_points < this.part.points &&
            this.part.points > 1
          ) {
            return true
          }
        } else if (
          (this.part.possible_points !== null &&
            this.scorecard.project_type !== 'cs') ||
          (this.part.possible_core_points !== null &&
            this.scorecard.project_type === 'cs')
        ) {
          return true
        }
      }
      return false
    },
    getPartPointsOptions() {
      const points = []
      if (this.part && this.scorecard.type === 'v2') {
        if (
          this.scorecard.project_type === 'cs' &&
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
      if (this.part && this.scorecard.type === 'v2-pilot') {
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
    await this.$store.dispatch('scorecard/getPartNotes', this.part.id)
  },
  methods: {
    ...mapActions('scorecard', ['storePartGuidance']),
    getSubPartTitle(subpart) {
      let title = ''
      const spaceTypesInc = subpart.space_types_included
      if (spaceTypesInc.length !== 0) {
        if (spaceTypesInc.length === 1) {
          title += spaceTypesInc[0].name
        } else {
          title += spaceTypesInc[0].name
          for (let i = 1; i < spaceTypesInc.length; i++) {
            if (i === spaceTypesInc.length - 1) {
              title += ' & ' + spaceTypesInc[i].name
            } else {
              title += ', ' + spaceTypesInc[i].name
            }
          }
        }
      }
      return title + ''
    },
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
        isHSR: this.moduleType === 'hsr',
      }
      this.$store.dispatch('scorecard/updatePart', data)
    },
    showIfGuidanceTrue() {
      const flag = false
      let max = 0
      const maxValueObject = this.filterPartGuidance.map((key) => {
        return key.points
      })
      max = Math.max.apply(null, maxValueObject)
      if (this.part.scorecard_part.length && max > 0) {
        if (parseInt(this.part.scorecard_part[0].guidance_points) > 0) {
          this.partGuianceOpted = true
        } else {
          this.partGuianceOpted = false
        }
        return true
      }
      return flag
    },
    togglePartGuidance() {
      let max = 0
      if (this.partGuianceOpted) {
        const maxValueObject = this.filterPartGuidance.map((key) => {
          return key.points
        })
        max = Math.max.apply(null, maxValueObject)
      }
      const data = {
        partId: this.part.id,
        scorecardPartId: this.part.scorecard_part[0].id,
        response: this.part.scorecard_part.length
          ? this.part.scorecard_part[0].response
          : 'yes',
        concept: this.part.concept_name,
        version_id: this.$store.state.scorecard.scorecard.version_id,
        option_id: this.part.subParts[0].options[0].id,
        sub_part_id: this.part.subParts[0].id,
        points: this.part.points,
        guidancePoints: {
          guidance_points: max,
        },
        response_reason: 'User-entered',
        phase: 'assessment',
        isHSR: this.moduleType === 'hsr',
        scorecardId: this.scorecard.id,
      }
      this.storePartGuidance(data)
    },
  },
}
</script>
