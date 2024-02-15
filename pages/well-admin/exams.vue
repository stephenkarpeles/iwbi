<template>
  <div class="flex flex-col">
    <div v-if="adminExamsList">
      <NavBreadcrumbs>
        <WHeadingsHTwo class="text-primary-900" heading="Admin Exams" />
      </NavBreadcrumbs>
      <WFeedbackAlert ref="alert" />
      <WSlideoversOverlay ref="slideover" title="Exam Details" class="z-50">
        <template #content>
          <div class="px-5 flex w-full">
            <div class="mr-auto">
              <WButtonsBase
                type="primaryInverted"
                class="ml-auto px-5 mb-4"
                :icon="[
                  $store.state.exam.adminEditMode ? 'x-circle' : 'pencil',
                ]"
                @click.native="
                  $store.commit(
                    'exam/setAdminEditMode',
                    !$store.state.exam.adminEditMode
                  )
                "
              >
                <span v-if="$store.state.exam.adminEditMode">Cancel</span>
                <span v-else>Edit</span>
              </WButtonsBase>
            </div>
          </div>

          <div
            v-if="!$store.state.exam.adminEditMode"
            class="px-5 text-gray-600"
          >
            <div class="leading-tight md:leading-loose">
              Thank you for applying for your WELL AP Credential Exam. Your exam
              registration was successfully sent to Prometric.
              <br />
              The auto-generated ID for your exam eligibility is:
              <span class="font-bold">{{ selectedExam.eligibility_id }}</span>
              <br />
              Your exam application will expire on:
              <span class="font-bold">
                {{
                  $dayjs(selectedExam.expiration_date).format('MMM DD, YYYY')
                }}
              </span>
            </div>
            <div
              v-if="
                selectedExam.prometric_status === 'submitted' &&
                selectedExam.bought_in_bundle === 1
              "
              class="mt-5"
            >
              <div class="text-2xl">Access your study materials:</div>

              <ul class="list-decimal ml-8 mt-2">
                <li>
                  Visit the ATP digital resources:
                  <a
                    class="text-primary-600"
                    href="https://www.atplearningresources.com/</a>"
                    target="_blank"
                    >https://atplearningresources.com/</a
                  >
                </li>
                <li>Select <i>Create Account</i></li>
                <li>
                  Enter serial key: <strong>{{ userATP }}</strong
                  >, followed by completing/submitting the required fields in
                  the form.
                </li>
                <li>Select your ATP exam Prep eTextbook and start studying.</li>
              </ul>
            </div>
            <p class="mt-3">
              If you have any questions, please contact GBCI at
              <a
                href="https://www.gbci.org/contact"
                target="_blank"
                class="text-primary-500 cursor-pointer hover:text-primary-800"
              >
                www.gbci.org/contact
              </a>
            </p>
            <div class="sm:flex justify-between mt-3">
              <div>
                <WButtonsBase
                  icon="download"
                  @click.native="
                    $store.dispatch(
                      'invoice/download',
                      selectedExam.invoices[0]
                    )
                  "
                >
                  Download Receipt
                </WButtonsBase>
              </div>
              <div class="mt-4 sm:mt-0">
                <a
                  href="https://proscheduler.prometric.com/scheduling/testInformation"
                  target="_blank"
                >
                  <WButtonsBase icon="calendar-small" type="primaryInverted">
                    Schedule Exam With Prometric
                  </WButtonsBase>
                </a>
              </div>
            </div>
            <AlertCard
              v-if="
                selectedExam.exam_status === 'pending' &&
                selectedExam.payment_status === 'paid'
              "
              class="mt-5"
            >
              Please use the link below to cancel the exam registration. Note
              that this will mark the exam registration status as 'Cancelled'.
              <div class="m-2 w-32">
                <WButtonsBase type="alert" @click.native="cancelExam">
                  Cancel Exam
                </WButtonsBase>
              </div>
            </AlertCard>
          </div>
          <ExamEditor v-else :exam="selectedExam" />
        </template>
      </WSlideoversOverlay>
      <WFeedbackModal ref="modal">
        <div class="md:w-80 space-y-4">
          <div v-if="selectedExam && selectedExam.exam_status !== 'cancelled'">
            <WHeadingsHFour heading="Update Exam" />
            <FormulateInput
              v-if="selectedExam"
              v-model="selectedExam.expiration_date"
              label="WELL AP End Date"
              type="datetimepicker"
              max="9999-01-01"
              :error="error"
            />
            <WButtonsBase @click.native="updateExpiration">Save</WButtonsBase>
          </div>
          <div v-else>
            <div class="mb-3 text-gray-800 text-center w-56 mx-auto">
              You cannot update a cancelled exam's date.
            </div>
            <WButtonsBase @click.native="$refs.modal.isHidden = true">
              Close
            </WButtonsBase>
          </div>
        </div>
      </WFeedbackModal>
      <!-- mobile filter start here -->
      <LazyAccordiansBase
        ref="mobFilters"
        label="filters"
        class="sm:hidden mb-8 capitalize"
      >
        <template #content>
          <FormulateForm
            @submit="
              () => {
                allFilters.page = 1
                getAdminExamsList(allFilters)
                $refs.mobFilters.isExpanded = false
              }
            "
          >
            <FormulateInput
              v-model="filters.eligibility_id"
              label="Eligibility ID"
              type="text"
              :error="error"
            />
            <FormulateInput
              v-model="filters.first_name"
              label="First Name"
              type="text"
              :error="error"
            />
            <FormulateInput
              v-model="filters.last_name"
              label="Last Name"
              type="text"
              :error="error"
            />
            <FormulateInput
              v-model="filters.user_email"
              label="Email"
              type="text"
              :error="error"
            />
            <FormulateInput
              v-model="filters.organization"
              type="companymultisearch"
              name="organization"
              label="Organization*"
              :searchable="true"
              :clearonselect="false"
              :closeonselect="true"
              :optionslimit="10"
              :error="error"
              :disabled-add="true"
            />
            <FormulateInput
              v-model="filters.payment_status"
              label="Payment Status"
              type="select"
              :options="{
                paid: 'Paid',
                unpaid: 'Unpaid',
                waived: 'Waived',
              }"
              :error="error"
            />
            <FormulateInput
              v-model="filters.exam_status"
              label="Exam Status"
              type="select"
              :options="{
                '': '',
                pending: 'Pending',
                pass: 'Pass',
                fail: 'Failed',
                cancelled: 'Cancelled',
              }"
              :error="error"
            />
            <FormulateInput
              v-model="filters.prometric_status"
              label="Prometric Status"
              type="select"
              :options="{
                '': '',
                pending: 'Pending',
                submitted: 'Submitted',
              }"
              :error="error"
            />
            <FormulateInput
              v-model="filters.language"
              label="Language"
              type="select"
              :options="{
                '': '',
                en: 'English',
                cn: 'Chinese',
                fr: 'French',
                jp: 'Japanese',
                es: 'Spanish',
              }"
              :error="error"
            />
            <FormulateInput
              v-model="filters.discount_code"
              label="Discount Code"
              type="text"
              :error="error"
            />
            <FormulateInput
              v-model="filters.is_asid"
              label="ASID member"
              type="select"
              :options="{
                '': '',
                1: 'Yes',
                0: 'No',
              }"
              :error="error"
            />
            <div class="mt-6">
              <FormulateInput type="submit" label="Apply" />
            </div>
            <div v-if="hasAppliedFilters" class="mt-4">
              <WButtonsBase
                type="primaryInverted"
                @click.native="clearFilters()"
                >Clear filters</WButtonsBase
              >
            </div>
          </FormulateForm>
        </template>
      </LazyAccordiansBase>
      <!-- end here -->
      <!-- desktop filter start here -->
      <FormulateForm
        class="hidden sm:grid sm:grid-cols-3 md:grid-cols-4 gap-4 mb-5"
        @submit="
          () => {
            allFilters.page = 1
            getAdminExamsList(allFilters)
          }
        "
      >
        <FormulateInput
          v-model="filters.eligibility_id"
          label="Eligibility ID"
          type="text"
          :error="error"
        />
        <FormulateInput
          v-model="filters.first_name"
          label="First Name"
          type="text"
          :error="error"
        />
        <FormulateInput
          v-model="filters.last_name"
          label="Last Name"
          type="text"
          :error="error"
        />
        <FormulateInput
          v-model="filters.user_email"
          label="Email"
          type="text"
          :error="error"
        />
        <FormulateInput
          v-model="filters.organization"
          type="companymultisearch"
          name="organization"
          label="Organization*"
          :searchable="true"
          :clearonselect="false"
          :closeonselect="true"
          :optionslimit="10"
          :error="error"
          :disabled-add="true"
        />
        <FormulateInput
          v-model="filters.payment_status"
          label="Payment Status"
          type="select"
          :options="{
            paid: 'Paid',
            unpaid: 'Unpaid',
            waived: 'Waived',
          }"
          :error="error"
        />
        <FormulateInput
          v-model="filters.exam_status"
          label="Exam Status"
          type="select"
          :options="{
            '': '',
            pending: 'Pending',
            pass: 'Pass',
            fail: 'Failed',
            cancelled: 'Cancelled',
            refunded: 'Refunded',
            expired: 'Expired',
          }"
          :error="error"
        />
        <FormulateInput
          v-model="filters.prometric_status"
          label="Prometric Status"
          type="select"
          :options="{
            '': '',
            pending: 'Pending',
            submitted: 'Submitted',
          }"
          :error="error"
        />
        <FormulateInput
          v-model="filters.language"
          label="Language"
          type="select"
          :options="{
            '': '',
            en: 'English',
            cn: 'Chinese',
            fr: 'French',
            jp: 'Japanese',
            es: 'Spanish',
          }"
          :error="error"
        />
        <FormulateInput
          v-model="filters.discount_code"
          label="Discount Code"
          type="text"
          :error="error"
        />
        <FormulateInput
          v-model="filters.is_asid"
          label="ASID member"
          type="select"
          :options="{
            '': '',
            1: 'Yes',
            0: 'No',
          }"
          :error="error"
        />
        <div class="mt-6">
          <FormulateInput type="submit" label="Apply" />
        </div>
        <div v-if="hasAppliedFilters" class="mt-6">
          <WButtonsBase type="primaryInverted" @click.native="clearFilters()"
            >Clear filters</WButtonsBase
          >
        </div>
      </FormulateForm>
      <!-- end here -->
      <div
        class="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg"
      >
        <div class="overflow-x-scroll">
          <table class="w-full divide-y divide-gray-200">
            <thead>
              <tr class="text-white bg-primary-700">
                <th
                  class="px-6 py-3 text-left text-xs leading-4 font-medium uppercase tracking-wider"
                >
                  ID
                </th>
                <th
                  class="px-6 py-3 text-left text-xs leading-4 font-medium uppercase tracking-wider"
                >
                  Eligibility ID
                </th>
                <th
                  class="px-6 py-3 text-left text-xs leading-4 font-medium uppercase tracking-wider"
                >
                  User
                </th>
                <th
                  class="px-6 py-3 text-left text-xs leading-4 font-medium uppercase tracking-wider"
                >
                  Location
                </th>
                <th
                  class="px-6 py-3 text-left text-xs leading-4 font-medium uppercase tracking-wider"
                >
                  Fees
                </th>
                <th
                  class="px-6 py-3 text-left text-xs leading-4 font-medium uppercase tracking-wider"
                >
                  Payment Status
                </th>
                <th
                  class="px-6 py-3 text-left text-xs leading-4 font-medium uppercase tracking-wider"
                >
                  Discount Code
                </th>
                <th
                  class="px-6 py-3 text-left text-xs leading-4 font-medium uppercase tracking-wider"
                >
                  Form Code
                </th>
                <th
                  class="px-6 py-3 text-left text-xs leading-4 font-medium uppercase tracking-wider"
                >
                  Exam Status
                </th>
                <th
                  class="px-6 py-3 text-left text-xs leading-4 font-medium uppercase tracking-wider"
                >
                  Created At
                </th>
                <th class="px-6 py-3"></th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="exam in adminExamsList.data" :key="exam.id">
                <td class="px-6 py-4 whitespace-nowrap">
                  <div
                    class="text-sm leading-5 text-primary-500 cursor-pointer hover:text-primary-800"
                    @click="viewExamDetails(exam)"
                  >
                    {{ exam.id }}
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm leading-5 font-medium text-gray-900">
                    {{ exam.eligibility_id }} |
                    {{ getExamLanguage(exam.language) }}
                  </div>
                  <div
                    class="text-sm leading-5 text-primary-500 cursor-pointer hover:text-primary-800"
                    @click="changeDate(exam)"
                  >
                    <div v-if="exam.expiration_date">
                      Expires
                      {{ $dayjs(exam.expiration_date).format('MMM DD, YYYY') }}
                    </div>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm leading-5 font-medium text-gray-900">
                    {{ exam.first_name }} {{ exam.last_name }}
                  </div>
                  <div class="text-sm leading-5 text-gray-500">
                    {{ exam.email }}
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div
                    v-if="exam.addresses.length"
                    class="text-sm leading-5 font-medium text-gray-900"
                  >
                    {{ exam.addresses[0].city }},
                    {{ exam.addresses[0].state }}
                  </div>
                  <div
                    v-if="exam.addresses.length"
                    class="text-sm leading-5 text-gray-500"
                  >
                    {{ exam.addresses[0].country_code }}
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm leading-5 text-gray-900">
                    <span v-if="exam.invoices.length"
                      >$ {{ exam.invoices[0].total_amount }}</span
                    >
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm leading-5 text-gray-900">
                    <span
                      v-if="exam.payment_status !== 'unpaid'"
                      class="px-2 inline-flex text-xs leading-5 rounded-full bg-primary-600 text-white uppercase"
                      >{{ exam.payment_status }}</span
                    >
                    <span
                      v-else
                      class="px-2 inline-flex text-xs leading-5 rounded-full bg-secondary-600 text-white uppercase"
                    >
                      {{ exam.payment_status }}
                    </span>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div
                    class="text-sm leading-5 text-gray-900"
                    v-html="checkValue(exam.discount_code, 'N/A')"
                  ></div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm leading-5 text-gray-900">
                    {{ exam.form_code }}
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm leading-5 text-gray-900">
                    {{ exam.exam_status }}
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm leading-5 text-gray-900">
                    {{ exam.created_at }}
                  </div>
                </td>
                <td
                  class="px-6 py-4 whitespace-nowrap text-right text-sm leading-5 font-medium"
                >
                  <a
                    href="#"
                    class="text-primary-500 cursor-pointer hover:text-primary-800"
                    @click="viewExamDetails(exam)"
                  >
                    Edit
                  </a>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <FormInputsPagination
          :pagination="paginate"
          :offset="3"
          @paginate="getAdminExamsList(allFilters)"
        />
      </div>
    </div>
    <div v-else class="h-screen w-full mt-14">
      <div v-if="error == null" class="mx-auto text-center">
        <WLoadingSpinner class="mx-auto" />
        <div class="mt-3 text-primary-600">Loading Exams...</div>
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
import { createNamespacedHelpers } from 'vuex'
import { tableMixin } from '~/mixins/tableMixin'

const { mapState } = createNamespacedHelpers('exam')
export default {
  mixins: [tableMixin],

  data() {
    return {
      userATP: '',
      selectedExam: null,
      filters: {
        eligibility_id: null,
        company_id: null,
        first_name: null,
        last_name: null,
        user_email: null,
        organization: null,
        prometric_status: null,
        discount_code: null,
        exam_status: null,
        is_asid: null,
        payment_status: 'paid',
        language: null,
      },
      error: null,
    }
  },
  head() {
    return {
      title: `Admin Exams`,
    }
  },
  computed: {
    ...mapState(['adminExamsList', 'languages']),
    paginate() {
      if (this.adminExamsList) {
        return {
          total: this.adminExamsList.total,
          per_page: this.adminExamsList.per_page,
          current_page: this.adminExamsList.current_page,
          last_page: this.adminExamsList.last_page,
          from: this.adminExamsList.from,
          to: this.adminExamsList.to,
        }
      }
      return {}
    },
    hasAppliedFilters() {
      for (const key in this.filters) {
        if (
          this.filters[key] !== null &&
          this.filters[key] !== '' &&
          this.filters[key] !== 'paid'
        )
          return true
      }
      return false
    },
    allFilters() {
      const res = JSON.parse(JSON.stringify(this.filters))
      res.page = this.paginate.current_page
      return res
    },
  },
  created() {
    this.getAdminExamsList(this.allFilters)
  },
  methods: {
    async getAdminExamsList(payload) {
      if (this.filters?.organization && this.filters?.organization !== '') {
        payload.company_id = this.filters.organization.id
        payload.organization = this.filters.organization.name
      }
      return await this.$store
        .dispatch('exam/getAdminExamsList', payload)
        .catch((error) => (this.error = error))
    },
    async cancelExam() {
      await this.$store
        .dispatch('exam/cancelExam', this.selectedExam.id)
        .then((res) =>
          this.$refs.alert.showAlert('success', 'Exam successfully cancelled')
        )
        .catch((err) => {
          if (err) {
            this.formErrors = [err]
            this.$refs.alert.showAlert('error', 'You cannot cancel this exam!')
          }
        })
      this.getAdminExamsList(this.allFilters)
      this.$refs.slideover.open = false
    },
    async viewExamDetails(exam) {
      this.$store.commit('exam/setAdminEditMode', false)
      this.selectedExam = exam
      await this.$store
        .dispatch('user/getUserATP', this.selectedExam.user_id)
        .then((res) =>
          res[0] ? (this.userATP = res[0].code) : (this.userATP = '')
        )
      this.$refs.slideover.open = true
    },
    async updateExpiration() {
      await this.$store.dispatch('exam/updateExamExpiration', {
        id: this.selectedExam.id,
        expiration_date: this.selectedExam.expiration_date,
      })
      this.getAdminExamsList(this.allFilters)
      this.$refs.modal.isHidden = true
    },
    changeDate(exam) {
      this.selectedExam = { ...exam }
      this.selectedExam.expiration_date =
        this.selectedExam.expiration_date.substring(0, 10)
      this.$refs.modal.isHidden = false
    },
    formatPrice(value) {
      const val = (value / 1).toFixed(2)
      return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
    },
    getExamLanguage(lang) {
      return this.languages.filter((a) => a.value === lang)[0].text
    },
    clearFilters() {
      Object.keys(this.filters).forEach((k) => {
        this.filters[k] = null
      })
      this.filters.payment_status = 'paid'
      // Emit Event to Clear ComapanyMultiSearch Input Value
      this.$nuxt.$emit('clear-filters')
      this.$store.dispatch('exam/getAdminExamsList', this.filters)
    },
  },
}
</script>
