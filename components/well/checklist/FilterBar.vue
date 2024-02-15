<template>
  <div class="flex relative">
    <!-- <WFeedbackModal ref="modal" class="z-20 mt-12">
      <div style="min-width: 600px">
        <WHeadingsHFour heading="Filters" class="text-center mx-auto" />
        <hr class="border-gray-300 mb-8" />
        <div class="h-84 overflow-y-scroll px-4">
          <WHeadingsHThree heading="Part Type" clas="mb-5 text-primary-800" />
          <div class="flex justify-between">
            <div>
              <div class="text-lg text-primary-800">Imperial</div>
              <div class="text-sm text-primary-500">
                Show all part requirements via imperial measurements
              </div>
            </div>
            <Toggle v-model="filters.imperial" class="mt-auto" />
          </div>
          <div class="flex justify-between mt-3">
            <div>
              <div class="text-lg text-primary-800">Preconditions</div>
              <div class="text-sm text-primary-500">
                Include parts that are preconditions
              </div>
            </div>
            <Toggle v-model="filters.show_preconditions" class="mt-auto" />
          </div>
          <div class="flex justify-between mt-3">
            <div>
              <div class="text-lg text-primary-800">Optimizations</div>
              <div class="text-sm text-primary-500">
                Include parts that are optimizations
              </div>
            </div>
            <Toggle v-model="filters.show_optimizations" class="mt-auto" />
          </div>
        </div>
        <hr class="border-gray-300 mt-8" />
        <div class="w-full mt-8">
          <WLinksBase @click.native="clearFilters">Clear all</WLinksBase>
        </div>
      </div>
    </WFeedbackModal> -->
    <WFeedbackModal
      v-if="pendingReview"
      ref="observationModal"
      class="z-20 mt-12"
    >
      <div class="max-w-2xl" style="min-width: 600px">
        <WHeadingsHFour
          :heading="pendingReview.phase + '-General Observation'"
          class="text-center mx-auto"
        />
        <hr class="border-gray-300 mb-8" />
        <FormulateForm @submit="submitObservation">
          <FormulateInput
            :key="forceReMount"
            v-model="generalObservation"
            type="richtext"
          />
          <FormulateInput class="mt-2" type="submit" label="Submit" />
        </FormulateForm>
      </div>
    </WFeedbackModal>
    <div class="w-18 h-10 flex space-x-3">
      <Popover ref="conceptPopover" y="bottom" x="right">
        <WButtonsBase
          class="my-auto bg-white text-primary-600"
          type="pill"
          icon="chevron-down"
        >
          Response
        </WButtonsBase>
        <template #content>
          <div class="flex w-64 h-24">
            <FormulateInput
              v-model="filters.response"
              class="mx-auto my-auto"
              type="checkbox"
              :options="[
                { label: 'Yes', value: 'yes' },
                { label: 'Maybe', value: 'maybe' },
                { label: 'No', value: 'no' },
              ]"
            />
          </div>
        </template>
      </Popover>

      <Popover ref="conceptPopover" y="bottom" x="right">
        <WButtonsBase
          class="my-auto bg-white text-primary-600"
          type="pill"
          icon="chevron-down"
        >
          Verification
        </WButtonsBase>
        <template #content>
          <div class="p-3 flex w-96 h-32">
            <div class="mx-auto my-auto w-full">
              <FormulateInput
                v-model="filters.verification"
                type="select"
                class="w-full"
                :options="verificationOptions"
                placeholder="Filter by Verification"
              />
            </div>
          </div>
        </template>
      </Popover>

      <!-- <WButtonsBase
        :class="['my-auto bg-white text-primary-600 whitespace-nowrap']"
        type="pill"
        icon="adjustments"
        @click.native="$refs.modal.isHidden = false"
      >
        More filters
      </WButtonsBase> -->
      <div
        v-if="
          module.hsr_status === 'achieved' &&
          scorecardsOptions &&
          scorecardsOptions.length > 1
        "
        class="mx-auto my-auto w-full"
      >
        <FormulateInput
          v-model="scorecardVersion"
          :options="scorecardsOptions"
          type="select"
          placeholder="Select checklist"
        />
      </div>
      <WButtonsBase
        v-if="
          (currentUser.role.includes('well-admin') ||
            currentUser.role.includes('external-reviewer')) &&
          pendingReview
        "
        :class="['my-auto bg-white text-primary-600']"
        type="pill"
        icon="plus"
        @click.native="
          () => {
            $refs.observationModal.isHidden = false
            generalObservation = pendingReview.general_observation
            forceReMount++
          }
        "
      >
        General Observation
      </WButtonsBase>

      <WButtonsBase
        v-if="
          filters.name !== '' ||
          filters.doc_count ||
          filters.note_count ||
          filters.point_weight ||
          !filters.show_preconditions ||
          !filters.show_optimizations ||
          filters.verification !== ''
        "
        :class="['my-auto text-white bg-primary-600']"
        type="pill"
        icon="refresh"
        @click.native="clearFilters()"
      />
    </div>
    <div class="ml-auto h-10 my-auto flex space-x-2">
      <Flyout y="bottom" x="left" class="h-full">
        <WIconsBase
          type="neutral"
          :icon="filters.imperial ? 'ruler' : 'ruler-inverted'"
          class="w-6 text-primary-600 cursor-pointer"
          @click.native="filters.imperial = !filters.imperial"
        />
        <template #content>
          <div class="text-sm w-52 text-center p-2 text-primary-600">
            Toggle Metric / Imperial Units
          </div>
        </template>
      </Flyout>
      <Flyout y="bottom" x="left" class="h-full">
        <svg
          v-if="!rowsExpanded"
          class="w-6 text-primary-600 cursor-pointer"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          @click="toggleRows()"
        >
          <path
            d="M2 6a2 2 0 012-2h5l2 2h5a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6z"
          />
        </svg>
        <svg
          v-else
          class="w-6 text-primary-600 cursor-pointer"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          @click="toggleRows()"
        >
          <path
            fill-rule="evenodd"
            d="M2 6a2 2 0 012-2h4l2 2h4a2 2 0 012 2v1H8a3 3 0 00-3 3v1.5a1.5 1.5 0 01-3 0V6z"
            clip-rule="evenodd"
          />
          <path
            d="M6 12a2 2 0 012-2h8a2 2 0 012 2v2a2 2 0 01-2 2H2h2a2 2 0 002-2v-2z"
          />
        </svg>
        <template #content>
          <div class="text-sm w-48 text-center p-2 text-primary-600">
            Expand/Collapse Rows
          </div>
        </template>
      </Flyout>
      <Flyout y="bottom" x="left" class="h-full">
        <svg
          class="w-6 text-primary-600 cursor-pointer"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
          />
        </svg>
        <template #content>
          <div
            class="text-sm w-48 text-center p-2 text-primary-600"
            @click="$parent.downloadReport('imperial')"
          >
            Download Report (Imperial)
          </div>
          <div
            class="text-sm w-48 text-center p-2 text-primary-600"
            @click="$parent.downloadReport('metric')"
          >
            Download Report (Metric)
          </div>
        </template>
      </Flyout>
    </div>
  </div>
</template>
<script>
import { mapState, mapGetters, mapActions } from 'vuex'

export default {
  props: {
    value: {
      type: Object,
      required: false,
      default() {
        return {
          concept: 'All',
          response: [],
          name: '',
        }
      },
    },
    module: {
      type: Object,
      required: true,
    },
    moduleType: {
      type: String,
      required: true,
      default: 'hsr',
    },
  },
  data() {
    return {
      filters: {
        concept: 'All',
        response: [],
        name: '',
        point_weight: null,
        show_preconditions: true,
        show_optimizations: true,
        doc_count: null,
        note_count: null,
        verification: '',
        imperial: false,
      },
      scorecardVersion: '',
      generalObservation: '',
      forceReMount: 0,
      rowsExpanded: false,
    }
  },
  computed: {
    ...mapState({
      currentUser: (state) => state.user.currentUser,
      showBanner: (state) => state.settings.showScorecardBanner,
      verifications: (state) => state.checklist.verifications,
      sharedWorkspace: (state) => state.shared.sharedWorkspace,
    }),
    ...mapGetters('review', ['pendingReview']),
    scorecardsOptions() {
      let options = []
      if (this.module.all_scorecards) {
        if (
          this.module.all_scorecards.filter((a) => a.type === 'v2-hsr').length
        ) {
          options = [
            ...this.module.all_scorecards.filter((a) => a.type === 'v2-hsr'),
          ]
        }
        if (this.module.all_scorecards.filter((a) => a.type === 'wpr').length) {
          options = [
            ...this.module.all_scorecards.filter((a) => a.type === 'wpr'),
          ]
        }
        options.map((option, index) => {
          option.label =
            'Renewal checklist ' +
            this.$dayjs(option.updated_at).format('MMMM, YYYY')
          option.value = option.id.toString()
          return option
        })
      }

      options[options.length - 1].label = options[
        options.length - 1
      ].label.replace('Renewal', 'Initial')

      return options
    },
    verificationOptions() {
      let options = []
      if (this.verifications) {
        options = [...this.verifications]

        options.map((option) => {
          option.label = option.name
          option.value = option.id.toString()
          return option
        })
      }
      return options
    },
    expanded() {
      if (this.$store.state.settings.navExpanded == null) {
        return true
      }

      if (this.$store.state.settings.navExpanded === 'false') {
        return false
      }

      if (this.$store.state.settings.navExpanded === 'true') {
        return true
      }
      return this.$store.state.settings.navExpanded
    },
    moduleTypePayload() {
      let moduleType

      // Set moduleType to Project if HSR/WPR Opt-In
      if (
        this.moduleType === 'project' ||
        this.moduleType === 'hsrOpt' ||
        this.moduleType === 'wpr'
      ) {
        moduleType = 'project'
      } else {
        moduleType = 'portfolio'
      }
      return moduleType
    },
  },
  watch: {
    filters: {
      handler(val) {
        this.$store.dispatch('checklist/updateFilters', { ...this.filters })
        this.$emit('input', val)
      },
      deep: true,
    },
    value: {
      handler(val) {
        this.$emit('input', val)
      },
      deep: true,
    },
    scorecardVersion(payload) {
      this.changeScorecardVersion(payload)
    },
  },
  created() {
    this.filters.imperial = false
    // set imperial as true if the country uses imperial by default
    if (this.project) {
      if (this.project.addresses && this.project.addresses.length > 0) {
        if (
          this.project.addresses[0].country_code === 'US' ||
          this.project.addresses[0].country_code === 'LR' ||
          this.project.addresses[0].country_code === 'MM'
        ) {
          this.filters.imperial = true
        }
      }
    }
    if (!this.value) {
      this.$emit('input', this.filters)
    }
  },
  methods: {
    ...mapActions('review', ['submitReviewObservation']),
    ...mapActions('checklist', ['getReviewResponses']),
    async changeScorecardVersion(payload) {
      // call api if the version is changed
      const id = payload
      this.$parent.loadingFeature = true
      await this.$store.dispatch('checklist/getScorecard', id)
      await this.$store.dispatch('checklist/getConceptAndFeatures', id)
      await this.$store.dispatch('checklist/getScores')
      await this.$store.dispatch('checklist/getHSRVerifications')
      await this.$store.dispatch('checklist/updatePartsList', true)
      await this.$store.dispatch('checklist/getResponseSummary', id)
      this.$parent.loadingFeature = false
      this.getReviewNotes()

      if (this.moduleType === 'hsr') {
        const scorecardVersion = this.scorecardsOptions.filter(
          (a) => a.id === parseInt(this.scorecardVersion)
        )
        if (scorecardVersion.length) {
          await this.$store.dispatch(
            'checklist/getStandardVersionName',
            scorecardVersion[0].version_id
          )
          await this.$store.dispatch(
            'review/getSharedReviewList',
            this.$store.state.shared.sharedWorkspace.id
          )
        }
      } else if (this.moduleType === 'wpr') {
        const scorecardVersion = this.scorecardsOptions.filter(
          (a) => a.id === parseInt(this.scorecardVersion)
        )
        if (scorecardVersion.length) {
          await this.$store.dispatch(
            'checklist/getStandardVersionName',
            scorecardVersion[0].version_id
          )
          await this.$store.dispatch(
            'review/getSharedReviewList',
            this.module.wpr_scorecard_version_id
          )
        }
      } else {
        await this.$store.dispatch(
          'checklist/getStandardVersionName',
          this.module.hsr_scorecard_version_id
        )
      }

      const target = {
        response: [],
        name: '',
        point_weight: null,
        show_preconditions: true,
        show_optimizations: true,
        doc_count: null,
        note_count: null,
        concept: 'All',
        isHSR: true,
        verification: '',
      }

      this.$store.dispatch('checklist/updateFilters', target)

      // manipulate frontend for enabling and disabling fields

      const scorecard = parseInt(this.scorecardVersion)

      this.$store.commit(
        'checklist/hsrActiveChecklist',
        scorecard === this.module.hsr_scorecard_id
      )
    },
    getReviewNotes() {
      this.getReviewResponses({
        module: this.moduleTypePayload,
        module_id: this.module.id,
      })
    },

    clearFilters() {
      this.filters = {
        concept: 'All',
        response: [],
        name: '',
        point_weight: null,
        show_preconditions: true,
        show_optimizations: true,
        doc_count: null,
        note_count: null,
        verification: '',
        imperial: false,
      }
    },
    expandAllRows() {
      this.$parent.$refs['table-row'].map((row) => (row.expanded = true))
    },
    collapseAllRows() {
      this.$parent.$refs['table-row'].map((row) => (row.expanded = false))
    },
    toggleBanner() {
      if (this.showBanner == null || this.showBanner === 'false') {
        this.$store.commit('settings/setScorecardBannerState', 'true')
      } else {
        this.$store.commit('settings/setScorecardBannerState', 'false')
      }
    },
    toggleRows() {
      if (this.rowsExpanded) {
        this.collapseAllRows()
      } else {
        this.expandAllRows()
      }
      this.rowsExpanded = !this.rowsExpanded
    },
    submitObservation() {
      let apiUurl = `api/admin/portfolio/${this.module.id}/review/${this.pendingReview.id}/generalObservation`
      if (this.moduleType === 'project') {
        apiUurl = `api/admin/project/${this.module.id}/review/${this.pendingReview.id}/generalObservation`
      }
      this.submitReviewObservation({
        url: apiUurl,
        data: { general_observation: this.generalObservation },
      }).then((response) => {
        this.$refs.observationModal.isHidden = true
        if (this.moduleType !== 'project') {
          this.$store.dispatch('review/getSharedReviewList', this.module.id)
        } else {
          this.$store.dispatch('review/getReviewList', this.module.id)
        }
      })
    },
  },
}
</script>
