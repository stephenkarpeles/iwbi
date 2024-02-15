<template>
  <div>
    <div>
      <div class="">
        <div class="relative bg-white p-5 rounded-lg">
          <WHeadingsHThree
            class="mb-2"
            heading="Confirm your enrollment fees"
          />
          <div
            v-if="
              checkInviteAccess === 'portfolio-member' ||
              checkInviteAccess === 'portfolio-pta'
            "
            class="
              bg-primary-100
              text-primary-600
              border border-primary-600
              rounded
              p-1
            "
          >
            Only Project Administrators are allowed to opt-in for WELL Health
            Safety. Once the project has opted-in, all the team members can
            contribute to the Health Safety scorecard and documentation. Please
            reach out to your project admin to complete the WELL Health-Safety
            enrollment.
          </div>

          <FormulateForm @submit="optHsr('terms')">
            <div class="mb-5">
              <FormulateInput
                v-model="reviewType"
                type="select"
                name="doc-submit-phase"
                label="Will you submit documentation for your rating and WELL Certification together?"
                placeholder="Select option"
                validation="required"
                :options="[
                  {
                    value: 1,
                    label: 'Yes, we will submit both during the same review.',
                  },
                  {
                    value: 0,
                    label: 'No, we will initiate a separate review cycle.',
                  },
                ]"
              />
            </div>
            <div class="mb-5">
              <FormulateInput
                v-model="allLocations"
                type="select"
                name="doc-submit-phase"
                label="Are all locations currently included in your subscribed portfolio*"
                placeholder="Select option"
                validation="required"
                :options="allLocationsOptions"
              />
            </div>
            <div class="mt-5 text-sm">
              <p
                class="
                  mb-5
                  bg-secondary-100
                  text-secondary-600
                  border border-secondary-600
                  rounded
                  p-2
                "
              >
                *Subscribed portfolios can choose to submit their WELL
                Health-Safety Rating documents in one of their two available
                annual reviews at no additional fee. Locations seeking a rating
                with this documentation must be included in the defined
                portfolio or would need to pay for their enrollment according to
                this pricing table.
              </p>
              <p class="mb-5">Eligible discounts can be applied to this fee.</p>
            </div>

            <div class="flex justify-between">
              <div>
                <span class="font-bold">Enrollment fee</span>
              </div>
              <div>
                <span v-if="reviewType == 1" class="font-bold"
                  >Included<sup>*</sup></span
                >
              </div>
            </div>
            <div>
              <div>
                <ul class="list-disc pl-5 text-sm mb-2.5 font-light leading-5">
                  <li>Support from our technical experts</li>
                  <li>
                    Resources to inform your health-focused strategies and
                    actions
                  </li>
                  <li>Third-party documentation review</li>
                </ul>
              </div>
              <div class="mt-5">
                <div class="mb-5">
                  <FormulateInput
                    v-model="reviewChecked"
                    name="terms"
                    type="checkbox"
                    :label="
                      reviewType == 1
                        ? 'Yes, we plan to submit our documents under one review and understand that if my project would like to change this decision, we will incur additional fees.'
                        : 'Yes, we plan to submit our documents in a separate review cycle and understand that this will incur additional fees. '
                    "
                    validation="required"
                    class="px-3 py-5 text-sm font-bold"
                  />
                </div>
              </div>
              <div class="flex justify-end">
                <div class="text-sm font-bold">ENROLLMENT TOTAL</div>
              </div>
              <div class="flex justify-end">
                <div v-if="reviewType == 1" class="text-primary-600 font-bold">
                  $0
                </div>
                <div v-else class="text-primary-600 font-bold text-uppercase">
                  Pending Quote
                </div>
              </div>
            </div>
            <div class="flex justify-center mt-10">
              <FormulateInput
                class="mt-3"
                type="submit"
                :name="
                  reviewType == 1 ? 'View terms and conditions' : 'Proceed'
                "
              />
            </div>
          </FormulateForm>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapState, mapMutations, mapActions } from 'vuex'
export default {
  data() {
    return {
      country: '',
      reviewChecked: '',
      allLocationsOptions: [
        { value: 1, label: 'Yes' },
        { value: 0, label: 'No' },
      ],
      reviewType: 1,
      allLocations: '1',
    }
  },
  computed: {
    ...mapState({
      pricingDetails: (state) => state.portfolio.pricingDetails,
      checkInviteAccess: (state) => state.portfolio.checkInviteAccess,
      portfolioMembers: (state) => state.portfolio.portfolioMembers,
      portfolio: (state) => state.portfolio.portfolio,
      currentUser: (state) => state.user.currentUser,
      countries: (state) => state.address.countries,
    }),
    checkInviteAccess() {
      let userRole = ''
      for (let i = 0; i < this.portfolioMembers.length; i++) {
        if (this.currentUser.email === this.portfolioMembers[i].email) {
          userRole = this.portfolioMembers[i].pivot.role
        }
      }
      return userRole
    },
  },
  mounted() {
    if (this.portfolio && this.portfolio.hsr_opt) {
      this.reviewType = this.$store.state.portfolio.portfolio.hsr_review
      this.allLocations = this.allLocationsOptions.filter(
        (a) => parseInt(a.value) === this.portfolio.hsr_all_location
      )[0].value
    }
    if (this.portfolio.id && this.portfolio.addresses) {
      const pAddress = this.portfolio.addresses.findIndex((a) => a.is_shipping)

      this.country = this.countries.filter(
        (a) => a.code === this.portfolio.addresses[pAddress].country_code
      )[0].code
    }
    this.getPricing()
  },
  methods: {
    ...mapActions('portfolio', [
      'detailsForExistingPortfolio',
      'optInHsr',
      'getPortfolio',
      'getPricingDetails',
    ]),
    ...mapMutations('portfolio', ['setMode', 'setCurrentStep']),
    optHsr(index) {
      if (!this.reviewChecked) {
        this.reviewChecked = ''
      }
      this.detailsForExistingPortfolio({
        hsr_opt: 1,
        hsr_review: this.reviewType,
        hsr_all_location: this.allLocations,
      })
      if (parseInt(this.reviewType) === 1) {
        this.setMode(index)
        this.setCurrentStep('2')
      } else {
        this.optInHsr({ id: this.portfolio.id })
        this.getPortfolio({ id: this.$route.params.id, type: 'v2-pilot' })
        this.setMode(index)
      }
    },
    getPricing() {
      this.getPricingDetails()
    },
  },
}
</script>
