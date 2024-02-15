<template>
  <div>
    <div
      v-if="part.note"
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
        class="bg-white w-full border border-primary-300 px-6 py-4 rounded-md space-y-2"
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
  </div>
</template>

<script>
import { mapGetters, mapState } from 'vuex'
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
      partGuianceOpted: false,
    }
  },
  computed: {
    ...mapGetters('scorecard', ['filterPartGuidance']),
    ...mapState({
      scorecard: (state) => state.scorecard.scorecard,
    }),
  },
  methods: {
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
        isHSR: false,
        scorecardId: this.scorecard.id,
      }
      this.$store.dispatch('scorecard/storePartGuidance', data)
    },
  },
}
</script>
