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
    <WFeedbackModal
      v-if="recertification && recertification.location_changed === 1"
      ref="confirmLocationModal"
      class="z-20 mt-12"
    >
      <div class="w-96">
        <div class="text-base text-center text-primary-900 leading-7 font-bold">
          Please confirm that the location list is final and ready for
          proceeding renewal.
        </div>
        <div class="flex p-4 justify-between">
          <WButtonsBase
            type="primaryInverted"
            class="mr-4"
            @click.native="confirmLocations()"
            >Confirm</WButtonsBase
          >
        </div>
      </div>
    </WFeedbackModal>
    <WFeedbackModal
      v-if="recertification && recertification.location_changed === 1"
      ref="nextScreenModal"
      class="z-20 mt-12"
      :can-manually-close="false"
    >
      <div class="w-96">
        <div>
          <div
            class="text-base text-primary-900 leading-7 font-bold text-center"
          >
            <p>
              Thank you for confirming the locations! The renewal audit
              locations list is ready under Documents >> General Tab. We will
              also share the audit locations via email as a follow-up.
            </p>
          </div>
          <div class="flex p-4 justify-center">
            <WButtonsBase
              type="primaryInverted"
              class="mr-4"
              @click.native="nextScreenModal()"
              >Next</WButtonsBase
            >
          </div>
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
              `/shared-workspaces/${sharedworkspace.portfolio_number}/properties-import`
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
        <WButtonsBase
          v-if="recertification && recertification.location_changed === 1"
          class="my-auto w-full whitespace-nowrap bg-danger-500 hover:bg-danger-400 hover:border-0"
          @click.native="showConfirmModal()"
        >
          Confirm Locations
        </WButtonsBase>
      </div>
    </div>
    <p
      v-if="recertification && recertification.location_changed === 1"
      class="text-gray-700 text-sm mt-2 max-w-3xl mb-3"
    >
      Please follow the instructions below to: <br />
      1. Add locations: To add a single new location to your enrollment at
      renewal, click the 'Add' button and complete the location details. To add
      multiple locations to your enrollment at renewal, click the 'Import'
      button to download the excel template. Complete the template with the
      location details and upload the excel file under Locations >> 'Import'
      page. <br />2. Remove locations: To remove a location, click the 'Archive'
      button under each location by scrolling to the right of the locations
      list. <br />
      3. Modify locations: To modify one or more locations, click the 'Import'
      button to download the existing locations list and make the necessary
      updates in the downloaded excel list. Complete the list and re-upload the
      template under Locations >> 'Import' page.
    </p>
    <p v-else class="text-gray-700 text-sm mt-2 max-w-3xl mb-3">
      You have enrolled ({{ sharedworkspace.no_of_assets }}) location(s) to
      pursue a WELL Health-Safety Rating. Prior to submitting for review, you
      need to provide additional details about each location that help to
      evaluate compliance with feature requirements during their review. You can
      add each location individually or can utilize an excel template to bulk
      upload the required information for each location.
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
                            <!-- Column 1 -->
                            <th
                              v-if="toggleBulkEdit"
                              scope="col"
                              class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                            >
                              Select
                            </th>
                            <!-- Column 2 -->
                            <th
                              scope="col"
                              class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                            >
                              NAME
                            </th>
                            <!-- Column 3 -->
                            <th
                              scope="col"
                              class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                            >
                              COUNTRY
                            </th>
                            <!-- Column 4 -->
                            <th
                              scope="col"
                              class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                            >
                              CITY
                            </th>
                            <!-- Column 5 -->
                            <th
                              scope="col"
                              class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                            >
                              Area
                            </th>
                            <!-- Column 6 -->
                            <th
                              scope="col"
                              class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                            >
                              PUBLIC?
                            </th>
                            <!-- Column 7 -->
                            <!-- <th
                              scope="col"
                              class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                            >
                              HEALTH-SAFETY RATED
                            </th> -->
                            <!-- Column 8 -->
                            <th
                              scope="col"
                              class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                            >
                              Construction Status
                            </th>
                            <!-- Column 9 -->
                            <th
                              scope="col"
                              class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                            >
                              OWNER
                            </th>
                            <!-- Column 10 -->
                            <th
                              scope="col"
                              class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                            >
                              OWNER ORGANIZATION
                            </th>
                            <!-- Column 11 -->
                            <th
                              scope="col"
                              class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                            >
                              ADMIN
                            </th>
                            <!-- Column 12 -->
                            <th
                              v-if="sharedworkspace.hsr_status === 'achieved'"
                              scope="col"
                              class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                            >
                              Certificate
                            </th>
                            <!-- Column 13 -->
                            <th
                              scope="col"
                              class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                            >
                              Profile
                            </th>
                            <!-- Column 14 -->
                            <th
                              scope="col"
                              class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                            >
                              Added at
                            </th>
                            <!-- Column 15 -->
                            <th
                              v-if="sharedworkspace.hsr_status === 'achieved'"
                              scope="col"
                              class="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                            >
                              Action
                            </th>
                            <!-- Column 16 -->
                            <th
                              v-if="hasArchivedLocation"
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
                            <!-- Column 1 -->
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
                            <!-- Column 2 -->
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
                            <!-- Column 3 -->
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
                            <!-- Column 4 -->
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
                            <!-- Column 5 -->
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
                            <!-- Column 6 -->
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
                            <!-- Column 7 -->
                            <!-- <td
                              class="px-6 py-4 whitespace-nowrap"
                              :class="
                                location.deleted_at !== null ? 'opacity-50' : ''
                              "
                            >
                              <span
                                v-if="location.hsr_cert === 'Yes'"
                                class="px-2 mt-2 inline-flex text-xs uppercase leading-5 font-light rounded-full"
                              >
                                <svg
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
                              </span>
                              <span
                                v-else-if="location.hsr_cert === ''"
                                class="px-2 mt-2 inline-flex text-xs uppercase leading-5 font-light rounded-full"
                              >
                                <WIconsBase
                                  icon="minus-circle"
                                  class="text-yellow-300"
                                />
                              </span>
                              <span
                                v-else
                                class="px-2 mt-2 inline-flex text-xs uppercase leading-5 font-light rounded-full"
                              >
                                <svg
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
                              </span>
                            </td> -->
                            <!-- Column 8 -->
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
                            <!-- Column 9 -->
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
                            <!-- Column 10 -->
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
                            <!-- Column 11 -->
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
                            <!-- Column 12 -->
                            <td
                              v-if="!showActionBtn(location)"
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
                            <!-- <td
                              v-else
                              class="px-6 py-4 whitespace-nowrap"
                              :class="
                                location.deleted_at !== null ? 'opacity-50' : ''
                              "
                            ></td> -->
                            <!-- Column 13 -->
                            <td class="px-6 py-4 whitespace-nowrap">
                              <span
                                class="text-primary-600 hover:text-primary-900 cursor-pointer"
                                @click="
                                  () => {
                                    $refs.profile.toggleOpen()
                                    activeLocation = location
                                  }
                                "
                              >
                                View
                              </span>
                            </td>
                            <!-- Column 14 -->
                            <td class="px-6 py-4 whitespace-nowrap">
                              <div class="text-sm text-gray-900">
                                {{
                                  location.addresses[0].created_at.split(' ')[0]
                                }}
                              </div>
                            </td>
                            <!-- Column 15  -->
                            <td
                              v-if="showActionBtn(location)"
                              class="px-6 py-4"
                              :class="
                                location.deleted_at !== null ? 'opacity-50' : ''
                              "
                            ></td>
                            <!-- Column 16 -->
                            <td
                              v-if="!showActionBtn(location)"
                              class="px-6 py-4 whitespace-nowrap opacity-1"
                            >
                              <WButtonsBase
                                v-if="location.deleted_at"
                                title="Restoring a location will add the location back to your WELL Health-Safety portfolio without tagging it to the uploaded documents."
                                type="primary"
                                @click.native="activateLocation(location.id)"
                                >Restore</WButtonsBase
                              >
                              <WButtonsBase
                                v-else
                                title="Archiving a location will remove it from your WELL Health-Safety portfolio."
                                type="primary"
                                @click.native="archiveLocations(location.id)"
                              >
                                Archive
                              </WButtonsBase>
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
export default {
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
      allLocations: (state) => state.shared.paginatedLocations,
      loading: (state) => state.shared.loading,
      sharedworkspace: (state) => state.shared.sharedWorkspace,
      subsetList: (state) => state.shared.subsetList,
      renewLocation: (state) => state.renew.renewLocation,
      currentUser: (state) => state.user.currentUser,
      allReviews: (state) => state.review.allReviews,
      recertificationList: (state) => state.recertification.recertificationList,
      test: (state) => state.shared,
    }),
    recertification() {
      let recertifiction = ''
      if (this.recertificationList.length !== 0) {
        const lastRecertifiction = this.recertificationList.length - 1
        recertifiction = this.recertificationList[lastRecertifiction]
      }
      return recertifiction
    },
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
            ' Upload spreadsheet to automatically create individual location profiles and scorecards for those locations within your WELL Health-Safety Rating'
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
    async archiveLocations(locationID) {
      this.$refs.loadingModal.isHidden = false
      // Archive Single Location vs Bulk Edit
      const payload = {
        project_ids: locationID ? [locationID] : this.selectedBulkProperties,
        data: [
          {
            field: 'deleted_at',
            value: new Date(),
          },
        ],
      }
      try {
        await this.$axios.post(
          `api/portfolio/projects/${this.sharedworkspace.id}/bulkUpdate`,
          payload
        )
        this.$store.dispatch('notifications/toastMessage', {
          message:
            'Starting archiving process now. Please refresh to see the updated list',
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
    showConfirmModal() {
      this.$refs.confirmLocationModal.isHidden = false
    },
    confirmLocations() {
      // Set Location Confirmed back to 0 (True)
      const recertPayload = {
        ...this.recertification,
        location_changed: 0,
      }
      this.$store.dispatch('recertification/updateRecert', recertPayload)
      // Set Tab in Recert Steps
      this.$store.dispatch('shared/setActiveTab', 'CONFIRM FEES')
      // Hide all Modals
      this.$refs.confirmLocationModal.isHidden = true
      this.$refs.nextScreenModal.isHidden = false
    },
    nextScreenModal() {
      this.$router.push(
        `/shared-workspaces/${this.sharedworkspace.portfolio_number}/recertification`
      )
    },
  },
}
</script>
