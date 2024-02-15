<template>
  <div v-if="formData">
    <WFeedbackAlert ref="alert" />
    <FormulateForm
      :form-errors="formErrors"
      class="space-y-6 max-w-4xl mx-auto"
      @submit="submitEstimate"
    >
      <WHeadingsHTwo
        class="md:pb-5"
        :heading="
          $route.fullPath.includes('v2-pilot')
            ? 'WELL v2 Pilot Pricing Calculator'
            : 'WELL v2 Pricing Calculator'
        "
      />
      <div class="shadow-md flex flex-wrap justify-between border rounded-md">
        <div
          class="
            w-full
            bg-primary-50
            rounded-t-md
            border-b
            px-4
            md:px-8
            py-4
            text-primary-800
            flex
            justify-between
          "
        >
          <div class="font-bold">General Information</div>
        </div>
        <div
          class="
            flex flex-wrap
            px-4
            md:px-8
            py-4
            w-full
            justify-between
            text-gray-400
          "
        >
          <div
            class="grid grid-cols-1 md:grid-cols-2 gap-x-4 md:gap-y-4 w-full"
          >
            <FormulateInput
              v-model="formData.first_name"
              label="First Name*"
              type="text"
              validation="required"
            />
            <FormulateInput
              v-model="formData.last_name"
              label="Last Name*"
              type="text"
              validation="required"
            />
            <FormulateInput
              v-model="formData.email"
              label="Email Address*"
              type="text"
              validation="required"
            />
            <FormulateInput
              v-model="formData.organization"
              label="Your Organization*"
              type="text"
              validation="required"
            />
            <FormulateInput
              v-model="formData.country"
              :options="countryOptions"
              type="select"
              label="Country/Region"
              validation="required"
            />
          </div>
        </div>
      </div>

      <div
        v-for="(project, index) in formData.projects"
        :key="index"
        class="shadow-md flex flex-wrap justify-between border rounded-md"
      >
        <div
          class="
            w-full
            bg-primary-50
            rounded-t-md
            border-b
            px-4
            md:px-8
            py-4
            text-primary-800
            flex
            justify-between
          "
        >
          <div>
            <div class="font-bold">Project Information:</div>
            <div class="text-sm">
              {{ project.name }}
            </div>
          </div>
        </div>
        <div
          class="
            flex flex-wrap
            px-4
            md:px-8
            py-4
            w-full
            justify-between
            text-gray-400
          "
        >
          <div
            class="grid grid-cols-1 md:grid-cols-2 gap-x-4 md:gap-y-4 w-full"
          >
            <div class="md:space-x-2 md:flex mt-auto">
              <FormulateInput
                v-model="project.name"
                class="md:w-1/2"
                label="Project Name"
                type="text"
              />
              <FormulateInput
                v-model="project.area"
                class="md:w-1/2"
                label="Project Area (in sq ft):"
                type="text"
              />
            </div>
            <FormulateInput
              v-model="project.primary_space_type_id"
              :options="spaceTypeOptions"
              label="Which of the following is the primary space type of the project?"
              type="select"
              validation="required"
              @change="
                (e) => {
                  setType(index, e)
                }
              "
            />
            <FormulateInput
              v-model="project.type"
              label="What are you seeking certification for?"
              type="select"
              :disabled="
                project.primary_space_type_id === '3' ||
                project.primary_space_type_id === 3
              "
              :options="certificationOptions"
              validation="required"
            />
            <FormulateInput
              v-model="project.country"
              :options="countryOptions"
              type="select"
              label="Country/Region"
              validation="required"
            />
            <FormulateInput
              v-model="project.estimate_sector"
              :options="sectorOptions"
              label="Does your project qualify for any of these market sectors?"
              type="select"
            >
              <template slot="label">
                <label
                  class="
                    text-sm
                    font-bold
                    leading-5
                    text-gray-700
                    sm:mt-px sm:pt-2
                  "
                  >Does your project qualify for any of these market sectors?
                  <Flyout ref="conceptFlyout" y="top" x="right" class="h-full">
                    <WButtonsBase
                      type="tooltip"
                      icon="question-mark-circle"
                      @click.native="$refs.modal.isHidden = false"
                    />
                    <template #content>
                      <div class="p-3 w-60">
                        Markets and building sectors below qualify for a 35%
                        discount. Click to learn more.
                      </div>
                    </template>
                  </Flyout>
                </label>
              </template>
            </FormulateInput>
          </div>
        </div>
      </div>

      <div class="flex">
        <div>
          <WButtonsBase
            type="primaryInverted"
            icon="plus"
            @click.native="addProject"
          >
            Add Project
          </WButtonsBase>
        </div>
      </div>

      <div class="shadow-md flex flex-wrap justify-between border rounded-md">
        <div
          class="
            w-full
            bg-primary-50
            rounded-t-md
            border-b
            px-4
            md:px-8
            py-4
            text-primary-800
            flex
            justify-between
          "
        >
          <div class="font-bold">Eligible Discounts</div>
        </div>
        <div
          class="
            flex flex-wrap
            px-4
            md:px-8
            py-4
            w-full
            justify-between
            text-gray-400
          "
        >
          <FormulateInput
            v-model="formData.membership"
            class="w-full"
            placeholder="Please select"
            :options="discountOptions"
            type="select"
          >
            <template slot="label">
              <label
                class="
                  text-sm
                  font-bold
                  leading-5
                  text-gray-700
                  sm:mt-px sm:pt-2
                "
                >Does your project qualify for any member discounts?
                <Flyout ref="conceptFlyout" y="bottom" x="right" class="h-full">
                  <WButtonsBase
                    type="tooltip"
                    icon="question-mark-circle"
                    @click.native="openMembershipSite()"
                  />
                  <template #content>
                    <div class="p-3 w-60">
                      IWBI members receive discounts on registration and
                      documentation review fees. Interested? Click to learn more
                      or send an email to membership@wellcertified.com
                    </div>
                  </template>
                </Flyout>
              </label>
            </template>
          </FormulateInput>
        </div>
      </div>

      <div class="shadow-md flex flex-wrap justify-between border rounded-md">
        <div
          class="
            w-full
            bg-primary-50
            rounded-t-md
            border-b
            px-4
            md:px-8
            py-4
            text-primary-800
            flex
            justify-between
          "
        >
          <div class="font-bold">Admin Override Information</div>
        </div>
        <div
          class="
            flex flex-wrap
            px-4
            md:px-8
            py-4
            w-full
            justify-between
            text-gray-400
          "
        >
          <div class="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-4 w-full">
            <FormulateInput
              v-model="formData.cert_rate"
              label="Certification Rate (per sqft):"
              placeholder="Certification Rate (per sqft)"
              type="text"
            />
            <FormulateInput
              v-model="formData.pv_rate"
              label="PV Rate (per sqft):"
              placeholder="PV Rate (per sqft)"
              type="text"
            />
            <FormulateInput
              v-model="formData.reg_discount"
              label="Registration Discount (%):"
              placeholder="Registration Discount (%)"
              type="text"
            />
            <FormulateInput
              v-model="formData.cert_discount"
              label="Certification Discount (%):"
              placeholder="Certification Discount (%)"
              type="text"
            />
            <FormulateInput
              v-model="formData.pv_discount"
              label="PV Discount (%):"
              placeholder="PV Discount (%)"
              type="text"
            />
            <FormulateInput
              v-model="formData.exp_date"
              label="Expiration Date:"
              type="datetimepicker"
              max="9999-01-01"
            />
          </div>
        </div>
      </div>
      <div>
        <FormulateErrors
          class="
            my-2
            text-danger-400
            shadow-lg
            p-2
            rounded
            bg-red-100
            text-center
          "
        />
      </div>
      <div class="md:flex justify-between">
        <div class="pb-4">
          <WButtonsBase type="danger" @click.native="resetForm">
            Reset Fields
          </WButtonsBase>
        </div>
        <div class="md:w-32">
          <WButtonsBase v-if="loading" :type="'primaryInverted'">
            <span>
              <WLoadingSpinner type="button" class="mx-auto" />
            </span>
          </WButtonsBase>
          <FormulateInput
            v-else
            type="submit"
            :label="mode === 'creation' ? 'Create Estimate' : 'Update Estimate'"
          />
        </div>
      </div>
    </FormulateForm>
    <WFeedbackModal ref="modal">
      <div class="max-w-lg">
        <div class="text-sm font-light p-5 text-gray-500">
          <ul class="list-disc pl-3 gap-3">
            <li class="mb-2">
              <strong>Government/Municipal Buildings:</strong> Buildings that
              serve "government agencies", which are entities 100% owned by
              government and serve government function.
            </li>
            <li class="mb-2">
              <strong>Schools:</strong> Includes all educational facilities,
              such as public and private schools, primary and secondary and
              higher education.
            </li>
            <li class="mb-2">
              <strong>Non-Profit, charitable organizations:</strong> Tax exempt
              entities organized and operated exclusively for charitable
              purpose. The term "charitable" is based on relevant definition
              used under applicable non-profit legislation and includes relief
              for the poor, the distressed, or the underprivileged; advancement
              of religion; advancement of education or science; erecting or
              maintaining public buildings, monuments, or works; lessening the
              burdens of government; lessening neighborhood tensions;
              eliminating prejudice and discrimination; defending human and
              civil rights secured by law; and combating community deterioration
              and juvenile delinquency.
            </li>
            <li class="mb-2">
              <strong>Low-Income / affordable housing:</strong> Projects may be
              considered "low-income housing" for the purposes of WELL if at
              least 40% of units are reserved for households makings 60% or less
              than the area median income and if housing costs are deemed
              "affordable" for those households. Housing is defined as
              "affordable" when total cost of rent is no more than 33% of
              income; thus, total annual cost must not exceed 20% of area median
              income. The area median income (AMI) is the household income for
              the median — or middle — household in a region. The region should
              include the more-populated urban core and its less-populated
              surrounding territories, sharing industry, infrastructure, and
              housing.
            </li>
          </ul>
        </div>
      </div>
    </WFeedbackModal>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  props: {
    mode: {
      type: String,
      required: false,
      default: 'edit',
    },
    type: {
      type: String,
      required: false,
      default: 'v2',
    },
    estimate: {
      type: Object,
      required: false,
      default() {
        return {
          id: null,
          name: '',
          organization: '',
          email: '',
          user_id: null,
          is_community: 0,
          pricing_version: 3,
          override_reg_rate: null,
          override_cert_rate: null,
          override_pv_rate: null,
          override_discount_reg: null,
          override_discount_cert: null,
          override_discount_pv: null,
          override_discount: null,
          reg_fees: null,
          pre_cert_fees: null,
          bundle_fees: null,
          project_id: null,
          doc_review_fees: null,
          pv_fees: null,
          membership: '',
          override_precert_rate: null,
          mem_reg_discount: null,
          mem_cert_discount: null,
          mem_pv_discount: null,
          total_area: null,
          reg_discount: null,
          per_project_area: 0,
          project_number: null,
          projects: [
            {
              name: '',
              area: null,
              type: '',
              estimate_sector: '',
              primary_space_type_id: '',
            },
          ],
        }
      },
    },
  },
  data() {
    return {
      loading: false,
      formErrors: [],
      formData: null,
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
      certificationOptions: [
        { value: 'new-existing', label: 'WELL Certification' },
        { value: 'cs', label: 'WELL Core Certification' },
      ],
      discountOptions: [
        { value: '', label: 'Not applicable' },
        { value: 'Cornerstone', label: 'Cornerstone' },
        { value: 'Keystone', label: 'Keystone' },
        { value: 'Portfolio', label: 'Portfolio' },
      ],
      sectorOptions: [
        { value: '', label: 'Not applicable' },
        {
          value: 'government/municipal-buildings',
          label: 'Government/Municipal Buildings',
        },
        { value: 'schools', label: 'Schools' },
        {
          value: 'non-profit-charitable-organizations',
          label: 'Non-Profit, charitable organizations',
        },
        {
          value: 'low-income/affordable-housing',
          label: 'Low-Income / affordable housing',
        },
        { value: 'assisted-living', label: 'Assisted Living' },
        { value: 'small-business', label: 'Small Business' },
        { value: 'healthcare-facilities', label: 'Healthcare Facilities' },
      ],
    }
  },
  computed: {
    ...mapState({
      countries: (state) => state.address.countries,
    }),
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
  },

  mounted() {
    this.formData = JSON.parse(JSON.stringify(this.estimate))
  },
  methods: {
    setType(index, event) {
      const e = event.target.value
      if (e === 3 || e === '3') {
        this.formData.projects[index].type = 'new-existing'
      } else {
        this.formData.projects[index].type = ''
      }
    },
    addProject() {
      const newProject = {
        area: null,
        estimate_sector: null,
        id: null,
        name: null,
        space_types: [],
        primary_space_type_id: null,
        type: null,
      }
      this.formData.projects.push(newProject)
    },
    resetForm() {
      this.formData = JSON.parse(JSON.stringify(this.estimate))
    },
    async submitEstimate() {
      this.loading = true
      const data = {
        id: this.formData.id,
        country: this.formData.country,
        first_name: this.formData.first_name,
        membership: this.formData.membership,
        last_name: this.formData.last_name,
        organization: this.formData.organization,
        email: this.formData.email,
        type: this.type,
        projects: [],
        cert_rate: this.formData.cert_rate,
        pv_rate: this.formData.pv_rate,
        reg_discount: this.formData.reg_discount,
        cert_discount: this.formData.cert_discount,
        pv_discount: this.formData.pv_discount,
        exp_date: this.formData.exp_date,
      }

      for (let i = 0; i < this.formData.projects.length; i++) {
        const project = {
          estimate_sector: this.formData.projects[i].estimate_sector,
          type: this.formData.projects[i].type,
          space_types: [this.formData.projects[i].primary_space_type_id],
          primary_space_type_id:
            this.formData.projects[i].primary_space_type_id,
          id: this.formData.projects[i].id,
          name: this.formData.projects[i].name,
          country: this.formData.projects[i].country,
          area: this.formData.projects[i].area,
        }

        if (project.id) {
          project.project_id = project.id
        }

        data.projects.push(project)
      }

      if (this.mode === 'creation') {
        data.email_address = data.email
        await this.$store
          .dispatch('estimate/createV2Estimate', data)
          .then((res) => this.$router.push('/estimates/v2/' + res.id))
          .catch((err) => {
            if (err) {
              this.formErrors = [err]
              this.$refs.alert.showAlert('error', err)
            }
          })
      } else {
        await this.$store.dispatch('estimate/updateEstimate', data)
        await this.$parent.getEstimate()
        this.$parent.editMode = false
      }
      this.loading = false
    },
    openMembershipSite() {
      window.open('https://www.wellcertified.com/membership', '_blank')
    },
  },
}
</script>
