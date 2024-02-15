<template>
  <div v-if="!loading">
    <WSlideoversOverlay
      ref="location"
      :title="title"
      :caption="caption"
      class="z-40"
    >
      <template #content>
        <div class="flex px-6">
          <SharedLocationsForm
            v-if="slideOverMode === 'location'"
            :project-id="selectedLocation ? selectedLocation.id : null"
          />
          <SharedBulkLocationUpload v-if="slideOverMode === 'upload'" />
          <SharedLocationFilters v-if="slideOverMode === 'filters'" />
          <SharedCreateSubset v-if="slideOverMode === 'subset'" />
        </div>
      </template>
    </WSlideoversOverlay>
    <WSlideoversOverlay
      ref="profile"
      :title="`${activeLocation.name} - Profile`"
      class="z-40"
    >
      <template #content>
        <div class="flex px-6">
          <SharedProjectProfile :project="activeLocation" />
        </div>
      </template>
    </WSlideoversOverlay>
    <!-- Loading indicator -->
    <WFeedbackModal ref="loadingModal" class="z-50">
      <div class="max-w-xl space-y-2 px-4">
        <WLoadingSpinner class="mx-auto" />
        <div class="mt-3 text-primary-600">
          Archiving selected location(s). Please wait...
        </div>
        <div class="text-sm text-gray-400">
          If you don`t see the changes, please refresh the listing.
        </div>
      </div>
    </WFeedbackModal>
    <div class="flex justify-between">
      <div class="col-span-5">
        <WHeadingsHTwo heading="Locations"></WHeadingsHTwo>
      </div>
      <div class="flex space-x-2 my-auto">
        <WButtonsBase
          v-if="showAdd && !pendingReview"
          icon="plus"
          class="my-auto"
          @click.native="
            $router.push(
              `/wpr/${sharedworkspace.portfolio_number}/properties-import`
            )
          "
        >
          Import
        </WButtonsBase>

        <WButtonsDropdown v-if="showAdd && !pendingReview" class="my-auto">
          <WButtonsBase icon="plus">Add</WButtonsBase>
          <template #customButtons>
            <WButtonsBase
              type="neutral"
              @click.native="showOverlay('location')"
            >
              Add location
            </WButtonsBase>
            <WButtonsBase
              v-if="sharedworkspace.no_of_assets > 1"
              type="neutral"
              @click.native="showOverlay('subset')"
            >
              Create subset
            </WButtonsBase>
          </template>
        </WButtonsDropdown>
      </div>
    </div>
    <p class="text-gray-700 text-sm mt-2 max-w-3xl mb-3">
      You have enrolled ({{ sharedworkspace.no_of_assets }}) location(s) to
      pursue a WELL Performance Rating. Prior to submitting for review, you need
      to provide additional details about each location that help to evaluate
      compliance with feature requirements during their review. You can add each
      location individually or can utilize an excel template to bulk upload the
      required information for each location.
    </p>
    <div>
      <WTabsHorizontal
        v-model="currentTab"
        class="w-full -mb-px"
        :tabs="locationTabs"
      />
      <div v-if="currentTab === 'Overview'" class="flex">
        <div
          class="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg mt-5 w-full"
        >
          <div class="flex justify-between px-4 pt-4">
            <div class="flex space-x-2">
              <div
                v-if="currentUser.role.includes('well-admin') && renewalStatus"
              >
                <Flyout triangle="bottom" y="bottom" x="right" class="h-full">
                  <WButtonsBase
                    icon="view-grid"
                    type="primaryInverted"
                    @click.native="
                      ;(toggleBulkEdit = !toggleBulkEdit),
                        (selectedBulkProperties = [])
                    "
                  />
                  <template #content>
                    <div class="text-sm w-48 text-center p-2 text-primary-600">
                      Toggle Multiselect
                    </div>
                  </template>
                </Flyout>
              </div>
              <WButtonsBase
                icon="refresh"
                type="primaryInverted"
                @click.native="
                  $store.dispatch('shared/getSharedProjects', {
                    paginate: true,
                    page: 1,
                  })
                "
              >
                Refresh Project Listing
              </WButtonsBase>
            </div>
            <div class="w-1/2 float-right flex">
              <WButtonsBase
                v-if="selectedBulkProperties.length"
                icon="archive"
                type="primaryInverted"
                @click.native="archiveLocations()"
              >
                Archive locations
              </WButtonsBase>
              <WButtonsBase
                icon="download"
                class="ml-1"
                type="primaryInverted"
                @click.native="exportProjects"
              >
                Download locations
              </WButtonsBase>
              <WButtonsBase
                class="ml-1"
                icon="filter"
                type="primaryInverted"
                @click.native="showOverlay('filters')"
              >
                Filters
              </WButtonsBase>
            </div>
          </div>
          <div v-if="allLocations && allLocations.data.length">
            <div class="flex pt-3 overflow-x-auto overflow-y-hidden">
              <div class="flex flex-col">
                <div class="-my-2 overflow-x-auto">
                  <div class="py-2 align-middle inline-block min-w-full">
                    <div
                      class="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg"
                    >
                      <table class="min-w-full divide-y divide-gray-200">
                        <thead class="bg-primary-700 text-white !w-full">
                          <tr class="w-auto">
                            <th
                              v-if="toggleBulkEdit"
                              scope="col"
                              class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                            >
                              Select
                            </th>
                            <th
                              scope="col"
                              class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                            >
                              NAME
                            </th>
                            <th
                              scope="col"
                              class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                            >
                              COUNTRY
                            </th>
                            <th
                              scope="col"
                              class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                            >
                              CITY
                            </th>
                            <th
                              scope="col"
                              class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                            >
                              Area
                            </th>
                            <th
                              scope="col"
                              class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                            >
                              PUBLIC?
                            </th>

                            <th
                              scope="col"
                              class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                            >
                              Construction Status
                            </th>
                            <th
                              scope="col"
                              class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                            >
                              OWNER
                            </th>
                            <th
                              scope="col"
                              class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                            >
                              OWNER ORGANIZATION
                            </th>
                            <th
                              scope="col"
                              class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                            >
                              ADMIN
                            </th>
                            <th
                              scope="col"
                              class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                            >
                              ADDED AT
                            </th>
                            <th
                              v-if="sharedworkspace.hsr_status === 'achieved'"
                              scope="col"
                              class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                            >
                              Certificate
                            </th>
                            <th
                              scope="col"
                              class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                            >
                              Profile
                            </th>
                            <th
                              v-if="currentUser.role.includes('well-admin')"
                              scope="col"
                              class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                            >
                              Activate
                            </th>
                            <th
                              scope="col"
                              class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                            ></th>
                          </tr>
                        </thead>
                        <tbody class="bg-white divide-y divide-gray-200">
                          <tr
                            v-for="(location, index) in allLocations.data"
                            :key="index"
                            :class="
                              location.deleted_at !== null ? 'bg-gray-100' : ''
                            "
                          >
                            <td
                              v-if="toggleBulkEdit"
                              class="px-6 py-4 whitespace-nowrap"
                              :class="
                                location.deleted_at !== null ? 'opacity-50' : ''
                              "
                            >
                              <div class="flex items-center">
                                <div class="ml-4">
                                  <FormulateInput
                                    v-model="selectedBulkProperties"
                                    :value="location.id"
                                    :disabled="location.deleted_at"
                                    type="checkbox"
                                  />
                                </div>
                              </div>
                            </td>
                            <td
                              class="px-6 py-4 whitespace-nowrap"
                              :class="
                                location.deleted_at !== null ? 'opacity-50' : ''
                              "
                            >
                              <div class="text-sm font-medium text-gray-900">
                                <WLinksBase
                                  link="#"
                                  @click.native="
                                    !location.deleted_at &&
                                      !pendingReview &&
                                      showOverlay('edit-location', location)
                                  "
                                >
                                  {{ location.name }}
                                </WLinksBase>
                              </div>
                            </td>
                            <td
                              class="px-6 py-4 whitespace-nowrap"
                              :class="
                                location.deleted_at !== null ? 'opacity-50' : ''
                              "
                            >
                              <div class="text-sm font-medium text-gray-900">
                                {{ location.country_code }}
                              </div>
                            </td>
                            <td
                              class="px-6 py-4 whitespace-nowrap"
                              :class="
                                location.deleted_at !== null ? 'opacity-50' : ''
                              "
                            >
                              <div class="text-sm font-medium text-gray-900">
                                {{ location.map_city }}
                              </div>
                            </td>
                            <td
                              class="px-6 py-4 whitespace-nowrap"
                              :class="
                                location.deleted_at !== null ? 'opacity-50' : ''
                              "
                            >
                              <div class="text-sm font-medium text-gray-900">
                                {{ location.area }} sqft
                              </div>
                              <div class="text-sm text-gray-500">
                                {{ location.area_in_meter }} sqm
                              </div>
                            </td>
                            <td
                              class="px-6 py-4 whitespace-nowrap"
                              :class="
                                location.deleted_at !== null ? 'opacity-50' : ''
                              "
                            >
                              <span
                                v-if="location.project_public"
                                class="px-2 inline-flex text-xs uppercase leading-5 font-light rounded-full bg-green-100 text-green-800"
                              >
                                Yes
                              </span>
                              <span
                                v-else
                                class="px-2 inline-flex text-xs uppercase leading-5 font-light rounded-full bg-secondary-100 text-secondary-800"
                              >
                                No
                              </span>
                            </td>

                            <td
                              class="px-6 py-4 whitespace-nowrap"
                              :class="
                                location.deleted_at !== null ? 'opacity-50' : ''
                              "
                            >
                              <span
                                v-if="location.construction_status"
                                class="px-2 inline-flex text-xs uppercase leading-5 font-light rounded-full bg-green-100 text-green-800"
                              >
                                Complete
                              </span>
                              <span
                                v-else
                                class="px-2 inline-flex text-xs uppercase leading-5 font-light rounded-full bg-yellow-100 text-yellow-800"
                              >
                                Pending
                              </span>
                            </td>

                            <td
                              class="px-6 py-4 whitespace-nowrap"
                              :class="
                                location.deleted_at !== null ? 'opacity-50' : ''
                              "
                            >
                              <div
                                class="text-sm text-gray-900"
                                :class="
                                  location.deleted_at !== null
                                    ? 'opacity-50'
                                    : ''
                                "
                              >
                                {{ location.owner_name }}
                              </div>
                              <div
                                class="text-sm text-gray-500"
                                :class="
                                  location.deleted_at !== null
                                    ? 'opacity-50'
                                    : ''
                                "
                              >
                                {{ location.owner_email }}
                              </div>
                            </td>
                            <td
                              class="px-6 py-4 whitespace-nowrap"
                              :class="
                                location.deleted_at !== null ? 'opacity-50' : ''
                              "
                            >
                              <div
                                class="text-sm text-gray-900"
                                :class="
                                  location.deleted_at !== null
                                    ? 'opacity-50'
                                    : ''
                                "
                              >
                                {{ location.owner_org }}
                              </div>
                            </td>

                            <td
                              class="px-6 py-4 whitespace-nowrap"
                              :class="
                                location.deleted_at !== null ? 'opacity-50' : ''
                              "
                            >
                              <div class="text-sm text-gray-900">
                                {{ location.user.name }}
                                {{ location.user.last_name }}
                              </div>
                              <div
                                class="text-sm text-gray-500"
                                :class="
                                  location.deleted_at !== null
                                    ? 'opacity-50'
                                    : ''
                                "
                              >
                                {{ location.user.email }}
                              </div>
                            </td>
                            <td class="text-sm text-gray-900">
                              {{
                                $dayjs(location.addresses[0].created_at).format(
                                  'MMM DD, YYYY'
                                )
                              }}
                            </td>
                            <td
                              v-if="sharedworkspace.hsr_status === 'achieved'"
                              class="px-6 py-4 whitespace-nowrap"
                              :class="
                                location.deleted_at !== null ? 'opacity-50' : ''
                              "
                            >
                              <a
                                v-if="location.deleted_at == null"
                                href="#"
                                class="text-primary-600 hover:text-primary-900"
                                @click="
                                  downloadLocationLevelCertificate(location.id)
                                "
                                >Download</a
                              >
                            </td>

                            <td class="px-6 py-4 whitespace-nowrap">
                              <div
                                v-if="location.deleted_at == null"
                                class="text-primary-600 hover:text-primary-900 cursor-pointer"
                                @click="
                                  () => {
                                    $refs.profile.toggleOpen()
                                    activeLocation = location
                                  }
                                "
                              >
                                View
                              </div>
                            </td>
                            <td
                              v-if="
                                currentUser.role.includes('well-admin') &&
                                !showActionBtn(location)
                              "
                              class="px-6 py-4 whitespace-nowrap opacity-1"
                              @click.prevent.stop="
                                activateLocation(location.id)
                              "
                            >
                              <WButtonsBase
                                v-if="location.deleted_at"
                                type="primary"
                                >Restore</WButtonsBase
                              >
                            </td>
                            <td
                              class="px-6 py-4"
                              :class="
                                location.deleted_at !== null ? 'opacity-50' : ''
                              "
                            ></td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <FormInputsPagination
              v-if="allLocations && allLocations.data.length"
              :pagination="paginate"
              :offset="3"
              :show-max="true"
              @paginate="
                $store.dispatch('shared/getSharedProjects', {
                  paginate: true,
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
              <p class="text-base">There are no locations.</p>
            </div>
          </div>
        </div>
      </div>
      <div v-if="currentTab === 'Subset'" class="flex">
        <div
          class="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg mt-5 w-full"
        >
          <div class="flex justify-between px-4 pt-4">
            <div>
              <WButtonsBase
                icon="refresh"
                type="primaryInverted"
                @click.native="
                  $store.dispatch('shared/getSubsetList', {
                    paginate: true,
                    page: 1,
                  })
                "
              >
                Refresh Subset Listing
              </WButtonsBase>
            </div>
            <div class="w-1/2 float-right mt-2 mr-2 flex">
              <WButtonsBase
                icon="download"
                :type="['primaryInverted']"
                @click.native="exportProjects"
                >Download locations</WButtonsBase
              >
              <WButtonsBase
                class="ml-1"
                icon="filter"
                :type="['primaryInverted']"
                @click.native="showOverlay('filters')"
                >Filters
              </WButtonsBase>
            </div>
          </div>
          <div v-if="subsetList && subsetList.length">
            <div class="md:container md:mx-auto flex pt-3 overflow-x-auto">
              <table class="min-w-full divide-y divide-gray-200">
                <thead class="bg-primary-700 text-white">
                  <tr>
                    <th
                      scope="col"
                      class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                    >
                      LOCATION NAME
                    </th>
                    <th
                      v-for="subset in subsetList"
                      :key="'subset-th-' + subset.id"
                      scope="col"
                      class="px-6 py-3 text-center text-xs font-medium uppercase tracking-wider"
                    >
                      {{ subset.name }}
                    </th>
                  </tr>
                </thead>

                <tbody class="text-left select-none">
                  <tr
                    v-for="(location, index) in allLocations.data"
                    :key="index"
                    :class="[
                      index % 2 && 'bg-primary-100',
                      'divide-x border-b',
                    ]"
                  >
                    <td
                      class="px-6 py-4 whitespace-nowrap text-sm font-medium text-primary-700"
                    >
                      {{ location.project_number }} - {{ location.name }}
                    </td>
                    <td
                      v-for="subset in subsetList"
                      :key="'subset-td-' + subset.id + 'project-' + location.id"
                      :class="[
                        !isInSubset(location.id, subset)
                          ? 'hover:bg-green-50'
                          : 'hover:bg-red-50',
                        'px-6 py-4 text-center whitespace-nowrap cursor-pointer transition-colors duration-100',
                      ]"
                      @click="setLocationInSubset(location.id, subset)"
                    >
                      <svg
                        v-if="!isInSubset(location.id, subset)"
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
            <FormInputsPagination
              v-if="
                subsetList.length && allLocations && allLocations.data.length
              "
              :pagination="paginate"
              :offset="3"
              @paginate="
                $store.dispatch('shared/getSharedProjects', {
                  paginate: true,
                  page: paginate.current_page,
                })
              "
            />
          </div>
          <div
            v-else
            class="md:container md:mx-auto flex px-2 pt-3 overflow-x-auto"
          >
            <div class="p-4 my-5 w-full rounded text-sm">
              <WHeadingsHFour
                heading="Subsets are an efficiency tool to help you manage your portfolio."
              ></WHeadingsHFour>
              <p>
                Subsets make it easier to attach scorecard templates, assign
                documents or appoint team members with specific groups of
                locations. Subsets function similarly to a tag or filter, but
                have added settings you can select to ensure they display
                exactly when you want them to.
              </p>
              <p>
                We recommend you start with the broadest categories that are
                useful, those that share similarities which are important enough
                that their approach and strategy may differ significantly. Most
                organisations will find between 1-5 subsets works best Larger
                portfolios may see benefit in exploring 5-10 subsets.
              </p>
              <p>
                Currently your WELL Health-safety is not utilizing any subsets.
                Ready to start?
              </p>
            </div>
          </div>
        </div>
      </div>
      <div v-if="renewLocation" class="w-20 ml-auto mt-4 mb-2">
        <WButtonsBase
          type="primary"
          class="mr-4"
          @click.native="
            $store.commit('settings/setSidebarTab', 'TERMS')
            $router.push(
              `/shared-workspaces/${sharedWorkspace.portfolio_number}/recertification`
            )
          "
          >Next</WButtonsBase
        >
      </div>
    </div>
  </div>
</template>
<script>
import { mapState, mapActions } from 'vuex'
import { tableMixin } from '~/mixins/tableMixin'

export default {
  mixins: [tableMixin],
  data() {
    return {
      toggleBulkEdit: false,
      selectedBulkProperties: [],
      currentTab: 'Overview',
      title: '',
      caption: '',
      slideOverMode: '',
      selectedLocation: {},
      activeLocation: '',
      hasArchivedLocation: false,
    }
  },
  computed: {
    ...mapState({
      allLocations: (state) =>
        JSON.parse(JSON.stringify(state.shared.paginatedLocations)),
      loading: (state) => state.shared.loading,
      sharedworkspace: (state) => state.shared.sharedWorkspace,
      subsetList: (state) => state.shared.subsetList,
      renewLocation: (state) => state.renew.renewLocation,
      currentUser: (state) => state.user.currentUser,
      allReviews: (state) => state.review.allReviews,
      recertificationList: (state) => state.recertification.recertificationList,
      test: (state) => state.shared,
    }),
    renewalStatus() {
      return !!this.recertificationList.length
    },
    pendingReview() {
      if (
        this.allReviews &&
        this.allReviews.length > 0 &&
        this.allReviews.filter((review) => review.status !== 'reviewed')
          .length > 0
      ) {
        return true
      }
      return false
    },
    showAdd() {
      if (this.currentUser.role.includes('well-admin')) {
        return true
      }
      if (this.sharedworkspace.hsr_status === 'achieved') {
        if (!this.hsrAchieved) {
          return true
        } else {
          return false
        }
      }
      return true
    },
    hsrAchieved() {
      if (this.recertificationList && this.recertificationList.length) {
        const recert = this.recertificationList.filter((a) => a.date_certified)
        if (recert.length) {
          return !!recert[recert.length - 1].date_certified
        }
      }
      return false
    },
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
    locationTabs() {
      return this.sharedworkspace.no_of_assets > 1
        ? [
            { name: 'Overview', icon: '' },
            { name: 'Subset', icon: '' },
          ]
        : [{ name: 'Overview', icon: '' }]
    },
  },
  async created() {
    await this.$store.dispatch('shared/fetchSpaceTypes')
  },
  async mounted() {
    if (this.sharedworkspace) {
      await this.$store.dispatch(
        'review/getSharedReviewList',
        this.$route.params.id.toString().substring(5, 10)
      )
      this.$store.dispatch('shared/getSharedProjects', {
        paginate: 'Yes',
        page: this.paginate.current_page ? this.paginate.current_page : 1,
      })
      this.$store.dispatch('shared/getSubsetList')

      await this.$store.dispatch('recertification/getHSRRecertification')
    }
  },
  methods: {
    ...mapActions('shared', [
      'exportProjects',
      'getSubsetList',
      'downloadLocationCertificate',
    ]),
    showActionBtn(location) {
      if (
        location.deleted_at === null &&
        this.sharedworkspace.hsr_status !== 'achieved'
      ) {
        if (!this.hasArchivedLocation) this.hasArchivedLocation = true
        return true
      }
      return false
    },
    isInSubset(locationId, subset) {
      return subset.project_ids.includes(locationId)
    },
    downloadLocationLevelCertificate(locationId) {
      this.$store
        .dispatch('shared/downloadLocationCertificate', {
          portfolio_id: this.sharedworkspace.id,
          location_id: locationId,
        })
        .then((res) => {
          window.open(res.data.url, '_blank')
        })
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
      this.$store.dispatch('shared/syncSubset', data)
    },
    showOverlay(type, location) {
      this.slideOverMode = type
      switch (type) {
        case 'edit-location':
          this.title = 'Edit location'
          this.caption = ''
          this.slideOverMode = 'location'
          this.selectedLocation = { ...location }
          break
        case 'location':
          this.title = 'Add a location'
          this.caption = ''
          this.selectedLocation = null
          break
        case 'upload':
          this.title = 'Add multiple locations'
          this.caption =
            ' Upload spreadsheet to automatically create individual location profiles and scorecards for those locations within your WELL Performance Rating'
          break
        case 'filters':
          this.title = 'Filters'
          break
        case 'subset':
          this.title = 'Create a subset'
          this.caption =
            'Group locations into subsets to customize your list and make sharing documents easier.'
          break
        default:
          this.title = ''
          this.caption = ''
          break
      }
      this.$refs.location.toggleOpen()
    },
    async archiveLocations() {
      this.$refs.loadingModal.isHidden = false
      try {
        await this.$axios.post(
          `api/portfolio/projects/${this.sharedworkspace.id}/bulkUpdate`,
          {
            project_ids: this.selectedBulkProperties,
            data: [
              {
                field: 'deleted_at',
                value: new Date(),
              },
            ],
          }
        )
        this.$store.dispatch('notifications/toastMessage', {
          message: 'Selected projects archived successfully!',
        })

        this.selectedBulkProperties = []

        // call api to get updated list
        await this.$store.dispatch('shared/getSharedProjects', {
          paginate: true,
          page: this.paginate.current_page ? this.paginate.current_page : 1,
        })
        this.$refs.loadingModal.isHidden = true
      } catch (error) {
        this.$store.dispatch('notifications/toastMessage', {
          message: error.response.data.message,
        })
        this.$refs.loadingModal.isHidden = true
      }
    },
    activateLocation(locationId) {
      this.$store
        .dispatch('shared/activateLocation', locationId)
        .then(() => {
          this.$store.dispatch('notifications/toastMessage', {
            message: 'Selected project Restored successfully!',
          })
          this.$store.dispatch('shared/getSharedProjects', {
            paginate: true,
            page: this.paginate.current_page ? this.paginate.current_page : 1,
          })
        })
        .catch((err) => {
          this.$store.dispatch('notifications/toastMessage', {
            message: err.response.data.message,
          })
        })
    },
  },
}
</script>
