<template>
  <div>
    <div
      v-if="subsetList && subsetList.length > 0"
      class="
        shadow
        overflow-hidden
        border-b border-gray-200
        sm:rounded-lg
        w-full
      "
    >
      <div class="flex flex-col">
        <div class="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div
            class="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8"
          >
            <div
              class="
                shadow
                overflow-hidden
                border-b border-gray-200
                sm:rounded-lg
              "
            >
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
                      Location
                    </th>
                    <th
                      v-for="(subset, index) in subsetList"
                      :key="index"
                      scope="col"
                      class="
                        px-6
                        py-3
                        text-left text-xs
                        font-semibold
                        uppercase
                        tracking-wider
                        text-center
                      "
                    >
                      {{ subset.name }}
                    </th>
                  </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
                  <tr
                    v-for="(project, index) in allLocations.data"
                    :key="index"
                  >
                    <td class="px-6 py-4 whitespace-nowrap">
                      <div class="text-sm font-medium text-gray-900">
                        {{ project.name }}
                      </div>
                    </td>
                    <td
                      v-for="subset in subsetList"
                      :key="'subset-td-' + subset.id + 'project-' + project.id"
                      :class="[
                        !isInSubset(project.id, subset)
                          ? 'hover:bg-green-50'
                          : 'hover:bg-red-50',
                        'px-6 py-4 text-center whitespace-nowrap cursor-pointer transition-colors duration-100',
                      ]"
                      @click="setLocationInSubset(project.id, subset)"
                    >
                      <svg
                        v-if="!isInSubset(project.id, subset)"
                        class="h-6 w-6 inline"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="#BD7A86"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                      <svg
                        v-else
                        class="h-6 w-6 inline"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="#C2D8C1"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      <FormInputsPagination
        v-if="allLocations && allLocations.data.length"
        :show-max="true"
        :pagination="paginate"
        :offset="2"
        @paginate="
          $store.dispatch('portfolio/getFilterProjects', {
            sortBy: null,
            paginate: 'Yes',
            page: paginate.current_page,
          })
        "
      />
    </div>
    <div v-else>
      <div class="p-10 bg-primary-100 border border-primary-200 rounded-md">
        <WHeadingsHFour
          heading="Subsets are an efficiency tool to help you manage your portfolio."
          class="text-primary-900"
        />
        <div class="text-primary-900 opacity-50">
          <p>
            Subsets make it easier to attach scorecard templates, assign
            documents or appoint team members with specific groups of locations.
            Subsets function similarly to a tag or filter, but have added
            settings you can select to ensure they display exactly when you want
            them to.
          </p>
          <p>
            We recommend you start with the broadest categories that are useful,
            those that share similarities which are important enough that their
            approach and strategy may differ significantly. Most organisations
            will find between 1-5 subsets works best Larger portfolios may see
            benefit in exploring 5-10 subsets.
          </p>
          <p>
            Currently your portfolio is not utilizing any subsets. Ready to
            start?
          </p>
        </div>
        <div class="inline-flex mt-3">
          <WButtonsBase
            type="primary"
            @click.native="$parent.showOverlay('subset')"
          >
            Create subset now
          </WButtonsBase>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  computed: {
    ...mapState({
      subsetList: (state) => state.portfolio.subsetList,
      allLocations: (state) => state.portfolio.allLocations,
    }),
    paginate() {
      if (this.allLocations) {
        return {
          total: this.allLocations.total,
          per_page: this.allLocations.per_page,
          current_page: this.allLocations.current_page,
          last_page: this.allLocations.last_page,
          from: this.allLocations.from,
          to: this.allLocations.to,
        }
      }
      return {}
    },
  },
  methods: {
    isInSubset(locationId, subset) {
      return subset.project_ids.includes(locationId)
    },
    setLocationInSubset(locationId, subset) {
      // deep copy to detach teh subset listing from the state
      const subsetClone = JSON.parse(JSON.stringify(this.subsetList))
      const subsetIndex = subsetClone.findIndex((a) => a.id === subset.id)
      if (!subsetClone[subsetIndex].project_ids.includes(locationId)) {
        subsetClone[subsetIndex].project_ids.push(locationId)
      } else {
        subsetClone[subsetIndex].project_ids = subsetClone[
          subsetIndex
        ].project_ids.filter(function (item) {
          return item !== locationId
        })
      }
      const subsets = subsetClone.filter((a) =>
        a.project_ids.includes(locationId)
      )
      const data = {
        project_id: locationId,
        subset_ids: subsets.map((element) => {
          return element.id
        }),
      }
      this.$store.dispatch('portfolio/syncSubset', data)
    },
  },
}
</script>
