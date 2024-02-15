<template>
  <div>
    <WFeedbackModal ref="toolTipModal">
      <div class="max-w-2xl">
        <ul>
          <li>
            <strong>Government/Municipal Buildings:</strong>
            Buildings that serve "government agencies", which are entities 100%
            owned by government and serve government function.
          </li>
          <li>
            <strong>Schools:</strong> Includes all educational facilities, such
            as public and private schools, primary and secondary and higher
            education.
          </li>
          <li>
            <strong>Non-Profit, charitable organizations:</strong>
            Tax exempt entities organized and operated exclusively for
            charitable purpose. The term "charitable" is based on relevant
            definition used under applicable non-profit legislation and includes
            relief for the poor, the distressed, or the underprivileged;
            advancement of religion; advancement of education or science;
            erecting or maintaining public buildings, monuments, or works;
            lessening the burdens of government; lessening neighborhood
            tensions; eliminating prejudice and discrimination; defending human
            and civil rights secured by law; and combating community
            deterioration and juvenile delinquency.
          </li>
          <li>
            <strong>Low-Income / affordable housing:</strong>
            Projects may be considered "low-income housing" for the purposes of
            WELL if at least 40% of units are reserved for households makings
            60% or less than the area median income and if housing costs are
            deemed "affordable" for those households. Housing is defined as
            "affordable" when total cost of rent is no more than 33% of income;
            thus, total annual cost must not exceed 20% of area median income.
            The area median income (AMI) is the household income for the median
            — or middle — household in a region. The region should include the
            more-populated urban core and its less-populated surrounding
            territories, sharing industry, infrastructure, and housing.
          </li>
          <li>
            <strong>Senior and assisted living:</strong>
            Spaces that provide any level of supervised care and support
            services to residents, such as aging adults, disabled youth or
            long-term care patients.
          </li>
          <li>
            <strong>Small Business:</strong> Small businesses are defined as
            having less than 50 employees and less than $10 million in annual
            revenue and have less than five locations.
          </li>
        </ul>
        <div class="flex justify-end mt-3">
          <div class="w-48">
            <WButtonsBase @click.native="$refs.toolTipModal.isHidden = true">
              Ok
            </WButtonsBase>
          </div>
        </div>
      </div>
    </WFeedbackModal>
    <div class="rounded-b-lg relative bg-white">
      <div class="hidden lg:block lg:absolute lg:inset-0">
        <div class="lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2">
          <img
            class="h-56 w-full object-cover lg:absolute lg:h-full rounded-r-lg"
            :src="'/well-ap/register/' + currentStep + '.jpg'"
            alt=""
          />
        </div>
      </div>
      <div
        class="rounded-b-lg relative py-6 px-4 xl:pt-16 sm:px-6 lg:px-8 lg:max-w-7xl lg:mx-auto lg:grid lg:grid-cols-2"
      >
        <div :class="{ hidden: currentStep !== 0 }" class="lg:pr-8">
          <div class="max-w-md mx-auto sm:max-w-lg lg:mx-0">
            <FormulateForm class="space-y-2" @submit="validateStep">
              <WHeadingsHFour
                heading="Project Owner"
                sub-heading="The project owner is the individual or entity that holds all legal right to possess and control project-relevant location and to authorize decisions pertaining to the location."
              />

              <!-- <FormulateInput
                v-model="formData.owner_org"
                type="text"
                label="Owner organization*"
                class="w-full"
                validation="required"
              /> -->

              <FormulateInput
                v-model="company"
                type="companymultisearch"
                name="organization"
                label="Owner Organization*"
                validation="required"
                class="w-full"
                :searchable="true"
                :clearonselect="false"
                :closeonselect="true"
                :optionslimit="10"
              />
              <FormulateInput
                v-model="formData.owner_name"
                type="text"
                label="Owner name*"
                class="w-full"
                validation="required"
              />

              <FormulateInput
                v-model="formData.owner_email"
                type="text"
                label="Owner email*"
                class="w-full"
                validation="required"
              />

              <FormulateInput
                v-model="formData.owner_phone"
                type="text"
                label="Owner phone"
                class="w-full"
              />

              <FormulateInput
                v-model="formData.industry"
                :options="industryOptions"
                type="select"
                placeholder="Select an industry"
                label="Industry*"
                validation="required"
              />

              <FormulateInput
                v-model="formData.org_website"
                type="text"
                label="Organization website"
                class="w-full"
              />

              <FormulateInput
                v-model="formData.org_overview"
                type="textarea"
                label="Organization Overview"
                class="w-full"
              />

              <FormulateInput
                v-model="formData.construction_status"
                :options="[
                  { label: 'No, existing building', value: 0 },
                  { label: 'Yes', value: 1 },
                ]"
                label="Are you planning to undergo construction or renovation?*"
                type="radio"
                validation="required"
              />
              <FormulateInput
                v-model="formData.other_certification"
                :options="otherCertificationOptions"
                label="Other certifications being pursued"
                type="checkbox"
              />

              <FormulateInput
                v-if="
                  formData.other_certification &&
                  formData.other_certification.includes('other')
                "
                v-model="formData.other_certification_name"
                type="text"
                label="Please specify*"
                validation="required"
              />

              <FormulateInput
                v-model="formData.doc_sub_date_est"
                type="datetimepicker"
                label="Estimated date of document submission*"
                max="9999-01-01"
                validation="required"
              />

              <FormulateInput
                v-model="formData.construction_completion_date"
                type="datetimepicker"
                label="Anticipated date of construction completion*"
                max="9999-01-01"
                validation="required"
              />

              <div>
                <label
                  class="text-sm font-bold leading-5 text-gray-700 sm:mt-px sm:pt-2"
                >
                  Does your project qualify for any of the following market
                  sectors?
                  <Flyout
                    ref="conceptFlyout"
                    y="bottom"
                    x="right"
                    class="h-full"
                  >
                    <WButtonsBase
                      type="tooltip"
                      icon="question-mark-circle"
                      @click.native="$refs.toolTipModal.isHidden = false"
                    />
                    <template #content>
                      <div class="p-3 w-64">
                        Markets and building sectors below qualify for a 35%
                        discount.
                        <WLinksBase
                          @click.native="$refs.toolTipModal.isHidden = false"
                        >
                          Click to learn more.
                        </WLinksBase>
                      </div>
                    </template>
                  </Flyout>
                </label>
                <FormulateInput
                  v-model="formData.estimate_sector"
                  :options="sectorOptions"
                  type="select"
                  placeholder="Not Applicable"
                />
              </div>

              <FormulateInput class="mt-8" type="submit" label="Continue" />
            </FormulateForm>
          </div>
        </div>
        <div :class="{ hidden: currentStep !== 1 }" class="lg:pr-8">
          <div class="max-w-md mx-auto sm:max-w-lg lg:mx-0">
            <WHeadingsHFour
              heading="Project Owner"
              sub-heading="The project owner is the individual or entity that holds all legal right to possess and control project-relevant location and to authorize decisions pertaining to the location."
            />

            <FormulateForm class="space-y-2" @submit="validateStep">
              <div class="w-full relative">
                <FormulateInput
                  v-model="formData.area"
                  type="number"
                  min="0"
                  step=".01"
                  label="Project area"
                  validation="required|number"
                  disabled
                />
                <div
                  style="height: 38px"
                  class="absolute right-0 top-0 mt-6 flex bg-primary-100 text-primary-400 border border-primary-300 rounded-r"
                >
                  <div class="my-auto px-3">ft <sup>2</sup></div>
                </div>
              </div>

              <FormulateInput
                v-model="formData.code"
                type="text"
                label="Registration code"
                class="w-full"
                validation="optional|min:12,length"
                error-behavior="live"
              >
                <template slot="help">
                  <div class="font-light text-sm text-gray-500 -mt-2">
                    If you were issued a special code for registration, please
                    enter here.
                  </div>
                </template>
              </FormulateInput>

              <WHeadingsHFour heading="Project Address" />
              <FormInputsAddressFormulate :target="formData.projectAddress" />

              <WHeadingsHFour heading="Owner Address" />
              <FormInputsAddressFormulate
                :target="formData.ownerAddress"
                :required="true"
              />
              <p
                class="text-sm font-medium bg-secondary-600 text-white rounded border-yellow-300 p-3"
              >
                A project may opt-out of the WELL project directory and
                publicity opportunities as a “private project” at the time of
                registration. A “private project” means that the project name,
                street address, and identify of the owner will not appear within
                the WELL project directory. The private status of your project
                can be changed at any time.
              </p>
              <FormulateInput
                v-model="formData.project_public"
                :options="[
                  { label: 'No', value: 0 },
                  { label: 'Yes', value: 1 },
                ]"
                label="Is this a public project?*"
                type="radio"
                validation="required"
              />

              <div class="flex w-full justify-between">
                <div class="w-40">
                  <WButtonsBase
                    type="primaryInverted"
                    @click.native="currentStep--"
                  >
                    Back
                  </WButtonsBase>
                </div>
                <div class="w-40">
                  <FormulateInput
                    v-if="!registering"
                    type="submit"
                    label="Continue"
                  />
                  <WButtonsBase v-else type="primaryInverted">
                    <span>
                      <WLoadingSpinner type="button" class="mx-auto" />
                    </span>
                  </WButtonsBase>
                </div>
              </div>
            </FormulateForm>
          </div>
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
      registering: false,
      company: null,
      formData: {
        owner_org: null,
        projectAddress: {},
        ownerAddress: {},
        project_public: 1,
      },
      currentStep: 0,
      otherCertificationOptions: [
        { label: 'BREEAM', value: 'breeam' },
        { label: 'DGNB', value: 'dgnb' },
        { label: 'Green Star', value: 'green_star' },
        { label: 'HQE', value: 'hqe' },
        { label: 'LEED', value: 'leed' },
        {
          label: 'Living Building Challenge',
          value: 'living_building_challenge',
        },
        { label: 'OSMOZ', value: 'osmoz' },
        { label: 'Other', value: 'other' },
      ],
      sectorOptions: [
        { value: null, label: 'Not Applicable' },
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
    }
  },
  computed: {
    ...mapState({
      countries: (state) => state.address.countries,
      project: (state) => state.project.project,
    }),
  },
  mounted() {
    this.formData.area = this.project.area
  },
  methods: {
    validateStep() {
      this.$parent.$parent.$parent.$refs.content.scrollTop = 0
      if (this.currentStep === 1) {
        this.registerProject()
      } else {
        this.currentStep++
      }
    },
    async registerProject() {
      this.registering = true

      this.$store.dispatch('notifications/toastMessage', {
        message: 'Registering project...this may take a moment.',
      })
      if (this.formData.projectAddress && this.formData.country_code) {
        this.formData.city = this.formData.projectAddress.city
        this.formData.street = this.formData.projectAddress.street
        this.formData.state = this.formData.projectAddress.state
        this.formData.country = this.formData.projectAddress.country_code
        this.formData.postal_code = this.formData.projectAddress.postal_code

        this.formData.country_id = this.countries.find(
          (country) =>
            country.code === this.formData.projectAddress.country_code
        ).id
      } else {
        this.formData.country_id = this.countries.find(
          (country) => country.code === this.formData.ownerAddress.country_code
        ).id
      }
      // Bind company_id and owner organization to CompanyMultiSearch state
      this.formData.owner_org = this.company.name
      this.formData.company_id = this.company.id
      this.formData.owner_city = this.formData.ownerAddress.city
      this.formData.owner_street = this.formData.ownerAddress.street
      this.formData.owner_state = this.formData.ownerAddress.state
      this.formData.owner_country_code = this.formData.ownerAddress.country_code
      this.formData.owner_zip = this.formData.ownerAddress.postal_code

      this.formData.pricing_option = 'single-cycle'

      await this.$store.dispatch('project/registerProject', this.formData)
      await this.$router.push({
        path: `/projects/${this.project.type}/${this.project.project_number}/billing`,
        query: { ...this.$route.query },
      })
    },
  },
}
</script>
