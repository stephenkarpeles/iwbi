<template>
  <div>
    <div v-if="ceHours && currentUser">
      <WFeedbackModal ref="renewModal" class="z-40">
        <WHeadingsHThree heading="Would you like to renew your credentials?" />
        <FormulateForm @submit="renewCredentials">
          <FormInputsAddressFormulate
            ref="mailingAddress"
            :required="true"
            :address="renewalData.address"
            :target="renewalData.address"
            :element-id="`mailing`"
          />
          <div class="mt-8 flex max-w-md mx-auto">
            <div class="mx-auto flex">
              <div class="text-sm text-gray-400 my-auto mr-2">
                Do you have a discount code?
              </div>
              <Toggle v-model="showDiscountForm" />
            </div>
          </div>
          <div
            v-if="showDiscountForm"
            class="relative flex flex-grow focus-within:z-10 z-10 -mr-4"
          >
            <input
              v-model="renewalData.discount_code"
              placeholder="Discount Code"
              class="mx-auto max-w-sm border mt-2 rounded-md shadow-sm text-primary-700 appearance-none w-full px-3 py-2 border-primary-300 placeholder-primary-400 focus:outline-none focus:shadow-outline-blue focus:border-blue-300 transition duration-150 ease-in-out sm:text-sm sm:leading-5"
              @input="renewError = null"
            />
          </div>
          <div v-if="renewError" class="rounded-md bg-red-50 p-4">
            <div class="flex">
              <div class="flex-shrink-0">
                <svg
                  class="h-5 w-5 text-red-400"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    fill-rule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clip-rule="evenodd"
                  />
                </svg>
              </div>
              <div class="ml-3">
                <h3 class="text-sm font-medium text-red-800">
                  {{ renewError }}
                </h3>
              </div>
            </div>
          </div>
          <FormulateInput
            class="mt-5"
            type="submit"
            label="Renew Now"
            :disabled="processingRenew"
          />
        </FormulateForm>
      </WFeedbackModal>
      <WSlideoversOverlay
        ref="reportSlide"
        title="Report CE Hours"
        class="z-40"
      >
        <template #content>
          <div class="px-4 sm:px-6">
            <FormulateForm @submit="validateNewHours">
              <div>
                <h3
                  class="text-lg leading-6 font-medium text-gray-900 pt-5 pb-2"
                >
                  Activity Type
                </h3>
                <FormulateInput
                  v-model="formData.activity_type"
                  :options="activityTypes"
                  type="radio"
                  validation-name="An activity type"
                  validation="required"
                />
              </div>
              <div v-if="formData.activity_type === 'Education'">
                <h3
                  class="text-lg leading-6 font-medium text-gray-900 pt-5 pb-2"
                >
                  Course Information
                </h3>
                <FormulateInput
                  v-model="formData.course_id"
                  type="text"
                  label="Course ID"
                />
              </div>
              <div v-if="formData.activity_type === 'Project'">
                <h3
                  class="text-lg leading-6 font-medium text-gray-900 pt-5 pb-2"
                >
                  Project Information
                </h3>
                <FormulateInput
                  v-model="formData.project_type"
                  type="select"
                  label="Project Type"
                  :options="projectTypes"
                  placeholder="Select option"
                />
                <FormulateInput
                  v-model="formData.project_id"
                  type="text"
                  label="Project ID"
                />
                <FormulateInput
                  v-model="formData.project_name"
                  type="text"
                  label="Project Name"
                />
                <FormulateInput
                  v-model="formData.project_role"
                  type="select"
                  label="Project Role"
                  :options="projectRoles"
                  placeholder="Select option"
                />
              </div>
              <div>
                <h3
                  class="text-lg leading-6 font-medium text-gray-900 pt-5 pb-2"
                >
                  Involvement
                </h3>
                <FormulateInput
                  v-model="formData.activity_title"
                  type="text"
                  label="Activity Title"
                  validation="required"
                />
                <FormulateInput
                  v-model="formData.provided_by"
                  type="text"
                  label="Provided By"
                  validation="required"
                />
                <FormulateInput
                  v-model="formData.start_date"
                  type="datetimepicker"
                  max="9999-01-01"
                  label="Activity Start Date"
                  :validation="
                    'required|after:' +
                    currentUser.credential_start_date +
                    '|before:' +
                    currentUser.credential_end_date
                  "
                />
                <FormulateInput
                  v-if="formData.start_date !== ''"
                  v-model="formData.end_date"
                  type="datetimepicker"
                  max="9999-01-01"
                  label="Activity End Date"
                  :validation="'required'"
                />
                <FormulateInput
                  v-model="formData.description"
                  type="textarea"
                  label="Activity Description"
                  validation="required"
                />
                <FormulateInput
                  v-model="formData.url"
                  type="text"
                  label="Activity URL"
                />
                <FormulateInput
                  v-model="formData.well_specific"
                  :options="{
                    0: 'No',
                    1: 'WELL-Specific',
                  }"
                  type="radio"
                  label="Is this activity WELL-specific?*"
                  validation="required"
                  validation-name="This question"
                />
                <FormulateInput
                  v-model="formData.hours_reported"
                  type="number"
                  step="0.01"
                  min="0"
                  label="Hours Reported"
                  validation="required|max:10|min:0"
                />
                <FormulateInput class="mt-3" type="submit" />
              </div>
            </FormulateForm>
          </div>
        </template>
      </WSlideoversOverlay>
      <div class="flex-1 relative z-0">
        <NavBreadcrumbs
          :class="
            displayWarning
              ? 'sm:px-6 md:px-8 relative'
              : 'sm:px-6 md:px-8 relative md:pb-11'
          "
        >
          <div class="md:flex justify-between items-center">
            <div class="md:flex">
              <img
                class="h-full mr-5 my-auto w-22"
                src="/well-ap/credentials/badge.png"
              />
              <div class="mr-4 lg:mr-0">
                <div class="xl:flex relative mb-4">
                  <WHeadingsHTwo
                    class="mb-2 lg:w-2/3"
                    heading="WELL AP Credential Maintenance"
                  />
                  <div
                    class="xl:mt-3 xl:ml-3 xl:absolute right-0 xl:transform xl:translate-x-1/2"
                  >
                    <div
                      v-if="currentUser.external_id"
                      class="bg-secondary-700 text-white px-2 md:px-8 inline-block rounded-md text-center"
                    >
                      &bull; WELL-AP-00000{{
                        currentUser.external_id.slice(-10)
                      }}
                    </div>
                    <div
                      v-else
                      class="bg-secondary-700 text-white px-4 rounded-md"
                    >
                      External ID Not Found
                    </div>
                  </div>
                </div>
                <div
                  v-if="currentUser.credential_start_date"
                  class="flex flex-col sm:flex-row text-base leading-6 text-gray-500 font-bold mb-4"
                >
                  <span class="flex"
                    ><img src="/icons/building.svg" /> Reporting Period:</span
                  >
                  <span class="pl-1 font-normal">
                    {{
                      $dayjs(currentUser.credential_start_date).format(
                        'MMM DD, YYYY'
                      )
                    }}
                    -
                    {{
                      $dayjs(currentUser.credential_end_date).format(
                        'MMM DD, YYYY'
                      )
                    }}
                  </span>
                </div>
              </div>
            </div>
            <div
              :class="[
                canRenew ? 'grid-cols-1 gap-y-2' : 'grid-cols-2 gap-x-2',
              ]"
              class="lg:grid space-y-2 lg:space-y-0"
            >
              <WButtonsDropdown>
                <WButtonsBase type="primaryInverted" icon="download">
                  Download
                </WButtonsBase>
                <template #customButtons>
                  <WButtonsBase
                    type="neutral"
                    icon="academic-cap"
                    @click.native="downloadCertificate(currentUser.id)"
                  >
                    Certificate
                  </WButtonsBase>
                  <a
                    href="https://cdn.wellcertified.com/static/WELL_AP_Logo_Package.zip"
                    target="_blank"
                  >
                    <WButtonsBase icon="folder-download" type="neutral">
                      Logo Pack
                    </WButtonsBase>
                  </a>
                </template>
              </WButtonsDropdown>
              <WButtonsBase
                icon="pencil"
                @click.native="
                  $refs.reportSlide.toggleOpen(), clearForm(), (formMode = '')
                "
              >
                Report CE Hours
              </WButtonsBase>
              <WButtonsBase
                v-if="canRenew"
                :icon="[processingRenew === false ? 'refresh' : null]"
                :type="[processingRenew ? 'primaryInverted' : 'primary']"
                @click.native="$refs.renewModal.isHidden = false"
              >
                <span v-if="!processingRenew">Renew credential</span>
                <span v-else>
                  <WLoadingSpinner type="button" class="mx-auto" />
                </span>
              </WButtonsBase>
            </div>
          </div>
        </NavBreadcrumbs>
        <div
          v-if="displayWarning"
          class="rounded-md bg-yellow-50 p-2 mb-5 rounded-lg border border-yellow-300 mx-8"
        >
          <div class="flex">
            <div class="flex-shrink-0">
              <svg
                class="mt-1 h-10 w-10 text-yellow-400"
                x-description="Heroicon name: exclamation"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fill-rule="evenodd"
                  d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                  clip-rule="evenodd"
                ></path>
              </svg>
            </div>
            <div class="ml-3">
              <WHeadingsHFour
                class="text-yellow-600"
                sub-heading="Your WELL AP credential is expiring soon. Please report your CE hours and renew your credential to maintain your WELL AP status."
              />
            </div>
          </div>
        </div>
        <div class="md:flex">
          <div class="my-6 md:my-8 w-full">
            <div class="max-w-6xl mx-auto sm:px-6 lg:px-8">
              <h2 class="text-lg leading-6 font-medium text-cool-gray-900">
                Overview
              </h2>
              <div class="mt-2 grid grid-cols-1 gap-5 lg:grid-cols-2" x-max="1">
                <div class="bg-white overflow-hidden shadow rounded-lg">
                  <div class="p-5">
                    <div class="flex items-center">
                      <div class="flex-shrink-0 w-8">
                        <svg
                          class="bg-primary-600 mr-3 p-2.5 rounded-md text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                      </div>
                      <div class="ml-5 w-0 flex-1">
                        <dl>
                          <dt
                            class="text-sm leading-5 font-medium text-cool-gray-500 truncate"
                          >
                            Total hours reported
                          </dt>
                          <dd>
                            <div
                              v-if="ceHours.summary"
                              class="text-lg leading-7 font-medium text-cool-gray-900"
                            >
                              <span class="font-bold"
                                >{{ ceHours.summary.total }} Hr.</span
                              >
                              <span class="text-gray-400 text-sm"
                                >of 30 hr.</span
                              >
                            </div>
                          </dd>
                        </dl>
                      </div>
                    </div>
                  </div>
                </div>

                <div class="bg-white overflow-hidden shadow rounded-lg">
                  <div class="p-5">
                    <div class="flex items-center">
                      <div class="flex-shrink-0 w-8">
                        <svg
                          class="bg-primary-600 mr-3 p-2.5 rounded-md text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                      </div>
                      <div class="ml-5 w-0 flex-1">
                        <dl>
                          <dt
                            class="text-sm leading-5 font-medium text-cool-gray-500 truncate"
                          >
                            WELL-specific hours reported
                          </dt>
                          <dd>
                            <div
                              v-if="ceHours.summary"
                              class="text-lg leading-7 font-medium text-cool-gray-900"
                            >
                              <span class="font-bold"
                                >{{ ceHours.summary.well }} Hr.</span
                              >
                              <span class="text-gray-400 text-sm"
                                >of 6 hr.</span
                              >
                            </div>
                          </dd>
                        </dl>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div class="md:px-0 mt-4 md:mt-0">
              <WTabsHorizontal
                ref="tabs"
                v-model="currentTab"
                class="my-3 lg:my-0"
                :tabs="[
                  { name: 'Activity Report', icon: 'map' },
                  { name: 'Billing', icon: 'academic-cap' },
                ]"
              />
            </div>

            <div
              v-if="currentTab === 'Billing'"
              class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 rounded-md md:mt-5"
            >
              <div
                v-for="invoice in credentialInvoices"
                :key="invoice.invoice_number"
                class="space-y-3"
              >
                <InvoiceCard
                  :invoice="invoice"
                  :redirect="`/well-ap/credentials`"
                />
              </div>
            </div>

            <!-- Activity table (small breakopoint and up) -->
            <div
              v-if="currentTab === 'Activity Report'"
              class="mt-5 overflow-y-auto"
            >
              <div class="md:max-w-md lg:max-w-6xl mx-auto sm:px-6 lg:px-8">
                <div class="flex flex-col mt-2">
                  <div
                    class="align-middle min-w-full overflow-x-auto overflow-hidden sm:rounded-lg"
                  >
                    <table class="min-w-full divide-y divide-cool-gray-200">
                      <thead class="bg-primary-800 text-white">
                        <tr>
                          <th
                            class="px-6 py-3 bg-cool-gray-50 text-left text-xs leading-4 font-medium text-cool-gray-500 uppercase tracking-wider"
                          >
                            Activity
                          </th>
                          <th
                            class="px-6 py-3 bg-cool-gray-50 text-right text-xs leading-4 font-medium text-cool-gray-500 uppercase tracking-wider"
                          >
                            Hours
                          </th>
                          <th
                            class="px-6 py-3 bg-cool-gray-50 text-left text-xs leading-4 font-medium text-cool-gray-500 uppercase tracking-wider md:block"
                          >
                            WELL Specific
                          </th>
                          <th
                            class="px-6 py-3 bg-cool-gray-50 text-right text-xs leading-4 font-medium text-cool-gray-500 uppercase tracking-wider"
                          >
                            Edit
                          </th>
                        </tr>
                      </thead>
                      <tbody
                        class="bg-white divide-y divide-cool-gray-200 border border-cool-gray-200"
                        x-max="1"
                      >
                        <tr
                          v-for="(activity, index) in ceHours.data"
                          :key="index"
                          class="bg-white"
                        >
                          <td
                            :class="{
                              'bg-gray-100 opacity-50':
                                currentUser.credential_start_date >
                                activity.start_date,
                            }"
                            class="px-6 py-4 leading-5 text-cool-gray-900"
                          >
                            <div class="groupspace-x-2 truncate leading-5">
                              <div class="text-xs text-gray-500">
                                {{
                                  $dayjs(activity.start_date).format(
                                    'MMM DD, YYYY'
                                  )
                                }}
                                -
                                {{
                                  $dayjs(activity.end_date).format(
                                    'MMM DD, YYYY'
                                  )
                                }}
                                |
                                <span
                                  v-if="activity.activity_type === 'Project'"
                                  >{{ activity.project_type }} </span
                                >{{ activity.activity_type }}
                                {{
                                  activity.activity_type === 'Project'
                                    ? '#' + activity.project_id
                                    : ''
                                }}
                                {{
                                  activity.activity_type === 'Education'
                                    ? activity.course_id
                                      ? '#' + activity.course_id
                                      : ''
                                    : ''
                                }}
                              </div>
                              <p
                                v-if="activity.activity_title"
                                class="text-gray-700 font-semibold truncate transition ease-in-out duration-150"
                              >
                                {{ activity.activity_title }}
                              </p>
                              <p
                                v-else
                                class="text-gray-700 font-semibold italic truncate transition ease-in-out duration-150"
                              >
                                Activity title not given
                              </p>
                              <div
                                class="block text-xs text-gray-500 w-full whitespace-normal"
                              >
                                {{ activity.description }}
                              </div>
                            </div>
                          </td>
                          <td
                            :class="{
                              'bg-gray-100 opacity-50':
                                currentUser.credential_start_date >
                                activity.start_date,
                            }"
                            class="px-6 py-4 whitespace-nowrap text-sm leading-5 text-cool-gray-900 text-center"
                          >
                            {{ activity.hours_reported }}
                          </td>
                          <td
                            :class="{
                              'bg-gray-100 opacity-50':
                                currentUser.credential_start_date >
                                activity.start_date,
                            }"
                            class="px-6 py-4 whitespace-nowrap text-sm leading-5 text-cool-gray-500"
                          >
                            <span
                              v-if="activity.well_specific"
                              class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800 uppercase"
                              >Yes</span
                            >
                          </td>
                          <td
                            :class="{
                              'bg-gray-100 opacity-50':
                                currentUser.credential_start_date >
                                activity.start_date,
                            }"
                            class="px-4"
                          >
                            <div class="flex">
                              <svg
                                v-if="
                                  currentUser.credential_start_date <=
                                  activity.start_date
                                "
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                class="w-5 h-5 text-primary-500 hover:text-primary-400 cursor-pointer"
                                @click="populateForm(activity)"
                              >
                                <path
                                  stroke-linecap="round"
                                  stroke-linejoin="round"
                                  stroke-width="2"
                                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                                />
                              </svg>
                              <svg
                                v-if="
                                  currentUser.credential_start_date <=
                                  activity.start_date
                                "
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                class="ml-2 w-5 h-5 text-danger-500 hover:text-danger-400 cursor-pointer"
                                @click="
                                  $store.dispatch(
                                    'exam/removeHours',
                                    activity.id
                                  )
                                "
                              >
                                <path
                                  stroke-linecap="round"
                                  stroke-linejoin="round"
                                  stroke-width="2"
                                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                />
                              </svg>
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
          <div
            class="sm:pr-6 lg:pr-8 lg:flex-shrink-0 lg:border-l lg:border-gray-200 xl:pr-0"
          >
            <div class="md:pl-6 lg:w-80 h-full overflow-y-auto">
              <div class="pt-6 pb-2">
                <h2 class="text-sm leading-5 font-semibold">Resources</h2>
              </div>
              <div>
                <ul class="divide-y divide-gray-200" x-max="1">
                  <li class="py-4">
                    <a
                      href="https://resources.wellcertified.com/webcasts/impact-of-climate-change-on-human-health/"
                      target="_blank"
                    >
                      <div class="flex space-x-3">
                        <img
                          class="w-4 h-4 text-gray-500"
                          src="/icons/bookmark.svg"
                          alt=""
                        />
                        <div class="flex-1 space-y-1">
                          <div class="flex items-center justify-between">
                            <h3 class="text-sm font-medium leading-5">
                              Human health in a changing climate
                            </h3>
                          </div>
                          <p class="text-sm leading-5 text-gray-500">
                            Learn how a changing climate can impact human health
                            in buildings and communities around the world.
                          </p>
                        </div>
                      </div>
                    </a>
                  </li>
                  <li class="py-4">
                    <a
                      href="https://resources.wellcertified.com/webcasts/more-than-a-building-expanding-your-wellness-portfolio/"
                      target="_blank"
                    >
                      <div class="flex space-x-3">
                        <img
                          class="w-4 h-4 text-gray-500"
                          src="/icons/bookmark.svg"
                          alt=""
                        />
                        <div class="flex-1 space-y-1">
                          <div class="flex items-center justify-between">
                            <h3 class="text-sm font-medium leading-5">
                              More than a building: Expanding your wellness
                              portfolio
                            </h3>
                          </div>
                          <p class="text-sm leading-5 text-gray-500">
                            Learn how WELL consultants and project teams are
                            shifting the narrative to focus on wellness
                            alternatives that expand beyond the traditional
                            building footprint.
                          </p>
                        </div>
                      </div>
                    </a>
                  </li>
                  <li class="py-4">
                    <a
                      href="https://resources.wellcertified.com/webcasts/integrating-public-health-data-and-building-design/"
                      target="_blank"
                    >
                      <div class="flex space-x-3">
                        <img
                          class="w-4 h-4 text-gray-500"
                          src="/icons/bookmark.svg"
                          alt=""
                        />
                        <div class="flex-1 space-y-1">
                          <div class="flex items-center justify-between">
                            <h3 class="text-sm font-medium leading-5">
                              Integrating public health data and building design
                            </h3>
                          </div>
                          <p class="text-sm leading-5 text-gray-500">
                            Learn how to leverage global health data to advance
                            health and well-being in buildings and communities
                            around the world.
                          </p>
                        </div>
                      </div>
                    </a>
                  </li>
                  <li class="py-4">
                    <a
                      href="https://resources.wellcertified.com/webcasts/well-portfolio-transform-your-organization/"
                      target="_blank"
                    >
                      <div class="flex space-x-3">
                        <img
                          class="w-4 h-4 text-gray-500"
                          src="/icons/bookmark.svg"
                          alt=""
                        />
                        <div class="flex-1 space-y-1">
                          <div class="flex items-center justify-between">
                            <h3 class="text-sm font-medium leading-5">
                              Transforming your organization
                            </h3>
                          </div>
                          <p class="text-sm leading-5 text-gray-500">
                            Explore how WELL Portfolio enables companies to
                            apply alternatives rooted in WELL v2 across a
                            portfolio of buildings and spaces.
                          </p>
                        </div>
                      </div>
                    </a>
                  </li>
                  <div class="bg-primary-700 mt-2 rounded-lg p-3 text-white">
                    <div class="font-bold text-2xl">Upcoming webcasts</div>
                    <p class="text-sm leading-5 mb-4 mt-1">
                      Register for upcoming webcasts and stay up to date on all
                      things WELL.
                    </p>
                    <a
                      href="https://resources.wellcertified.com/webcasts"
                      target="_blank"
                    >
                      <WButtonsBase type="primaryInverted">
                        View webcasts
                      </WButtonsBase>
                    </a>
                  </div>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-else class="h-screen w-full mt-14">
      <div class="mx-auto text-center">
        <WLoadingSpinner class="mx-auto" />
        <div class="mt-3 text-primary-600">Loading CE Hours...</div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  data() {
    return {
      showDiscountForm: false,
      renewSlideOver: false,
      processingRenew: false,
      formMode: '',
      discount_code: null,
      currentTab: 'activity',
      renewError: null,
      renewalData: {
        discount_code: null,
        address: {
          state: '',
          street: '',
          city: '',
          country_code: '',
          postal_code: '',
        },
      },
      formData: {
        activity_type: '',
        hours_reported: '',
        well_specific: '',
        url: '',
        description: '',
        end_date: '',
        other: '',
        start_date: '',
        provided_by: '',
        activity_title: '',
        project_type: '',
        project_id: '',
        project_name: '',
      },
      projectTypes: {
        WELL: 'WELL',
        LEED: 'LEED',
        select_or_other: 'Other',
      },
      activityTypes: {
        Authorship: 'Authorship',
        Education: 'Education',
        Project: 'Project Experience',
        Volunteer: 'Volunteer Work',
      },
      projectRoles: {
        Acoustician: 'Acoustician',
        Architect: 'Architect',
        Artist: 'Artist',
        Biologist: 'Biologist',
        Broker: 'Broker',
        Builder: 'Builder',
        'Building Engineer': 'Building Engineer',
        'Building Operator': 'Building Operator',
        'Civil Engineer': 'Civil Engineer',
        Client: 'Client',
        'Commissioning Agent': 'Commissioning Agent',
        'Construction Manager': 'Construction Manager',
        Contractor: 'Contractor',
        'Cost Consultant': 'Cost Consultant',
        'Custodial Supervisor': 'Custodial Supervisor',
        Developer: 'Developer',
        Ecologist: 'Ecologist',
        'Energy Manager': 'Energy Manager',
        'Environmental Adviser': 'Environmental Adviser',
        'Environmental Health & Safety': 'Environmental Health & Safety',
        'Environmental Manager': 'Environmental Manager',
        'Equipment Service Desk Supervisor':
          'Equipment Service Desk Supervisor',
        'Facility Manager': 'Facility Manager',
        'Financial Manager': 'Financial Manager',
        'Historic Architect': 'Historic Architect',
        "Homeowner's Association": "Homeowner's Association",
        'HVAC Engineer': 'HVAC Engineer',
        'HVAC Shop Supervisor': 'HVAC Shop Supervisor',
        'Interior Designer': 'Interior Designer',
        'Landscape Architect': 'Landscape Architect',
        'Lighting Designer': 'Lighting Designer',
        'Master Developer': 'Master Developer',
        'Master Planner': 'Master Planner',
        'MEP Engineer': 'MEP Engineer',
        Owner: 'Owner',
        'Owner & Master Developer': 'Owner & Master Developer',
        'Owner & Master Planner': 'Owner & Master Planner',
        'Paint Shop Supervisor': 'Paint Shop Supervisor',
        'Plumbing Shop Supervisor': 'Plumbing Shop Supervisor',
        'Project Administrator': 'Project Administrator',
        'Project Manager': 'Project Manager',
        'Property Manager': 'Property Manager',
        'QA/QC': 'QA/QC',
        'Site/Grounds Manager': 'Site/Grounds Manager',
        'Solid Waste Manager': 'Solid Waste Manager',
        'Structural Engineer': 'Structural Engineer',
        'Supply/Purchasing Manager': 'Supply/Purchasing Manager',
        Tenant: 'Tenant',
        'Transportation Planner': 'Transportation Planner',
        'Urban Designer': 'Urban Designer',
      },
    }
  },
  head() {
    return {
      title: `Credentials`,
    }
  },
  computed: {
    ...mapState({
      currentUser: (state) => state.user.currentUser,
      ceHours: (state) => state.exam.ceHours,
      credentialInvoices: (state) => state.exam.credentialInvoices,
    }),
    canRenew() {
      const startDate = this.$store.state.user.currentUser.credential_start_date
      const firstYear = new Date(
        new Date(startDate).setFullYear(new Date(startDate).getFullYear() + 1)
      )
      const renewTillDate = this.$dayjs(
        this.$store.state.user.currentUser.credential_end_date
      ).add(3, 'months')

      if (
        this.ceHours.summary != null &&
        firstYear <= new Date() &&
        new Date() <= renewTillDate &&
        ((this.ceHours.summary.other >= 24 && this.ceHours.summary.well >= 6) ||
          (this.ceHours.summary.well >= 6 && this.ceHours.summary.total >= 30))
      ) {
        return true
      }
      return false
    },
    displayWarning() {
      if (this.ceHours.summary != null) {
        const currentDate = this.$dayjs(new Date()).format('YYYY-MM-DD')
        const endDateFormatted = this.$dayjs(
          this.$store.state.user.currentUser.credential_end_date
        )
        const status = endDateFormatted.diff(currentDate, 'month')
        if (
          (status <= 3 && status >= 0 && this.ceHours.summary.total < 30) ||
          (this.ceHours.summary.well < 6 && status <= 3 && status >= 0)
        ) {
          return true
        }
        return false
      }
      return null
    },
  },

  async mounted() {
    await Promise.all([
      this.$store.dispatch('exam/getHours'),
      this.$store.dispatch('exam/getExams'),
      this.$store.dispatch('exam/getCredentialInvoices'),
    ])
    if (this.$store.state.user.currentUser.well_ap === 0) {
      this.$router.push('/well-ap/')
    }
  },

  methods: {
    populateForm(data) {
      this.formMode = 'edit'
      this.formData = { ...data }
      this.$refs.reportSlide.toggleOpen()
    },
    clearForm() {
      const emptyData = {
        activity_type: '',
        hours_reported: '',
        well_specific: '',
        url: '',
        description: '',
        end_date: '',
        other: '',
        start_date: '',
        provided_by: '',
        activity_title: '',
        project_type: '',
        project_id: '',
        project_name: '',
      }

      this.formData = { ...emptyData }
    },
    renewCredentials() {
      this.processingRenew = true

      const data = { ...this.renewalData }
      data.userID = this.currentUser.id

      this.$store
        .dispatch('credential/renewCredentials', data)
        .then((response) => {
          this.$router.push({
            name: 'invoice-invoiceNumber',
            params: {
              invoiceNumber: response.invoice_number,
            },
            query: {
              redirect: '/well-ap/credentials',
            },
          })
        })
        .catch((err) => {
          this.renewError = err
          this.processingRenew = false
        })
    },
    validateNewHours() {
      if (this.formData.activity_type !== 'Project') {
        this.formData.project_type = null
        this.formData.project_id = null
        this.formData.project_name = null
      }

      if (this.formData.activity_type !== 'Education') {
        this.formData.course_id = null
      }

      const self = this
      if (this.formMode === 'edit') {
        this.$store
          .dispatch('exam/updateHours', this.formData)
          .then((response) => {
            self.$refs.reportSlide.toggleOpen()
            self.formMode = ''
          })
      } else {
        this.$store
          .dispatch('exam/addHours', this.formData)
          .then((response) => {
            self.$refs.reportSlide.toggleOpen()
            self.formMode = ''
          })
      }
    },
    downloadCertificate(id) {
      const token = this.$store.state.authentication.token

      window.open(
        this.$axios.defaults.baseURL +
          'api/user/download-certificate/' +
          id +
          '?token=' +
          token,
        '_blank'
      )
    },
  },
}
</script>
