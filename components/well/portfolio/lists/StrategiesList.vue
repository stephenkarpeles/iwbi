<template>
  <div>
    <div v-if="strategies">
      <div
        class="overflow-hidden border-b border-gray-200 sm:rounded-t-lg w-full"
      >
        <div class="flex flex-col">
          <div class="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div
              class="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8"
            >
              <div class="overflow-hidden border-gray-200 sm:rounded-t-lg">
                <table class="min-w-full divide-y divide-gray-200">
                  <thead class="bg-primary-700 text-white">
                    <tr>
                      <th
                        scope="col"
                        class="
                          px-6
                          py-3
                          text-left text-xs
                          font-semibold
                          uppercase
                          tracking-wider
                        "
                      >
                        Alternative#
                      </th>
                      <th
                        scope="col"
                        class="
                          px-6
                          py-3
                          text-left text-xs
                          font-semibold
                          uppercase
                          tracking-wider
                        "
                      >
                        Portfolio
                      </th>
                      <th
                        scope="col"
                        class="
                          px-6
                          py-3
                          text-left text-xs
                          font-semibold
                          uppercase
                          tracking-wider
                        "
                      >
                        Feature
                      </th>
                      <th
                        scope="col"
                        class="
                          px-6
                          py-3
                          text-left text-xs
                          font-semibold
                          uppercase
                          tracking-wider
                        "
                      >
                        Status
                      </th>
                      <th
                        scope="col"
                        class="
                          px-6
                          py-3
                          text-left text-xs
                          font-semibold
                          uppercase
                          tracking-wider
                        "
                      >
                        Date
                      </th>
                      <th
                        scope="col"
                        class="
                          px-6
                          py-3
                          text-left text-xs
                          font-semibold
                          uppercase
                          tracking-wider
                        "
                      >
                        Owner
                      </th>
                      <th
                        scope="col"
                        class="
                          px-6
                          py-3
                          text-left text-xs
                          font-semibold
                          uppercase
                          tracking-wider
                        "
                      >
                        Type
                      </th>
                    </tr>
                  </thead>
                  <tbody class="bg-white divide-y divide-gray-200">
                    <tr
                      v-for="(strategy, index) in strategies.data"
                      :key="index"
                    >
                      <td class="px-6 py-4 whitespace-nowrap">
                        <nuxt-link
                          class="
                            cursor-pointer
                            text-primary-500 text-bold text-sm
                            leading-5
                            uppercase
                          "
                          :to="`/portfolio/${strategy.portfolio_number}/alternatives/${strategy.id}`"
                        >
                          {{ strategy.type }}-0{{ strategy.id }}
                        </nuxt-link>
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap">
                        <div class="text-sm leading-5 text-gray-900">
                          <WLinksBase
                            :link="`/portfolio/${strategy.portfolio_number}/dashboard`"
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
                          <span v-else>{{
                            strategy.feature.feature_full_name
                          }}</span>
                        </div>
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap">
                        <div class="text-sm leading-5 text-gray-900">
                          <span
                            v-if="strategy.status === 'pending'"
                            class="
                              text-center
                              badge-info
                              uppercase
                              p-1
                              bg-primary-500
                              text-white
                              rounded
                              font-semibold
                            "
                            style="font-size: 10px"
                            >{{ strategy.status }}</span
                          >
                          <span
                            v-else-if="
                              strategy.status === 'approved' ||
                              strategy.status === 'altered'
                            "
                            class="
                              text-center
                              badge-info
                              uppercase
                              p-1
                              bg-green-500
                              text-white
                              rounded
                              font-semibold
                            "
                            style="font-size: 10px"
                            >Approved</span
                          >
                          <span
                            v-else-if="strategy.status === 'denied'"
                            class="
                              text-center
                              badge-info
                              uppercase
                              p-1
                              bg-danger-300
                              text-white
                              rounded
                              font-semibold
                            "
                            style="font-size: 10px"
                            >{{ strategy.status }}</span
                          >
                          <span
                            v-else
                            class="
                              text-center
                              badge-info
                              uppercase
                              p-1
                              bg-gray-500
                              text-white
                              rounded
                              font-semibold
                            "
                            style="font-size: 10px"
                            >{{ strategy.status }}</span
                          >
                        </div>
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap">
                        <div class="text-sm leading-5 text-gray-900">
                          {{
                            $dayjs(strategy.created_at).format('MMM DD, YYYY')
                          }}
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
            </div>
          </div>
        </div>
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
        <div class="mt-3 text-primary-600">
          Loading submitted alternatives...
        </div>
      </div>
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
      strategies: (state) => state.portfolio.strategies,
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
    this.filters.portfolio_id = this.id
    this.$store.dispatch('portfolio/getStrategies', this.allFilters)
  },
}
</script>
