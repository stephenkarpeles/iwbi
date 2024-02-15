<template>
  <Popover :key="forceReRender" y="bottom" x="left" class="-mb-3 w-full">
    <div class="w-full mb-3 pr-7">
      <div class="text-lg font-bold text-primary-200 leading-tight truncate">
        {{ sharedWorkspace.name }}
      </div>
      <div class="text-xs text-gray-500">
        ID: {{ sharedWorkspace.portfolio_number }}
      </div>
    </div>
    <WButtonsBase
      icon="chevron-down"
      type="blank"
      class="text-primary-200 -mt-3 absolute inset-y-0 right-0"
    />
    <template #content>
      <div v-if="sharedWorkspaceList" class="-mt-1 py-1 rounded-b-lg w-56">
        <div>
          <div class="h-72 overflow-y-scroll divide-y-1">
            <WButtonsBase
              v-for="(project_listing, index) in sharedWorkspaceList.data"
              :key="index"
              type="listingPrimaryInverted"
              :class="[
                project_listing.portfolio_number ===
                  sharedWorkspace.portfolio_number && 'hidden',
              ]"
            >
              <div class="text-left w-full">
                <div class="flex justify-between">
                  <div class="truncate" @click="goToProject(project_listing)">
                    {{ project_listing.name }}
                  </div>
                  <div>
                    <a
                      :href="`/${
                        moduleType === 'wpr' ? 'wpr' : 'shared-workspaces'
                      }/${project_listing.portfolio_number}/dashboard`"
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
                  {{ project_listing.portfolio_number }}
                </div>
              </div>
            </WButtonsBase>
          </div>
        </div>
        <FormInputsPagination
          :simplify="true"
          :pagination="paginate"
          :offset="3"
          @paginate="$store.dispatch('portfolio/getPortfolioList', allFilters)"
        />
      </div>
    </template>
  </Popover>
</template>
<script>
import { mapState } from 'vuex'

export default {
  props: {
    moduleType: {
      type: String,
      required: false,
      default: 'v2-hsr',
    },
  },
  data() {
    return {
      filters: {
        type: 'v2-hsr',
        portfolio_number: '',
        name: '',
        reg_payment_status: 'paid',
      },
      forceReRender: 0,
      error: null,
    }
  },
  computed: {
    ...mapState({
      sharedWorkspace: (state) => state.shared.sharedWorkspace,
      sharedWorkspaceList: (state) => state.portfolio.portfolioList,
    }),
    paginate() {
      if (this.sharedWorkspaceList) {
        return {
          total: this.sharedWorkspaceList.total,
          per_page: this.sharedWorkspaceList.per_page,
          current_page: this.sharedWorkspaceList.current_page,
          last_page: this.sharedWorkspaceList.last_page,
          from: this.sharedWorkspaceList.from,
          to: this.sharedWorkspaceList.to,
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
        type: this.moduleType,
        portfolio_number: '',
        name: '',
        reg_payment_status: 'paid',
      }
      this.$store
        .dispatch('portfolio/getPortfolioList', this.allFilters)
        .catch((error) => (this.error = error))
    })
  },
  beforeDestroy() {
    this.$store.commit('portfolio/setPortfolioList', null)
  },
  methods: {
    regStatus(sharedWorkspace) {
      if (
        (sharedWorkspace.reg_status === 1 &&
          sharedWorkspace.reg_payment_status === 'paid') ||
        sharedWorkspace.reg_payment_status === 'waived'
      ) {
        return true
      } else {
        return false
      }
    },
    goToProject(projectListing) {
      this.forceReRender++

      this.$router.push(
        `/shared-workspaces/${projectListing.portfolio_number}/dashboard`
      )
    },
  },
}
</script>
