<template>
  <div>
    <WFeedbackModal ref="modal" :can-manually-close="false">
      <div class="max-w-lg mx-10 my-5">
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
        <WHeadingsHFour heading="Creating your new portfolio account now..." />
      </div>
    </WFeedbackModal>

    <WSlideoversOverlay
      ref="slideover"
      title="Minimum Requirements"
      class="z-40"
    >
      <template #content>
        <div class="text-gray-600 p-6 space-y-4">
          <p>
            WELL Portfolio is suitable for organizations who wish to engage with
            the WELL Building Standard in an ongoing way, applying health and
            well-being alternatives over time throughout their locations. WELL
            Portfolio members submit documentation that reflects these
            organizational commitments and earn recognition through a WELL
            Portfolio Score, as well as earning WELL Precertification and WELL
            Certification milestones at individual locations along the way.
          </p>
          <p>
            A defined portfolio must contain at least 10 projects, unless the
            member’s total global portfolio contains fewer than 10 projects, in
            which case the minimum project count is two. New construction
            locations that qualify for inclusion in the defined portfolio may be
            added to the portfolio at any time throughout the design or
            construction phase, but their inclusion is only required at the
            point of substantial completion of construction.
          </p>
        </div>
      </template>
    </WSlideoversOverlay>

    <NavBreadcrumbs>
      <WHeadingsHTwo class="text-primary-900" heading="WELL Portfolio" />
    </NavBreadcrumbs>
    <div class="mt-3 flex space-x-4 border border-primary-200 rounded-lg">
      <div class="w-full lg:w-1/2 p-4 space-y-8">
        <WHeadingsHThree
          class="text-primary-900"
          heading="Let's get this started"
          sub-heading="Transform your organization - and the future of health - when you apply proven wellness strategies at scale."
        />
        <a
          href="https://well.support/ff9102ed-5a44-4f72-adef-2ba55973b18a"
          target="_blank"
        >
          <div
            class="cursor-pointer bg-primary-800 hover:opacity-90 flex w-full bg-cover bg-center rounded-lg shadow-lg h-36 p-4 border border-primary-200"
            style="background-image: url('/portfolio/create/card.jpg')"
          >
            <div class="my-auto">
              <div class="uppercase text-primary-600 font-semibold text-sm">
                Getting Started
              </div>
              <div class="mb-2 font-bold text-2xl text-primary-800">
                Minimum Requirements
              </div>
              <WLinksBase
                icon="arrow-narrow-right"
                type="secondary"
                icon-position="right"
                target="_blank"
                link="https://well.support/ff9102ed-5a44-4f72-adef-2ba55973b18a"
              >
                View Requirements
              </WLinksBase>
            </div>
          </div>
        </a>

        <FormulateForm class="space-y-4 mt-4" @submit="createPortfolio">
          <FormulateInput
            v-model="formData.name"
            type="text"
            label="Portfolio name*"
            validation="required"
          />
          <!-- New org input one previously did not exist -->
          <FormulateInput
            v-model="company"
            type="companymultisearch"
            name="organization"
            label="Organization*"
            validation="required"
            :searchable="true"
            :clearonselect="false"
            :closeonselect="true"
            :optionslimit="10"
          />
          <div class="mt-5 text-sm font-medium leading-5 text-primary-800">
            Gross Area<sup>*</sup>
          </div>
          <div class="w-full relative">
            <FormulateInput
              v-model="formData.area"
              type="number"
              min="0"
              step=".01"
              placeholder="Area (in sq ft)"
              validation="required|number"
              @keyup="calcSqM()"
            />
            <div
              class="absolute right-0 top-0 flex h-10 bg-primary-100 text-primary-400 border border-primary-300 rounded-r"
            >
              <div class="my-auto px-3">ft<sup>2</sup></div>
            </div>
          </div>
          <div class="w-full relative mt-3">
            <FormulateInput
              v-model="formData.area_in_meter"
              type="number"
              min="0"
              step=".01"
              placeholder="Area (in sq m)"
              validation="required|number"
              @keyup="calcSqFt()"
            />
            <div
              class="absolute right-0 top-0 flex h-10 bg-primary-100 text-primary-400 border border-primary-300 rounded-r"
            >
              <div class="my-auto px-3">m<sup>2</sup></div>
            </div>
          </div>
          <FormulateInput
            v-model="formData.no_of_assets"
            type="number"
            label="Approximately how many locations will be in this portfolio?*"
            min="1"
            validation="required"
          />
          <div>
            <label
              for="applicablePart"
              class="w-full text-sm font-bold leading-5 text-gray-700 sm:mt-px sm:pt-2"
              >Where is your portfolio primarily located? (Select all that
              apply)*</label
            >
            <ClientOnly>
              <FormulateInput
                v-model="formData.location"
                :multiple="true"
                :options="[
                  { label: 'Africa', value: 'Africa' },
                  {
                    label: 'Australia & New Zealand',
                    value: 'Australia & New Zealand',
                  },
                  {
                    label:
                      'China, Northeast Asia,Central Asia & Southeast Asia',
                    value:
                      'China, Northeast Asia,Central Asia & Southeast Asia',
                  },
                  {
                    label: 'India & Middle East',
                    value: 'India & Middle East',
                  },
                  { label: 'Europe', value: 'Europe' },
                  { label: 'North America', value: 'North America' },
                  { label: 'South America', value: 'South America' },
                ]"
                name="applicablePart"
                validation="required"
                track-by="value"
                type="multi"
              />
            </ClientOnly>
          </div>
          <div class="bg-white shadow overflow-hidden sm:rounded-lg">
            <div class="px-4 py-5 sm:px-6">
              <h3 class="text-md leading-6 font-medium text-gray-900">
                Owner Address
              </h3>
            </div>
            <div class="border-t border-gray-200 px-4 py-5">
              <FormInputsAddressFormulate
                :required="true"
                :address="formData.address"
                :target="formData.address"
              />
            </div>
          </div>
          <FormulateInput
            v-model="formData.estimate_sector"
            :options="[
              { value: '', label: 'Not Applicable' },
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
              {
                value: 'healthcare-facilities',
                label: 'Healthcare Facilities',
              },
            ]"
            label="Does your project qualify for any of these market sectors?"
            type="select"
          >
            <template slot="label">
              <label
                class="text-sm font-bold leading-5 text-gray-700 sm:mt-px sm:pt-2"
                >Does your portfolio contain locations that qualify for any of
                the following sector discounts?*
                <Flyout ref="conceptFlyout" y="bottom" x="right" class="h-full">
                  <WButtonsBase type="tooltip" icon="question-mark-circle" />
                  <template #content>
                    <div class="p-3 w-max">
                      The building sectors below qualify for a qualify for a 35%
                      discount. Market sectors are recognized by a project's
                      location.
                    </div>
                  </template>
                </Flyout>
              </label>
            </template>
          </FormulateInput>

          <FormulateInput
            v-if="formData.estimate_sector !== ''"
            type="checkbox"
            validation="required"
            name="Agreement to the terms above"
            label="By checking this box, Portfolio Owner hereby confirms it has reviewed and understands eligibility for market and building sector discounts as set forth on the WELL v2 Pricing page at https://www.wellcertified.com/certification/v2/pricing and that it meets such eligibility requirements for the applicable market or building sector discount it has identified. IWBI reserves the right to request Portfolio Owner to submit documentation at any time to substantiate it meets eligibility criteria for applicable market or building sector discount, and Portfolio Owner acknowledges and agrees that IWBI may at any time revoke any market or building sector discount in the event IWBI learns the Portfolio does not meet eligibility criteria for applicable market or building sector discount."
          />

          <FormulateInput class="mt-5" type="submit" label="Create Portfolio" />
        </FormulateForm>
      </div>
      <div
        class="lg:w-1/2 bg-cover flex"
        style="background-image: url('/portfolio/create/bg.jpg')"
      ></div>
    </div>
  </div>
</template>
<script>
import { createNamespacedHelpers } from 'vuex'

const { mapState } = createNamespacedHelpers('user')
export default {
  asyncData({ store }) {
    return {
      currentUser: store.state.user.currentUser,
    }
  },
  data() {
    return {
      company: null,
      formData: {
        name: '',
        area: '',
        company_id: '',
        organization: '',
        area_in_meter: '',
        location: [],
        no_of_assets: '',
        type: 'v2',
        estimate_sector: '',
        address: {
          country_code: '',
          state: '',
          street: '',
          city: '',
          postal_code: '',
        },
      },
    }
  },
  head() {
    return {
      title: `Create a Portfolio`,
    }
  },
  computed: {
    ...mapState(['currentUser', 'countries', 'states']),
    reviewStatus() {
      return 'complete'
    },
    paymentStatus() {
      return 'complete'
    },
    submitStatus() {
      return 'complete'
    },
  },
  mounted() {
    this.company = {
      id: this.currentUser.company_id,
      name: this.currentUser.organization,
    }
  },
  methods: {
    gotoNextStep() {
      this.$router.push('/portfolio/create')
    },
    createPortfolio() {
      this.$refs.modal.isHidden = false

      this.formData.owner_country_code = this.formData.address.country_code
      this.formData.owner_city = this.formData.address.city
      this.formData.owner_state = this.formData.address.state
      this.formData.owner_street = this.formData.address.street
      this.formData.owner_postal_code = this.formData.address.postal_code
      if (
        this.company &&
        this.company !== '' &&
        this.company.id &&
        this.company.name
      ) {
        this.formData.company_id = this.company.id
        this.formData.organization = this.company.name
      }
      const payload = JSON.parse(JSON.stringify(this.formData))
      payload.location = this.formData.location.map((e) => {
        return e.value
      })
      this.$store.dispatch('portfolio/createPortfolio', payload)
    },
    calcSqM() {
      if (this.formData.area) {
        this.formData.area_in_meter = Number.parseFloat(
          this.formData.area * 0.092903
        ).toFixed(2)
      } else {
        this.formData.area_in_meter = 0
      }
    },
    calcSqFt() {
      if (this.formData.area_in_meter) {
        this.formData.area = Number.parseFloat(
          this.formData.area_in_meter * 10.7639
        ).toFixed(2)
      } else {
        this.formData.area = 0
      }
    },
  },
}
</script>
