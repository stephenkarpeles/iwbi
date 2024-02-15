<template>
  <div class="flex flex-col">
    <div class="px-5 overflow-x-auto sm:-mx-6 lg:-mx-8">
      <div>
        <WHeadingsHTwo heading="WELL AP: Group purchase" />
        <hr />
        <div class="mt-5">
          <p class="mb-5 text-sm flex">
            Special discounted pricing for groups of 10 or more can help your
            organization save time and money, and change the way you do business
            - for the better&nbsp;
            <WLinksBase
              link="https://www.wellcertified.com/well-ap/group-pricing"
              type="primary"
              target="_blank"
              >Learn more</WLinksBase
            >
          </p>
          <FormulateForm @submit="register">
            <div>
              <FormulateInput
                v-model="formData.first_name"
                type="text"
                label="First name *"
                class="w-full"
                validation="required"
              />
            </div>
            <div>
              <FormulateInput
                v-model="formData.last_name"
                type="text"
                label="Last name *"
                class="w-full"
                validation="required"
              />
            </div>
            <div>
              <FormulateInput
                v-model="formData.email"
                type="text"
                label="Email *"
                class="w-full"
                validation="required"
              />
            </div>
            <div class="shadow-md justify-between border rounded-md my-5 p-5">
              <FormInputsAddressFormulate
                :address="address"
                :target="address"
                :required="true"
                class-key="grid grid-cols-2 gap-x-4 gap-y-4 w-full"
              />
            </div>
            <div>
              <FormulateInput
                v-model="formData.quantity"
                type="number"
                min="10"
                label="Quantity *"
                class="w-full"
                validation="required|number"
              />
            </div>
            <div v-if="!isVerified">
              <div class="flex items-center">
                <div class="w-3/4">
                  <FormulateInput
                    v-model="discountCode"
                    class="w-75"
                    type="text"
                    label="Discount Code"
                    @keyup.native.enter="verifyCoupon"
                  />
                </div>
                <div class="w-1/4 mt-1 ml-5">
                  <WButtonsBase @click.native="verifyCoupon"
                    >Apply</WButtonsBase
                  >
                </div>
              </div>
            </div>
            <div
              v-if="!isVerified"
              class="mb-5 text-sm bg-primary-100 border border-primary-600 p-3 rounded"
            >
              <span class="text-primary-600">
                If you were issued a special discount code, please enter
                here.</span
              >
            </div>
            <div
              v-if="isVerified"
              class="mb-5 text-sm bg-primary-100 border border-primary-600 p-5 rounded"
            >
              <span class="text-medium mg-r-5 text-primary-600"
                >Discount code ({{ discountCode }}) is applied for this
                project.</span
              >
              <span
                class="cursor-pointer text-bold mb-5 text-danger-600 rounded"
                @click="resetCoupon"
                >Remove Code</span
              >
            </div>
            <FormulateInput
              type="submit"
              variant="well-light"
              label="Continue &amp; Pay"
            />
          </FormulateForm>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  auth: false,
  layout: 'default',
  data() {
    return {
      discountCode: '',
      isVerified: false,
      address: {
        country_code: '',
        state: '',
        street: '',
        city: '',
        postal_code: '',
      },
      formData: {
        bought_in_bundle: 0,
        first_name: '',
        last_name: '',
        email: '',
        quantity: 10,
      },
    }
  },
  methods: {
    verifyCoupon() {
      if (this.discountCode) {
        this.$axios
          .get(
            this.$axios.defaults.baseURL +
              'api/coupon/validate/' +
              this.discountCode +
              '?for=well-ap-group'
          )
          .then((response) => {
            this.$store.dispatch('notifications/toastMessage', {
              message: 'Discount Code successfully applied!',
            })
            this.isVerified = true
          })
          .catch((response) => {
            this.$store.dispatch('notifications/toastMessage', {
              message: 'Invalid discount code.',
            })
            this.isVerified = false
          })
      } else {
        this.$store.dispatch('notifications/toastMessage', {
          message: 'Please enter discount code',
        })
        this.isVerified = false
      }
    },
    resetCoupon() {
      this.discountCode = ''
      this.isVerified = false
    },
    register() {
      const data = this.formData
      data.country_code = this.address.country_code
      data.state = this.address.state
      data.street = this.address.street
      data.city = this.address.city
      data.postal_code = this.address.postal_code

      if (this.isVerified) {
        data.discount_code = this.discountCode
      }
      this.$axios.post('/api/examBulkPurchase', data).then((response) => {
        this.$router.push(
          '/invoice/' +
            response.data.invoice_number +
            '?showSuccessModal=bulk-purchase'
        )
      })
    },
  },
}
</script>
