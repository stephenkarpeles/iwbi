<template>
  <div class="flex flex-wrap px-10 py-5">
    <!-- warning -->
    <div
      v-if="invoices.length === 0"
      class="
        rounded-md
        bg-yellow-50
        p-4
        mb-5
        rounded-lg
        border border-yellow-300
        w-full
      "
    >
      <div class="flex">
        <div class="flex-shrink-0">
          <svg
            class="mt-3 h-5 w-5 text-yellow-400"
            x-description="Heroicon name: exclamation"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fill-rule="evenodd"
              d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
              clip-rule="evenodd"
            ></path>
          </svg>
        </div>
        <div class="ml-3">
          <WHeadingsHFour
            class="text-yellow-600"
            heading="The WELL Building Standard Certification Agreement has not been
                signed."
          />
          <div class="mt-2 text-sm leading-5 text-yellow-700">
            <p>
              Project documetation features are not available until the
              certification agreement has been signed by the project owner.
            </p>
          </div>
          <WLinksBase
            class="text-warning-500 mt-3"
            icon="arrow-narrow-right"
            icon-position="right"
            type="warning"
            @click.native="$parent.currentTab = 'Register'"
          >
            Sign Now!
          </WLinksBase>
        </div>
      </div>
    </div>

    <div v-else class="w-full mb-5 lg:w-1/3 lg:pr-16">
      <WHeadingsHThree heading="Billing" />
      <div v-if="isChinaPortfolio" class="flex my-3">
        <WButtonsBase
          type="primary"
          icon="download"
          @click.native="downloadCoA()"
        >
          Confirmation Agreement
        </WButtonsBase>
      </div>
      <div v-if="currentUser.role.includes('well-admin')" class="mt-5">
        <WButtonsDropdown>
          <WButtonsBase type="primaryInverted" icon="plus">
            Project Invoice
          </WButtonsBase>
          <template #customButtons>
            <WButtonsBase
              type="neutral"
              @click.native="createCustomInvoice('new')"
            >
              Create New Invoice
            </WButtonsBase>
            <WButtonsBase
              v-if="
                invoices &&
                invoices.length > 0 &&
                !invoices.some((e) => e.description.includes('Curative'))
              "
              type="neutral"
              @click.native="createCustomInvoice('curative-action')"
            >
              Curative Action
            </WButtonsBase>
            <WButtonsBase
              v-if="
                invoices &&
                invoices.length > 0 &&
                !invoices.some((e) => e.description.includes('Appeal'))
              "
              type="neutral"
              @click.native="createCustomInvoice('appeal-review')"
            >
              Appeal Review
            </WButtonsBase>
          </template>
        </WButtonsDropdown>
      </div>
    </div>
    <div class="w-full lg:w-2/3">
      <div class="space-y-4">
        <div v-for="(invoice, index) in invoices" :key="index">
          <InvoiceCard
            :invoice="invoice"
            :redirect="
              '/shared-workspaces/' + portfolio.portfolio_number + '/billing'
            "
          />
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapState } from 'vuex'

export default {
  props: {
    invoices: {
      type: Array,
      required: true,
    },
    portfolio: {
      type: Object,
      required: true,
    },
  },
  computed: {
    ...mapState({
      currentUser: (state) => state.user.currentUser,
    }),
    isChinaPortfolio() {
      for (let i = 0; i < this.portfolio.addresses.length; i++) {
        if (
          this.portfolio.addresses[i].country_code === 'CN' ||
          this.portfolio.addresses[i].country_code === 'HK' ||
          this.portfolio.addresses[i].country_code === 'MO'
        ) {
          return true
        }
      }
      return false
    },
  },
  methods: {
    hasInvoiceofType(type) {
      const index = this.invoices.findIndex(
        (a) => a.invoicable_sub_part === type
      )
      if (index !== -1) {
        return true
      } else {
        return false
      }
    },
    async createCustomInvoice(type) {
      if (type !== 'new') {
        await this.$store.dispatch('portfolio/createInvoice', {
          portfolio_id: this.portfolio.id,
          type,
        })
        await this.$store.dispatch('shared/getSharedWorkspace', {
          id: this.$route.params.id,
        })
      } else {
        const data = {
          country_code: this.portfolio.addresses[0].country_code,
          state: this.portfolio.addresses[0].state,
          city: this.portfolio.addresses[0].city,
          street: this.portfolio.addresses[0].street,
          postal_code: this.portfolio.addresses[0].postal_code,
          name: this.portfolio.owner_name,
          email: this.portfolio.owner_email,
          organization: this.portfolio.owner_org,
          portfolio_id: this.portfolio.id,
          back: this.$route.path,
        }
        this.$router.push({ path: `/well-admin/invoices/create`, query: data })
      }
    },
    downloadCoA() {
      this.$store
        .dispatch('shared/downloadCoA', {
          portfolio_id: this.portfolio.id,
        })
        .then((res) => {
          window.open(res.data.url, '_blank')
        })
    },
  },
}
</script>
