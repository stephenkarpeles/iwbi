<template>
  <Popover :key="forceReRender" y="bottom" x="left" class="-mb-3 w-full">
    <div class="w-full mb-3 pr-7">
      <div class="text-lg font-bold text-primary-200 leading-tight truncate">
        {{ portfolio.name }}
      </div>
      <div class="text-xs text-gray-500">
        ID: {{ portfolio.portfolio_number }}
      </div>
    </div>
    <WButtonsBase
      icon="chevron-down"
      type="blank"
      class="text-primary-200 -mt-3 absolute inset-y-0 right-0"
    />
    <template #content>
      <div v-if="portfolioList" class="w-56 -mt-1 py-1 rounded-b-lg">
        <div>
          <div class="h-72 overflow-y-scroll divide-y-1">
            <WButtonsBase
              v-for="(portfolio_listing, index) in portfolioList.data"
              :key="index"
              type="listingPrimaryInverted"
              :class="[
                portfolio_listing.portfolio_number ===
                  portfolio.portfolio_number && 'hidden',
              ]"
            >
              <div class="text-left w-full">
                <div class="flex justify-between">
                  <div
                    class="truncate"
                    @click="goToPortfolio(portfolio_listing)"
                  >
                    {{ portfolio_listing.name }}
                  </div>
                  <div>
                    <a
                      :href="`/portfolio/${portfolio_listing.portfolio_number}/dashboard`"
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
                  @click="goToPortfolio(portfolio_listing)"
                >
                  {{ portfolio_listing.portfolio_number }}
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
  data() {
    return {
      forceReRender: 0,
      error: null,
      filters: {
        type: 'v2-pilot',
        portfolio_number: '',
        name: '',
      },
    }
  },
  computed: {
    ...mapState({
      portfolio: (state) => state.portfolio.portfolio,
      portfolioList: (state) => state.portfolio.portfolioList,
    }),
    paginate() {
      if (this.portfolioList) {
        return {
          total: this.portfolioList.total,
          per_page: this.portfolioList.per_page,
          current_page: this.portfolioList.current_page,
          last_page: this.portfolioList.last_page,
          from: this.portfolioList.from,
          to: this.portfolioList.to,
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
      this.$store
        .dispatch('portfolio/getPortfolioList', this.allFilters)
        .catch((error) => (this.error = error))
    })
  },
  methods: {
    goToPortfolio(portfolio) {
      this.forceReRender++
      this.$router.push(`/portfolio/${portfolio.portfolio_number}/dashboard`)
    },
  },
}
</script>
