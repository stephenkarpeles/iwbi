<template>
  <div>
    <div
      v-if="showProcessingBanner === false"
      class="relative bg-white p-5 rounded-lg"
    >
      <WFeedbackAlert ref="alert" />
      <WHeadingsHThree
        class="mb-2 text-center"
        heading="Complete your payment"
      />
      <div class="text-sm pb-5">
        <p>
          Please ensure the information submitted is accurate and can be used
          for billing purposes. Please use English characters only.
        </p>
      </div>
      <div v-if="loading" class="grid grid-cols-1 gap-4">
        <div class="relative bg-white p-5 rounded-lg">
          <WLoadingSpinner />
          <div class="mt-3 text-primary-600">Loading...</div>
        </div>
      </div>
      <div v-else class="grid grid-cols-1 gap-4">
        <div class="text-sm">
          <div class="flex">
            <span class="mr-2">Billing Information</span
            ><WLinksBase icon="pencil" @click.native="toggleEditModal()"
              >Edit</WLinksBase
            >
          </div>
          <div>
            <p
              v-if="
                invoiceDetails.addresses && invoiceDetails.addresses.length > 0
              "
              class="tx-12 mg-b-0"
            >
              {{ invoiceDetails.addresses[0].first_name }}
              <br />
              <span
                v-if="
                  invoiceDetails.addresses &&
                  invoiceDetails.addresses.length > 0
                "
              >
                <span v-if="invoiceDetails.addresses[0].email"
                  >&nbsp;({{ invoiceDetails.addresses[0].email }})</span
                >
              </span>
            </p>
            <p
              v-if="
                invoiceDetails.addresses && invoiceDetails.addresses.length > 0
              "
              class="tx-12 mg-b-0"
            >
              {{ invoiceDetails.addresses[0].organization }}
            </p>
            <p
              v-if="
                invoiceDetails.addresses && invoiceDetails.addresses.length > 0
              "
              class="tx-12 lh-base"
            >
              <!-- eslint-disable-next-line vue/no-v-html -->
              <span v-html="getAddress"></span>
            </p>
            <p v-if="invoiceDetails.note" class="tx-12 lh-base">
              {{ invoiceDetails.note }}
            </p>
            <hr class="pb-5" />
            <table class="table-auto w-full p-2">
              <tbody class="p-5">
                <tr v-for="item in invoiceDetails.invoice_items" :key="item.id">
                  <td class="border-2 px-2 py-3 text-sm text-right flex">
                    <div
                      v-if="item.description !== 'Discount'"
                      class="text-sm flex justify-items-center"
                    >
                      <img
                        src="https://cdn.wellcertified.com/static/images/hsr/health-safety-logo.png"
                        alt="Health-Safety Rating logo"
                        class="img"
                        width="25px"
                        height="25px"
                      />
                    </div>
                    <div
                      v-if="item.description === 'Discount'"
                      class="flex justify-end pl-32"
                    >
                      {{ item.description }}
                      <div
                        v-if="invoiceDetails.discount_id && item.is_discount"
                        class="flex"
                      >
                        <span v-if="invoiceDetails.discount_code">
                          {{ invoiceDetails.discount_code }}
                        </span>
                        <WLinksBase
                          icon="check-circle-small"
                          @click.native="cancelDiscountCode()"
                          >x</WLinksBase
                        >
                      </div>
                    </div>
                    <div v-else>
                      <div class="text-sm">
                        {{ item.quantity }} high-volume locations (${{
                          item.unit_cost
                        }}
                        per location)
                      </div>
                    </div>
                  </td>
                  <td class="border-2 px-6 py-3 text-sm text-right">
                    ${{ (item.quantity * item.unit_cost) | formatNumber }}
                  </td>
                </tr>
                <tr>
                  <td class="border-2 px-6 py-3 text-sm text-right">
                    Subtotal excl. sales tax
                  </td>
                  <td class="border-2 px-6 py-3 text-sm text-right">
                    ${{ invoiceDetails.total_amount | formatNumber) }}
                  </td>
                </tr>
                <tr>
                  <td class="border-2 px-6 py-3 text-sm text-right">
                    Sales tax 0%
                  </td>
                  <td class="border-2 px-6 py-3 text-sm text-right">$0.00</td>
                </tr>
                <tr>
                  <td class="border-2 px-6 py-3 text-sm text-right font-bold">
                    TOTAL
                  </td>
                  <td
                    class="
                      border-2
                      px-6
                      py-3
                      text-sm text-right
                      font-bold
                      text-primary-600
                    "
                  >
                    ${{ invoiceDetails.total_amount | formatNumber }}
                  </td>
                </tr>
              </tbody>
            </table>
            <!-- <div v-if="invoiceDetails.status !== 'paid'">
              <WHeadingsHFour class="mt-10" :heading="'Payment Options'" />

              <FormulateInput
                v-model="paymentOption"
                :options="{
                  card: 'Card',
                  check: 'Check',
                  wire: 'Wire Transfer',
                }"
                type="radio"
              />
            </div>
            <div v-else class="mt-8">
              <WButtonsBase @click.native="downloadInvoice"
                >Download Receipt</WButtonsBase
              >
            </div> -->
            <div>
              <WHeadingsHFour
                v-if="!invoiceDetails.discount_id"
                class="mt-10"
                :heading="'Discount'"
              />
              <div v-if="!invoiceDetails.discount_id" class="flex">
                <FormulateInput
                  v-model="discountCode"
                  type="text"
                  placeholder="Enter discount code"
                />
                <WLinksBase
                  icon="check-circle-small"
                  @click.native="verifyDiscount()"
                ></WLinksBase>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-else>
      <div class="mx-auto text-center">
        <WLoadingSpinner class="mx-auto" />
        <div class="mt-3 text-primary-600">
          Please wait while we are processing your payment...
        </div>
      </div>
    </div>
    <div v-if="showProcessingBanner === false" class="flex">
      <div class="mt-5 px-5 w-full">
        <WButtonsBase
          v-if="invoiceDetails.status === 'unpaid'"
          icon="credit-card"
          @click.native="payNow()"
        >
          <span>Pay Now</span>
        </WButtonsBase>
      </div>
      <div class="mt-5 px-5 w-full">
        <WButtonsBase
          v-if="invoiceDetails.status === 'unpaid' && paymentOption !== 'card'"
          icon="download"
          @click.native="downloadInvoice()"
        >
          <span>Generate Invoice</span>
        </WButtonsBase>
      </div>
    </div>
    <WFeedbackModal ref="modal">
      <div
        class="max-w-7xl top-25 rounded left-45 shadow-lg bg-white text-black"
        style="width: 50vw"
      >
        <div class="flex justify-between bg-primary-800 text-white">
          <div class="p-4">
            <p class="text-xl font-bold">Update Billing Information</p>
          </div>
          <div class="p-4">
            <WButtonsBase
              icon="x-circle"
              type="blank"
              @click.native="$refs.modal.isHidden = true"
            />
          </div>
        </div>
        <FormulateForm class="space-y-2" @submit="handleInfoUpdate">
          <div class="shadow-lg border rounded-lg p-5">
            <div>
              <FormulateInput
                v-model="invoiceDetails.user_name"
                type="text"
                label="Name *"
                placeholder="Enter Name"
                validation="required"
                class="w-full"
              />
            </div>
            <div>
              <FormulateInput
                v-model="invoiceDetails.user_email"
                type="text"
                validation="required"
                placeholder="Enter email address"
                label="Email address"
                class="w-full"
              />
            </div>
            <div
              v-if="
                invoiceDetails.addresses && invoiceDetails.addresses.length > 0
              "
            >
              <FormulateInput
                v-model="invoiceDetails.addresses[0].organization"
                type="text"
                validation="required"
                label="Your Organization *"
                placeholder="Enter organization"
                class="w-full"
              />
            </div>
            <div v-if="invoiceDetails.addresses">
              <div
                class="
                  shadow-md
                  flex flex-wrap
                  justify-between
                  border
                  rounded-md
                "
              >
                <div
                  class="
                    w-full
                    bg-primary-50
                    rounded-t-md
                    border-b
                    px-8
                    py-4
                    text-primary-800
                    flex
                    justify-between
                  "
                >
                  <div class="font-bold">Billing Address</div>
                </div>
                <div
                  class="
                    flex flex-wrap
                    px-8
                    py-4
                    w-full
                    justify-between
                    text-gray-400
                  "
                >
                  <FormInputsAddressFormulate
                    :address="invoiceDetails.addresses[0]"
                    :target="invoiceDetails.addresses[0]"
                    :required="true"
                    class-key="grid grid-cols-2 gap-x-4 gap-y-4 w-full"
                  />
                </div>
              </div>
            </div>
            <FormulateInput type="submit" label="update" />
          </div>
        </FormulateForm>
      </div>
    </WFeedbackModal>
  </div>
</template>
<script>
import { mapMutations } from 'vuex'

export default {
  props: {
    project: {
      type: Object,
      required: true,
    },
    invoiceNumber: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      invoiceDetails: [],
      paymentInProgress: false,
      discountCode: '',
      showProcessingBanner: false,
      showEditModal: false,
      paymentOption: null,
      errorMessage: '',
      email: '',
      name: '',
      loading: true,
    }
  },
  computed: {
    getAddress() {
      let address = ''
      if (
        this.invoiceDetails.addresses &&
        this.invoiceDetails.addresses.length > 0
      ) {
        if (this.invoiceDetails.addresses[0].street) {
          address += this.invoiceDetails.addresses[0].street + '<br>'
        }
        if (this.invoiceDetails.addresses[0].city) {
          address += this.invoiceDetails.addresses[0].city + ', '
        }
        if (this.invoiceDetails.addresses[0].state) {
          address += this.invoiceDetails.addresses[0].state + '<br>'
        }
        if (this.invoiceDetails.addresses[0].country_code) {
          address += this.invoiceDetails.addresses[0].country_code + ' '
        }
        if (this.invoiceDetails.addresses[0].postal_code) {
          address += this.invoiceDetails.addresses[0].postal_code
        }
      }
      return address
    },
  },
  watch: {
    paymentOption(newValue) {
      if (newValue === 'card') this.setupStripe()
    },
  },
  mounted() {
    this.getInvoiceInfo()
  },
  methods: {
    ...mapMutations('shared', ['setCurrentStep']),
    getInvoiceInfo() {
      this.$axios
        .get('api/invoice/' + this.invoiceNumber + '/getByNumber')
        .then((response) => {
          this.invoiceDetails = response.data
          this.invoiceDetails.user_name = this.invoiceDetails.addresses[0]
            .first_name
            ? this.invoiceDetails.addresses[0].first_name
            : this.invoiceDetails.user_name

          this.showProcessingBanner = false
          this.discountCode = response.data.discount_id
          this.loading = false
        })
    },
    toggleEditModal() {
      this.$refs.modal.isHidden = false
    },
    cancelDiscountCode() {
      this.$axios
        .get(`api/invoice/${this.invoiceDetails.id}/remove-discount`)
        .then((response) => {
          this.$refs.alert.showAlert(
            'success',
            'Discount code removed successfully'
          )
          this.getInvoiceInfo()
        })
        .catch((err) => {
          this.$refs.alert.showAlert('error', err.response.data.msg)
        })
    },
    verifyDiscount() {
      if (this.discountCode) {
        this.$axios
          .get(
            'api/coupon/validate/' +
              this.discountCode +
              '?for=hsr&type=registration'
          )
          .then((response) => {
            this.applyDiscount()
          })
      }
    },
    applyDiscount() {
      this.$axios
        .get(
          `api/invoice/${this.invoiceDetails.id}/apply-discount/${this.discountCode}`
        )
        .then((response) => {
          this.$refs.alert.showAlert(
            'success',
            'Discount code applied successfully'
          )
        })
    },
    downloadInvoice() {
      const token = this.$store.state.authentication.token
      const url =
        this.$axios.defaults.baseURL +
        'api/invoice/' +
        this.invoiceDetails.id +
        '/pdf?token=' +
        token
      window.open(url, '_blank')
    },
    handleInfoUpdate() {
      const data = {
        name: this.invoiceDetails.user_name,
        email: this.invoiceDetails.user_email,
        organization: this.invoiceDetails.addresses[0].organization,
        description: this.invoiceDetails.description,
        country_code: this.invoiceDetails.addresses[0].country_code,
        state: this.invoiceDetails.addresses[0].state,
        postal_code: this.invoiceDetails.addresses[0].postal_code,
        street: this.invoiceDetails.addresses[0].street,
        city: this.invoiceDetails.addresses[0].city,
      }
      this.$axios
        .put('api/invoice/' + this.invoiceDetails.id + '/update', data)
        .then((response) => {
          this.$refs.modal.isHidden = true
          this.getInvoiceInfo()
        })
    },
    payNow() {
      this.$router.push(
        '/invoice/' +
          this.invoiceDetails.invoice_number +
          '?redirect=' +
          '/projects/' +
          this.project.type +
          '/' +
          this.project.project_number +
          '/hsr'
      )
      this.setCurrentStep('4')

      // this.$refs.modal1.isHidden = false
    },
  },
}
</script>
