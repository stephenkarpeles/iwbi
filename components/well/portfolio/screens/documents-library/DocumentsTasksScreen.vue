<template>
  <div v-if="!apiLoading">
    <template v-if="parts.length === 0">
      <span class="my-12 text-primary-600 text-center block"
        >No Tasks to Show</span
      >
    </template>
    <div v-for="(part, x) in parts" :key="x">
      <PortfolioVerificationListScreen
        :key="part.id"
        :location-type="locationType"
        :part="part"
        :subtab="$attrs.subtab"
      />
    </div>
  </div>
  <div v-else class="mx-auto mt-10 text-center">
    <WLoadingSpinner class="mx-auto" />
    <div class="mt-3 text-primary-600">Loading List of Tasks...</div>
  </div>
</template>
<script>
import { mapState } from 'vuex'
export default {
  props: {
    locationType: {
      type: String,
      default: '',
      required: false,
    },
  },
  data() {
    return {
      loadedParts: [],
      apiLoading: false,
      allLoaded: false,
      partsData: [],
    }
  },
  computed: {
    ...mapState({
      scorecard: (state) => state.scorecard.scorecard,
    }),
    parts() {
      let part = this.loadedParts
      if (
        Object.keys(this.$route.query).includes('feature_type') ||
        Object.keys(this.$route.query).includes('concept')
      ) {
        if (Object.keys(this.$route.query).includes('concept')) {
          const concepts = Array.isArray(this.$route.query.concept)
            ? this.$route.query.concept
            : [this.$route.query.concept]
          part = part.filter((e) => concepts.includes(e.concept_name))
        }
        if (Object.keys(this.$route.query).includes('feature_type')) {
          const feature = Array.isArray(this.$route.query.feature_type)
            ? this.$route.query.feature_type
            : [this.$route.query.feature_type]

          part = part.filter((e) => feature.includes(e.type))
        }
      }
      if (this.locationType === 'all') {
        return part
      } else {
        part.forEach((e, index) => {
          e.showPart = false
          e.verifications.forEach((v) => {
            if (this.locationType === 'pending') {
              if (v.options.filter((e) => e.completed < e.total).length) {
                e.showPart = true
              }
            } else if (this.locationType === 'completed') {
              if (
                v.options.filter((e) => e.completed >= e.total && e.total > 0)
                  .length
              ) {
                e.showPart = true
              }
            }
          })
        })

        return part.filter((a) => a.showPart)
      }
    },
  },
  watch: {
    $route(newRoute, oldRoute) {
      if (
        oldRoute.query.sub_tab === newRoute.query.sub_tab &&
        oldRoute.query.tab === newRoute.query.tab
      ) {
        this.getPartList()
      }
    },
  },

  async mounted() {
    await this.getPartList()
  },
  methods: {
    async getPartList() {
      let payload = null
      this.apiLoading = true
      this.loadedParts = []
      if (Object.keys(this.$route.query).length > 2) {
        payload = {
          project_ids: this.$route.query.project_ids
            ? Array.isArray(this.$route.query.project_ids)
              ? this.$route.query.project_ids
              : [this.$route.query.project_ids]
            : [],
          verifications: this.$route.query.verification
            ? Array.isArray(this.$route.query.verification)
              ? this.$route.query.verification
              : [this.$route.query.verification]
            : [],
          letter_of_assurances: this.$route.query.loa
            ? Array.isArray(this.$route.query.loa)
              ? this.$route.query.loa
              : [this.$route.query.loa]
            : [],
          on_sites: this.$route.query.on_sites
            ? Array.isArray(this.$route.query.on_sites)
              ? this.$route.query.on_sites
              : [this.$route.query.on_sites]
            : [],
          annotated_documents: this.$route.query.annotated_documents
            ? Array.isArray(this.$route.query.annotated_documents)
              ? this.$route.query.annotated_documents
              : [this.$route.query.annotated_documents]
            : [],
        }
      }

      await this.$axios
        .get(`api/scorecard/${this.scorecard.id}/verifications`, {
          params: { ...payload },
        })
        .then((resp) => {
          this.partsData = resp.data
          this.loadedParts = []
          this.partsData.forEach((el) => {
            this.loadedParts.push({
              ...el,
              part_prefix: el.prefix,
              loaded: false,
            })
          })
          if (this.loadedParts.length > 2) {
            this.loadedParts[0].loaded = true
            this.loadedParts[1].loaded = true
            this.loadedParts[2].loaded = true
          } else {
            this.loadedParts.forEach((e, index) => {
              this.loadedParts[index].loaded = true
            })
          }
          this.apiLoading = false
        })
    },
  },
}
</script>
