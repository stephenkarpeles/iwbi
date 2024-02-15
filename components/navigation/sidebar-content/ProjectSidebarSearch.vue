<template>
  <Popover :key="forceReRender" y="bottom" x="left" class="-mb-3 w-full">
    <div class="w-full mb-3 pr-7">
      <div class="text-lg font-bold text-primary-200 leading-tight truncate">
        {{ project.name }}
      </div>
      <div class="text-xs text-gray-500">ID: {{ project.project_number }}</div>
    </div>
    <WButtonsBase
      icon="chevron-down"
      type="blank"
      class="text-primary-200 -mt-3 absolute inset-y-0 right-0"
    />
    <template #content>
      <div v-if="projectsList" class="w-56 -mt-1 py-1 rounded-b-lg">
        <div>
          <div class="h-72 overflow-y-scroll divide-y-1">
            <WButtonsBase
              v-for="(project_listing, index) in projectsList.data"
              :key="index"
              type="listingPrimaryInverted"
              :class="[
                project_listing.project_number === project.project_number &&
                  'hidden',
              ]"
            >
              <div class="text-left w-full">
                <div class="flex justify-between">
                  <div class="truncate" @click="goToProject(project_listing)">
                    {{ project_listing.name }}
                  </div>
                  <div>
                    <a
                      :href="`/projects/${project_listing.type}/${project_listing.project_number}/dashboard`"
                      target="_blank"
                    >
                      <WIconsBase
                        icon="external-link"
                        type="blank"
                        class="text-primary-600"
                      />
                    </a>
                  </div>
                </div>
                <div
                  class="text-sm text-gray-400"
                  @click="goToProject(project_listing)"
                >
                  {{ project_listing.project_number }}
                </div>
              </div>
            </WButtonsBase>
          </div>
        </div>
        <FormInputsPagination
          :simplify="true"
          :pagination="paginate"
          :offset="3"
          @paginate="$store.dispatch('project/getV2Projects', allFilters)"
        />
      </div>
    </template>
  </Popover>
</template>
<script>
import { mapState } from 'vuex'

export default {
  data() {
    return {
      filters: {
        project_number: '',
        country_id: 0,
        name: '',
        reg_status: '',
        user_type: 'user',
        type: null,
        v1_project: null,
      },
      forceReRender: 0,
      error: null,
    }
  },
  computed: {
    ...mapState({
      project: (state) => state.project.project,
      projectsList: (state) => state.project.projectsList,
    }),
    paginate() {
      if (this.projectsList) {
        return {
          total: this.projectsList.total,
          per_page: this.projectsList.per_page,
          current_page: this.projectsList.current_page,
          last_page: this.projectsList.last_page,
          from: this.projectsList.from,
          to: this.projectsList.to,
        }
      }
      return {}
    },
    allFilters() {
      const res = JSON.parse(JSON.stringify(this.filters))
      res.page = this.paginate.current_page
      return res
    },
  },
  mounted() {
    this.$nextTick(() => {
      this.filters = {
        project_number: '',
        country_id: 0,
        name: '',
        reg_status: '',
        user_type: 'user',
        type: null,
        v1_project: null,
      }
      switch (this.$route.params.projectType) {
        case 'v1':
          this.filters.v1_project = 1
          this.$store
            .dispatch('project/getV1Projects', this.allFilters)
            .catch((error) => (this.error = error))
          return
        case 'v2':
          this.$store
            .dispatch('project/getV2Projects', this.allFilters)
            .catch((error) => (this.error = error))
          return
        case 'v2-pilot':
          this.filters.type = 'v2-pilot'
          this.$store
            .dispatch('project/getV2Projects', this.allFilters)
            .catch((error) => (this.error = error))
      }
    })
  },
  beforeDestroy() {
    this.$store.commit('project/setV2Projects', null)
  },
  methods: {
    goToProject(projectListing) {
      this.forceReRender++

      // This code will change directory based on where the user is currently
      // let endDirectory = this.$route.fullPath.split('/')

      // if (endDirectory[endDirectory.length - 1] === '') {
      //   endDirectory = endDirectory[endDirectory.length - 2]
      // } else {
      //   endDirectory = endDirectory[endDirectory.length - 1]
      // }

      this.$router.push({
        path: `/projects/${this.project.type}/${projectListing.project_number}/dashboard`,
        query: { ...this.$route.query },
      })
    },
  },
}
</script>
