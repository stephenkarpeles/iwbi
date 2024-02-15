<template>
  <div
    v-if="pricingDetails"
    class="w-shared-workspace-gradient relative bg-white rounded-lg shadow-md"
  >
    <LazyWFeedbackModal ref="downloadModal">
      <div class="mx-auto text-center">
        <WLoadingSpinner class="mx-auto" />
        <div class="mt-3 text-primary-600">Downloading your invoice...</div>
        <div class="text-sm text-gray-400">
          Please be patient, this may take a moment.
        </div>
      </div>
    </LazyWFeedbackModal>
    <LazyWFeedbackModal ref="modal">
      <div class="mx-auto text-center">
        <div class="mt-3 text-primary-600">
          Please confirm that you’d like to generate a PDF invoice for payment
          purposes.
        </div>
        <div class="flex mt-5">
          <WButtonsBase @click.native="downloadInvoice()"
            >Download invoice</WButtonsBase
          >
          <WButtonsBase
            class="ml-2"
            type="primaryInverted"
            @click.native="$refs.modal.isHidden = true"
            >Not now</WButtonsBase
          >
        </div>
      </div>
    </LazyWFeedbackModal>
    <div v-if="pricingDetails" class="rounded-lg">
      <div class="py-8">
        <div class="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="flex justify-between">
            <WHeadingsHTwo
              class="space-y-6"
              heading="Confirm your enrollment fee"
            ></WHeadingsHTwo>
          </div>
          <div
            v-if="showPricing"
            class="w-full divide-y divide-gray-300 space-y-2"
          >
            <div class="w-full">
              <div class="flex">
                <WHeadingsHFour
                  class="w-full"
                  :heading="
                    sharedWorkspace.no_of_asstes > 1
                      ? 'Multiple locations'
                      : 'Enrollment Fee'
                  "
                ></WHeadingsHFour>
                <span
                  class="flex justify-end w-full mt-2 text-xl leading-7 text-primary-700"
                  >${{
                    pricingDetails.amount_without_discount | formatNumber
                  }}*</span
                >
              </div>
              <div v-if="pricingDetails.per_property_amount" class="w-full">
                <p
                  v-if="sharedWorkspace.no_of_assets > 1"
                  class="text-sm text-gray-500 relative"
                >
                  {{ sharedWorkspace.no_of_assets }} locations, ${{
                    pricingDetails.per_property_amount.toFixed(2)
                  }}
                  USD per
                  <Flyout
                    :show-triangle="false"
                    y="bottom"
                    x="right"
                    class="h-full flex mt-2"
                  >
                    <WLinksBase type="primaryInverted" class="text-primary-600">
                      location</WLinksBase
                    >
                    <template #content>
                      <div class="">
                        <h3
                          class="p-4 text-center bg-primary-100 text-xl text-primary-700 mb-2 py-2"
                        >
                          Number of Locations
                        </h3>
                        <div
                          class="p-4 opacity-50 leading-6 text-sm text-primary-900 font-light"
                        >
                          <p>
                            The total number of locations that will be submitted
                            for review as part of a single application. Must
                            share an owner to be considered part of the same
                            application.
                          </p>
                          <p
                            class="text-primary-600 text-sm whitespace-normal md:whitespace-nowrap"
                          >
                            Price reductions apply to multi-location
                            applications.
                          </p>
                        </div>
                      </div>
                    </template>
                  </Flyout>
                </p>
                <p class="md:w-1/2 text-gray-500 text-sm">Includes:</p>
                <ul class="md:w-1/2 text-gray-500 text-sm mb-5 pl-0 md:pl-5">
                  <li>Dynamic digital WELL online dashboard</li>
                  <li>
                    Global team of technical experts through the community forum
                  </li>
                  <li>Curated technical tools and resources</li>
                  <li>Third-party documentation and performance review</li>
                  <li>Promotional awards package</li>
                </ul>
                <p class="text-gray-500 text-sm mb-2">
                  *Onsite performance testing & data collection fees are
                  variable and dependent upon the features and parts a project
                  pursues.
                </p>
              </div>
            </div>
            <FormulateForm @submit="next">
              <div v-if="!processingDiscount">
                <div
                  v-if="
                    pricingDetails.applicable_sector_discount ||
                    pricingDetails.applicable_membership_level_discount
                  "
                >
                  <WHeadingsHFour
                    heading="*Eligible discounts"
                  ></WHeadingsHFour>
                  <p class="text-gray-500 text-sm mb-2">
                    We detected you may be eligible for the following discounts.
                    Please confirm you meet the criterias by checking the box
                    below.
                  </p>
                  <div v-if="pricingDetails.applicable_sector_discount">
                    <div class="md:flex mt-2 relative">
                      <div class="flex-1 md:w-3/4">
                        <div class="mt-2 text-xl leading-7 font-semibold">
                          <Flyout
                            :show-triangle="false"
                            y="bottom"
                            x="left"
                            class="h-full flex mt-2"
                          >
                            <WLinksBase
                              type="primaryInverted"
                              class="text-primary-600"
                            >
                              {{ pricingDetails.applicable_sector_discount
                              }}<span class="text-primary-900">
                                &#160;discount</span
                              ></WLinksBase
                            >

                            <template #content>
                              <div class="">
                                <h3
                                  class="p-4 text-center bg-primary-100 text-xl text-primary-700 mb-2 py-2"
                                >
                                  {{ sectorDiscountHeading }}
                                </h3>
                                <div
                                  class="p-4 opacity-50 leading-6 text-sm text-primary-900 font-light"
                                  v-html="sectorDiscountCaption"
                                ></div>
                              </div>
                            </template>
                          </Flyout>
                        </div>
                      </div>
                      <div
                        v-if="pricingDetails.applicable_sector_discount_amount"
                        class="text-gray-500 ml-0 md:ml-10 mb-2 text-sm block md:hidden"
                      >
                        35% reduction in enrollment fees.
                      </div>
                      <span
                        class="flex justify-end md:w-1/4 mt-2 text-xl leading-7 text-gray-700"
                        :class="
                          pricingDetails.opt_out_market_sector_discount
                            ? 'line-through'
                            : ''
                        "
                        >- ${{
                          pricingDetails.applicable_sector_discount_amount
                            | formatNumber
                        }}
                        <Flyout
                          :show-triangle="false"
                          y="bottom"
                          x="left"
                          class="h-full flex mt-1 md:mt-0"
                        >
                          <WIconsBase
                            :disabled="processingDiscount"
                            :icon="
                              !pricingDetails.sector_discount ? 'x' : 'trash'
                            "
                            class="text-primary-600"
                            @click.native="removeDiscountType('country-sector')"
                          >
                          </WIconsBase>

                          <template #content>
                            <div
                              class="p-2 leading-6 text-sm text-primary-600 whitespace-nowrap"
                            >
                              {{
                                !pricingDetails.sector_discount
                                  ? 'Apply Discount'
                                  : 'Remove Discount'
                              }}
                            </div>
                          </template>
                        </Flyout>
                      </span>
                    </div>
                    <div
                      v-if="pricingDetails.applicable_sector_discount_amount"
                      class="text-gray-500 ml-10 mb-2 text-sm hidden md:block"
                    >
                      35% reduction in enrollment fees.
                    </div>
                  </div>
                  <div
                    v-if="pricingDetails.applicable_membership_level_discount"
                  >
                    <div class="md:flex mt-2 relative justify-between">
                      <div class="mt-2 text-xl leading-7 font-semibold">
                        <div>
                          <Flyout
                            :show-triangle="false"
                            y="bottom"
                            x="left"
                            class="h-full flex mt-2"
                          >
                            <WLinksBase
                              type="primaryInverted"
                              class="text-primary-600"
                            >
                              {{ pricingDetails.applicable_membership_level }}
                              Membership</WLinksBase
                            >
                            &#160;discount
                            <br />

                            <template #content>
                              <div>
                                <h3
                                  class="p-4 text-center bg-primary-100 text-xl text-primary-700 mb-2 py-2"
                                >
                                  IWBI Membership
                                </h3>
                                <div
                                  class="p-4 opacity-50 leading-6 text-sm text-primary-900 font-light"
                                >
                                  <p>
                                    IWBI Members are eligible for additional
                                    discounts on the WELL Ratings, up to 25%.
                                  </p>
                                  <p>
                                    For WELL Portfolio Members, projects that
                                    are a part of your existing Portfolio can
                                    enroll into the WELL Ratings free of charge.
                                    For other projects, a 25% discount applies.
                                  </p>
                                </div>
                              </div>
                            </template>
                          </Flyout>
                          <div class="text-sm">
                            <span class="text-primary-600"
                              >{{ pricingDetails.applicable_membership_level }}
                              Member:
                            </span>
                            {{ pricingDetails.org_name }} |
                            <span class="text-primary-600">{{
                              $dayjs(pricingDetails.org_ends_at).format(
                                'MMM DD, YYYY'
                              )
                            }}</span>
                          </div>
                        </div>
                      </div>
                      <div
                        v-if="
                          pricingDetails.applicable_membership_level ===
                          'Cornerstone'
                        "
                        class="text-gray-500 ml-0 md:ml-10 mb-2 text-sm block md:hidden"
                      >
                        15% reduction in enrollment fees.
                      </div>
                      <div
                        v-if="
                          pricingDetails.applicable_membership_level ===
                            'Keystone' ||
                          pricingDetails.applicable_membership_level ===
                            'Portfolio'
                        "
                        class="text-gray-500 ml-0 md:ml-5 mb-5 text-sm block md:hidden"
                      >
                        25% reduction in enrollment fees.
                      </div>

                      <span
                        class="flex justify-end md:w-1/4 mt-2 text-xl leading-7 text-gray-700 items-center"
                        :class="
                          pricingDetails.opt_out_membership_discount
                            ? 'line-through'
                            : ''
                        "
                        >- ${{
                          pricingDetails.applicable_membership_level_discount
                            | formatNumber
                        }}

                        <Flyout
                          :show-triangle="false"
                          y="bottom"
                          x="left"
                          class="h-full flex mt-1 md:mt-0"
                        >
                          <WIconsBase
                            :disabled="processingDiscount"
                            :icon="
                              !pricingDetails.opt_out_membership_discount
                                ? 'trash'
                                : 'x'
                            "
                            class="text-primary-600"
                            @click.native="removeDiscountType('membership')"
                          />

                          <template #content>
                            <div
                              class="p-2 leading-6 text-sm text-primary-600 whitespace-nowrap"
                            >
                              {{
                                pricingDetails.opt_out_membership_discount
                                  ? 'Apply Discount'
                                  : 'Remove Discount'
                              }}
                            </div>
                          </template>
                        </Flyout>
                      </span>
                    </div>
                    <div
                      v-if="
                        pricingDetails.applicable_membership_level ===
                        'Cornerstone'
                      "
                      class="text-gray-500 ml-0 md:ml-10 mb-2 text-sm hidden md:block"
                    >
                      15% reduction in enrollment fees.
                    </div>
                    <div
                      v-if="
                        pricingDetails.applicable_membership_level ===
                          'Keystone' ||
                        pricingDetails.applicable_membership_level ===
                          'Portfolio'
                      "
                      class="text-gray-500 ml-5 mb-5 text-sm hidden md:block"
                    >
                      25% reduction in enrollment fees.
                    </div>
                  </div>
                  <div
                    v-if="
                      pricingDetails.sector_discount ||
                      pricingDetails.membership_level
                    "
                    class="mt-5 flex justify-end mb-4"
                  >
                    <FormulateInput
                      v-model="sectorDiscountVerified"
                      type="checkbox"
                      class="ml-5"
                      validation="required"
                      label="Yes, my organization meets the criteria of the listed discount category.*"
                    ></FormulateInput>
                  </div>
                </div>
              </div>
              <div v-else>
                <div class="mx-auto text-center pb-10">
                  <WLoadingSpinner class="mx-auto mt-10" />
                  <div class="mt-3 text-primary-600">Loading discounts...</div>
                </div>
              </div>
              <div class="border-t border-gray-300">
                <div
                  v-if="
                    !pricingDetails.coupon_code_discount && !applyingDiscount
                  "
                >
                  <WHeadingsHFour class="mt-4" :heading="'Discount Code'" />
                  <div class="md:flex justify-between">
                    <div class="md:w-1/2">
                      <FormulateInput
                        v-model="discountCode"
                        type="text"
                        placeholder="Enter discount code"
                        @keypress.enter="verifyDiscount()"
                      />
                    </div>
                    <div class="md:w-1/4">
                      <WButtonsBase
                        icon="check-circle-small"
                        @click.native="verifyDiscount()"
                        >Apply</WButtonsBase
                      >
                    </div>
                  </div>
                </div>
                <div
                  v-if="
                    pricingDetails.coupon_code_discount && !applyingDiscount
                  "
                >
                  <WHeadingsHFour class="mt-5" :heading="'Discount Code'" />
                  <div class="flex justify-between items-baseline mb-5">
                    <div class="flex">
                      <div>
                        Applied discount code:&nbsp;
                        <span class="font-bold">{{ discountCode }}</span>
                        <div class="mt-2 text-primary-600 ml-5">
                          {{
                            pricingDetails.coupon_code_discount
                              ? pricingDetails.coupon_code_discount
                              : ''
                          }}
                        </div>
                      </div>
                    </div>
                    <span
                      class="md:flex justify-end break-words w-1/4 mt-2 text-xl leading-7 text-gray-700"
                    >
                      - ${{ pricingDetails.coupon_code_amount | formatNumber }}
                      <WIconsBase
                        icon="trash"
                        class="text-primary-600"
                        @click.native="removeDiscount"
                      />
                    </span>
                  </div>
                </div>
                <div v-if="applyingDiscount">
                  <div class="mx-auto text-center pb-10">
                    <WLoadingSpinner class="mx-auto mt-10" />
                    <div class="mt-3 text-primary-600">
                      Loading discounts...
                    </div>
                  </div>
                </div>
              </div>
              <div class="border-t border-gray-300">
                <div class="flex-col">
                  <div
                    class="text-md text-primary-900 font-semibold leading-7 text-xl mt-5 flex justify-end"
                  >
                    Enrollment Total
                  </div>
                  <div
                    class="text-2xl text-primary-600 font-semibold flex justify-end"
                  >
                    ${{ pricingDetails.amount | formatNumber }}
                  </div>
                </div>
              </div>
              <div class="mt-5">
                <div>
                  <div
                    class="md:flex align-items-start justify-between space-x-0 md:space-x-2"
                  >
                    <div class="md:w-1/4 my-auto mt-5">
                      <WButtonsBase
                        type="primaryInverted"
                        @click.native="downloadQuote"
                      >
                        <WIconsBase icon="download" />
                        <span class="ml-10">Official quote</span>
                      </WButtonsBase>
                    </div>
                    <div class="md:flex justify-end space-x-0 md:space-x-10">
                      <div class="md:w-48 mt-2 md:mt-5">
                        <WButtonsDropdown>
                          <WButtonsBase
                            type="primaryInverted"
                            @click.native="$router.push('/wpr')"
                          >
                            Save for later
                          </WButtonsBase>
                        </WButtonsDropdown>
                      </div>
                      <div class="md:w-48 my-auto mt-5">
                        <WButtonsBase
                          type="primaryInverted"
                          @click.native="
                            $store.dispatch(
                              'shared/setActiveTab',
                              'LOCATION INFORMATION'
                            )
                          "
                        >
                          Back
                        </WButtonsBase>
                      </div>
                      <div class="md:w-48 my-auto">
                        <FormulateInput
                          class="mt-5 flex-1"
                          type="submit"
                          label="Continue"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </FormulateForm>
          </div>
          <div v-else>
            <div class="flex">
              <WHeadingsHFour
                class="flex-1 w-4/4"
                heading="Enrollment Fee"
              ></WHeadingsHFour>
              <span
                class="flex justify-end w-1/4 mt-2 text-xl leading-7 font-semibold"
                >Custom<sup>*</sup></span
              >
            </div>
            <div v-if="pricingDetails.per_property_amount" class="flex mt-5">
              <div class="flex-1 md:w-3/4">
                <p v-if="sharedWorkspace.no_of_assets > 1">
                  {{ sharedWorkspace.no_of_assets }} high-volume locations.
                </p>
                <p class="w-full mt-5">
                  We appreciate your interest in the WELL Health-Safety Rating!
                </p>
                <p class="w-full mb-5">
                  Given the large number of locations you’d like to enroll, we
                  want to provide you with the best possible pricing. We will
                  contact you shortly to discuss a custom pricing package to fit
                  your needs.
                </p>
              </div>
              <div
                class="flex justify-end w-1/4 mt-2 text-xl leading-7 font-semibold"
                style="flex-direction: column; align-items: flex-end"
              >
                <div>Enrollment Total</div>
                <div>Pending Quote</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div v-else class="mx-auto mt-5 text-center">
    <WLoadingSpinner class="mx-auto" />
    <div class="mt-3 text-primary-600">Please Wait...</div>
  </div>
</template>
<script>
import { mapState, mapActions } from 'vuex'
export default {
  data() {
    return {
      discountCode: '',
      discountId: '',
      sectorDiscountVerified: false,
      discount: true,
      processingDiscount: false,
      applyingDiscount: false,
    }
  },
  computed: {
    sectorDiscountHeading() {
      const heading = this.pricingDetails.applicable_sector_discount.split('- ')
      if (heading && heading.length > 1) {
        return heading[1].split(' / ').join(' and ').split('/').join(' and ')
      } else {
        return heading[0]
      }
    },
    sectorDiscountCaption() {
      const discountType = this.pricingDetails.applicable_sector_discount
      if (discountType.includes('Government')) {
        return '<p>Buildings that serve "government agencies", which are entities 100% owned by government and serve government function.</p>'
      } else if (discountType.includes('Affordable')) {
        return '<p>Projects may be considered "low-income housing" for the purposes of WELL if at least 40% of units are reserved for households makings 60% or less than the area median income and if housing costs are deemed "affordable" for those households. Housing is defined as "affordable" when total cost of rent is no more than 33% of income; thus, total annual cost must not exceed 20% of area median income.</p>'
      } else if (discountType.includes('Charitable')) {
        return '<p>Projects may be considered non-profits if the primary business conducted in a given space falls within the non-profit sector.</p>'
      } else if (discountType.includes('Business')) {
        return '<p>Companies with less than 50 employees and less than $10 million in annual revenue.<p><p clas="text-primary-300 font-bold">Eligible for 35% price reduction.*,</p><p class="text-xs">*Can not be combined with sector and market reductions</p>'
      } else if (discountType.includes('Schools')) {
        return '<p>All educational facilities, such as public and private schools, primary and secondary and higher education.</p>'
      } else if (discountType.includes('Healthcare')) {
        return '<p>Facilities, such as hospitals or clinics, that provide medical treatment to patients that are typically reimbursed (partly or fully) by an insurance policy or government agency.</p>'
      } else {
        return '<p>IWBI offers a discount for projects from organizations headquartered in countries in the World Bank “low” and “lower-middle” income groups per a 2016 analysis. These projects are eligible for a<span class="text-primary-600"> 35% price reduction.</span>*</p><p class="text-xs"> *Can not be combined with small business and sector reductions</p>'
      }
    },
    id() {
      return this.sharedWorkspace.id
    },
    ...mapState({
      currentUser: (state) => state.user.currentUser,
      pricingDetails: (state) => state.shared.pricingDetails,
      allInvoices: (state) => state.shared.allInvoices,
      sharedWorkspace: (state) => state.shared.sharedWorkspace,
    }),
    isChinaProject() {
      for (let i = 0; i < this.sharedWorkspace.addresses.length; i++) {
        if (
          this.sharedWorkspace.addresses[0].country_code === 'CN' ||
          this.sharedWorkspace.addresses[0].country_code === 'HK' ||
          this.sharedWorkspace.addresses[0].country_code === 'MO'
        ) {
          return true
        }
      }
      return false
    },
    showPricing() {
      return true
    },
    countryName() {
      const countries = this.$store.state.address.countries
      return countries.find(
        (a) => a.code === this.sharedWorkspace.addresses[0].country_code
      ).name
    },
    country() {
      return this.sharedWorkspace.addresses[0].country_code
    },
  },
  async beforeCreate() {
    await this.$store.dispatch('shared/getSharedWorkspace', {
      id: this.$route.params.id,
    })

    await this.$store.dispatch('shared/getSharedWorkspace', {
      id: this.$route.params.id,
      discount_code: this.sharedWorkspace.discount
        ? this.sharedWorkspace.discount.code
        : '',
    })
    await this.$store.dispatch('shared/getPricingDetails', {
      discount_code: this.sharedWorkspace.discount
        ? this.sharedWorkspace.discount.code
        : '',
    })
    if (this.sharedWorkspace) {
      this.discountId = this.sharedWorkspace.discount_id
      if (this.discountId) {
        this.discountCode = this.sharedWorkspace.discount.code
      }
    }
  },
  methods: {
    ...mapActions('shared', ['setActiveTab']),
    next() {
      this.setActiveTab('TERMS + CONDITIONS')
    },
    downloadQuote() {
      this.$store.dispatch('shared/getQuote').then((resp) => {
        window.open(resp.data.url, '_blank')
      })
    },
    downloadCoA(val) {
      this.$store
        .dispatch('portfolio/downloadCoA', {
          id: this.sharedWorkspace.id,
          pre_cert_fees: val,
        })
        .then((res) => {
          window.open(res.data.url, '_blank')
        })
    },
    verifyDiscount() {
      if (this.discountCode) {
        this.applyingDiscount = true
        this.$axios
          .get(
            'api/coupon/validate/' +
              this.discountCode +
              '?for=hsr&type=registration'
          )
          .then(async (response) => {
            this.discountId = response.data.discount_id

            await this.updateSharedWorkspace()
            this.$store.dispatch('notifications/toastMessage', {
              message: response.data.msg,
            })
            this.applyingDiscount = false
          })
          .catch((err) => {
            this.discountId = ''
            this.$store.dispatch('notifications/toastMessage', {
              message: err.response.data.msg,
            })
            this.applyingDiscount = false
          })
      }
    },
    async updateSharedWorkspace() {
      this.submitting = true

      const sharedWorkspace = {
        ...this.$store.state.shared.sharedWorkspace,
        discount_id: this.discountId,
      }
      sharedWorkspace.space_types = [
        this.$store.state.shared.sharedWorkspace.space_types[0].id,
      ]
      await this.$store.dispatch(
        'shared/updateSharedWorkspace',
        sharedWorkspace
      )
      await this.$store.dispatch('shared/getSharedWorkspace', {
        id: this.$store.state.shared.sharedWorkspace.portfolio_number,
      })
      await this.$store.dispatch('shared/getPricingDetails', {
        discount_code: this.discountCode,
      })
    },
    async removeDiscount() {
      this.applyingDiscount = true
      this.discountId = ''
      this.discountCode = ''
      this.discount = false
      await this.updateSharedWorkspace()
      this.applyingDiscount = false
    },
    removeDiscountType(type) {
      this.processingDiscount = true
      this.$store
        .dispatch('shared/togglesharedDiscounts', type)
        .then((resp) => {
          this.processingDiscount = false
          this.$store.dispatch('shared/getPricingDetails', {
            discount_code: this.discountCode,
          })
        })
    },
    async downloadInvoice() {
      this.$refs.modal.isHidden = true
      this.$refs.downloadModal.isHidden = false
      await this.$store.dispatch('invoice/updateUserFieldsinInvoice', {
        id: this.allInvoices[0].id,
        country_code: this.sharedWorkspace.addresses.find(
          (address) => address.is_shipping === 1
        ).country_code,
        description: this.allInvoices[0].description,
        email: this.allInvoices[0].user_email,
        name: this.currentUser.full_name,
        organization: this.currentUser.organization,
        user_preference: 'wire',
      })
      await this.$store.dispatch('invoice/download', this.allInvoices[0])
      this.$refs.downloadModal.isHidden = true
    },
  },
}
</script>
