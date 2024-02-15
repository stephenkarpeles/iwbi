<template>
  <div>
    <div v-if="loading">
      <div class="mx-auto text-center">
        <WLoadingSpinner class="mx-auto" />
        <div class="mt-3 text-primary-600">Loading...</div>
      </div>
    </div>
    <div v-if="!resourceCountZero">
      <div v-for="(resource, index) in resources" :key="index">
        <div>
          <WLinksBase target="_blank" :link="resource.link">
            <div class="p-3 w-full">
              <div class="bg-white p-3 rounded shadow">
                <div
                  v-if="
                    resource.resource_type &&
                    resource.resource_type != 'IWBI Article'
                  "
                >
                  {{ resource.resource_type }}
                </div>
                <div
                  v-if="
                    resource.resource_type &&
                    resource.resource_type === 'IWBI Article'
                  "
                  class="text-sm text-primary-600"
                >
                  Article
                </div>
                <p
                  v-if="resource.resource_title"
                  class="text-base text-gray-500 flex"
                >
                  {{ resource.resource_title }}
                  <svg
                    class="ml-5 h-5 w-5 text-primary-600"
                    stroke="currentColor"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <path
                      d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    ></path>
                  </svg>
                </p>
                <p
                  v-if="resource.desc"
                  class="text-base"
                  v-html="resource.desc"
                ></p>
              </div>
            </div>
          </WLinksBase>
        </div>
      </div>
    </div>
    <div v-if="resourceCountZero && !loading">
      <div class="text-gray-400 m-4">
        There are no resources available for this feature.
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    featureId: {
      type: [String, Number],
      required: false,
      default: null,
    },
  },
  data() {
    return {
      resources: [],
      type: '',
      loading: true,
    }
  },
  computed: {
    resourceCountZero() {
      return this.resources.length === 0 || this.resources === null
    },
  },

  watch: {
    featureId() {
      this.getResources()
    },
  },
  mounted() {
    if (this.featureId) {
      this.getResources()
    }
  },
  methods: {
    getResources() {
      this.$axios
        .get('api/features/' + this.featureId + '/resource')
        .then((response) => {
          this.resources = response.data
          this.loading = false
        })
    },
  },
}
</script>
