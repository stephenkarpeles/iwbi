<template>
  <div>
    <div v-if="strategies">
      <div class="overflow-x-scroll">
        <table class="w-full divide-y divide-gray-200">
          <thead>
            <tr>
              <th
                class="px-6 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider"
              >
                Alternative#
              </th>
              <th
                class="px-6 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider"
              >
                Portfolio
              </th>
              <th
                class="px-6 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider"
              >
                Feature
              </th>
              <th
                class="px-6 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider"
              >
                Status
              </th>
              <th
                class="px-6 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider"
              >
                Date
              </th>
              <th
                class="px-6 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider"
              >
                Owner
              </th>
              <th
                class="px-6 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider"
              >
                Type
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="(strategy, index) in strategies.data" :key="index">
              <td class="px-6 py-4 whitespace-nowrap flex space-x-2">
                <nuxt-link
                  class="cursor-pointer text-primary-500 text-bold text-sm leading-5 uppercase"
                  :to="`/${
                    project_type === 'wpr' ? project_type : 'shared-workspaces'
                  }/${strategy.portfolio_number}/alternatives/${strategy.id}`"
                >
                  {{ strategy.type }}-0{{ strategy.id }}
                </nuxt-link>
                <a
                  :href="`/${
                    project_type === 'wpr' ? project_type : 'shared-workspaces'
                  }/${strategy.portfolio_number}/alternatives/${strategy.id}`"
                  target="_blank"
                >
                  <WIconsBase
                    icon="external-link"
                    type="blank"
                    class="text-gray-400 hover:text-gray-500"
                  />
                </a>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm leading-5 text-gray-900">
                  <WLinksBase
                    :link="`/${
                      project_type === 'wpr'
                        ? project_type
                        : 'shared-workspaces'
                    }/${strategy.portfolio_number}/dashboard`"
                    target="_blank"
                  >
                    {{ strategy.portfolio_number }}
                  </WLinksBase>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm leading-5 text-gray-900">
                  <span v-if="strategy.v1_aap === 1">{{
                    strategy.v1feature.name
                  }}</span>
                  <span v-else>{{ strategy.feature.feature_full_name }}</span>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm leading-5 text-gray-900">
                  <span
                    v-if="strategy.status === 'pending'"
                    class="text-center badge-info uppercase p-1 bg-primary-500 text-white rounded font-semibold"
                    style="font-size: 10px"
                    >{{ strategy.status }}</span
                  >
                  <span
                    v-else-if="
                      strategy.status === 'approved' ||
                      strategy.status === 'altered'
                    "
                    class="text-center badge-info uppercase p-1 bg-green-500 text-white rounded font-semibold"
                    style="font-size: 10px"
                    >Approved</span
                  >
                  <span
                    v-else-if="strategy.status === 'denied'"
                    class="text-center badge-info uppercase p-1 bg-danger-300 text-white rounded font-semibold"
                    style="font-size: 10px"
                    >Not Approved</span
                  >
                  <span
                    v-else
                    class="text-center badge-info uppercase p-1 bg-gray-500 text-white rounded font-semibold"
                    style="font-size: 10px"
                    >{{ strategy.status }}</span
                  >
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm leading-5 text-gray-900">
                  {{ $dayjs(strategy.created_at).format('MMM DD, YYYY') }}
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm leading-5 text-gray-900">
                  {{ strategy.user.full_name }}
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm leading-5 text-gray-900 uppercase">
                  {{ strategy.type }}
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <FormInputsPagination
        :pagination="paginate"
        :offset="3"
        @paginate="$store.dispatch('project/getStrategies', allFilters)"
      />
    </div>
    <div v-else>
      <div class="mx-auto text-center">
        <WLoadingSpinner class="mx-auto" />
        <div class="mt-3 text-primary-600">Loading submitted strategies...</div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapState } from 'vuex'

export default {
  data() {
    return {
      filters: {
        portfolio_id: null,
        v1_app: 0,
        orderBy: 'id',
        order: 'desc',
      },
    }
  },
  computed: {
    ...mapState({
      project_type: (state) => state.shared.sharedWorkspace.type,
      project_id: (state) => state.shared.sharedWorkspace.id,
      strategies: (state) => state.shared.strategies,
    }),
    paginate() {
      if (this.strategies) {
        return {
          total: this.strategies.total,
          per_page: this.strategies.per_page,
          current_page: this.strategies.current_page,
          last_page: this.strategies.last_page,
          from: this.strategies.from,
          to: this.strategies.to,
        }
      }
      return {}
    },
    hasAppliedFilters() {
      for (const key in this.filters) {
        if (this.filters[key] !== null && this.filters[key] !== '') return true
      }
      return false
    },
    allFilters() {
      const res = JSON.parse(JSON.stringify(this.filters))
      if (this.hasAppliedFilters) res.page = 1
      else res.page = this.paginate.current_page
      return res
    },
  },
  mounted() {
    this.filters.portfolio_id = this.project_id
    this.$store.dispatch('shared/getStrategies', this.allFilters)
  },
}
</script>
