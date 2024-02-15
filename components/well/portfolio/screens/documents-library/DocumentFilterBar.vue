<template>
  <div>
    <!-- eslint-disable -->
    <!-- Slideover -->
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
              @click="slideOverFilters[i].expand = !slideOverFilters[i].expand"
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
                :options="getOptions(el)"
              />
            </div>
          </div>
        </div>
      </template>
    </Slideover>
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  props: {
    activeTab: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      filters: {
        concept: 'All',
        project_ids: [],
        verification: '',
        on_site: '',
        loa: '',
        annotated_doc: '',
        assessment: '',
        implementation: '',
      },
      filtersApplied: {},
      taskList: [
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

        {
          name: 'Concepts',
          value: [],
          expand: false,
          type: 'concept',
          icon: null,
          options: this.concepts,
        },
      ],
      verificationTypes: {
        'v2-pilot': [
          {
            name: 'Annotated Documents',
            value: [],
            expand: false,
            type: 'annotated_documents',
            icon: null,
            options: 'annonated_verif',
          },
          {
            name: 'Loa',
            value: [],
            expand: false,
            type: 'loa',
            icon: null,
            options: 'loa_verif',
          },
          {
            name: 'On Site',
            value: [],
            expand: false,
            type: 'on_site',
            icon: null,
            options: 'on_site_verif',
          },
        ],
        v2: [
          {
            name: 'Verification',
            value: [],
            expand: false,
            type: 'verification',
            icon: null,
            options: 'verif',
          },
        ],
      },
      filesList: [
        {
          name: 'Type',
          value: [],
          expand: false,
          type: 'type',
          icon: null,
          options: [
            {
              label: 'Feature',
              value: 'Feature',
            },
            { label: 'Audit', value: 'Audit' },
            {
              label: 'General',
              value: 'General',
            },
            { label: 'Legal', value: 'Legal' },
          ],
        },
        {
          name: 'Document Stage',
          value: [],
          expand: false,
          type: 'document_stage',
          icon: null,
          options: [
            { label: 'Implementation', value: 'Implementation' },
            { label: 'Intent', value: 'Intent' },
          ],
        },
        {
          name: 'Review Status',
          value: [],
          expand: false,
          type: 'scorecard_doc_review_status',
          icon: null,
          options: [
            { label: 'Reviewed', value: 'Reviewed' },
            { label: 'Ready For Review', value: 'Ready For Review' },
            { label: 'Expired', value: 'Expired' },
          ],
        },
      ],
    }
  },

  computed: {
    ...mapState({
      portfolio: (state) => state.portfolio.portfolio,
      scorecard: (state) => state.scorecard.scorecard,
      verifications: (state) => state.scorecard.verifications,
      annotatedDocuments: (state) => state.scorecard.annotatedDocuments,
      letterOfAssurances: (state) => state.scorecard.letterOfAssurances,
      onSites: (state) => state.scorecard.onSites,
    }),
    verificationOptions() {
      return this.getSelectOptions(this.verifications)
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
    locations() {
      if (this.$store.state.portfolio.onlyProperties) {
        return this.$store.state.portfolio.onlyProperties.map((e) => {
          return { label: e.project_number + '-' + e.name, value: e.id }
        })
      } else {
        return []
      }
    },
    slideOverFilters() {
      const verification =
        this.portfolio.type === 'v2'
          ? this.verificationTypes.v2
          : this.verificationTypes['v2-pilot']
      if (this.activeTab === 'Tasks') {
        const list = [...verification, ...this.taskList]
        list[list.length - 1].options = this.concepts
        return list
      } else {
        return [...verification, ...this.filesList]
      }
    },
    concepts() {
      return this.$store.state.scorecard.concepts.map((e) => {
        return { label: e.name, value: e.name }
      })
    },

    computedfiltersAppliedList() {
      if (Object.keys(this.filtersApplied).length) {
        const filters = []
        this.filtersApplied.forEach((e) => {
          if (e.value.length) {
            const option = [
              'verif',
              'annonated_verif',
              'loa_verif',
              'on_site_verif',
            ]
            if (option.includes(e.options)) {
              if (e.options === 'verif') {
                e.value.forEach((el) => {
                  const data = this.verificationOptions.find(
                    (a) => a.value === el
                  )

                  filters.push({
                    label: data.label,
                    type: e.type,
                    value: data.value,
                  })
                })
              } else if (e.options === 'annonated_verif') {
                e.value.forEach((el) => {
                  const data = this.annotatedDocumentOptions.find(
                    (a) => a.value === el
                  )

                  filters.push({
                    label: data.label,
                    type: e.type,
                    value: data.value,
                  })
                })
              } else if (e.options === 'loa_verif') {
                e.value.forEach((el) => {
                  const data = this.loaOptions.find((a) => a.value === el)

                  filters.push({
                    label: data.label,
                    type: e.type,
                    value: data.value,
                  })
                })
              } else if (e.options === 'on_site_verif') {
                e.value.forEach((el) => {
                  const data = this.onSiteOptions.find((a) => a.value === el)

                  filters.push({
                    label: data.label,
                    type: e.type,
                    value: data.value,
                  })
                })
              }
            } else {
              e.value.forEach((el) => {
                filters.push({
                  label: e.options.find((a) => a.value === el).label,
                  type: e.type,
                  value: el,
                })
              })
            }
          }
        })
        return filters
      } else {
        return []
      }
    },
  },
  watch: {
    activeTab() {
      this.clearSidebarFilters()
      this.$parent.selectByLocations = null
    },
  },
  created() {
    if (Object.keys(this.$route.query).length > 2) {
      const keys = Object.keys(this.$route.query)
      keys.forEach((key) => {
        if (key !== 'tab') {
          const index = this.slideOverFilters.findIndex((a) => a.type === key)
          if (index !== -1) {
            this.slideOverFilters[index].value = Array.isArray(
              this.$route.query[key]
            )
              ? this.$route.query[key]
              : [this.$route.query[key]]
          }
        }
      })
      this.applyFilters()
    }
  },

  methods: {
    getOptions(el) {
      const option = ['verif', 'annonated_verif', 'loa_verif', 'on_site_verif']
      if (option.includes(el.options)) {
        if (el.options === 'verif') return this.verificationOptions
        else if (el.options === 'annonated_verif')
          return this.annotatedDocumentOptions
        else if (el.options === 'loa_verif') return this.loaOptions
        else if (el.options === 'on_site_verif') return this.onSiteOptions
      } else {
        return el.options
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
    applyFilters() {
      this.filtersApplied = JSON.parse(JSON.stringify(this.slideOverFilters))
      const query = {}
      this.filtersApplied.forEach((e) => {
        if (e.value.length) {
          query[encodeURI(e.type)] = e.value
        }
      })

      this.$router.push({
        path: this.$route.path,
        query: {
          tab: this.$route.query.tab,
          sub_tab: this.$route.query.sub_tab,
          project_ids: this.$route.query.project_ids,
          ...query,
        },
      })
      if (this.$refs.filterSlider) this.$refs.filterSlider.isHidden = true
    },

    clearSidebarFilters() {
      this.slideOverFilters.forEach((el) => (el.value = []))
      this.filters.project_ids = []
      this.filtersApplied = {}

      this.$router.push({
        path: this.$route.path,
        query: {
          tab: this.activeTab,
          sub_tab: this.$route.query.sub_tab,
        },
      })

      if (this.$refs.filterSlider) this.$refs.filterSlider.isHidden = true
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

<style></style>
