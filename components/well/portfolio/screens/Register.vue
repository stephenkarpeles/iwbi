<template>
  <div>
    <WHeadingsHTwo class="text-primary-900 pb-3" heading="WELL Portfolio" />
    <!-- Modals -->
    <WFeedbackModal ref="billingModal" :can-manually-close="false">
      <div class="max-w-lg text-primary-900">
        <div
          class="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100"
        >
          <svg
            class="h-6 w-6 text-green-600"
            x-description="Heroicon name: check"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M5 13l4 4L19 7"
            ></path>
          </svg>
        </div>
        <WHeadingsHThree
          class="mx-auto flex items-center justify-center text-center"
          heading="Congratulations on taking the next step towards health and wellness
          within the built-environment."
        />
        <div class="flex flex-col">
          <WHeadingsHFour heading="Next Steps:" />

          <ul class="list-inside list-disc">
            <li>
              <span class="font-bold">Pay Registration Invoice:</span>
              <span
                >You can find your registration invoice under the Billing
                tab.</span
              >
            </li>
            <!-- button goes here -->
            <li class="font-bold">Sign Portfolio Agreement</li>
            <span
              >In order to start uploading the documentation, the portfolio
              owner needs to sign the WELL Portfolio agreement. The link will be
              visible in the dashboard after paying the enrollment
              invoice.</span
            >
          </ul>
          <WButtonsBase
            class="mt-2"
            type="primary"
            @click.native="
              () => {
                $refs.billingModal.isHidden = false
                $router.push(`/portfolio/${portfolio.portfolio_number}/billing`)
              }
            "
          >
            Go To Billing
          </WButtonsBase>
        </div>
      </div>
    </WFeedbackModal>

    <WFeedbackModal ref="discountModal" class="z-50">
      <div class="max-w-xl space-y-2 px-4">
        <WHeadingsHThree heading="Sector-specific discounts" />
        <ul class="list-inside list-disc">
          <li>
            <b>Government/Municipal Buildings:</b> Buildings that serve
            "government agencies", which are entities 100% owned by government
            and serve government function.
          </li>
          <li>
            <b>Schools:</b> Includes all educational facilities, such as public
            and private schools, primary and secondary and higher education.
          </li>
          <li>
            <b>Non-Profit, charitable organizations:</b> Tax exempt entities
            organized and operated exclusively for charitable purpose. The term
            "charitable" is based on relevant definition used under applicable
            non-profit legislation and includes relief for the poor, the
            distressed, or the underprivileged; advancement of religion;
            advancement of education or science; erecting or maintaining public
            buildings, monuments, or works; lessening the burdens of government;
            lessening neighborhood tensions; eliminating prejudice and
            discrimination; defending human and civil rights secured by law; and
            combating community deterioration and juvenile delinquency.
          </li>
          <li>
            <b>Low-Income / affordable housing:</b> Projects may be considered
            "low-income housing" for the purposes of WELL if at least 40% of
            units are reserved for households makings 60% or less than the area
            median income and if housing costs are deemed "affordable" for those
            households. Housing is defined as "affordable" when total cost of
            rent is no more than 33% of income; thus, total annual cost must not
            exceed 20% of area median income. The area median income (AMI) is
            the household income for the median — or middle — household in a
            region. The region should include the more-populated urban core and
            its less-populated surrounding territories, sharing industry,
            infrastructure, and housing.
          </li>
        </ul>
        <div class="flex w-full">
          <div class="mx-auto w-32">
            <WButtonsBase
              icon="x-circle"
              @click.native="$refs.discountModal.isHidden = true"
              >Close</WButtonsBase
            >
          </div>
        </div>
      </div>
    </WFeedbackModal>
    <!-- parent container -->
    <div
      class="flex rounded-md shadow-md border border-primary-200 mt-4 min-h-screen"
    >
      <div class="flex flex-col p-6 text-primary-900 w-1/2">
        <div id="formHeader" class="flex flex-col">
          <span class="text-2xl">Enroll</span>
          <span class="text-base opacity-50 mt-2"
            >The first step of the WELL Portfolio program is enrollment.
            Organizations will use this period to define their portfolio prior
            to activating their 5-year subscription. The enrollment fee* for
            participation is USD $25,000.
          </span>
        </div>
        <!-- Step 0 -->
        <div :class="{ hidden: currentStep !== 0 }">
          <FormulateForm class="flex flex-col space-y-2" @submit="validateStep">
            <WHeadingsHFour
              heading="Organization"
              sub-heading="Organization details and domain."
            />
            <!-- <FormulateInput
              v-model="formData.owner_org"
              type="text"
              label="Owner organization*"
              class="w-full"
              validation="required"
            /> -->
            <!-- New company input -->
            <FormulateInput
              v-model="company"
              type="companymultisearch"
              name="organization"
              label="Owner Organization*"
              validation="required"
              :searchable="true"
              :clearonselect="false"
              :closeonselect="true"
              :optionslimit="10"
            />
            <FormulateInput
              v-model="formData.owner_name"
              type="text"
              label="Owner Name*"
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
              label="Owner phone*"
              validation="required"
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
              placeholder="www.example.com"
              class="w-full"
            />
            <FormulateInput
              v-model="formData.overview"
              label="Organization overview"
              placeholder="Description"
              type="textarea"
            />

            <FormulateInput type="submit" label="Continue" class="w-full" />
          </FormulateForm>
        </div>

        <!-- Step 1 -->
        <div :class="{ hidden: currentStep !== 1 }">
          <FormulateForm class="flex flex-col space-y-2" @submit="validateStep">
            <WHeadingsHFour
              heading="Owner Address"
              sub-heading="Owner address details."
            />
            <FormInputsAddressFormulate
              :target="ownerAddress"
              :required="true"
            />
            <div class="flex w-full justify-between">
              <WHeadingsHFour
                heading="Billing Address"
                sub-heading="Billing address details."
              />
              <FormulateInput
                v-model="mailingEqualsBilling"
                class="mt-11 pt-1"
                type="checkbox"
                label="Same as owner address"
              />
            </div>
            <FormInputsAddressFormulate
              :target="mailingEqualsBilling ? ownerAddress : billingAddress"
              :disabled="mailingEqualsBilling"
              :required="true"
            />

            <div>
              <span class="text-sm opacity-50"
                >Does your portfolio contain locations that qualify for any of
                the following sector discounts?
              </span>
              <Flyout ref="conceptFlyout" y="bottom" x="right" class="h-full">
                <WButtonsBase
                  type="tooltip"
                  icon="question-mark-circle"
                  @click.native="$refs.discountModal.isHidden = false"
                />
                <template #content>
                  <div class="p-3 w-64">
                    The bulding sector below qualify for a 35% discount. Market
                    sectors are recognized by a project`s location. Click to
                    learn more.
                  </div>
                </template>
              </Flyout>
            </div>

            <FormulateInput
              v-model="sectorSelected"
              :options="discountOptions"
              type="select"
              placeholder="Please select"
            />
            <div class="flex w-full justify-between space-x-4">
              <WButtonsBase
                type="primaryInverted"
                @click.native="currentStep--"
              >
                Back
              </WButtonsBase>
              <FormulateInput type="submit" label="Continue" class="w-full" />
            </div>
          </FormulateForm>
        </div>

        <!-- Step 2 -->
        <div :class="{ hidden: currentStep !== 2 }">
          <FormulateForm class="flex flex-col space-y-2" @submit="validateStep">
            <WHeadingsHFour heading="Organizational confidentiality" />
            <div
              class="p-4 rounded-md border border-primary-300 min-h-32 overflow-y-auto"
            >
              <span class="text-sm opacity-50"
                >A portfolio may opt-out publicity opportunities and identifying
                publicly within the WELL organizational directory by electing to
                be considered as a “private portfolio” at the time of
                enrollment. A “private portfolio” means that the organization
                name, street address, and identity of the owner will not appear
                within the WELL organizational directory or in any IWBI
                materials. Organizations that elect to remain private cannot
                publicly promote their participation in the program and any WELL
                Portfolio ScoreTM earned by the owner cannot be displayed while
                the portfolio remains private. The privacy status of your
                portfolio and any related WELL Portfolio Scores can be changed
                at any time, entirely at the discretion of the owner.</span
              >
            </div>
            <FormulateInput
              v-model="formData.portfolio_public"
              class="mt-4"
              :options="{
                1: 'Yes',
                0: 'No',
              }"
              type="radio"
              label="Is this portfolio public?*"
              validation="required"
            />
            <div class="flex w-full justify-between space-x-4">
              <WButtonsBase
                type="primaryInverted"
                @click.native="currentStep--"
              >
                Back
              </WButtonsBase>
              <WButtonsBase v-if="submitting" :type="'primaryInverted'">
                <span>
                  <WLoadingSpinner type="button" class="mx-auto" />
                </span>
              </WButtonsBase>
              <FormulateInput
                v-else
                type="submit"
                label="Enroll"
                class="w-full"
              />
            </div>
          </FormulateForm>
        </div>
      </div>
      <div
        class="text-primary-900 flex flex-col space-y-6 bg-cover bg-center p-6 rounded-r-md w-1/2"
        :style="{ backgroundImage: 'url(/portfolio/screen/enrolbgcard.jpg)' }"
      >
        <span class="text-2xl">Expanded pricing equity</span>
        <div
          v-for="(card, index) in priceEquityCards"
          :key="index"
          class="flex flex-col"
        >
          <span class="text-xl mb-2">{{ card.title }}</span>
          <span class="text-sm">{{ card.description }}</span>
          <span v-if="card.footer" class="text-secondary-700 text-sm mt-1">{{
            card.footer
          }}</span>
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
      submitting: false,
      formData: {
        portfolio_public: 1,
      },
      company: null,
      company_id: '',
      organization: '',
      ownerAddress: {},
      billingAddress: {},
      mailingEqualsBilling: false,
      sectorSelected: null,
      currentStep: 0,
      priceEquityCards: [
        {
          title: 'Begin today',
          description:
            'The first step of the WELL Portfolio program is enrollment. Organizations will use this period to define their portfolio prior to activating their 5-year subscription.',
          footer: 'The enrollment fee* for participation is USD $25,000.',
        },
        {
          title: 'Market discount',
          description:
            'For projects in countries defined as lower-middle- and low-income countries according to the Atlas Method, an indicator of income developed by the World Bank, we’re pleased to extend a 35% discount on enrollment and certification fees.',
        },
        {
          title: 'Sector discounts',
          description:
            'We’re also introducing a 35% discount for education, non-profits and affordable housing, along with government agency facilities.',
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
      discountOptions: [
        { value: null, label: 'Not Applicable' },
        {
          value: 'government/municipal-buildings',
          label: 'Government/Municipal Buildings',
        },
        {
          value: 'low-income/affordable-housing',
          label: 'Low-Income / affordable housing',
        },
        {
          value: 'non-profit-charitable-organizations',
          label: 'Non-Profit, charitable organizations',
        },
        { value: 'small-business', label: 'Small Business' },
        { value: 'schools', label: 'Schools' },
        { value: 'healthcare-facilities', label: 'Healthcare Facilities' },
      ],
    }
  },
  computed: {
    ...mapState({
      portfolio: (state) => state.portfolio.portfolio,
    }),
  },
  methods: {
    validateStep() {
      // scroll the page to the top
      this.$parent.$parent.$parent.$refs.content.scrollTop = 0

      if (this.currentStep === 2) {
        this.submitForm()
      } else {
        this.currentStep++
      }
    },
    submitForm() {
      this.submitting = true
      // owner, billing
      const data = { ...this.portfolio, ...this.formData }
      if (this.mailingEqualsBilling) {
        data.billing_city = this.ownerAddress.city
        data.billing_country_code = this.ownerAddress.country_code
        data.billing_postal_code = this.ownerAddress.postal_code
        data.billing_state = this.ownerAddress.state
        data.billing_street = this.ownerAddress.street
      } else {
        data.billing_city = this.billingAddress.city
        data.billing_country_code = this.billingAddress.country_code
        data.billing_postal_code = this.billingAddress.postal_code
        data.billing_state = this.billingAddress.state
        data.billing_street = this.billingAddress.street
      }

      if (this.sectorSelected) {
        data.estimate_sector = this.sectorSelected.value
      }

      // company/organization
      if (
        this.company &&
        this.company !== '' &&
        this.company.id &&
        this.company.name
      ) {
        data.company_id = this.company.id
        data.organization = this.company.name
      }
      // this.company_id = this.company.id
      // this.organization = this.company.name
      // this.formData.owner_org = this.company.name

      // data.owner
      data.owner_city = this.ownerAddress.city
      data.owner_country_code = this.ownerAddress.country_code
      data.owner_postal_code = this.ownerAddress.postal_code
      data.owner_state = this.ownerAddress.state
      data.owner_street = this.ownerAddress.street

      // verify length ,of portfolio location
      if (this.portfolio?.location?.length) {
        data.location = this.portfolio.location.map((e) => {
          return e
        })
      }

      // discount sector
      data.estimate_sector = this.sectorSelected
      this.$store
        .dispatch('portfolio/registerPortfolio', {
          id: this.portfolio.id,
          data,
        })
        .then((res) => {
          this.$refs.billingModal.isHidden = false
        })
    },
  },
}
</script>
