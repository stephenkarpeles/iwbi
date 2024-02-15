<template>
  <div v-if="formData">
    <WFeedbackAlert ref="alert" />
    <FormulateForm
      :form-errors="formErrors"
      class="space-y-6 max-w-5xl mx-auto"
      @submit="submitEstimate"
    >
      <WHeadingsHTwo
        class="md:pb-5"
        heading="WELL Community Pricing Calculator"
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
          <div class="grid grid-col-1 md:grid-cols-2 gap-x-4 md:gap-y-4 w-full">
            <FormulateInput
              v-model="formData.estimate.name"
              label="Name*"
              type="text"
              validation="required"
            />
            <FormulateInput
              v-model="formData.estimate.email"
              label="Email Address*"
              type="text"
              validation="required"
            />
            <FormulateInput
              v-model="formData.estimate.organization"
              label="Your Organization*"
              type="text"
              validation="required"
            />
            <FormulateInput
              v-model="formData.estimate.country"
              :options="countryOptions"
              type="select"
              label="Country/Region"
              validation="required"
            />
            <FormulateInput
              v-if="
                formData.estimate.id && formData.estimate.is_community !== 1
              "
              v-model="formData.estimate.is_community"
              :options="{
                0: 'No',
                1: 'Yes',
              }"
              type="radio"
              label="Is this estimate for a WELL Community project? *"
              validation="required"
            />
            <FormulateInput
              v-model="formData.estimate.membership"
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
                  <Flyout
                    ref="conceptFlyout"
                    y="bottom"
                    x="right"
                    class="h-full"
                  >
                    <WButtonsBase
                      type="tooltip"
                      icon="question-mark-circle"
                      @click.native="openMembershipSite()"
                    />
                    <template #content>
                      <div class="p-3 w-60">
                        IWBI members receive discounts on registration and
                        documentation review fees. Interested? Click to learn
                        more or send an email to membership@wellcertified.com
                      </div>
                    </template>
                  </Flyout>
                </label>
              </template>
            </FormulateInput>
            <FormulateInput
              v-model="formData.estimate.estimate_sector"
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
                  <Flyout
                    ref="sectorFlyout"
                    y="bottom"
                    x="right"
                    class="h-full"
                  >
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

      <div
        v-for="(project, index) in formData.estimate.projects"
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
          <div class="md:flex md:space-x-4 md:gap-y-4 w-full">
            <FormulateInput
              v-model="project.name"
              class="md:w-1/2"
              label="Project Name*"
              type="text"
              validation="required"
            />
            <FormulateInput
              v-if="formData.estimate.is_community !== 1"
              v-model="project.area"
              class="md:w-1/2"
              label="Project Area (in sq ft)*"
              type="text"
              validation="required"
            />
            <FormulateInput
              v-else
              v-model="project.area"
              class="md:w-1/2"
              label="Project Area (in acres)*"
              type="text"
              validation="required"
            />
            <FormulateInput
              v-if="formData.estimate.is_community !== 1"
              v-model="project.type"
              :options="projectTypeOptions"
              label="Project Type*"
              type="select"
              validation="required"
            />
          </div>
          <div v-if="formData.estimate.is_community === 1" class="py-2 text-xs">
            <p class="pb-2">
              Please note: <b>Existing communities</b> are required to certify
              at least one building under an approved health and wellness
              building certification. For a list of preapproved health and
              wellness rating systems, see
              <a
                class="text-primary-500"
                href="https://v2.wellcertified.com/resources/preapproved-programs"
                target="_blank"
                >this page</a
              >. Projects interested in pursuing WELL Certification to fulfill
              this requirement may refer to the v2 pricing calculator for a
              building estimate.
            </p>
            <p>
              For <b>new developments</b>, health and wellness certified
              buildings must represent at least 15% of total buildings. For more
              information about this requirement, including the process for
              seeking an exemption, see the WELL Community Standard “Certified
              Buildings” section. For a list of preapproved health and wellness
              rating systems, see
              <a
                class="text-primary-500"
                href="https://v2.wellcertified.com/resources/preapproved-programs"
                target="_blank"
                >this page</a
              >. Projects interested in pursuing WELL Certification to fulfill
              this requirement may refer to the v2 pricing calculator for a
              building estimate.
            </p>
          </div>
        </div>
      </div>

      <div v-if="formData.estimate.is_community !== 1">
        <div class="text-sm text-gray-400">
          A 10% discount is available on registration fees when registering
          multiple projects together.
        </div>
        <div class="flex mt-3">
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
          <div
            class="grid grid-cols-1 md:grid-cols-2 md:gap-x-4 md:gap-y-4 w-full"
          >
            <FormulateInput
              v-model="formData.estimate.override_reg_rate"
              label="Override Reg Rate:"
              placeholder="Override Reg Rate"
              type="text"
            />
            <FormulateInput
              v-model="formData.estimate.override_cert_rate"
              label="Override Cert Rate:"
              placeholder="Override Cert Rate"
              type="text"
            />
            <FormulateInput
              v-model="formData.estimate.override_pv_rate"
              label="Override PV Rate:"
              placeholder="Override PV Rate"
              type="text"
            />
            <FormulateInput
              v-model="formData.estimate.override_discount_reg"
              label="Override Discount Reg:"
              placeholder="Override Discount Reg"
              type="text"
            />
            <FormulateInput
              v-model="formData.estimate.override_discount_cert"
              label="Override Discount Cert:"
              placeholder="Override Discount Cert"
              type="text"
            />
            <FormulateInput
              v-model="formData.estimate.override_discount_pv"
              label="Override Discount PV:"
              placeholder="Override Discount PV"
              type="text"
            />
            <FormulateInput
              v-model="formData.estimate.override_discount"
              label="Override Discount:"
              placeholder="Override Discount"
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
    estimate: {
      type: Object,
      required: false,
      default() {
        return {
          estimate: {
            id: null,
            name: '',
            organization: '',
            email: '',
            user_id: null,
            country: '',
            is_community: 1,
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
            country_name: '',
            project_number: null,
            estimate_sector: null,
            projects: [
              {
                name: '',
                area: null,
                type: 'community',
              },
            ],
          },
        }
      },
    },
  },
  data() {
    return {
      loading: false,
      formData: null,
      formErrors: [],
      projectTypeOptions: [
        { value: 'nc', label: 'New and Existing Buildings' },
        { value: 'ci', label: 'New and Existing Interiors' },
        { value: 'cs', label: 'Core & Shell' },
        {
          value: 'cics',
          label:
            'New and Existing Interiors in a Core & Shell Certified Building',
        },
        { value: 'residential', label: 'Multifamily Residential (Pilot)' },
        { value: 'retail', label: 'Retail (Pilot)' },
        { value: 'restaurant', label: 'Restaurants (Pilot)' },
        { value: 'education', label: 'Educational Facilities (Pilot)' },
        { value: 'kitchen', label: 'Commercial Kitchen (Pilot)' },
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
    addProject() {
      const newProject = {
        area: null,
        name: null,
        type: null,
      }
      this.formData.estimate.projects.push(newProject)
    },
    resetForm() {
      this.formData = JSON.parse(JSON.stringify(this.estimate))
    },
    async submitEstimate() {
      this.loading = true
      const data = {
        id: this.formData.estimate.id,
        name: this.formData.estimate.name,
        country: this.formData.estimate.country,
        is_community: this.formData.estimate.is_community,
        membership: this.formData.estimate.membership,
        organization: this.formData.estimate.organization,
        email: this.formData.estimate.email,
        projects: [],
        override_cert_rate: this.formData.estimate.override_cert_rate,
        override_discount: this.formData.estimate.override_discount,
        override_discount_cert: this.formData.estimate.override_discount_cert,
        override_discount_pv: this.formData.estimate.override_discount_pv,
        override_discount_reg: this.formData.estimate.override_discount_reg,
        override_pv_rate: this.formData.estimate.override_pv_rate,
        override_reg_rate: this.formData.estimate.override_reg_rate,
        estimate_sector: this.formData.estimate.estimate_sector,
        exp_date: this.formData.exp_date,
      }

      for (let i = 0; i < this.formData.estimate.projects.length; i++) {
        const project = {
          name: this.formData.estimate.projects[i].name,
          area: this.formData.estimate.projects[i].area,
          type: this.formData.estimate.projects[i].type,
        }
        data.projects.push(project)
      }

      if (this.mode === 'creation') {
        await this.$store
          .dispatch('estimate/createV1Estimate', data)
          .then((res) => this.$router.push('/estimates/v1/' + res.id))
          .catch((err) => {
            if (err) {
              this.formErrors = [err]
              this.$refs.alert.showAlert('error', err)
            }
          })
      } else {
        await this.$store.dispatch('estimate/updateV1Estimate', data)
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
