<template>
  <div
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
          <WLinksBase
            class="w-1/4 mr-5"
            icon="arrow-narrow-left"
            type="primary"
            :link="`/shared-workspaces/${$store.state.shared.sharedWorkspace.portfolio_number}/dashboard`"
            >Back</WLinksBase
          >
          <WHeadingsHTwo
            class="space-y-6"
            heading="Confirm your renewal fees"
          ></WHeadingsHTwo>
          <div class="w-full divide-y divide-gray-300 space-y-2">
            <div class="w-full">
              <div class="flex">
                <WHeadingsHFour
                  class="w-full"
                  :heading="
                    sharedWorkspace.no_of_asstes > 1
                      ? 'Multiple locations'
                      : 'Renewal Fee'
                  "
                ></WHeadingsHFour>
                <span
                  class="
                    flex
                    justify-end
                    w-full
                    mt-2
                    text-xl
                    leading-7
                    text-primary-700
                  "
                  >${{
                    pricingDetails.amount_without_discount | formatNumber
                  }}*</span
                >
              </div>
              <div v-if="pricingDetails.per_property_amount" class="w-full">
                <p class="w-1/2 text-gray-500 text-sm">Includes:</p>
                <ul class="w-1/2 text-gray-500 text-sm mb-5 pl-5">
                  <li>Promotional awards package</li>
                  <li>Support from our technical experts</li>
                  <li>
                    Resources to support maintenance of your projects'
                    health-focused strategies and renewal process
                  </li>
                  <li>Third-party documentation review</li>
                </ul>
              </div>
            </div>
            <FormulateForm @submit="next">
              <div
                v-if="
                  pricingDetails.sector_discount ||
                  pricingDetails.membership_level
                "
              >
                <WHeadingsHFour heading="*Eligible discounts"></WHeadingsHFour>
                <p class="text-gray-500 text-sm mb-2">
                  We detected you may be eligible for the following discounts.
                  Please confirm you meet the criterias by checking the box
                  below.
                </p>
                <div v-if="pricingDetails.sector_discount">
                  <div class="flex mt-2">
                    <WHeadingsHFour
                      class="flex-1 w-3/4 ml-5"
                      :heading="pricingDetails.sector_discount"
                    ></WHeadingsHFour>
                    <span
                      class="
                        flex
                        justify-end
                        w-1/4
                        mt-2
                        text-xl
                        leading-7
                        text-gray-700
                      "
                      >- ${{
                        pricingDetails.sector_discount_amount | formatNumber
                      }}</span
                    >
                  </div>
                  <div
                    v-if="pricingDetails.sector_discount"
                    class="text-gray-500 ml-10 mb-2 text-sm"
                  >
                    35% reduction in program fees.
                  </div>
                </div>
                <div v-if="pricingDetails.membership_level">
                  <div class="flex mt-2">
                    <WHeadingsHFour
                      class="flex-1 w-3/4 ml-5"
                      :heading="`${pricingDetails.membership_level} Membership discounts`"
                    ></WHeadingsHFour>
                    <span
                      class="
                        flex
                        justify-end
                        w-1/4
                        mt-2
                        text-xl
                        leading-7
                        text-gray-700
                      "
                      >- ${{
                        pricingDetails.membership_level_discount | formatNumber
                      }}</span
                    >
                  </div>
                  <div
                    v-if="pricingDetails.membership_level === 'Cornerstone'"
                    class="text-gray-500 ml-10 mb-2 text-sm"
                  >
                    15% reduction in program fees.
                  </div>
                  <div
                    v-if="
                      pricingDetails.membership_level === 'Keystone' ||
                      pricingDetails.membership_level === 'Portfolio'
                    "
                    class="text-gray-500 ml-5 mb-5 text-sm"
                  >
                    25% reduction in program fees.
                  </div>
                </div>
                <FormulateInput
                  v-model="sectorDiscountVerified"
                  type="checkbox"
                  class="mt-5 ml-5"
                  validation="required"
                  label="Yes, my organization meets the criteria of the listed discount category.*"
                ></FormulateInput>
              </div>
              <div class="w-full divide-y divide-gray-300 space-y-2">
                <div v-if="!discountId">
                  <WHeadingsHFour class="mt-10" :heading="'Discount Code'" />
                  <div class="flex">
                    <FormulateInput
                      v-model="discountCode"
                      class="w-1/2"
                      type="text"
                      placeholder="Enter discount code"
                      @keypress.enter="verifyDiscount()"
                    />
                    <div class="w-1/4 ml-5">
                      <WButtonsBase
                        icon="check-circle-small"
                        @click.native="verifyDiscount()"
                        >Apply</WButtonsBase
                      >
                    </div>
                  </div>
                </div>
                <div v-else>
                  <WHeadingsHFour class="mt-10" :heading="'Discount Code'" />
                  <div class="flex justify-between">
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

                      <div class="ml-5">
                        <WButtonsBase
                          icon="trash"
                          @click.native="removeDiscount"
                        ></WButtonsBase>
                      </div>
                    </div>
                    <div
                      class="
                        flex
                        justify-end
                        w-1/4
                        mt-2
                        text-xl
                        leading-7
                        text-gray-700
                      "
                    >
                      - ${{ pricingDetails.coupon_code_amount | formatNumber }}
                    </div>
                  </div>
                </div>
              </div>
              <div class="flex mt-5 align-items-start justify-between">
                <div>
                  <div class="flex space-x-2">
                    <div class="w-48 my-auto">
                      <FormulateInput
                        class="mt-5 flex-1"
                        type="submit"
                        label="Pay now with credit card"
                      />
                    </div>
                    <div class="w-48 mt-5">
                      <WButtonsDropdown>
                        <WButtonsBase type="primaryInverted">
                          Pay later
                        </WButtonsBase>
                        <template #customButtons>
                          <WButtonsBase
                            v-if="
                              country !== 'CN' &&
                              country !== 'HK' &&
                              country !== 'MO'
                            "
                            class="leading-3"
                            type="neutral"
                            @click.native="
                              ;($refs.modal.isHidden = false),
                                ($refs.modal.isHiddent = true)
                            "
                          >
                            Pay by check
                          </WButtonsBase>
                          <WButtonsBase
                            class="leading-3"
                            type="neutral"
                            @click.native="
                              ;($refs.modal.isHidden = false),
                                ($refs.modal.isHiddent = true)
                            "
                          >
                            Pay by wire
                          </WButtonsBase>
                        </template>
                      </WButtonsDropdown>
                    </div>
                  </div>
                </div>
                <div
                  class="
                    flex
                    justify-end
                    w-1/4
                    mt-2
                    text-xl
                    leading-7
                    font-semibold
                    text-primary-700
                  "
                  style="flex-direction: column; align-items: flex-end"
                >
                  <div class="text-md text-gray-500 font-light">
                    Renewal Total
                  </div>
                  <div>${{ pricingDetails.amount | formatNumber }}</div>
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
import { mapState, mapActions } from 'vuex'
export default {
  data() {
    return {
      discountCode: null,
      sectorDiscountVerified: false,
      discountId: '',
    }
  },
  computed: {
    ...mapState({
      currentUser: (state) => state.user.currentUser,
      pricingDetails: (state) => state.shared.pricingDetails,
      allInvoices: (state) => state.shared.allInvoices,
      sharedWorkspace: (state) => state.shared.sharedWorkspace,
      recertificationList: (state) => state.recertification.recertificationList,
    }),
    country() {
      return this.sharedWorkspace.addresses[0].country_code
    },
    recertInvoice() {
      let invoices = []
      if (this.recertification) {
        invoices = this.allInvoices.filter(
          (a) =>
            a.invoicable_sub_part ===
            'recertification-' + this.recertification.id
        )
      }
      if (invoices.length) return invoices[0]
      else return invoices
    },
    recertification() {
      let recertifiction = ''
      if (this.recertificationList.length !== 0) {
        const lastRecertifiction = this.recertificationList.length - 1
        recertifiction = this.recertificationList[lastRecertifiction]
      }
      return recertifiction
    },
    recertificationPaymentStatus() {
      if (this.recertification) {
        return this.recertification.payment_status
      }
      return ''
    },
  },
  watch: {
    recertification() {
      this.discountId = this.recertification.discount_id
      if (this.discountId) {
        this.discountCode = this.recertification.discount
          ? this.recertification.discount.code
          : ''
      }
    },
  },
  async mounted() {
    await this.$store.dispatch('shared/getSharedWorkspace', {
      id: this.$route.params.id,
    })
    await this.$store.dispatch('shared/getPricingDetails', {
      recert_price: true,
      discount_code: this.recertification.discount
        ? this.recertification.discount.code
        : '',
    })
    if (this.recertification) {
      this.discountId = this.recertification.discount_id
      if (this.discountId) {
        this.discountCode = this.recertification.discount.code
      }
    }
  },
  methods: {
    ...mapActions('shared', ['setActiveTab']),
    next() {
      this.$router.push(
        `/invoice/${this.recertInvoice.invoice_number}?redirect=/shared-workspaces/${this.sharedWorkspace.portfolio_number}/dashboard`
      )
    },
    verifyDiscount() {
      if (this.discountCode) {
        this.$axios
          .get(
            'api/coupon/validate/' +
              this.discountCode +
              '?for=hsr&type=recertification'
          )
          .then((response) => {
            this.discountId = response.data.discount_id
            this.updateRecert()
            this.$store.dispatch('notifications/toastMessage', {
              message: response.data.msg,
            })
          })
          .catch((err) => {
            this.discountId = ''
            this.$store.dispatch('notifications/toastMessage', {
              message: err.response.data.msg,
            })
          })
      }
    },
    async updateRecert() {
      const payload = {
        ...this.recertification,
        discount_id: this.discountId,
      }
      await this.$store.dispatch('recertification/updateRecert', payload)
      await this.$store.dispatch('recertification/getHSRRecertification')
      await this.$store.dispatch('shared/getPricingDetails', {
        recert_price: true,
        discount_code: this.discountCode,
      })
    },
    async downloadInvoice() {
      this.$refs.modal.isHidden = true
      this.$refs.downloadModal.isHidden = false
      await this.$store.dispatch('invoice/updateUserFieldsinInvoice', {
        id: this.recertInvoice.id,
        country_code: this.sharedWorkspace.addresses.find(
          (address) => address.is_shipping === 1
        ).country_code,
        description: this.recertInvoice.description,
        email: this.recertInvoice.user_email,
        name: this.currentUser.full_name,
        organization: this.currentUser.organization,
        user_preference: 'wire',
      })
      await this.$store.dispatch('invoice/download', this.recertInvoice)
      this.$router.push(
        `/shared-workspaces/${this.sharedWorkspace.portfolio_number}/scorecard`
      )
      this.$refs.downloadModal.isHidden = true
    },
    removeDiscount() {
      this.discountId = ''
      this.discountCode = ''
      this.updateRecert()
    },
  },
}
</script>
