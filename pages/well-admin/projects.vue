<template>
  <div class="flex flex-col">
    <div
      v-if="adminProjectsList"
      class="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8"
    >
      <div class="py-2 align-middle inline-block w-full sm:px-6 lg:px-8">
        <WFeedbackAlert ref="alert" />

        <NavBreadcrumbs>
          <WHeadingsHTwo heading="Admin Projects" />
          <template #actions>
            <div class="justify-end w-full flex">
              <div>
                <WButtonsBase
                  type="primaryInverted"
                  icon="download"
                  @click.native="downloadLogos"
                >
                  Download All Project Logos
                </WButtonsBase>
              </div>
            </div>
          </template>
        </NavBreadcrumbs>

        <!-- mobile filters start here -->
        <LazyAccordiansBase
          ref="mobFilters"
          label="Filters"
          class="sm:hidden mb-8 capitalize"
        >
          <template #content>
            <FormulateForm @submit="applyFilters">
              <FormulateInput
                v-model="filters.project_number"
                type="text"
                placeholder="Project ID"
                label="Project ID"
              />
              <FormulateInput
                v-model="filters.name"
                type="text"
                placeholder="Name"
                label="Name"
              />
              <FormulateInput
                v-model="filters.type"
                :options="[
                  { label: 'All', value: 'all' },
                  { label: 'v1', value: 'v1' },
                  { label: 'v2 Pilot', value: 'v2-pilot' },
                  { label: 'v2 HSR', value: 'v2-hsr' },
                  { label: 'v2', value: 'v2' },
                ]"
                type="select"
                label="Project version"
                placeholder="Project version"
              />
              <FormulateInput
                v-model="filters.city"
                type="text"
                placeholder="Project City"
                label="Project City"
              />
              <FormulateInput
                v-model="filters.state"
                type="text"
                placeholder="Project State"
                label="Project State"
              />
              <FormulateInput
                v-model="filters.country_code"
                :options="countryOptions"
                type="select"
                label="Location/Country/Region"
                placeholder="Location/Country/Region"
              />
              <FormulateInput
                v-model="filters.project_phase_internal"
                :options="projectPhaseOptions"
                type="select"
                label="Project Phase"
                placeholder="Project Phase"
              />
              <FormulateInput
                v-model="filters.reg_status"
                :options="registrationStatusOptions"
                type="select"
                label="Registration Status"
                placeholder="Registration Status"
              />
              <FormulateInput
                v-model="filters.agreement_status"
                :options="[
                  { label: 'Signed', value: '1' },
                  { label: 'Pending', value: '0' },
                ]"
                type="select"
                label="Agreement Status"
                placeholder="Agreement Status"
              />
              <FormulateInput
                v-model="filters.space_type"
                :options="spaceTypeOptions"
                type="select"
                label="Space Type"
                placeholder="Space Type"
              />
              <FormulateInput
                v-model="filters.industry"
                :options="industryOptions"
                type="select"
                label="Industry"
                placeholder="Industry"
              />
              <FormulateInput
                v-model="filters.coach_email"
                type="text"
                placeholder="Coach Contact Email"
                label="Coach Contact Email"
              />
              <FormulateInput
                v-model="filters.admin_email"
                type="text"
                placeholder="Admin Email"
                label="Admin Email"
              />
              <FormulateInput
                v-model="filters.admin_org"
                type="text"
                placeholder="Admin Organization"
                label="Admin Organization"
              />
              <FormulateInput
                v-model="filters.owner_org"
                type="text"
                placeholder="Owner Organization"
                label="Owner Organization"
              />
              <FormulateInput
                v-model="filters.member_email"
                type="text"
                placeholder="Team Member Email"
                label="Team Member Email"
              />

              <div class="mt-6">
                <FormulateInput type="submit" label="Apply" />
              </div>
              <div v-if="hasAppliedFilters" class="mt-4">
                <WButtonsBase
                  class="mt-auto"
                  type="primaryInverted"
                  @click.native="clearFilters()"
                >
                  Clear filters
                </WButtonsBase>
              </div>
            </FormulateForm>
          </template>
        </LazyAccordiansBase>
        <!-- end here -->
        <!-- desktop filters start here -->
        <FormulateForm
          class="hidden sm:grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 my-5"
          @submit="applyFilters"
        >
          <FormulateInput
            v-model="filters.project_number"
            type="text"
            placeholder="Project ID"
            label="Project ID"
          />
          <FormulateInput
            v-model="filters.name"
            type="text"
            placeholder="Name"
            label="Name"
          />
          <FormulateInput
            v-model="filters.type"
            :options="[
              { label: 'All', value: 'all' },
              { label: 'v1', value: 'v1' },
              { label: 'v2 Pilot', value: 'v2-pilot' },
              { label: 'v2 HSR', value: 'v2-hsr' },
              { label: 'v2', value: 'v2' },
            ]"
            type="select"
            label="Project version"
            placeholder="Project version"
          />
          <FormulateInput
            v-model="filters.city"
            type="text"
            placeholder="Project City"
            label="Project City"
          />
          <FormulateInput
            v-model="filters.state"
            type="text"
            placeholder="Project State"
            label="Project State"
          />
          <FormulateInput
            v-model="filters.country_code"
            :options="countryOptions"
            type="select"
            label="Location/Country/Region"
            placeholder="Location/Country/Region"
          />
          <FormulateInput
            v-model="filters.project_phase_internal"
            :options="projectPhaseOptions"
            type="select"
            label="Project Phase"
            placeholder="Project Phase"
          />
          <FormulateInput
            v-model="filters.reg_status"
            :options="registrationStatusOptions"
            type="select"
            label="Registration Status"
            placeholder="Registration Status"
          />
          <FormulateInput
            v-model="filters.agreement_status"
            :options="[
              { label: 'Signed', value: '1' },
              { label: 'Pending', value: '0' },
            ]"
            type="select"
            label="Agreement Status"
            placeholder="Agreement Status"
          />
          <FormulateInput
            v-model="filters.space_type"
            :options="spaceTypeOptions"
            type="select"
            label="Space Type"
            placeholder="Space Type"
          />
          <FormulateInput
            v-model="filters.industry"
            :options="industryOptions"
            type="select"
            label="Industry"
            placeholder="Industry"
          />
          <FormulateInput
            v-model="filters.coach_email"
            type="text"
            placeholder="Coach Contact Email"
            label="Coach Contact Email"
          />
          <FormulateInput
            v-model="filters.admin_email"
            type="text"
            placeholder="Admin Email"
            label="Admin Email"
          />
          <FormulateInput
            v-model="filters.admin_org"
            type="text"
            placeholder="Admin Organization"
            label="Admin Organization"
          />
          <FormulateInput
            v-model="filters.owner_org"
            type="text"
            placeholder="Owner Organization"
            label="Owner Organization"
          />
          <FormulateInput
            v-model="filters.member_email"
            type="text"
            placeholder="Team Member Email"
            label="Team Member Email"
          />

          <div class="mt-6">
            <FormulateInput type="submit" label="Apply" />
          </div>
          <div class="mt-6">
            <WButtonsBase
              v-if="hasAppliedFilters"
              class="mt-auto"
              type="primaryInverted"
              @click.native="clearFilters()"
            >
              Clear filters
            </WButtonsBase>
          </div>
        </FormulateForm>
        <div
          class="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg"
        >
          <div class="overflow-x-scroll">
            <table class="w-full divide-y divide-gray-200">
              <thead class="bg-primary-700 text-white">
                <tr>
                  <th
                    class="px-6 py-3 text-left text-xs leading-4 font-medium uppercase tracking-wider"
                  >
                    Project ID
                  </th>
                  <th
                    class="px-6 py-3 text-left text-xs leading-4 font-medium uppercase tracking-wider"
                  >
                    Name
                  </th>
                  <th
                    class="px-6 py-3 text-left text-xs leading-4 font-medium uppercase tracking-wider"
                  >
                    Area
                  </th>
                  <th
                    class="px-6 py-3 text-left text-xs leading-4 font-medium uppercase tracking-wider"
                  >
                    Location
                  </th>
                  <th
                    class="px-6 py-3 text-left text-xs leading-4 font-medium uppercase tracking-wider"
                  >
                    Registration Status
                  </th>
                  <th
                    class="px-6 py-3 text-left text-xs leading-4 font-medium uppercase tracking-wider"
                  >
                    Project Type
                  </th>
                  <th
                    class="px-6 py-3 text-left text-xs leading-4 font-medium uppercase tracking-wider"
                  >
                    Agreement
                  </th>
                  <th
                    class="px-6 py-3 text-left text-xs leading-4 font-medium uppercase tracking-wider"
                  >
                    Certification Status
                  </th>
                  <th
                    class="px-6 py-3 text-left text-xs leading-4 font-medium uppercase tracking-wider"
                  >
                    Project Admin
                  </th>
                  <th
                    class="px-6 py-3 text-left text-xs leading-4 font-medium uppercase tracking-wider"
                  >
                    Owner
                  </th>
                  <th
                    class="px-6 py-3 text-left text-xs leading-4 font-medium uppercase tracking-wider flex items-center space-x-2"
                  >
                    <button @click="toggleProjectOrder">
                      <WIconsBase
                        class="cursor-pointer"
                        icon="switch-vertical"
                      />
                    </button>
                    <div>Owner Organization</div>
                  </th>
                  <th
                    class="px-6 py-3 text-left text-xs leading-4 font-medium uppercase tracking-wider"
                  >
                    Project Phase
                  </th>
                  <th
                    class="px-6 py-3 text-left text-xs leading-4 font-medium uppercase tracking-wider"
                  >
                    Coach
                  </th>
                  <th
                    class="px-6 py-3 text-left text-xs leading-4 font-medium uppercase tracking-wider"
                  >
                    Created At
                  </th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr
                  v-for="(project, index) in adminProjectsList.data"
                  :key="index"
                >
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div
                      class="text-sm leading-5 text-primary-500 cursor-pointer flex space-x-2"
                    >
                      <div
                        @click="
                          $router.push(
                            `/projects/${project.type}/${project.project_number}/dashboard`
                          )
                        "
                      >
                        {{ project.project_number }}
                      </div>
                      <a
                        :href="`/projects/${project.type}/${project.project_number}/dashboard`"
                        target="_blank"
                      >
                        <WIconsBase
                          icon="external-link"
                          type="blank"
                          class="text-gray-400 hover:text-gray-500"
                        />
                      </a>
                    </div>
                    <div class="text-sm leading-5">
                      <span
                        v-if="project.type === 'v2'"
                        class="px-2 inline-flex text-xs leading-5 rounded-full bg-primary-600 text-white uppercase"
                        >WELL v2</span
                      >
                      <span
                        v-else-if="project.type === 'v2-pilot'"
                        class="px-2 inline-flex text-xs leading-5 rounded-full bg-green-500 text-white uppercase"
                        >WELL v2 pilot</span
                      >
                      <span
                        v-else-if="project.type === 'v1'"
                        class="px-2 inline-flex text-xs leading-5 rounded-full bg-gray-400 text-white uppercase"
                        >WELL v1</span
                      >
                      <span
                        v-else-if="project.type === 'v2-hsr'"
                        class="px-2 inline-flex text-xs leading-5 rounded-full bg-gray-400 text-white uppercase"
                        >HSR Location</span
                      >
                    </div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm leading-5 font-medium text-gray-900">
                      {{ project.name }}
                    </div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm leading-5 text-gray-900">
                      {{ Number(project.area).toLocaleString() }} sqft
                    </div>
                    <div class="text-sm leading-5 text-gray-500">
                      {{ Number(project.area_in_meter).toLocaleString() }} sqm
                    </div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm leading-5 text-gray-900">
                      <span v-if="project.owner_state"
                        >{{ project.owner_state }},
                      </span>
                      {{ getCountryName(project.country_code) }}
                    </div>
                    <div v-html="checkValue(project.map_city)"></div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm leading-5 text-gray-900">
                      <span
                        v-if="
                          project.reg_status === 1 &&
                          project.reg_payment_status === 'paid'
                        "
                        class="px-2 inline-flex text-xs leading-5 rounded-full bg-primary-600 text-white uppercase"
                        >Registered</span
                      >
                      <span
                        v-else-if="
                          project.reg_status === 1 &&
                          project.reg_payment_status !== 'paid'
                        "
                        class="px-2 inline-flex text-xs leading-5 rounded-full bg-warning-600 text-white uppercase"
                        >Registration in progress</span
                      >
                      <span
                        v-else
                        class="px-2 inline-flex text-xs leading-5 rounded-full bg-secondary-600 text-white uppercase"
                        >Not Registered</span
                      >
                    </div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm leading-5 text-gray-900">
                      {{ getProjectType(project.project_type) }}
                    </div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm leading-5 text-gray-900">
                      <span
                        v-if="project.agreement_status"
                        class="px-2 inline-flex text-xs leading-5 rounded-full bg-green-600 text-white uppercase"
                        >Signed</span
                      >
                      <span
                        v-else
                        class="px-2 inline-flex text-xs leading-5 rounded-full bg-secondary-600 text-white uppercase"
                        >Not signed</span
                      >
                    </div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div v-html="checkValue(project.cert_status)"></div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm leading-5 text-gray-900">
                      <span v-if="project.user">
                        {{ project.user.email }}
                      </span>
                    </div>
                    <div
                      v-if="project.user"
                      class="text-sm leading-5 text-gray-500"
                    >
                      {{ project.user.full_name }}
                    </div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div v-html="checkValue(project.owner_email)"></div>
                    <div class="text-sm leading-5 text-gray-500">
                      {{ project.owner_name }}
                    </div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div v-html="checkValue(project.owner_org)"></div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div
                      v-html="checkValue(project.project_phase_internal)"
                    ></div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div
                      v-html="
                        checkValue(
                          project.coach !== null
                            ? project.coach.email
                            : project.coach
                        )
                      "
                    ></div>
                    <div
                      v-if="project.coach"
                      class="text-sm leading-5 text-gray-500"
                    >
                      {{ project.coach.full_name }}
                    </div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm leading-5 text-gray-900">
                      {{ $dayjs(project.created_at).format('MMM DD, YYYY') }}
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <FormInputsPagination
            :pagination="paginate"
            :offset="3"
            @paginate="
              $store.dispatch('project/getAdminProjectsList', allFilters)
            "
          />
        </div>
      </div>
    </div>
    <div v-else class="h-screen w-full mt-14">
      <div v-if="error == null" class="mx-auto text-center">
        <WLoadingSpinner class="mx-auto" />
        <div class="mt-3 text-primary-600">Loading projects...</div>
      </div>
      <div v-else class="mx-auto text-center">
        <div class="mt-3 text-danger-400 font-medium">
          Something went wrong. Please check that you have correct permissions
          to view this.
          <br />
          Error: {{ error }}
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapState } from 'vuex'
import { tableMixin } from '~/mixins/tableMixin'

export default {
  mixins: [tableMixin],

  data() {
    return {
      filters: {
        name: '',
        type: 'all',
        country_code: '',
        state: '',
        city: '',
        industry: '',
        reg_status: null,
        space_type: null,
        orderBy: 'id',
        order: 'desc',
        project_number: null,
        project_phase_internal: null,
      },
      error: null,
      registrationStatusOptions: [
        { value: '1', label: 'Registered' },
        { value: '2', label: 'Registration in progress' },
        { value: '0', label: 'Not Registered' },
      ],
      regStatus: [
        { label: 'N/A', value: '_none' },
        { label: 'Open', value: 'open' },
        { label: 'Closed', value: 'closed' },
        { label: 'Inactive', value: 'inactive' },
        { label: 'Registered - Inactive', value: 'reginactive' },
        { label: 'Registered - Not pursuing', value: 'regclosed' },
        { label: 'Registered - Moved to v2', value: 'regmovedv2' },
        { label: 'Reopened', value: 'reopened' },
        { label: 'Portfolio - closed', value: 'portfolioclosed' },
      ],
      projectType: [
        { value: 'new-existing', text: 'A building that I own & occupy' },
        { value: 'non-cs', text: 'A building I own and lease out/sell' },
        { value: 'cics', text: 'A space I lease' },
        { value: 'cs', text: 'WELL Core' },
      ],
      projectPhaseOptions: [
        { value: null, label: 'N/A' },
        {
          value: 'D&O Preliminary Documentation Review',
          label: 'D&O Preliminary Documentation Review',
        },
        { value: 'D&O Final Application', label: 'D&O Final Application' },
        {
          value: 'D&O Final Documentation Review',
          label: 'D&O Final Documentation Review',
        },
        { value: 'D&O Decision', label: 'D&O Decision' },
        {
          value: 'Preliminary Precertification Application',
          label: 'Preliminary Precertification Application',
        },
        {
          value: 'Preliminary Precertification Review',
          label: 'Preliminary Precertification Review',
        },
        {
          value: 'Final Precertification Application',
          label: 'Final Precertification Application',
        },
        {
          value: 'Final Precertification Review',
          label: 'Final Precertification Review',
        },
        {
          value: 'Precertification Decision',
          label: 'Precertification Decision',
        },
        {
          value: 'Preliminary Documentation Application',
          label: 'Preliminary Documentation Application',
        },
        {
          value: 'Preliminary Documentation Review',
          label: 'Preliminary Documentation Review',
        },
        {
          value: 'Final Documentation Application',
          label: 'Final Documentation Application',
        },
        {
          value: 'Final Documentation Review',
          label: 'Final Documentation Review',
        },
        {
          value: 'Documentation Review Complete',
          label: 'Documentation Review Complete',
        },
        {
          value: 'Documentation Appeal Application',
          label: 'Documentation Appeal Application',
        },
        {
          value: 'Documentation Review Review',
          label: 'Documentation Review Review',
        },
        {
          label: 'Performance Testing Scheduling on Hold',
          value: 'Performance Testing Scheduling on Hold',
        },
        {
          label: 'Performance Testing Scheduling In Progress',
          value: 'Performance Testing Scheduling In Progress',
        },
        {
          label: 'Performance Testing Scheduled',
          value: 'Performance Testing Scheduled',
        },
        {
          label:
            'Performance Testing in progress with independent Performance Testing Agent',
          value:
            'Performance Testing in progress with independent Performance Testing Agent',
        },
        {
          label: 'Preliminary Performance Review',
          value: 'Preliminary Performance Review',
        },
        {
          label: 'Final Performance Review Application',
          value: 'Final Performance Review Application',
        },
        {
          label: 'Final Performance Review',
          value: 'Final Performance Review',
        },
        {
          label: 'Performance Verification',
          value: 'Performance Verification',
        },
        {
          value: 'Performance Verification Appeal Application',
          label: 'Performance Verification Appeal Application',
        },
        {
          value: 'Performance Verification Appeal Review',
          label: 'Performance Verification Appeal Review',
        },
        {
          value: 'Curative Action Plan Application',
          label: 'Curative Action Plan Application',
        },
        {
          value: 'Curative Action Plan Review',
          label: 'Curative Action Plan Review',
        },
        { value: 'Certification Decision', label: 'Certification Decision' },
        {
          value: 'Final WELL Report',
          label: 'Final WELL Report',
        },
        {
          value: 'Preliminary Health-Safety Review',
          label: 'Preliminary Health-Safety Review',
        },
        {
          value: 'Final Health-Safety Application',
          label: 'Final Health-Safety Application',
        },
        {
          value: 'Final Health-Safety Review',
          label: 'Final Health-Safety Review',
        },
        {
          value: 'Final Health-Safety Rating Achieved',
          label: 'Final Health-Safety Rating Achieved',
        },
        {
          value: 'Final Health-Safety Rating Appeal',
          label: 'Final Health-Safety Rating Appeal',
        },
        {
          value: 'Renewal Preliminary Health-Safety Review',
          label: 'Renewal Preliminary Health-Safety Review',
        },
        {
          value: 'Renewal Final Health-Safety Review',
          label: 'Renewal Final Health-Safety Review',
        },
      ],
      industryOptions: [
        { value: 'Agriculture', label: 'Agriculture' },
        { value: 'Apparel', label: 'Apparel' },
        { value: 'Architecture', label: 'Architecture' },
        { value: 'Banking', label: 'Banking' },
        { value: 'Biotechnology', label: 'Biotechnology' },
        { value: 'Chemicals', label: 'Chemicals' },
        { value: 'Communications', label: 'Communications' },
        { value: 'Construction', label: 'Construction' },
        { value: 'Consulting', label: 'Consulting' },
        { value: 'Education', label: 'Education' },
        { value: 'Electronics', label: 'Electronics' },
        { value: 'Energy', label: 'Energy' },
        { value: 'Engineering', label: 'Engineering' },
        { value: 'Entertainment', label: 'Entertainment' },
        { value: 'Environmental', label: 'Environmental' },
        { value: 'Finance', label: 'Finance' },
        { value: 'Food & Beverage', label: 'Food & Beverage' },
        { value: 'Government', label: 'Government' },
        { value: 'Healthcare', label: 'Healthcare' },
        { value: 'Hospitality', label: 'Hospitality' },
        { value: 'Insurance', label: 'Insurance' },
        { value: 'Legal', label: 'Legal' },
        { value: 'Machinery', label: 'Machinery' },
        { value: 'Manufacturing', label: 'Manufacturing' },
        { value: 'Media', label: 'Media' },
        { value: 'Not For Profit', label: 'Not For Profit' },
        { value: 'Real Estate', label: 'Real Estate' },
        { value: 'Recreation', label: 'Recreation' },
        { value: 'Retail', label: 'Retail' },
        { value: 'Technology', label: 'Technology' },
        { value: 'Telecommunications', label: 'Telecommunications' },
        { value: 'Transportation', label: 'Transportation' },
        { value: 'Utilities', label: 'Utilities' },
        { value: 'Other', label: 'Other' },
      ],
      spaceTypeOptions: [
        { label: 'Office', value: 12 },
        { label: 'Residential', value: 3 },
        { label: 'Retail', value: 6 },
        { label: 'Education', value: 11 },
        { label: 'Hospitality', value: 16 },
        { label: 'Assisted Living', value: 17 },
        { label: 'Cultural Institutions', value: 18 },
        { label: 'Public Assembly', value: 19 },
        { label: 'Commercial Kitchen', value: 2 },
        { label: 'Commercial Dining', value: 4 },
        { label: 'Industrial', value: 20 },
        { label: 'Laboratory', value: 21 },
        { label: 'Fitness', value: 22 },
        { label: 'Healthcare', value: 24 },
        { label: 'Warehouses', value: 9 },
        { label: 'Childcare', value: 25 },
        { label: 'Auditorium', value: 26 },
        { label: 'Transportation', value: 27 },
        { label: 'Library', value: 28 },
        { label: 'Grocery', value: 29 },
        { label: 'Sporting Venue', value: 23 },
        { label: 'Shopping Center', value: 30 },
        { label: 'Manufacturing', value: 31 },
        { label: 'Medical Office', value: 32 },
        { label: 'Data Centers', value: 33 },
        { label: 'Convention Centers', value: 34 },
        { label: 'Others', value: 15 },
      ],
    }
  },
  head() {
    return {
      title: `Admin Projects`,
    }
  },
  computed: {
    ...mapState({
      countries: (state) => state.address.countries,
      adminProjectsList: (state) => state.project.adminProjectsList,
    }),
    orgFilterOrder() {
      // Destructure order from filter & Used to toggle asc & dsc on org name
      return this.filters.order
    },
    countryOptions() {
      const options = []
      for (let i = 0; i < this.countries.length; i++) {
        const option = {
          value: this.countries[i].code,
          label: this.countries[i].name,
        }
        options.push(option)
      }
      return options
    },
    paginate() {
      if (this.adminProjectsList) {
        return {
          total: this.adminProjectsList.total,
          per_page: this.adminProjectsList.per_page,
          current_page: this.adminProjectsList.current_page,
          last_page: this.adminProjectsList.last_page,
          from: this.adminProjectsList.from,
          to: this.adminProjectsList.to,
        }
      }
      return {}
    },
    hasAppliedFilters() {
      for (const key in this.filters) {
        if (
          this.filters[key] !== null &&
          this.filters[key] !== '' &&
          key !== 'order' &&
          key !== 'orderBy' &&
          key !== 'type'
        )
          return true
      }
      return false
    },
    allFilters() {
      const res = JSON.parse(JSON.stringify(this.filters))
      const regStatusVal = this.filters.reg_status
        ? parseInt(this.filters.reg_status)
        : null
      if (res.type === 'all') {
        delete res.type
      }
      if (regStatusVal !== null) {
        if (regStatusVal >= 1) {
          res.reg_status = 1
          res.reg_payment_status = regStatusVal === 2 ? 'unpaid' : 'paid'
        } else {
          res.reg_status = 0
          res.reg_payment_status = 'unpaid'
        }
      }
      if (res.space_type !== null) {
        res['space_types[]'] = res.space_type
        delete res.space_type
      }
      res.page = this.paginate.current_page
      return res
    },
  },
  watch: {
    orgFilterOrder() {
      this.applyFilters()
    },
  },
  async mounted() {
    return await this.$store
      .dispatch('project/getAdminProjectsList', this.allFilters)
      .catch((error) => (this.error = error))
  },
  methods: {
    getRegistrationStatus(project) {
      let status = ''
      if (project.reg_status === 1 && project.reg_payment_status === 'paid') {
        status = 'registered'
      } else if (
        project.reg_status === 1 &&
        project.reg_payment_status !== 'paid'
      ) {
        status = 'Registration in progress'
      } else {
        status = 'Not Registered'
      }

      if (project.registration_status) {
        this.regStatus.forEach((el) => {
          if (el.value === project.registration_status) status = el.label
        })
      }

      return status
    },
    toggleProjectOrder() {
      this.filters.orderBy = 'owner_org'
      this.filters.order = this.filters.order === 'desc' ? 'asc' : 'desc'
    },
    applyFilters() {
      this.allFilters.page = 1
      this.$store.dispatch('project/getAdminProjectsList', this.allFilters)
    },
    async downloadLogos() {
      await this.$store
        .dispatch('project/downloadAllProjectLogos')
        .then((res) =>
          this.$refs.alert.showAlert(
            'success',
            'We will notify you by email once we are ready with your file.'
          )
        )
        .catch((err) => {
          if (err) {
            this.formErrors = [err]
            this.$refs.alert.showAlert('error', err)
          }
        })
    },
    getCountryName(countryCode) {
      const res = this.countries.length
        ? this.countries.filter((a) => a.code === countryCode)
        : null
      return res.length ? res[0].name : ''
    },
    getProjectType(projectType) {
      const res = this.projectType.filter((a) => a.value === projectType)
      return res.length ? res[0].text : projectType
    },
    clearFilters() {
      Object.keys(this.filters).forEach((k) => {
        this.filters[k] = null
      })
      this.filters.orderBy = 'id'
      this.filters.order = 'desc'
      this.filters.type = 'all'
      this.$store.dispatch('project/getAdminProjectsList', this.allFilters)
    },
  },
}
</script>
