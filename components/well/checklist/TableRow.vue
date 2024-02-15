<template>
  <tr class="hover:bg-primary-100">
    <td colspan="5">
      <div
        :class="[
          expanded && 'bg-primary-100',
          'cursor-pointer flex w-full items-center',
        ]"
      >
        <div
          class="my-auto py-2 text-sm leading-5 font-medium text-primary-500 px-5"
          @click="expanded = !expanded"
        >
          <div class="font-medium w-12 text-center flex pr-5">
            {{ getTablePart(part) }}
          </div>
        </div>
        <div
          class="w-9/12 my-auto px-2 py-2 text-sm leading-5 font-medium text-gray-900"
          @click="expanded = !expanded"
        >
          <div class="font-medium flex">
            <div>
              <div class="text-primary-600 font-bold">
                {{ getTableLabelName(part) }}
              </div>
              <div class="text-sm text-primary-900">
                {{ part.feature_name }}
              </div>
            </div>
            <div v-if="showWarningSign" class="ml-2">
              <WIconsBase
                icon="exclamation-circle"
                class="text-danger-300 mr-2"
              />
            </div>
          </div>
        </div>

        <div
          class="my-auto px-6 py-2 text-sm leading-5 font-medium text-gray-900"
        >
          <div class="w-56 flex">
            <ScorecardHoverIcon :part="part" type="comments" />
            <ScorecardHoverIcon :part="part" type="documents" />
            <div class="flex w-48 ml-2">
              <WButtonsBase
                type="neutral"
                :class="[
                  response === 'yes'
                    ? 'bg-primary-600 text-white'
                    : 'bg-white text-primary-600',
                  'border rounded-l-lg transition-colors duration-300',
                ]"
                :disabled="!isActiveChecklist"
                @click.native="sendResponse('yes')"
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
                :disabled="!isActiveChecklist"
                @click.native="sendResponse('maybe')"
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
                :disabled="!isActiveChecklist"
                @click.native="sendResponse('no')"
              >
                No
              </WButtonsBase>
            </div>
          </div>
        </div>
      </div>
      <div
        v-if="expanded"
        :class="[
          expanded && 'bg-primary-200',
          'w-full px-4 py-6 border-t bg-primary-100 space-y-3',
        ]"
      >
        <LazyAccordiansBase label="Requirements" :expanded="true">
          <template #content>
            <div
              v-for="(sub_part, index) in part.subParts"
              :key="index"
              class="my-12"
            >
              <div class="font-black text-primary-800 pl-2 text-lg text-center">
                {{ getSubPartTitle(sub_part) }}
              </div>
              <div class="mt-2 space-y-2">
                <ChecklistSubPartOption
                  v-if="
                    part.scorecard_part.length &&
                    part.scorecard_part.filter(
                      (part) => part.sub_part_id === sub_part.id
                    ).length > 0 &&
                    part.scorecard_part.filter(
                      (part) => part.sub_part_id === sub_part.id
                    )[0].option_id
                  "
                  ref="subPartOption"
                  :part="part"
                  :sub-part="sub_part"
                  :scorecard-option="
                    part.scorecard_part.filter(
                      (part) => part.sub_part_id === sub_part.id
                    )[0].option_id
                  "
                />
                <ChecklistSubPartOption
                  v-else
                  ref="subPartOption"
                  :part="part"
                  :sub-part="sub_part"
                  :scorecard-option="'null'"
                />
              </div>
            </div>
            <div class="space-y-2">
              <div
                v-if="filterPartGuidance"
                class="bg-primary-100 w-full border-l-4 border-primary-400 p-4"
              >
                <div class="font-bold text-primary-600">
                  WELL Core Guidance:
                </div>
                <p
                  v-for="(guidance, index) in filterPartGuidance"
                  :key="index"
                  class="text-sm leading-5 font-light text-primary-600"
                  v-html="guidance.doc_guidance"
                ></p>
                <FormulateInput
                  v-if="showIfGuidanceTrue()"
                  v-model="partGuianceOpted"
                  type="checkbox"
                  label="I would like to pursue additional point opportunities for WELL Core."
                  @input="togglePartGuidance()"
                />
              </div>
            </div>
            <div
              v-if="part.note && part.note !== ''"
              class="bg-yellow-50 border-l-4 border-yellow-400 p-4 mt-4"
            >
              <div class="flex">
                <div class="flex-shrink-0">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                    class="h-5 w-5 text-yellow-400"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                      clip-rule="evenodd"
                    ></path>
                  </svg>
                </div>
                <div class="ml-3">
                  <!-- eslint-disable-next-line vue/no-v-html -->
                  <p
                    class="text-sm text-yellow-700"
                    v-html="
                      addGlossaryTooltips(
                        part.note,
                        $store.state.shared.sharedWorkspace
                      )
                    "
                  ></p>
                </div>
              </div>
            </div>
          </template>
        </LazyAccordiansBase>

        <LazyAccordiansBase label="Resources">
          <template #content>
            <div class="flex space-x-2">
              <div class="w-full">
                <div
                  class="h-64 bg-gray-100 border border-primary-200 rounded overflow-y-auto"
                >
                  <ChecklistSubPartResource
                    :feature-id="part.feature_id"
                    class="p-5"
                  />
                </div>
              </div>
            </div>
          </template>
        </LazyAccordiansBase>
        <LazyAccordiansBase
          label="Next Steps"
          type="secondary"
          :expanded="true"
        >
          <template #content>
            <ChecklistPartNextSteps
              :key="part.id"
              :module-type="moduleType"
              :module="module"
              :part="part"
              :part-id="part.id"
            />
          </template>
        </LazyAccordiansBase>
        <LazyAccordiansBase
          v-if="
            pendingReview &&
            ($store.state.user.currentUser.role.includes('well-admin') ||
              $store.state.user.currentUser.role.includes(
                'external-reviewer'
              )) &&
            (pendingReview.phase.indexOf('Health-Safety Review') !== -1 ||
              pendingReview.phase === 'Curative Action Plan Review' ||
              pendingReview.is_hsr)
          "
          :label="'Admin Review - ' + pendingReview.phase"
        >
          <template #content>
            <FormulateInput
              id="reviewComment"
              v-model="partResponseSelected"
              type="select"
              :options="responseOptions"
              placeholder="Select response"
              @input="setResponse"
            />
            <div class="flex">
              <div class="w-1/2">
                <ChecklistAdminResponse
                  ref="adminResponse"
                  :part-id="part.id"
                />
              </div>
              <div class="w-1/2">
                <ChecklistAdminComments
                  :part-id="part.id"
                  @update-comment="updateComment"
                />
              </div>
            </div>
          </template>
        </LazyAccordiansBase>
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
    parts: {
      type: Array,
      required: true,
      default: () => {
        return []
      },
    },
    activeConcept: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      expanded: false,
      new_guidance_summary: null,
      guidance_summary: null,
      partResponseSelected: null,
      partGuianceOpted: false,
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
    ...mapGetters('checklist', ['filterPartGuidance']),
    ...mapState({
      project: (state) => state.project.project,
      checklist: (state) => state.checklist.scorecard,
      verifications: (state) => state.checklist.verifications,
      adminReviewResponses: (state) => state.checklist.adminReviewResponses,
      isActiveChecklist: (state) => state.checklist.isActiveChecklist,
      recertificationList: (state) => state.recertification.recertificationList,
      scorecard: (state) => state.checklist.scorecard,
    }),
    showWarningSign() {
      if (!this.isActiveChecklist || !this.recertificationList.length) {
        return false
      }
      if (this.part.document_count || this.part.new_document) {
        return false
      }
      if (this.response === 'no') {
        return false
      }

      if (
        this.verificationlist.includes('On-going Data Report') ||
        this.hasAuditVerification
      ) {
        if (this.module.no_of_assets === 1 || this.moduleType === 'project') {
          if (
            this.part.all_document_count &&
            !this.part.document_count &&
            !this.part.new_document
          ) {
            return true
          } else if (
            this.part.invalid_document_count &&
            !this.part.document_count &&
            !this.part.new_document
          ) {
            return true
          }
        } else if (this.part.invalid_document_count) {
          return true
        }
      }

      if (
        this.hasOtherDocuments &&
        !this.part.document_count &&
        !this.part.new_document
      ) {
        return true
      }
      return false
    },
    hasOtherDocuments() {
      const verification = [
        'Letter of Assurance – Owner',
        'Policy and/or Operations Schedule',
      ]
      let isOther = false
      for (const subpart of this.part.subParts) {
        for (const option of subpart.options) {
          option.verifications.forEach((e) => {
            if (verification.includes(e.name) && !isOther) {
              isOther = true
            }
          })
        }
      }

      return isOther
    },
    hasAuditVerification() {
      const verification = [
        'On-site Photographs',
        'On-going Maintenance Report',
        'Professional Narrative',
        'Technical Document',
      ]
      let isAudit = false
      for (const subpart of this.part.subParts) {
        for (const option of subpart.options) {
          option.verifications.forEach((e) => {
            if (verification.includes(e.name) && !isAudit) {
              isAudit = true
            }
          })
        }
      }

      return isAudit
    },
    verificationlist() {
      const verification = []
      const verificationname = []
      for (const subpart of this.part.subParts) {
        for (const option of subpart.options) {
          option.verifications.map((arr) => verification.push(arr))
        }
      }
      for (let i = 0; i < verification.length; i++) {
        verificationname.push(verification[i].name)
      }
      const isverification = verificationname.filter(
        (n) => n === 'On-going Data Report' || n === 'On-site Photographs'
      )
      return isverification
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
  },
  watch: {
    partResponse() {
      this.partResponseSelected = this.partResponse.response
    },
    expanded(value) {
      if (value) {
        this.$store.dispatch('checklist/getPartGuidance', this.part.id)
      }
    },
  },
  mounted() {
    if (this.part.scorecard_part.length > 0) {
      this.guidance_summary = this.part.scorecard_part[0].summary
    }
  },
  methods: {
    ...mapActions('checklist', [
      'updateReviewResponses',
      'setReviewResponses',
      'storePartGuidance',
    ]),
    getTableLabelName(part) {
      // Filter out current table part
      const filteredParts = this.parts.filter((p) => p.id !== part.id)
      // Check if the part is multiple
      const hasMultipleParts = filteredParts.some(
        (p) => p.feature_prefix === part.feature_prefix
      )

      // If part has multiple return its part name
      // If not return its feature prefix
      if (hasMultipleParts) return part.name
    },

    getTablePart(part) {
      // Filter out current table part
      const filteredParts = this.parts.filter((p) => p.id !== part.id)
      // Check if the part is multiple
      const hasMultipleParts = filteredParts.some(
        (p) => p.feature_prefix === part.feature_prefix
      )

      // If part has multiple return its part prefix
      // If not return its feature prefix
      if (hasMultipleParts)
        return `${
          this.scorecard.type === 'wpr' ? 'P' : ''
        }${part.part_prefix.replace('0', '')}`
      return `${this.scorecard.type === 'wpr' ? 'P' : ''}${part.feature_prefix}`
    },
    addGlossaryTooltips(fieldText, projectInfo = null) {
      fieldText = this.addCitations(fieldText, projectInfo)
      const originalText = fieldText
      const glossaryTerm = this.$store.state.checklist.glossaryTerm
      for (let i = 0; i < glossaryTerm.length; i++) {
        const term = glossaryTerm[i].term
        let def = glossaryTerm[i].description
        def = def
          .replace(/"/g, '&quot;')
          .replace(/“/g, '&quot;')
          .replace(/”/g, '&quot;')
        let pos = originalText
          .toLowerCase()
          .indexOf(' ' + term.toLowerCase() + ' ')
        if (pos !== -1) {
          pos = fieldText.toLowerCase().indexOf(' ' + term.toLowerCase() + ' ')
          const currentText = fieldText.substr(pos + 1, term.length + 1)
          const replaceBy =
            '<span class="has-tooltip"><span class="tooltip rounded shadow-lg mb-10 p-2 bg-gray-100">' +
            def +
            '</span><span class="border-dotted border-b-2 border-primary-600 cursor-pointer">' +
            currentText +
            '</span></span>'

          fieldText =
            fieldText.substr(0, pos + 1) +
            replaceBy +
            fieldText.substr(pos + term.length + 1)
        }
      }
      return fieldText
    },
    addCitations(fieldText, projectInfo = null) {
      fieldText = fieldText.replace(/<span>/g, '')
      fieldText = fieldText.replace(/<\/span>/g, '')
      fieldText = fieldText.replace(/CIT:/g, '')
      const pattern = /(<sup>(\[\d*(,*\d*-*\d*)*\])<\/sup>)/g
      const temp = fieldText.match(new RegExp(pattern.source, pattern.flags))
      if (temp) {
        const result = fieldText
          .match(new RegExp(pattern.source, pattern.flags))
          .map((match) => new RegExp(pattern.source, pattern.flags).exec(match))
        for (let i = 0; i < result.length; i++) {
          if (result[i] !== null) {
            const oldMatch = result[i][2]
            const newResult = ''
            fieldText = fieldText.replace(oldMatch, newResult)
          }
        }
      }
      return this.unitFilter(fieldText, projectInfo)
    },
    unitFilter(data, projectInfo = null) {
      let e = data
      const b = e.match(/{{well-unit}}(.*?){{\/well-unit}}/g)
      if (b && b.length) {
        b.forEach((element) => {
          const tagLength = element.length
          const tagIndex = e.indexOf('{{well-unit}}')
          let temp = element.replace(/{{\/?well-unit}}/g, '')
          temp = this.$store.state.scorecard.activeFilters.imperial
            ? temp.split('|')[0]
            : temp.split('|')[1]
          const firstString = e.slice(0, tagIndex)
          const secondString = e.slice(tagIndex + tagLength, e.length)
          e = firstString + temp + secondString
        })
      }
      if (projectInfo) {
        return this.pointsFilter(e, projectInfo)
      } else {
        return e
      }
    },
    pointsFilter(data, projectInfo) {
      const projectTypeIsWELLCore = projectInfo.project_type === 'cs'
      let e = data
      const b = e.match(/{{well-points}}(.*?){{\/well-points}}/g)
      if (b && b.length) {
        b.forEach((element) => {
          const tagLength = element.length
          const tagIndex = e.indexOf('{{well-points}}')
          let temp = element.replace(/{{\/?well-points}}/g, '')
          temp = !projectTypeIsWELLCore
            ? temp.split('|')[0]
            : temp.split('|')[1]
          const firstString = e.slice(0, tagIndex)
          const secondString = e.slice(tagIndex + tagLength, e.length)
          e = firstString + temp + secondString
        })
      }
      return e
    },
    async updatePartGuidance() {
      const data = {
        summary: this.new_guidance_summary,
        scorecardId: this.part.scorecard_part[0].id,
      }
      await this.$store.dispatch('checklist/updatePartGuidance', data)
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
        version_id: this.$store.state.checklist.scorecard.version_id,
        option_id: this.part.subParts[0].options[0].id,
        sub_part_id: this.part.subParts[0].id,
        points: this.part.points,
        guidancePoints: {
          guidance_points: max,
        },
        response_reason: 'User-entered',
        phase: 'assessment',
        isHSR: this.moduleType === 'hsr',
        scorecardId: this.checklist.id,
      }
      this.storePartGuidance(data)
    },
    removePartGuidance() {
      this.guidance_summary = ''
      const data = {
        summary: this.guidance_summary,
        scorecardId: this.part.scorecard_part[0].id,
      }
      this.$store.dispatch('checklist/updatePartGuidance', data)
    },
    getSubPartTitle(subpart) {
      let title = 'For '
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
    sendResponse(response) {
      if (this.part.scorecard_part.length === 0) {
        const options = this.part.subParts.filter(
          (a) => a.options.length > 1 && a.condition === 'OR'
        )
        if (options.length && response !== 'no') {
          this.$store.dispatch('notifications/toastMessage', {
            message: 'Please select an option below.',
          })
          this.expanded = true
          return false
        }
      }
      const data = {
        partId: this.part.id,
        response,
        concept: this.part.concept_name,
        version_id: this.$store.state.checklist.scorecard.version_id,
        option_id: this.part.subParts[0].options[0].id,
        sub_part_id: this.part.subParts[0].id,
        points: this.part.points,
        response_reason: 'User-entered',
        phase: 'assessment',
        isHSR: this.moduleType === 'hsr',
      }

      this.$store.dispatch('checklist/updatePart', data)
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
<style lang="css">
.glossary-term {
  border-bottom: 1px dotted #fff;
  font-weight: 500;
}
.tooltip {
  display: none;
  position: absolute;
}

.has-tooltip:hover .tooltip {
  display: flex;
  z-index: 50;
}
</style>
