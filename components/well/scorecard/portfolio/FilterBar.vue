<template>
  <div class="flex flex-wrap relative">
    <div class="flex relative w-full px-11">
      <Slideover ref="filterSlider" class="z-10">
        <template #header>
          <div class="flex justify-between items-center w-full">
            <span class="font-semibold">Filters</span>
            <div class="text-primary-600">
              <span
                class="hover:text-primary-500 hover:cursor-pointer"
                @click="applyFilters()"
                >Apply</span
              >
              |
              <span
                class="hover:text-primary-500 hover:cursor-pointer"
                @click="clearSidebarFilters()"
                >Clear</span
              >
            </div>
          </div>
        </template>
        <template #content>
          <div class="border-b w-full absolute left-0"></div>
          <div class="divide-y">
            <div
              v-for="(el, i) in slideOverFilters"
              :key="i"
              class="py-5 text-sm"
            >
              <button
                class="text-primary-900 flex items-center w-full justify-between"
                @click="el.expand = !el.expand"
              >
                <span class="flex items-center">
                  <WIconsBase v-if="el.icon" :icon="el.icon" />
                  {{ el.name }}</span
                >
                <WIconsBase :icon="el.expand ? 'chevron-up' : 'chevron-down'" />
              </button>
              <div
                :ref="'container' + i"
                :class="`overflow-hidden max-h-0 transition-all duration-500 ${
                  el.expand ? `max-h-40 overflow-y-auto` : ''
                }`"
              >
                <FormulateInput
                  v-model="el.value"
                  class="mx-auto my-auto !focus:ring-0 mt-2"
                  type="checkbox"
                  :options="
                    el.options === 'verif'
                      ? verificationOptions
                      : el.options === 'space_types'
                      ? spaceTypesOptions
                      : el.options
                  "
                />
              </div>
            </div>
          </div>
        </template>
      </Slideover>
      <WFeedbackModal ref="modal" class="z-20 mt-12">
        <div style="min-width: 600px">
          <WHeadingsHFour heading="More filters" class="text-center mx-auto" />
          <hr class="border-gray-300 mb-8" />
          <div class="h-84 overflow-y-scroll px-4">
            <WHeadingsHThree heading="Part Type" clas="mb-5 text-primary-800" />

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
            <div class="flex justify-between mt-3">
              <div>
                <div class="text-lg text-primary-800">Filter by spaces</div>
                <div class="text-sm text-primary-500">
                  Include spaces that this project includes
                </div>
              </div>
              <Toggle
                v-model="filters.show_space_types"
                class="mt-auto"
                @click.native="toggleSpaceFilter()"
              />
            </div>
            <div
              v-if="module.benchmark_opt === 1 && module.type === 'v2-pilot'"
              class="flex justify-between mt-3"
            >
              <div class="text-lg text-primary-800">Assessment</div>
              <div>
                <FormulateInput
                  v-model="filters.assessment"
                  :options="phaseArray.assessment"
                  type="select"
                  placeholder="Select assessment phase"
                />
              </div>
            </div>
            <div
              v-if="module.type === 'v2-pilot'"
              class="flex justify-between mt-3"
            >
              <div class="text-lg text-primary-800">Implementation</div>
              <div>
                <FormulateInput
                  v-model="filters.implementation"
                  :options="phaseArray.implementation"
                  type="select"
                  placeholder="Select implementation phase"
                />
              </div>
            </div>
          </div>
          <hr class="border-gray-300 mt-8" />
          <div class="w-full mt-8">
            <WLinksBase @click.native="clearFilters">Clear all</WLinksBase>
          </div>
        </div>
      </WFeedbackModal>
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
      <div class="h-10 flex space-x-3">
        <div class="relative h-10">
          <div
            class="absolute top-0 flex h-full bg-primary-100 text-primary-400 border border-primary-300 rounded-l"
          >
            <div class="my-auto px-3">
              <svg
                class="w-5 text-primary-700"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
          </div>
          <FormulateInput
            v-model="filters.name"
            class="pl-10 h-10"
            type="text"
            placeholder="Search"
          />
        </div>
        <WButtonsBase
          v-if="scorecard.type === 'v2'"
          class="w-32"
          icon="filter"
          @click.native="$refs.filterSlider.isHidden = false"
        >
          Filters
        </WButtonsBase>
        <div v-else class="flex space-x-2">
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

          <Popover
            v-if="scorecard.type !== 'wpr'"
            ref="conceptPopover"
            y="bottom"
            x="right"
          >
            <WButtonsBase
              class="my-auto bg-white text-primary-600"
              type="pill"
              icon="chevron-down"
            >
              Verification
            </WButtonsBase>
            <template #content>
              <div class="p-3 flex w-96">
                <div class="mx-auto my-auto w-full">
                  <FormulateInput
                    v-model="filters.loa"
                    type="select"
                    class="w-full"
                    label="Letter of assurance"
                    :options="loaOptions"
                    placeholder="Filter by Verification"
                  />
                  <FormulateInput
                    v-model="filters.annotated_doc"
                    type="select"
                    class="w-full"
                    label="Annotated documents"
                    :options="annotatedDocumentOptions"
                    placeholder="Filter by Verification"
                  />
                  <FormulateInput
                    v-model="filters.on_site"
                    type="select"
                    class="w-full"
                    label="On-site verification"
                    :options="onSiteOptions"
                    placeholder="Filter by Verification"
                  />
                  <hr class="border-gray-300 mt-8" />
                  <div class="w-full mt-2">
                    <WLinksBase @click.native="clearFilters"
                      >Clear all</WLinksBase
                    >
                  </div>
                </div>
              </div>
            </template>
          </Popover>

          <WButtonsBase
            v-if="module.type !== 'wpr'"
            :class="['my-auto bg-white text-primary-600']"
            type="pill"
            icon="adjustments"
            @click.native="$refs.modal.isHidden = false"
          >
            More filters
          </WButtonsBase>
        </div>

        <div
          v-if="currentUser.role.includes('well-admin') && portfolio"
          class="w-48 whitespace-nowrap"
        >
          <WButtonsBase
            @click.native="
              updateSurveyCompleted(false),
                $router.push({
                  path: `/portfolio/${portfolio.portfolio_number}/scorecard/survey`,
                  query: { ...$route.query },
                })
            "
          >
            Admin: Re-enable Survey
          </WButtonsBase>
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
        <div v-if="scorecard.type !== 'v2'">
          <WButtonsBase
            v-if="
              filters.concept !== 'All' ||
              filters.name !== '' ||
              filters.doc_count ||
              filters.note_count ||
              filters.point_weight ||
              filters.verification ||
              filters.on_site ||
              filters.response.length > 0 ||
              filters.annotated_doc ||
              filters.loa ||
              !filters.show_preconditions ||
              !filters.show_optimizations ||
              !filters.assessment ||
              !filters.implementation
            "
            :class="['my-auto text-white bg-primary-600']"
            type="pill"
            icon="refresh"
            @click.native="clearFilters()"
          />
        </div>
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
        <Flyout v-if="module.type !== 'wpr'" y="bottom" x="left" class="h-full">
          <WIconsBase
            type="neutral"
            :icon="showBanner === 'true' ? 'photograph' : 'photograph-inverted'"
            class="w-6 text-primary-600 cursor-pointer"
            @click.native="toggleBanner()"
          />
          <template #content>
            <div class="text-sm w-48 text-center p-2 text-primary-600">
              Show/Hide Banner
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

        <Popover y="bottom" x="left">
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
        </Popover>
      </div>
    </div>
    <div
      v-if="module.type !== 'wpr'"
      class="text-sm flex relative w-full mt-2 justify-around -mb-4 bg-gray-50 shadow-inner pt-3 mt-3"
    >
      <WLinksBase
        :class="[
          filters.concept === 'All'
            ? 'border-b-2 border-secondary-700 pb-2 px-1 font-bold'
            : 'px-1',
        ]"
        type="pillOption"
        @click.native="filters.concept = 'All'"
      >
        All
      </WLinksBase>
      <WLinksBase
        :style="{
          color: filters.concept === 'Air' ? colors[filters.concept] : 'gray',
        }"
        :class="[
          filters.concept === 'Air'
            ? 'font-bold border-b-2 border-secondary-700 pb-2 px-1 font-bold'
            : 'px-1',
        ]"
        type="pillOption"
        @click.native="filters.concept = 'Air'"
      >
        Air
      </WLinksBase>
      <WLinksBase
        :style="{
          color: filters.concept === 'Water' ? colors[filters.concept] : 'gray',
        }"
        :class="[
          filters.concept === 'Water'
            ? 'border-b-2 border-secondary-700 pb-2 px-1 font-bold'
            : 'px-1',
        ]"
        type="pillOption"
        @click.native="filters.concept = 'Water'"
      >
        Water
      </WLinksBase>
      <WLinksBase
        :style="{
          color:
            filters.concept === 'Nourishment'
              ? colors[filters.concept]
              : 'gray',
        }"
        :class="[
          filters.concept === 'Nourishment'
            ? 'border-b-2 border-secondary-700 pb-2 px-1 font-bold'
            : 'px-1',
        ]"
        type="pillOption"
        @click.native="filters.concept = 'Nourishment'"
      >
        Nourishment
      </WLinksBase>
      <WLinksBase
        :style="{
          color: filters.concept === 'Light' ? colors[filters.concept] : 'gray',
        }"
        :class="[
          filters.concept === 'Light'
            ? 'border-b-2 border-secondary-700 pb-2 px-1 font-bold'
            : 'px-1',
        ]"
        type="pillOption"
        @click.native="filters.concept = 'Light'"
      >
        Light
      </WLinksBase>
      <WLinksBase
        :style="{
          color:
            filters.concept === 'Movement' ? colors[filters.concept] : 'gray',
        }"
        :class="[
          filters.concept === 'Movement'
            ? 'border-b-2 border-secondary-700 pb-2 px-1 font-bold'
            : 'px-1',
        ]"
        type="pillOption"
        @click.native="filters.concept = 'Movement'"
      >
        Movement
      </WLinksBase>
      <WLinksBase
        :style="{
          color:
            filters.concept === 'Thermal Comfort'
              ? colors[filters.concept]
              : 'gray',
        }"
        :class="[
          filters.concept === 'Thermal Comfort'
            ? 'border-b-2 border-secondary-700 pb-2 px-1 font-bold'
            : 'px-1',
        ]"
        type="pillOption"
        @click.native="filters.concept = 'Thermal Comfort'"
      >
        Thermal Comfort
      </WLinksBase>
      <WLinksBase
        :style="{
          color: filters.concept === 'Sound' ? colors[filters.concept] : 'gray',
        }"
        :class="[
          filters.concept === 'Sound'
            ? 'border-b-2 border-secondary-700 pb-2 px-1 font-bold'
            : 'px-1',
        ]"
        type="pillOption"
        @click.native="filters.concept = 'Sound'"
      >
        Sound
      </WLinksBase>
      <WLinksBase
        :style="{
          color:
            filters.concept === 'Materials' ? colors[filters.concept] : 'gray',
        }"
        :class="[
          filters.concept === 'Materials'
            ? 'border-b-2 border-secondary-700 pb-2 px-1 font-bold'
            : 'px-1',
        ]"
        type="pillOption"
        @click.native="filters.concept = 'Materials'"
      >
        Materials
      </WLinksBase>
      <WLinksBase
        :style="{
          color: filters.concept === 'Mind' ? colors[filters.concept] : 'gray',
        }"
        :class="[
          filters.concept === 'Mind'
            ? 'border-b-2 border-secondary-700 pb-2 px-1 font-bold'
            : 'px-1',
        ]"
        type="pillOption"
        @click.native="filters.concept = 'Mind'"
      >
        Mind
      </WLinksBase>
      <WLinksBase
        :style="{
          color:
            filters.concept === 'Community' ? colors[filters.concept] : 'gray',
        }"
        :class="[
          filters.concept === 'Community'
            ? 'border-b-2 border-secondary-700 pb-2 px-1 font-bold'
            : 'px-1',
        ]"
        type="pillOption"
        @click.native="filters.concept = 'Community'"
      >
        Community
      </WLinksBase>
      <WLinksBase
        v-if="project"
        :style="{
          color:
            filters.concept === 'Innovation' ||
            filters.concept === 'Innovations'
              ? colors[filters.concept]
              : 'gray',
        }"
        :class="[
          filters.concept === 'Innovation' || filters.concept === 'Innovations'
            ? 'border-b-2 border-secondary-700 pb-2 px-1 font-bold'
            : 'px-1',
        ]"
        type="pillOption"
        @click.native="
          project.type === 'v2-pilot'
            ? (filters.concept = 'Innovations')
            : (filters.concept = 'Innovation')
        "
      >
        <span v-if="project.type === 'v2-pilot'"> Innovations </span>
        <span v-else> Innovation </span>
      </WLinksBase>
      <WLinksBase
        v-if="portfolio"
        :style="{
          color:
            filters.concept === 'Innovation' ||
            filters.concept === 'Innovations'
              ? colors[filters.concept]
              : 'gray',
        }"
        :class="[
          filters.concept === 'Innovation' || filters.concept === 'Innovations'
            ? 'border-b-2 border-secondary-700 pb-2 px-1 font-bold'
            : 'px-1',
        ]"
        type="pillOption"
        @click.native="
          portfolio.type === 'v2-pilot'
            ? (filters.concept = 'Innovations')
            : (filters.concept = 'Innovation')
        "
      >
        <span v-if="portfolio.type === 'v2-pilot'"> Innovations </span>
        <span v-else> Innovation </span>
      </WLinksBase>
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
  },
  data() {
    return {
      filters: {
        concept: 'All',
        response: [],
        name: '',
        verification: '',
        on_site: '',
        loa: '',
        annotated_doc: '',
        point_weight: null,
        show_space_types: true,
        show_preconditions: true,
        show_optimizations: true,
        doc_count: null,
        note_count: null,
        imperial: false,
        assessment: '',
        implementation: '',
        is_core: false,
      },
      generalObservation: '',
      forceReMount: 0,
      rowsExpanded: false,
      colors: {
        Air: '#144249',
        Water: '#07667F',
        Nourishment: '#0B7B97',
        Light: '#3B9DB6',
        Movement: '#91CBD3',
        'Thermal Comfort': '#A7D6AD',
        Sound: '#63A984',
        Materials: '#40927D',
        Mind: '#2F6B5E',
        Community: '#23483D',
        Innovation: '#263d46',
        Innovations: '#263d46',
      },
      phaseArray: {
        assessment: [
          { label: 'Select assessment phase', value: '' },
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
          { label: 'Select implementation phase', value: '' },
          { value: 'outstanding', label: 'Not Started' },
          { value: 'in_progress', label: 'In Progress' },
          { value: 'completed', label: 'Completed' },
          { value: 'need_action', label: 'Needs Action' },
          { value: 'withdrawn', label: 'Withdrawn' },
        ],
      },
      tagsList: [],
      slideOverFilters: [
        {
          name: 'Response',
          value: [],
          expand: false,
          type: 'response',
          icon: null,
          options: [
            { label: 'Yes', value: 'yes' },
            { label: 'Maybe', value: 'maybe' },
            { label: 'No', value: 'no' },
          ],
        },
        {
          name: 'Verification',
          value: [],
          expand: false,
          type: 'verification',
          icon: null,
          options: 'verif',
        },
        {
          name: 'Part Type',
          value: [],
          expand: false,
          type: 'feature_type',
          icon: null,
          options: [
            { label: 'Preconditions', value: 'P' },
            { label: 'Optimization', value: 'O' },
          ],
        },
        // badge
        {
          name: 'Priorities',
          value: [],
          expand: false,
          type: 'tags',
          icon: 'color-swatch',
          options: [],
        },
        {
          name: 'Space Type',
          value: [],
          expand: false,
          type: 'space_types',
          icon: 'office-building',
          options: 'space_types',
        },
        // rating
        {
          name: 'Ratings',
          value: [],
          expand: false,
          type: 'tags',
          icon: 'chart-bar-solid',
          options: [],
        },
        // stragegy type
        {
          name: 'Strategy Type',
          value: [],
          expand: false,
          type: 'tags',
          icon: 'share',
          options: [],
        },
        // crosswalk
        {
          name: 'Crosswalk',
          value: [],
          expand: false,
          type: 'tags',
          icon: 'switch-horizontal',
          options: [],
        },
      ],
    }
  },
  computed: {
    ...mapState({
      showBanner: (state) => state.settings.showScorecardBanner,
      verifications: (state) => state.scorecard.verifications,
      annotatedDocuments: (state) => state.scorecard.annotatedDocuments,
      letterOfAssurances: (state) => state.scorecard.letterOfAssurances,
      onSites: (state) => state.scorecard.onSites,
      project: (state) => state.project.project,
      portfolio: (state) => state.portfolio.portfolio,
      currentUser: (state) => state.user.currentUser,
      scorecard: (state) => state.scorecard.scorecard,
      spaceTypes: (state) => state.portfolio.spaceTypes,
    }),
    ...mapGetters('review', ['pendingReview']),
    verificationOptions() {
      return this.getSelectOptions(this.verifications)
    },
    spaceTypesOptions() {
      const temp = this.spaceTypes
      temp.shift()
      return temp
    },
    annotatedDocumentOptions() {
      return this.getSelectOptions(this.annotatedDocuments)
    },
    loaOptions() {
      return this.getSelectOptions(this.letterOfAssurances)
    },
    onSiteOptions() {
      return this.getSelectOptions(this.onSites)
    },
    calcPortfolioId() {
      const id = this.$route.params.id.toString().substring(5, 10)
      return parseInt(id)
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
  },
  watch: {
    filters: {
      handler(val) {
        this.$store.dispatch('scorecard/updateFilters', { ...this.filters })
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
  },
  async created() {
    if (this.project) {
      this.filters = { ...this.$store.state.scorecard.activeFilters }
      // set imperial as true if the country uses imperial by default
      if (this.project.addresses && this.project.addresses.length > 0) {
        if (
          this.project.addresses[0].country_code === 'US' ||
          this.project.addresses[0].country_code === 'LR' ||
          this.project.addresses[0].country_code === 'MM'
        ) {
          this.filters.imperial = true
        }
      }
      this.$store.dispatch('review/getReviewList', this.project.id)
      if (!this.value) {
        this.$emit('input', this.filters)
      }
    }
    if (this.portfolio) {
      this.filters = { ...this.$store.state.scorecard.activeFilters }
      // set imperial as true if the country uses imperial by default
      if (this.portfolio.addresses && this.portfolio.addresses.length > 0) {
        if (
          this.portfolio.addresses[0].country_code === 'US' ||
          this.portfolio.addresses[0].country_code === 'LR' ||
          this.portfolio.addresses[0].country_code === 'MM'
        ) {
          this.filters.imperial = true
        }
      }
      this.$store.dispatch('review/getReviewList', this.portfolio.id)
      if (!this.value) {
        this.$emit('input', this.filters)
      }
    }
    try {
      await this.$axios.get('api/tags').then((res) => {
        this.tagsList = res.data
        this.parseTagOptions('Rating', 'Ratings')
        this.parseTagOptions('Type', 'Strategy Type')
        this.parseTagOptions('Crosswalk', 'Crosswalk')
        this.parseTagOptions('Badge', 'Priorities')
      })
      await this.$store.dispatch('portfolio/fetchSpaceTypes')
    } catch (error) {}
  },
  methods: {
    ...mapActions('survey', ['loadSurvey', 'updateSurveyCompleted']),
    ...mapActions('review', ['submitReviewObservation']),
    clearFilters() {
      this.filters = {
        concept: 'All',
        response: [],
        name: '',
        verification: '',
        on_site: '',
        loa: '',
        annotated_doc: '',
        point_weight: null,
        show_preconditions: true,
        show_optimizations: true,
        doc_count: null,
        note_count: null,
        assessment: '',
        implementation: '',
      }
    },
    toggleSpaceFilter() {
      let spaceTypes = this.module.space_types.map(function (space) {
        return space.id
      })
      if (!this.filters.show_space_types) {
        spaceTypes = []
      }
      this.$store.dispatch('scorecard/getAllFilteredFeatures', {
        space_types: spaceTypes,
      })
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
      const apiUurl = `api/admin/project/${this.module.id}/review/${this.pendingReview.id}/generalObservation`
      this.submitReviewObservation({
        url: apiUurl,
        data: { general_observation: this.generalObservation },
      }).then((response) => {
        this.$refs.observationModal.isHidden = true
        this.$store.dispatch('review/getReviewList', this.project.id)
      })
    },
    getSelectOptions(field) {
      let options = []
      if (field) {
        options = [...field]
        options.map((option) => {
          option.label = option.name
          option.value = option.id.toString()
          return option
        })
      }
      return options
    },
    parseTagOptions(tag, category) {
      const ratingOptions = this.tagsList
        .filter((el) => el.type === tag)
        .map((el) => {
          return {
            label: el.name,
            value: el.id,
          }
        })
      this.slideOverFilters.find((el) => el.name === category).options =
        ratingOptions
    },
    async applyFilters() {
      const nonEmptyValues = this.slideOverFilters.filter(
        (el) => el.type === 'tags' && el.value.length
      )
      const ids = nonEmptyValues.map((el) => el.value)
      const mergedIds = [].concat.apply([], ids).map(Number)
      try {
        await this.$store.dispatch('scorecard/getAllFilteredFeatures', {
          tags: mergedIds,
          option_verification: this.parseFilterValues('verification')
            ? this.parseFilterValues('verification').map((el) => parseInt(el))
            : [],
          response: this.parseFilterValues('response') || [],
          feature_type: this.parseFilterValues('feature_type') || [],
          space_types: this.parseFilterValues('space_types')
            ? this.parseFilterValues('space_types').map((el) => parseInt(el))
            : [],
        })
      } catch (error) {
        // console.error(error)
      }
    },
    async clearSidebarFilters() {
      this.slideOverFilters.forEach((el) => (el.value = []))
      await this.$store.dispatch('scorecard/getAllFilteredFeatures', {
        tags: [],
      })
    },
    parseFilterValues(type) {
      const values = this.slideOverFilters.find(
        (el) => el.type === type && el.value.length
      )?.value
      return values
    },
  },
}
</script>
