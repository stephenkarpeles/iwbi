<template>
  <div class="relative">
    <!-- slide over -->
    <WSlideoversOverlay ref="location" title="Edit location" class="z-40">
      <template #content>
        <div class="flex px-6">
          <PortfolioPropertiesAdd
            :project-id="selectedLocation ? selectedLocation.id : null"
          />
        </div>
      </template>
    </WSlideoversOverlay>
    <WFeedbackModal ref="bulkEdit" title="Edit Selected Locations" class="z-40">
      <PortfolioBulkEditForm
        v-if="$refs.bulkEdit && !$refs.bulkEdit.isHidden"
        :properties="selectedBulkProperties"
      />
    </WFeedbackModal>
    <div class="absolute -mt-12 flex space-x-2">
      <Flyout triangle="bottom" y="bottom" x="right" class="h-full">
        <WButtonsBase
          icon="view-grid"
          type="primaryInverted"
          @click.native="
            ;(toggleBulkEdit = !toggleBulkEdit), (selectedBulkProperties = [])
          "
        />
        <template #content>
          <div class="text-sm w-48 text-center p-2 text-primary-600">
            Toggle Multiselect
          </div>
        </template>
      </Flyout>
      <WButtonsBase
        v-if="toggleBulkEdit && selectedBulkProperties.length > 1"
        icon="pencil"
        @click.native="$refs.bulkEdit.isHidden = false"
      >
        Edit Selected
      </WButtonsBase>
      <Flyout triangle="bottom" y="bottom" x="right" class="h-full">
        <WButtonsBase
          icon="ruler"
          type="primaryInverted"
          @click.native="toggleSizeDisplay()"
        />
        <template #content>
          <div class="text-sm w-52 text-center p-2 text-primary-600">
            Toggle Metric / Imperial Units
          </div>
        </template>
      </Flyout>
    </div>

    <WFeedbackModal ref="occupancyModal">
      <div v-if="selectedOccupancy" class="w-96 mt-2 -mb-2 text-xs">
        <div class="p-4 text-white bg-primary-600 rounded-t-lg">
          You do not have occpancy estimates added for this location, however,
          occupancy numbers impact your WELL Score significantly
        </div>
        <div class="px-4 pb-4 mt-2 rounded-b-lg">
          <div>
            Based on the area of this location, we estimate
            {{ selectedOccupancy.no_of_occupants_recommend }}
            occupants to be here. You can confirm these estimates now and update
            this again in the future.
          </div>
          <div class="mt-2">
            <FormulateForm
              @submit="
                updateOccupancy(
                  selectedOccupancy.id,
                  newOccupancyValue,
                  updateOthersValue
                )
              "
            >
              <FormulateInput
                v-model="newOccupancyValue"
                type="number"
                :value="selectedOccupancy.no_of_occupants_recommend"
                validation="required"
              />
              <FormulateInput
                v-model="updateOthersValue"
                class="my-2"
                :label="`Update all ${portfolio.missing_occupants_count} locations in this Portfolio having no occupancy estimate with default estimates`"
                type="checkbox"
              />
              <WButtonsBase v-if="updatingOccupancy" :type="'primaryInverted'">
                <span>
                  <WLoadingSpinner type="button" class="mx-auto" />
                </span>
              </WButtonsBase>
              <FormulateInput v-else type="submit" label="Confirm" />
            </FormulateForm>
          </div>
        </div>
      </div>
    </WFeedbackModal>

    <div
      class="z-10 relative shadow overflow-hidden border-b border-gray-200 sm:rounded-lg w-full"
    >
      <div v-if="allLocations && allLocations.data">
        <div class="flex flex-col">
          <div class="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div
              class="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8"
            >
              <div class="shadow border-b border-gray-200 sm:rounded-lg">
                <table class="min-w-full divide-y divide-gray-200">
                  <thead class="bg-primary-700 text-white">
                    <tr>
                      <th
                        v-if="toggleBulkEdit"
                        scope="col"
                        class="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider"
                      >
                        Select
                      </th>
                      <th
                        scope="col"
                        class="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider"
                      >
                        <div class="w-32 flex items-center space-x-2">
                          <div>location</div>
                          <div>
                            <WIconsBase
                              class="cusor-pointer"
                              icon="switch-vertical"
                              @click.native="
                                ;(sortBy = 'project_number'),
                                  $store.dispatch(
                                    'portfolio/getFilterProjects',
                                    {
                                      sortBy: sortBy,
                                      paginate: 'Yes',
                                      page: paginate.current_page,
                                    }
                                  )
                              "
                            />
                          </div>
                        </div>
                      </th>
                      <th
                        scope="col"
                        class="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider"
                      >
                        city
                      </th>
                      <th
                        scope="col"
                        class="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider"
                      >
                        <div>country</div>
                      </th>
                      <th
                        scope="col"
                        class="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider"
                      >
                        <div class="w-32 flex items-center space-x-2">
                          <div>occupancy</div>
                          <div>
                            <WIconsBase
                              class="cusor-pointer"
                              icon="switch-vertical"
                              @click.native="
                                ;(sortBy = 'no_of_occupants'),
                                  $store.dispatch(
                                    'portfolio/getFilterProjects',
                                    {
                                      sortBy: sortBy,
                                      paginate: 'Yes',
                                      page: paginate.current_page,
                                    }
                                  )
                              "
                            />
                          </div>
                        </div>
                      </th>
                      <th
                        scope="col"
                        class="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider"
                      >
                        <div class="flex items-center space-x-2">
                          <span class="w-20">
                            SIZE
                            {{
                              selectedMetric === 'meters' ? '(Sq m)' : '(Sq f)'
                            }}
                          </span>
                          <div>
                            <WIconsBase
                              v-if="selectedMetric === 'meters'"
                              class="cusor-pointer"
                              icon="switch-vertical"
                              @click.native="
                                ;(sortBy = 'area_in_meter'),
                                  $store.dispatch(
                                    'portfolio/getFilterProjects',
                                    {
                                      sortBy: sortBy,
                                      paginate: 'Yes',
                                      page: paginate.current_page,
                                    }
                                  )
                              "
                            />
                            <WIconsBase
                              v-else
                              class="cusor-pointer"
                              icon="switch-vertical"
                              @click.native="
                                ;(sortBy = 'area'),
                                  $store.dispatch(
                                    'portfolio/getFilterProjects',
                                    {
                                      sortBy: sortBy,
                                      paginate: 'Yes',
                                      page: paginate.current_page,
                                    }
                                  )
                              "
                            />
                          </div>
                        </div>
                      </th>
                      <th
                        scope="col"
                        class="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider"
                      >
                        <div class="w-32 flex items-center space-x-2">
                          <div>addenda</div>
                          <div>
                            <WIconsBase
                              class="cusor-pointer"
                              icon="switch-vertical"
                              @click.native="
                                ;(sortBy = 'applicable_version_id'),
                                  $store.dispatch(
                                    'portfolio/getFilterProjects',
                                    {
                                      sortBy: sortBy,
                                      paginate: 'Yes',
                                      page: paginate.current_page,
                                    }
                                  )
                              "
                            />
                          </div>
                        </div>
                      </th>

                      <th
                        scope="col"
                        class="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider"
                      >
                        public?
                      </th>
                      <th
                        scope="col"
                        class="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider"
                      >
                        precertification
                      </th>
                      <th
                        scope="col"
                        class="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider"
                      >
                        certification
                      </th>
                      <th
                        scope="col"
                        class="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider"
                      >
                        construction
                      </th>
                      <th
                        scope="col"
                        class="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider overflow-hidden"
                      >
                        <div class="w-32">owner</div>
                      </th>

                      <th
                        scope="col"
                        class="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider"
                      >
                        <div class="w-40">owner organization</div>
                      </th>

                      <th
                        scope="col"
                        class="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider"
                      >
                        project admin
                      </th>
                      <th
                        scope="col"
                        class="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider"
                      >
                        <div class="w-32 flex items-center space-x-2">
                          <div>updated at</div>
                          <div>
                            <WIconsBase
                              class="cusor-pointer"
                              icon="switch-vertical"
                              @click.native="
                                ;(sortBy = 'updated_at'),
                                  $store.dispatch(
                                    'portfolio/getFilterProjects',
                                    {
                                      sortBy: sortBy,
                                      paginate: 'Yes',
                                      page: paginate.current_page,
                                    }
                                  )
                              "
                            />
                          </div>
                        </div>
                      </th>
                      <th
                        class="px-3 md:px-6 py-3 text-left text-xs leading-4 font-medium uppercase tracking-wider"
                      >
                        <div class="w-28"></div>
                      </th>
                      <th
                        class="w-28 font-semibold right-0 transform absolute px-3 md:px-6 py-3 text-left text-xs leading-4 uppercase tracking-wider bg-primary-700"
                      >
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody class="bg-white divide-y divide-gray-200">
                    <tr
                      v-for="(project, index) in allLocations.data"
                      :key="index"
                      :class="
                        project.deleted_at !== null && 'bg-gray-200 opacity-50'
                      "
                    >
                      <td
                        v-if="toggleBulkEdit"
                        class="px-6 py-4 whitespace-nowrap"
                      >
                        <div class="flex items-center">
                          <div class="ml-4">
                            <FormulateInput
                              v-model="selectedBulkProperties"
                              :value="project.id"
                              type="checkbox"
                            />
                          </div>
                        </div>
                      </td>
                      <td
                        class="px-6 py-4 whitespace-nowrap text-primary-600 hover:text-primary-500 hover:cursor-pointer"
                        :class="
                          project.deleted_at
                            ? 'hover:cursor-not-allowed hover:text-primary-600'
                            : ''
                        "
                        @click="
                          !project.deleted_at ? viewProperty(project) : null
                        "
                      >
                        <div class="flex items-center">
                          <div class="text-sm font-medium">
                            <div>
                              {{ project.name }}
                            </div>
                            <div class="py-1 text-xs">
                              {{ project.project_number }}
                            </div>
                          </div>
                        </div>
                      </td>

                      <td
                        class="px-6 py-4 whitespace-nowrap text-sm text-gray-500"
                      >
                        {{ project.map_city }}
                      </td>

                      <td
                        class="px-6 py-4 whitespace-nowrap text-sm text-gray-500"
                      >
                        {{ project.country_code }}
                      </td>

                      <td
                        class="px-6 py-4 text-gray-500 text-sm"
                        @mouseenter="
                          ;(newOccupancyValue =
                            project.no_of_occupants_recommend),
                            (updateOthersValue = false)
                        "
                      >
                        <div
                          v-if="
                            project.no_of_occupants == null ||
                            project.no_of_occupants === ''
                          "
                          class="flex"
                        >
                          {{ project.no_of_occupants_recommend }}
                          <WIconsBase
                            type="primary"
                            class="cursor-pointer"
                            icon="exclamation-circle"
                            @click.native="
                              ;($refs.occupancyModal.isHidden = false),
                                (selectedOccupancy = project)
                            "
                          />
                        </div>
                        <div v-else>
                          {{ project.no_of_occupants }}
                        </div>
                      </td>
                      <td
                        class="px-6 py-4 whitespace-nowrap text-sm text-gray-500"
                      >
                        <div v-if="selectedMetric === 'feet'">
                          {{ project.area }}
                        </div>
                        <div v-else>
                          {{ project.area_in_meter }}
                        </div>
                      </td>
                      <td
                        class="px-6 py-4 whitespace-nowrap text-sm text-gray-500"
                      >
                        {{ project.addenda_version_name }}
                      </td>

                      <td class="px-6 py-4 whitespace-nowrap">
                        <div
                          v-if="project.project_public"
                          class="text-sm font-medium text-gray-900"
                        >
                          <svg
                            class="h-5 w-5 inline"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="#84B082"
                          >
                            <path
                              stroke-linecap="round"
                              stroke-linejoin="round"
                              stroke-width="2"
                              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                        </div>
                        <div v-else class="text-sm font-medium text-gray-900">
                          <svg
                            class="h-5 w-5 inline"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="#AC5867"
                          >
                            <path
                              stroke-linecap="round"
                              stroke-linejoin="round"
                              stroke-width="2"
                              d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                        </div>
                      </td>

                      <td class="px-6 py-4 whitespace-nowrap">
                        <div
                          v-if="project.d_and_o"
                          class="text-sm font-medium text-gray-900"
                        >
                          <svg
                            class="h-5 w-5 inline"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="#84B082"
                          >
                            <path
                              stroke-linecap="round"
                              stroke-linejoin="round"
                              stroke-width="2"
                              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                        </div>
                        <div v-else class="text-sm font-medium text-gray-900">
                          <svg
                            class="h-5 w-5 inline"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="#AC5867"
                          >
                            <path
                              stroke-linecap="round"
                              stroke-linejoin="round"
                              stroke-width="2"
                              d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                        </div>
                      </td>

                      <td class="px-6 py-4 whitespace-nowrap">
                        <div
                          v-if="project.well_cert === 'Yes'"
                          class="text-sm font-medium text-gray-900"
                        >
                          <svg
                            class="h-5 w-5 inline"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="#84B082"
                          >
                            <path
                              stroke-linecap="round"
                              stroke-linejoin="round"
                              stroke-width="2"
                              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                        </div>
                        <div v-else class="text-sm font-medium text-gray-900">
                          <svg
                            class="h-5 w-5 inline"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="#AC5867"
                          >
                            <path
                              stroke-linecap="round"
                              stroke-linejoin="round"
                              stroke-width="2"
                              d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                        </div>
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap">
                        <div
                          v-if="project.construction_status"
                          class="text-sm font-medium text-gray-900"
                        >
                          <svg
                            class="h-5 w-5 inline"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="#84B082"
                          >
                            <path
                              stroke-linecap="round"
                              stroke-linejoin="round"
                              stroke-width="2"
                              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                        </div>
                        <div v-else class="text-sm font-medium text-gray-900">
                          <svg
                            class="h-5 w-5 inline"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="#AC5867"
                          >
                            <path
                              stroke-linecap="round"
                              stroke-linejoin="round"
                              stroke-width="2"
                              d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                        </div>
                      </td>
                      <td
                        class="px-6 py-4 whitespace-nowrap text-sm text-gray-500"
                      >
                        <div>
                          {{ project.owner_name }}
                        </div>
                        <div class="mt-2 py-1 text-gray-500">
                          {{ project.owner_email }}
                        </div>
                      </td>

                      <td
                        class="px-6 py-4 whitespace-nowrap text-sm text-gray-500"
                      >
                        {{ project.owner_org }}
                      </td>
                      <td
                        class="px-6 py-4 whitespace-nowrap text-sm text-gray-500"
                      >
                        <div>
                          {{ project.user.name }}
                        </div>
                        <div
                          class="mt-2 whitespace-nowrap text-sm text-gray-500"
                        >
                          {{ project.user.email }}
                        </div>
                      </td>

                      <td
                        class="px-6 py-4 whitespace-nowrap text-sm text-gray-500"
                      >
                        {{ $dayjs(project.updated_at).format('MMM DD, YYYY') }}
                      </td>

                      <td class="w-28"></td>

                      <td
                        :class="`
                          flex
                          w-28
                          h-16
                          justify-center
                          right-0
                          transform
                          absolute
                          whitespace-nowrap
                          ${!project.deleted_at && 'white-gradient'}
                          my-2
                          px-2
                        `"
                      >
                        <div class="flex space-x-2">
                          <WButtonsBase
                            :disabled="project.deleted_at"
                            type="primaryInverted"
                            icon="pencil"
                            @click.native="showOverlay(project)"
                          />
                        </div>
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
              sortBy: sortBy,
              paginate: 'Yes',
              page: paginate.current_page,
            })
          "
        />
      </div>
      <div
        v-else
        class="md:container md:mx-auto flex px-2 pt-3 overflow-x-auto"
      >
        <div class="p-4 my-5 w-full rounded font-semibold text-sm">
          <p class="text-base">There are no Project.</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  data() {
    return {
      sortBy: null,
      selectedOccupancy: null,
      updatingOccupancy: false,
      selectedLocation: null,
      toggleBulkEdit: false,
      selectedMetric: 'meters',
      selectedBulkProperties: [],
      newOccupancyValue: null,
      updateOthersValue: false,
    }
  },
  computed: {
    ...mapState({
      portfolio: (state) => state.portfolio.portfolio,
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
    toggleSizeDisplay() {
      if (this.selectedMetric === 'meters') {
        this.selectedMetric = 'feet'
      } else {
        this.selectedMetric = 'meters'
      }
    },
    async updateOccupancy(project, newOccupancyValue, updateOthersValue) {
      const self = this
      this.updatingOccupancy = true
      await this.$store
        .dispatch('portfolio/updateOccupancy', {
          portfolio_id: this.portfolio.id,
          project_id: project,
          no_of_occupants: newOccupancyValue,
          update_others: updateOthersValue,
        })
        .then((res) => {
          setTimeout(() => {
            self.$store.dispatch('portfolio/getFilterProjects', {
              paginate: 'Yes',
              page: self.paginate.current_page,
            })
            self.$store.dispatch('portfolio/getPortfolioById', {
              id: self.portfolio.id,
            })
            self.updatingOccupancy = false
            self.$refs.occupancyModal.isHidden = true
            self.$store.dispatch('notifications/toastMessage', {
              message: res.data.msg,
            })
          }, 3000)
        })
    },

    viewProperty(project) {
      if (project.type === 'v2-pilot') {
        window.open(
          this.$router.resolve(
            `/projects/v2-pilot/${project.project_number}/dashboard`
          ).href,
          '_blank'
        )
      } else {
        window.open(
          this.$router.resolve(
            `/projects/v2/${project.project_number}/dashboard`
          ).href,
          '_blank'
        )
      }
    },
    showOverlay(project) {
      this.selectedLocation = project
      this.$refs.location.toggleOpen()
    },
  },
}
</script>
