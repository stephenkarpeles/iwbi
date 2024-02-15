<template>
  <div class="relative">
    <div
      v-if="disabledInvoice"
      class="bg-gray-300 w-full h-full absolute left-0 rounded-lg opacity-25"
    ></div>
    <div
      class="cursor-pointer hover:bg-primary-100 transition-colors duration-300 shadow-md flex flex-wrap justify-between border rounded-md"
      @click="
        !allowPayment || disabledInvoice
          ? null
          : type && module && !redirect
          ? $router.push(
              '/invoice/' +
                invoice.invoice_number +
                '?redirect=' +
                redirect +
                '&for=' +
                module +
                '&type=' +
                type
            )
          : $router.push(
              '/invoice/' + invoice.invoice_number + '?redirect=' + $route.path
            )
      "
    >
      <div
        class="h-auto md:h-20 w-full bg-primary-50 rounded-t-md border-b px-3 md:px-8 py-4 text-primary-800 md:flex justify-between"
      >
        <div class="md:flex">
          <div class="my-auto font-bold mr-4 flex">
            <span class="mr-1" v-if="invoice.status === 'unpaid'">
              Invoice:
            </span>
            <span class="mr-1" v-else> Receipt: </span>
            #{{ invoice.invoice_number }}
          </div>
          <div
            v-if="invoice.status !== 'unpaid'"
            class="my-auto px-2 py-1 w-20 md:w-24 text-center text-xs rounded-full text-white uppercase bg-success-600"
          >
            {{ invoice.status }}
          </div>
          <div
            v-else
            class="my-auto px-2 py-1 w-20 md:w-24 text-center text-xs rounded-full text-white uppercase bg-secondary-700"
          >
            UNPAID
          </div>
        </div>
        <div class="md:w-32 mt-2 md:mt-0">
          <WButtonsBase
            data-id="pay-now-btn"
            v-if="invoice.status === 'unpaid' && allowPayment"
            type="primary"
          >
            Pay Now
          </WButtonsBase>
        </div>
      </div>
      <div
        class="flex flex-wrap px-3 md:px-8 py-4 w-full justify-between text-gray-400"
      >
        <div>
          <div>{{ invoice.description }}</div>
          <div v-if="invoice.status !== 'unpaid'" class="text-xs">
            Payment Date:
            <span class="font-bold text-primary-600">{{
              $dayjs(invoice.payment_date).format('MMM, DD YYYY')
            }}</span>
          </div>
        </div>
        <div>
          <span class="text-2xl text-primary-600 font-bold"
            >${{ invoice.total_amount.toFixed(2) | formatNumber }}</span
          >
          USD
        </div>
        <div class="md:w-full justify-end flex">
          <div v-if="!disabledInvoice" class="ml-auto flex mt-3 w-48">
            <WButtonsBase
              v-if="invoice.status !== 'unpaid'"
              icon="download"
              type="primaryInverted"
              class="text-primary-500"
              @click.native.stop="$store.dispatch('invoice/download', invoice)"
            >
              Download receipt
            </WButtonsBase>
            <WButtonsBase
              v-else
              icon="download"
              type="primaryInverted"
              class="text-primary-500"
              @click.native.stop="downloadInvoice()"
            >
              Download invoice
            </WButtonsBase>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    invoice: {
      type: Object,
      required: true,
    },
    redirect: {
      type: String,
      required: false,
      default: null,
    },
    backUrl: {
      type: String,
      required: false,
      default: '',
    },
    type: {
      type: String,
      required: false,
      default: null,
    },
    module: {
      type: String,
      required: false,
      default: null,
    },
  },
  computed: {
    allowPayment() {
      let allow = true
      if (this.invoice) {
        if (
          (this.invoice.v1_project ||
            this.invoice.project_type === 'v2-pilot') &&
          this.invoice.v1_project_standard !== 'community' &&
          this.invoice.invoicable_sub_part === 'registration'
        ) {
          allow = false
        }
      }
      return allow
    },
    disabledInvoice() {
      if (
        (this.invoice.status === 'unpaid' &&
          this.invoice.project_type === 'v2-pilot' &&
          this.invoice.invoicable_sub_part === 'registration') ||
        (this.invoice.status === 'unpaid' &&
          this.invoice.project_type === 'v1' &&
          this.invoice.invoicable_sub_part === 'registration' &&
          this.invoice.v1_project_standard !== 'community')
      ) {
        return true
      }
      return false
    },
  },
  methods: {
    downloadInvoice() {
      const token = this.$store.state.authentication.token

      if (this.legacyId) {
        window.open(
          'https://legacy-wellonline.wellcertified.com/printPdf/' +
            this.legacyId,
          '_blank'
        )
      } else {
        const url =
          this.$axios.defaults.baseURL +
          'api/invoice/' +
          this.invoice.id +
          '/pdf?token=' +
          token
        window.open(url, '_blank')
      }
    },
  },
}
</script>
