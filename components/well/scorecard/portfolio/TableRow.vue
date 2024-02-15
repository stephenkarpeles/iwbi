<template>
  <tr :class="[module.type !== 'v2-pilot' && 'border-b', 'grid']">
    <ModalsGeneral ref="confirmSelection">
      <div style="width: 400px">
        <PortfolioScorecardConfirmResponseScreen
          @confirm="
            $store.dispatch('scorecard/partResponseChange', {
              part_id: part.id,
              data: {
                response: 'no',
                points: part.points,
              },
            })
          "
        />
      </div>
    </ModalsGeneral>
    <td colspan="4">
      <div
        :class="[
          expanded && 'bg-primary-100',
          'hover:bg-primary-100 cursor-pointer flex w-full ',
        ]"
      >
        <div
          class="px-6 my-auto py-2 text-sm leading-5 font-medium text-primary-500"
          @click="expanded = !expanded"
        >
          <div class="font-medium w-12 text-center">
            <img
              v-if="showIcons"
              class="rounded-full w-8 mx-auto"
              :src="`/scorecard/icons/${activeConcept
                .replace(/\s+/g, '-')
                .toLowerCase()}.png`"
            />
            <div>
              {{ getTablePart }}
            </div>
          </div>
        </div>
        <div
          class="w-7/12 my-auto px-6 py-2 text-sm leading-5 font-medium text-gray-900"
          @click="expanded = !expanded"
        >
          <div class="font-medium">
            <div class="flex">
              <div class="text-primary-600 font-bold">
                {{ getTableLabelName }}
              </div>
            </div>
            <div class="text-sm text-primary-900">
              {{ part.feature_name }}
              <div
                v-if="checkPartPhaseStatus && module.benchmark_opt === 1"
                :class="`ml-2 inline border px-1 text-sm rounded ${checkPartPhaseStatus.style}`"
              >
                {{ checkPartPhaseStatus.title }}
              </div>
              <div
                v-if="checkPartImplementPhaseStatus"
                :class="`ml-2 inline border px-1 text-sm rounded ${checkPartImplementPhaseStatus.style}`"
              >
                {{ checkPartImplementPhaseStatus.title }}
              </div>
            </div>
          </div>
        </div>
        <div
          class="w-3/12 my-auto px-6 py-2 text-sm leading-5 font-medium text-gray-900 flex items-center"
          @click="expanded = !expanded"
        >
          <div v-if="feature.type === 'P' && moduleType !== 'wpr'">
            <div
              v-if="part.points === 0 && response === 'yes'"
              class="ml-4 font-medium uppercase bg-primary-100 border border-primary-300 text-primary-700 w-10 h-10 rounded-full font-bold flex"
            >
              <div class="mx-auto my-auto">
                <span v-if="part.points === 0"> P </span>
              </div>
            </div>
            <div
              v-else
              class="opacity-30 ml-4 font-medium uppercase bg-primary-100 border border-primary-300 text-primary-700 w-10 h-10 rounded-full font-bold flex"
            >
              <div class="mx-auto my-auto">
                <span v-if="part.points === 0"> P </span>
              </div>
            </div>
          </div>
          <div v-else-if="moduleType !== 'wpr'">
            <div
              v-if="partPointsVal !== 0 && part.points > 0"
              class="ml-4 font-medium uppercase bg-primary-100 border border-primary-300 text-primary-700 w-10 h-10 rounded-full font-bold flex"
            >
              <div class="mx-auto my-auto">
                <span> {{ partPointsVal }} </span>
              </div>
            </div>
            <div
              v-else
              class="opacity-30 ml-4 font-medium uppercase bg-primary-100 border border-primary-300 text-primary-700 w-10 h-10 rounded-full font-bold flex"
            >
              <div class="mx-auto my-auto">
                <span> {{ part.points }} </span>
              </div>
            </div>
          </div>

          <WIconsBase
            v-if="guidancePoints"
            icon="plus"
            class="w-5 text-primary-600 ml-4"
          />

          <div
            v-if="guidancePoints"
            class="ml-4 uppercase bg-secondary-100 border border-secondary-300 text-secondary-700 w-10 h-10 rounded-full font-bold flex"
          >
            <div class="mx-auto my-auto">
              {{ guidancePoints }}
            </div>
          </div>
        </div>
        <div
          class="my-auto px-6 py-2 text-sm leading-5 font-medium text-gray-900"
        >
          <div class="w-56 flex">
            <PortfolioScorecardHoverIcon
              ref="commentHover"
              :part="part"
              type="comments"
            />
            <PortfolioScorecardHoverIcon
              ref="docHover"
              :part="part"
              type="documents"
            />

            <div
              v-if="part.points === 0 && module.type === 'v2-pilot'"
              class="flex w-48 ml-2"
            >
              <WButtonsBase
                type="neutral"
                :class="[
                  response === 'yes'
                    ? 'bg-primary-600 text-white'
                    : 'bg-white text-primary-600',
                  'border rounded-l-lg transition-colors duration-300',
                ]"
                @click.native="
                  part.points === 0 &&
                  module.type === 'v2-pilot' &&
                  moduleType !== 'portfolio'
                    ? null
                    : sendResponse('yes')
                "
              >
                Yes
              </WButtonsBase>
              <WButtonsBase
                type="neutral"
                :class="[
                  response === 'maybe'
                    ? 'bg-secondary-700 text-white'
                    : 'bg-white text-primary-600',
                  'border-t border-b  transition-colors duration-300',
                ]"
                @click.native="
                  part.points === 0 && module.type === 'v2-pilot'
                    ? null
                    : sendResponse('maybe')
                "
              >
                Maybe
              </WButtonsBase>
              <WButtonsBase
                type="neutral"
                :class="[
                  response === 'no'
                    ? 'bg-gray-500 text-white'
                    : 'bg-white text-primary-600',
                  'border rounded-r-lg  transition-colors duration-300',
                ]"
                @click.native="
                  part.points === 0 && module.type === 'v2-pilot'
                    ? null
                    : sendResponse('no')
                "
              >
                No
              </WButtonsBase>
            </div>
            <div v-else class="flex w-48 ml-2">
              <WButtonsBase
                type="neutral"
                :class="[
                  response === 'yes'
                    ? 'bg-primary-600 text-white'
                    : 'bg-white text-primary-600',
                  'border rounded-l-lg hover:bg-primary-900 hover:text-white transition-colors duration-300',
                ]"
                @click.native="
                  part.points === 0 && module.type === 'v2-pilot'
                    ? null
                    : sendResponse('yes')
                "
              >
                Yes
              </WButtonsBase>
              <WButtonsBase
                type="neutral"
                :class="[
                  response === 'maybe'
                    ? 'bg-secondary-700 text-white'
                    : 'bg-white text-primary-600',
                  'border-t border-b hover:bg-secondary-900 hover:text-white transition-colors duration-300',
                ]"
                @click.native="
                  part.points === 0 && module.type === 'v2-pilot'
                    ? null
                    : sendResponse('maybe')
                "
              >
                Maybe
              </WButtonsBase>
              <WButtonsBase
                type="neutral"
                :class="[
                  response === 'no'
                    ? 'bg-gray-400 text-white'
                    : 'bg-white text-primary-600',
                  'border rounded-r-lg hover:bg-gray-700 hover:text-white transition-colors duration-300',
                ]"
                @click.native="
                  part.points === 0 && module.type === 'v2-pilot'
                    ? null
                    : sendResponse('no')
                "
              >
                No
              </WButtonsBase>
            </div>
          </div>
        </div>
      </div>
      <div v-if="expanded" class="w-full bg-gray-200 pb-3">
        <div
          class="bg-primary-800 w-full flex py-3 px-6 justify-between items-center"
        >
          <div class="flex space-x-1">
            <div v-for="(tab, index) in tabs" :key="index" class="flex">
              <button
                :class="`text-white flex
              space-x-2
              px-6
              py-3
              rounded-md
              ${
                currentTab === tab.name
                  ? 'bg-primary-700'
                  : 'hover:bg-primary-700'
              }
              
            `"
                @click="currentTab = tab.name"
              >
                <WIconsBase :icon="tab.icon" />
                {{ tab.name }} {{ tab.count > 0 ? `(${tab.count})` : '' }}
              </button>
              <div
                v-if="index === tabs.length - 2"
                class="border border-primary-700 ml-1"
              ></div>
            </div>
          </div>

          <Dropdown
            v-if="module.type === 'v2-pilot'"
            v-model="implementPhaseVal"
            :options="phaseArray.implementation"
            @input="sendPhaseResponse('implementation')"
          />
        </div>

        <div class="my-4 mx-6">
          <PortfolioScorecardRequirementsScreen
            v-if="currentTab === 'Requirements'"
            :part="part"
          />

          <PortfolioScorecardVerificationScreen
            v-if="currentTab === 'Verification'"
            :part="part"
          />

          <PortLegacyResourcesScreen
            v-if="currentTab === 'Resources'"
            :part="part"
            :module="module"
            :module-type="moduleType"
          />

          <PortfolioScorecardCommentScreen
            v-if="currentTab === 'Comments'"
            :part="part"
          />
        </div>
      </div>
    </td>
  </tr>
</template>
<script>
import { mapGetters, mapState, mapActions } from 'vuex'
export default {
  props: {
    showIcons: {
      type: Boolean,
      required: false,
      default: true,
    },
    module: {
      type: Object,
      required: false,
      default: () => {},
    },
    moduleType: {
      type: String,
      required: false,
      default: '',
    },
    part: {
      type: Object,
      required: true,
    },
    feature: {
      type: Object,
      required: false,
      default: null,
    },
    activeConcept: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      currentTab: 'Requirements',
      implementPhaseVal: '',
      phaseArray: {
        implementation: [
          { value: 'outstanding', label: 'Not Started', color: 'bg-gray-300' },
          {
            value: 'in_progress',
            label: 'In Progress',
            color: 'bg-yellow-500',
          },
          { value: 'completed', label: 'Completed' },
          { value: 'need_action', label: 'Needs Action', color: 'bg-red-500' },
          { value: 'withdrawn', label: 'Withdrawn' },
        ],
      },

      expanded: false,
      partPointsVal: 0,
      new_guidance_summary: null,
      guidance_summary: null,
      partGuianceOpted: false,
      partResponseSelected: null,
      responseOptions: [
        { label: 'Achieved', value: 'Achieved' },
        { label: 'Anticipated', value: 'Anticipated' },
        {
          label: 'Anticipated, Pending On-site Assessment',
          value: 'Anticipated, Pending On-site Assessment',
        },
        { label: 'Not Achieved', value: 'Not Achieved' },
        { label: 'Not Anticipated', value: 'Not Anticipated' },
        { label: 'Not Applicable', value: 'Not Applicable' },
        { label: 'Not Attempted', value: 'Not Attempted' },
        { label: 'Partially Anticipated', value: 'Partially Anticipated' },
        { label: 'Partially Achieved', value: 'Partially Achieved' },
        { label: 'Pending', value: 'Pending' },
        { label: 'Pending Documentation', value: 'Pending Documentation' },
        {
          label: 'Pending Documentation, Pending On-site Assessment',
          value: 'Pending Documentation, Pending On-site Assessment',
        },
        {
          label: 'Pending On-site Assessment',
          value: 'Pending On-site Assessment',
        },
        { label: 'Withdrawn', value: 'Withdrawn' },
      ],
    }
  },
  computed: {
    ...mapGetters('review', ['pendingReview']),
    ...mapGetters('scorecard', ['filterPartGuidance']),
    ...mapState({
      currentUser: (state) => state.user.currentUser,
      project: (state) => state.project.project,
      scorecard: (state) => state.scorecard.scorecard,
      adminReviewResponses: (state) => state.scorecard.adminReviewResponses,
      partNotes: (state) => state.scorecard.partNotes,
    }),
    getTableLabelName() {
      if (this.part) {
        if (this.part.name === 'Part 1') {
          return ''
        }
        return this.part.name
      }
      return null
    },
    getTablePart() {
      if (this.part) {
        if (this.module.type === 'wpr') {
          return this.part.part_prefix.replace('0', '')
        } else {
          return this.part.part_prefix.replace('0', '')
        }
      }
      return null
    },
    tabs() {
      const arr = [
        {
          name: 'Requirements',
          icon: 'clipboard-check',
          count: 0,
        },
        {
          name: 'Verification',
          icon: 'document-text',
          count:
            this.part.scorecard_part.length &&
            this.part.scorecard_part[0].option
              ? this.part.scorecard_part.length
              : 0,
        },
        {
          name: 'Comments',
          icon: 'chat-alt',
          count: this.partNotes.length,
        },
        {
          name: 'Resources',
          icon: 'library',
          count: 0,
        },
      ]
      return arr
    },
    getPartPointsOptions() {
      const points = []
      if (this.part && this.module.type === 'v2') {
        if (
          this.module.project_type === 'cs' &&
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
      if (this.part && this.module.type === 'v2-pilot') {
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
    checkPartImplementPhaseStatus() {
      if (this.part && this.part.scorecard_part.length) {
        let title = ''
        let style = ''
        switch (this.part.scorecard_part[0].implementation) {
          case 'completed':
            title = 'Completed'
            style = 'border-green-600 text-green-600'
            break
          case 'withdrawn':
            title = 'Withdrawn'
            style = 'border-gray-600 text-gray-600'
            break
          case 'need_action':
            title = 'Needs Action'
            style = 'border-red-700 text-red-700'
            break
          case 'in_progress':
            title = 'In Progress'
            style = 'border-yellow-500 text-yellow-500'
            break
          case 'outstanding':
            title = 'Not Started'
            style = 'border-primary-600 text-primary-600'
            break
          default:
            return null
        }
        return {
          title,
          style,
        }
      } else {
        return null
      }
    },
    checkPartPhaseStatus() {
      if (this.part && this.part.scorecard_part.length) {
        let title = ''
        let style = ''
        switch (this.part.scorecard_part[0].assessment) {
          case 'achievable_with_minor_adjustments':
            title = 'Minor Adjustments'
            style = 'border-yellow-500 text-yellow-500'
            break
          case 'achievable_with_major_adjustments':
            title = 'Major Adjustments'
            style = 'border-yellow-500 text-yellow-500'
            break
          case 'not_achievable':
            title = 'Not Achievable'
            style = 'border-gray-500 text-gray-500'
            break
          case 'achievable':
            title = 'Anticipated'
            style = 'border-green-600 text-green-600'
            break
          default:
            return null
        }
        return {
          title,
          style,
        }
      } else {
        return null
      }
    },

    guidancePoints() {
      if (this.part.scorecard_part[0]) {
        return this.part.scorecard_part[0].guidance_points
      }
      return null
    },
    response() {
      if (this.part.scorecard_part[0]) {
        return this.part.scorecard_part[0].response
      }
      return null
    },
    partResponse() {
      const response = ''
      const index = this.pendingReview
        ? this.adminReviewResponses.findIndex(
            (a) => a.id === this.pendingReview.id
          )
        : -1
      if (index !== -1) {
        if (this.adminReviewResponses[index].responses.length) {
          const result = this.adminReviewResponses[index].responses.filter(
            (a) => a.part_id === this.part.id
          )
          if (result.length) {
            return result[0]
          }
        }
      }
      return response
    },
    showMultiPoints() {
      if (this.part.points) {
        if (this.module.type === 'v2-pilot') {
          if (
            this.part.min_points > 0 &&
            this.part.min_points < this.part.points &&
            this.part.points > 1
          ) {
            return true
          }
        } else if (
          (this.part.possible_points !== null &&
            this.module.project_type !== 'cs') ||
          (this.part.possible_core_points !== null &&
            this.module.project_type === 'cs')
        ) {
          return true
        }
      }
      return false
    },
  },
  watch: {
    partResponse() {
      this.partResponseSelected = this.partResponse.response
    },
    expanded(value) {
      if (value === this.part.id) {
        this.$store.dispatch('scorecard/getPartGuidance', this.part.id)
      }
    },
    response() {
      if (this.part.scorecard_part.length > 0) {
        this.partPointsVal =
          this.part.scorecard_part[0].response === 'yes'
            ? this.part.scorecard_part[0].points
            : 0
      }
    },
    part() {
      if (this.part.scorecard_part.length > 0) {
        this.guidance_summary = this.part.scorecard_part[0].summary
      }
    },
  },
  mounted() {
    if (this.part.scorecard_part.length > 0) {
      this.guidance_summary = this.part.scorecard_part[0].summary
      this.partPointsVal = this.part.scorecard_part[0].points
      this.implementPhaseVal = this.part.scorecard_part[0].implementation || ''
    }
  },
  methods: {
    ...mapActions('scorecard', [
      'updateReviewResponses',
      'setReviewResponses',
      'storePartGuidance',
    ]),
    async updatePartGuidance() {
      const data = {
        summary: this.new_guidance_summary,
        scorecardId: this.part.scorecard_part[0].id,
      }
      await this.$store.dispatch('scorecard/updatePartGuidance', data)
      this.guidance_summary = this.new_guidance_summary
      this.new_guidance_summary = ''
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
    removePartGuidance() {
      this.guidance_summary = ''
      const data = {
        summary: this.guidance_summary,
        scorecardId: this.part.scorecard_part[0].id,
      }
      this.$store.dispatch('scorecard/updatePartGuidance', data)
    },

    setResponse(value) {
      if (value) {
        const data = {
          data: {
            part_id: this.part.id,
            response: value,
            model_type: this.pendingReview.project_id
              ? 'ProjectReview'
              : 'Review',
          },
          id: this.pendingReview.id,
          phase: this.pendingReview.phase,
        }
        if (this.partResponse) {
          data.responseId = this.partResponse.id
          this.updateReviewResponses(data)
        } else {
          this.setReviewResponses(data)
        }
      }
    },
    async sendResponse(response) {
      if (
        (this.response === 'yes' || this.response === 'maybe') &&
        this.part.scorecard_part.length &&
        this.part.scorecard_part[0].option &&
        response === 'no'
      ) {
        this.$refs.confirmSelection.isHidden = false
      } else {
        await this.$store.dispatch('scorecard/partResponseChange', {
          part_id: this.part.id,
          data: {
            response,
            points: this.part.points,
          },
        })
        const data = {
          partId: this.part.id,
          response,
          concept: this.part.concept_name,
          version_id: this.$store.state.scorecard.scorecard.version_id,
          option_id: this.part.subParts[0].options[0].id,
          sub_part_id: this.part.subParts[0].id,
          points: this.part.points,
          response_reason: 'User-entered',
          phase: 'assessment',
          isHSR: this.moduleType === 'hsr',
        }
        this.$store.dispatch('scorecard/updatePart', data)
      }
    },
    sendPhaseResponse(response) {
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
      this.$store.dispatch('scorecard/sendPartResponse', data)
    },
    updateComment(payload) {
      this.$refs.adminResponse.commentNote = payload.comment.description
      this.$refs.adminResponse.editMode = true
      this.$refs.adminResponse.responseId = payload.responseId
      this.$refs.adminResponse.commentId = payload.comment.id
      this.$refs.adminResponse.forceReMount++
    },
  },
}
</script>
