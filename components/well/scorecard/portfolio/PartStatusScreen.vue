<template>
  <div>
    <div class="flex">
      <div class="w-1/2 mr-2 mt-2">
        <FormulateInput
          v-if="module.benchmark_opt === 1"
          v-model="assessPhaseVal"
          :options="phaseArray.assessment"
          label="Assessment"
          type="select"
          placeholder="Select assessment phase"
          @change="sendResponse('assessment')"
        />
      </div>
      <div class="w-1/2 mt-2">
        <FormulateInput
          v-model="implementPhaseVal"
          :options="phaseArray.implementation"
          label="Implementation"
          type="select"
          placeholder="Select implementation phase"
          @change="sendResponse('implementation')"
        />
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
  },
  data() {
    return {
      assessPhaseVal: null,
      implementPhaseVal: null,
      phaseArray: {
        assessment: [
          { label: 'Anticipated', value: 'achievable' },
          {
            label: 'Achievable with Minor adjustments',
            value: 'achievable_with_minor_adjustments',
          },
          {
            label: 'Achievable with Major adjustments',
            value: 'achievable_with_major_adjustments',
          },
          { label: 'Not Achievable', value: 'not_achievable' },
        ],
        implementation: [
          { value: 'outstanding', label: 'Not Started' },
          { value: 'in_progress', label: 'In Progress' },
          { value: 'completed', label: 'Completed' },
          { value: 'need_action', label: 'Needs Action' },
          { value: 'withdrawn', label: 'Withdrawn' },
        ],
      },
    }
  },
  watch: {
    part() {
      if (this.part && this.part.scorecard_part.length) {
        this.assessPhaseVal = this.part.scorecard_part[0].assessment
        this.implementPhaseVal = this.part.scorecard_part[0].implementation
      }
    },
  },
  mounted() {
    if (this.part && this.part.scorecard_part.length) {
      this.assessPhaseVal = this.part.scorecard_part[0].assessment
      this.implementPhaseVal = this.part.scorecard_part[0].implementation
    }
  },
  methods: {
    sendResponse(response) {
      const data = {
        partId: this.part.id,
        response: this.part.scorecard_part[0].response,
        concept: this.part.concept_name,
        version_id: this.$store.state.scorecard.scorecard.version_id,
        option_id: this.part.subParts[0].options[0].id,
        sub_part_id: this.part.subParts[0].id,
        points: this.part.points,
        response_reason: 'User-entered',
        phase: response,
        phase_response:
          response === 'assessment'
            ? this.assessPhaseVal
            : this.implementPhaseVal,
        isHSR: this.moduleType === 'hsr',
      }
      this.$store.dispatch('scorecard/updatePart', data)
    },
  },
}
</script>
