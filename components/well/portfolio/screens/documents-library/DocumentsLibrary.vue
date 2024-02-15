<template>
  <div v-if="doneLoading">
    <!-- eslint-disable -->
    <ModalsGeneral ref="uploadDocModal" header="Upload a Document">
      <div style="width: 1000px">
        <PortfolioUploadDocumentScreen />
      </div>
    </ModalsGeneral>
    <!-- Slideover -->
    <PortfolioDocumentFilterBar ref="filterBar" :activeTab="currentTab" />
    <!-- header -->
    <div class="flex justify-between">
      <div>
        <WHeadingsHTwo heading="Documents library" class="text-primary-900" />
        <span class="text-sm font-normal text-gray-500 space-x-1 w-3/4">
          This library compiles all documentation connected to your locations,
          and tracks your task progress to advancing WELL at scale.
          <WLinksBase
            class="ml-1 underline inline-block"
            target="_blank"
            link="https://well.support/documentation-guide~8f750b55-7d79-4055-abd3-df3491143cfe"
          >
            Learn More
          </WLinksBase>
        </span>
      </div>
      <div class="flex space-x-2">
        <WButtonsBase
          v-if="
            portfolio.agreement_status !== 0 &&
            portfolio.agreement_status !== null
          "
          class="shadow-none"
          icon="plus"
          @click.native="$refs.uploadDocModal.isHidden = false"
          >Upload</WButtonsBase
        >
        <Flyout v-else y="bottom" x="left" class="h-full">
          <WButtonsBase class="shadow-none" icon="plus">Upload</WButtonsBase>
          <template #content>
            <div class="text-sm w-52 text-center p-2 text-primary-600">
              Please sign the legal agreement before uploading documents
            </div>
          </template>
        </Flyout>

        <div class="flex items-center">
          <WButtonsDropdown>
            <WButtonsBase icon="chevron-down" type="primaryInverted"
              >Download</WButtonsBase
            >
            <template #customButtons>
              <WButtonsBase
                v-if="downloadAccess"
                type="neutral"
                @click.native="downloadAll"
              >
                All documents
              </WButtonsBase>
              <WButtonsBase
                type="neutral"
                @click.native="downloadScorecardExcel"
              >
                Locations scorecard excel
              </WButtonsBase>
            </template>
          </WButtonsDropdown>
        </div>
      </div>
    </div>

    <WTabsHorizontal
      v-model="currentTab"
      :defaultTab="currentTab"
      class="w-full -mb-px mt-8"
      :tabs="tabs"
    />
    <div
      v-if="currentTab !== 'Location Summary'"
      class="flex justify-between items-center mt-6"
    >
      <div v-if="currentTab === 'Documents'" class="w-80 relative">
        <FormulateInput
          v-model="documentName"
          type="text"
          placeholder="Search by name"
        />
        <div
          v-if="documentName !== ''"
          class="absolute right-1 top-2 cursor-pointer"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-4 w-4 text-gray-400 inline-flex"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            @click="documentName = ''"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </div>
      </div>
      <div class="w-80">
        <FormulateInput
          v-model="selectByLocations"
          :options="locations"
          type="multi"
          :multiple="false"
          :show-labels="false"
          :searchable="true"
          placeholder="Select by Locations"
        />
      </div>

      <div class="flex space-x-10">
        <div v-if="currentTab === 'Tasks'" class="flex space-x-2 items-center">
          <span class="text-sm text-gray-500">Show Locations:</span>
          <div class="rounded-full bg-gray-100 text-sm">
            <button
              v-for="(tab, i) in subTabs"
              :key="i"
              :class="`py-2 px-3 rounded-full ${
                subTab === tab.value
                  ? 'text-white bg-primary-600'
                  : 'text-gray-500'
              }`"
              @click="subTab = tab.value"
            >
              {{ tab.label }}
            </button>
          </div>
        </div>
        <WButtonsBase
          type="primaryInverted"
          class="shadow-none w-32 mb-4"
          icon="filter"
          @click.native="$refs.filterBar.$refs.filterSlider.isHidden = false"
          >Filters</WButtonsBase
        >
      </div>
    </div>
    <div
      v-if="
        ($refs.filterBar &&
          $refs.filterBar.computedfiltersAppliedList.length) ||
        selectByLocations
      "
      class="mt-6 flex items-end"
    >
      <span class="uppercase text-primary-700 font-semibold"
        >active filters:</span
      >
      <span class="text-primary-800 mx-2"
        >Showing
        <span class="font-bold">{{
          selectByLocations
            ? $refs.filterBar.computedfiltersAppliedList.length + 1
            : $refs.filterBar.computedfiltersAppliedList.length
        }}</span>
        filters.
      </span>
      <span
        @click="
          selectByLocations = null
          $refs.filterBar.clearSidebarFilters()
        "
        class="text-primary-600 ml-2 underline text-md hover:cursor-pointer hover:text-primary-500"
        >Clear Filters</span
      >
    </div>

    <div
      v-if="
        ($refs.filterBar &&
          $refs.filterBar.computedfiltersAppliedList.length) ||
        selectByLocations
      "
      class="flex flex-wrap"
    >
      <div
        v-if="selectByLocations"
        class="flex space-x-2 mr-2 mb-2 text-primary-600 bg-primary-100 rounded-md border border-primary-500 text-sm items-center px-2 py-1"
      >
        {{ selectByLocations.label }}
        <WIconsBase
          class="w-3 h-3 hover:cursor-pointer hover:text-primary-500"
          icon="x"
          @click.native="removeElementFromLocation"
        ></WIconsBase>
      </div>
      <div
        v-for="el in $refs.filterBar.computedfiltersAppliedList"
        class="flex space-x-2 mr-2 mb-2 text-primary-600 bg-primary-100 rounded-md border border-primary-500 text-sm items-center px-2 py-1"
      >
        {{ el.label }}
        <WIconsBase
          class="w-3 h-3 hover:cursor-pointer hover:text-primary-500"
          icon="x"
          @click.native="removeElementFromFilter(el)"
        ></WIconsBase>
      </div>
    </div>
    <div class="mt-6">
      <PortfolioDocumentsTasksScreen
        ref="taskScreen"
        v-if="currentTab === 'Tasks'"
        :locationType="subTab"
        :subtab="subTab"
      />
      <PortfolioDocumentsFilesScreen
        ref="fileScreen"
        v-if="currentTab === 'Documents'"
      />
      <PortfolioDocumentsSummaryScreen
        v-if="currentTab === 'Location Summary'"
      />
    </div>
  </div>
  <div v-else>
    <div class="mx-auto text-center py-5">
      <WLoadingSpinner class="mx-auto" />
      <div class="mt-3 text-primary-600">{{ loadingStatus }}</div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  props: {
    id: {
      type: Number,
      required: true,
    },
  },
  data() {
    return {
      currentTab: '',
      loadingStatus: 'Loading Document Data...',
      doneLoading: false,
      subTab: '',
      subTabs: [
        {
          label: 'Pending',
          value: 'pending',
        },
        {
          label: 'Fulfilled',
          value: 'completed',
        },
        {
          label: 'All',
          value: 'all',
        },
      ],
      parts: null,
      selectByLocations: null,
      documentName: '',
      tabs: [
        { name: 'Tasks', icon: 'pencil-alt' },
        { name: 'Documents', icon: 'document' },
        { name: 'Location Summary', icon: 'office-building' },
      ],
    }
  },
  computed: {
    ...mapState({
      portfolio: (state) => state.portfolio.portfolio,
      scorecard: (state) => state.scorecard.scorecard,
      currentUser: (state) => state.user.currentUser,
      portfolioMembers: (state) => state.portfolio.portfolioMembers,
    }),
    locations() {
      if (this.$store.state.portfolio.onlyProperties) {
        return this.$store.state.portfolio.onlyProperties.map((e) => {
          return { label: e.project_number + '-' + e.name, value: e.id }
        })
      } else {
        return []
      }
    },
    downloadAccess() {
      const isTeamMember = this.portfolioMembers.find(
        (el) => el.id === this.currentUser.id
      )

      const isReviewer = this.portfolio.reviewers.find(
        (el) => el.id === this.currentUser.id
      )

      if (this.currentUser.role.includes('well-admin')) {
        return true
      }
      if (isTeamMember && this.currentUser.role.includes('external-reviewer'))
        return false
      if (isReviewer) return true

      return false
    },
  },
  watch: {
    documentName: {
      handler(val) {
        this.$refs.fileScreen.getDocuments(this.documentName)
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
    locations() {
      if (Object.keys(this.$route.query).includes('project_ids')) {
        this.selectByLocations = this.locations.find(
          (a) => parseInt(a.value) === parseInt(this.$route.query.project_ids)
        )
      }
    },
    selectByLocations(value) {
      if (value) {
        if (!Object.keys(this.$route.query).includes('project_ids')) {
          this.$router.push({
            path: this.$route.path,
            query: {
              ...this.$route.query,
              project_ids: [value.value],
            },
          })
        } else if (parseInt(this.$route.query.project_ids) !== value.value) {
          this.$router.push({
            path: this.$route.path,
            query: {
              ...this.$route.query,
              project_ids: [value.value],
            },
          })
        }
      }
    },
    subTab(newVal, oldVal) {
      if (oldVal) {
        this.$router.push({
          path: this.$route.path,
          query: { ...this.$route.query, sub_tab: this.subTab },
        })
      }
    },
  },
  created() {
    this.currentTab = this.$route.query.tab
    this.subTab = this.$route.query.sub_tab
  },
  async mounted() {
    await this.$store.dispatch('scorecard/getScorecard', this.id)

    await this.$store.dispatch(
      'scorecard/getConcepts',
      this.scorecard.version_id
    )
    this.loadingStatus = 'Pulling Verification Options...'
    await this.$store.dispatch(
      'scorecard/getVerificationsByType',
      this.portfolio.type
    )

    this.$store.dispatch(
      'portfolio/getPropertiesFilteredFields',
      this.portfolio.id
    )
    this.doneLoading = true
  },
  methods: {
    removeElementFromLocation() {
      this.selectByLocations = null
      const query = this.$route.query
      if (Object.keys(query).includes('project_ids')) {
        this.$router.push({
          path: this.$route.path,
          query: {
            ...query,
            project_ids: [],
          },
        })
      }
    },
    removeElementFromFilter(element) {
      const indexOfType = this.$refs.filterBar.slideOverFilters.findIndex(
        (a) => a.type === element.type
      )
      const index = this.$refs.filterBar.slideOverFilters[
        indexOfType
      ].value.indexOf(element.value)

      if (index !== -1) {
        this.$refs.filterBar.slideOverFilters[indexOfType].value.splice(
          index,
          1
        )
        this.$refs.filterBar.applyFilters()
      }
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
    downloadAll() {
      const data = ''
      this.$store
        .dispatch('portfolio/downloadAllDocuments', data)
        .then((response) => {
          this.$store.dispatch('notifications/toastMessage', {
            message:
              'We will notify you by email once we are ready with your file.',
          })
        })
    },
    downloadScorecardExcel() {
      this.$store
        .dispatch('portfolio/downloadScorecardDocuments')
        .then((response) => {
          this.$store.dispatch('notifications/toastMessage', {
            message: response.data.message,
          })
        })
    },
  },
}
</script>
